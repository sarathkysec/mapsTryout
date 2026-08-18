import * as shaders from './shaders';
import * as utils from './webglUtils';
import * as fboUtils from './fboUtils';

export function initFluidSimulation(canvas, config) {
  let isActive = true;
  let animationFrameId = null;
  let pointers = [new utils.Pointer()];
  const { gl, ext } = utils.getWebGLContext(canvas);
  if (!ext.supportLinearFiltering) {
    config.DYE_RESOLUTION = 256;
    config.SHADING = false;
  }

  const baseVertexShader = utils.compileShader(gl, gl.VERTEX_SHADER, shaders.baseVertexShaderSource);
  const copyShader = utils.compileShader(gl, gl.FRAGMENT_SHADER, shaders.copyShaderSource);
  const clearShader = utils.compileShader(gl, gl.FRAGMENT_SHADER, shaders.clearShaderSource);
  const splatShader = utils.compileShader(gl, gl.FRAGMENT_SHADER, shaders.splatShaderSource);
  const advectionShader = utils.compileShader(gl, gl.FRAGMENT_SHADER, shaders.advectionShaderSource, ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']);
  const divergenceShader = utils.compileShader(gl, gl.FRAGMENT_SHADER, shaders.divergenceShaderSource);
  const curlShader = utils.compileShader(gl, gl.FRAGMENT_SHADER, shaders.curlShaderSource);
  const vorticityShader = utils.compileShader(gl, gl.FRAGMENT_SHADER, shaders.vorticityShaderSource);
  const pressureShader = utils.compileShader(gl, gl.FRAGMENT_SHADER, shaders.pressureShaderSource);
  const gradientSubtractShader = utils.compileShader(gl, gl.FRAGMENT_SHADER, shaders.gradientSubtractShaderSource);

  const blit = fboUtils.initBlit(gl);
  let dye, velocity, divergence, curl, pressure;

  const copyProgram = new fboUtils.Program(gl, baseVertexShader, copyShader);
  const clearProgram = new fboUtils.Program(gl, baseVertexShader, clearShader);
  const splatProgram = new fboUtils.Program(gl, baseVertexShader, splatShader);
  const advectionProgram = new fboUtils.Program(gl, baseVertexShader, advectionShader);
  const divergenceProgram = new fboUtils.Program(gl, baseVertexShader, divergenceShader);
  const curlProgram = new fboUtils.Program(gl, baseVertexShader, curlShader);
  const vorticityProgram = new fboUtils.Program(gl, baseVertexShader, vorticityShader);
  const pressureProgram = new fboUtils.Program(gl, baseVertexShader, pressureShader);
  const gradienSubtractProgram = new fboUtils.Program(gl, baseVertexShader, gradientSubtractShader);
  const displayMaterial = new fboUtils.Material(gl, baseVertexShader, shaders.displayShaderSource);

  function initFramebuffers() {
    let simRes = utils.getResolution(gl, config.SIM_RESOLUTION);
    let dyeRes = utils.getResolution(gl, config.DYE_RESOLUTION);
    const texType = ext.halfFloatTexType, rgba = ext.formatRGBA, rg = ext.formatRG, r = ext.formatR;
    const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
    gl.disable(gl.BLEND);

    dye = !dye ? fboUtils.createDoubleFBO(gl, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering)
      : fboUtils.resizeDoubleFBO(gl, copyProgram, blit, dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
    velocity = !velocity ? fboUtils.createDoubleFBO(gl, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering)
      : fboUtils.resizeDoubleFBO(gl, copyProgram, blit, velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
    divergence = fboUtils.createFBO(gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    curl = fboUtils.createFBO(gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    pressure = fboUtils.createDoubleFBO(gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
  }

  displayMaterial.setKeywords(config.SHADING ? ['SHADING'] : []);
  initFramebuffers();

  let lastUpdateTime = Date.now(), colorUpdateTimer = 0.0, autoTimer = 0.0;

  function updateFrame() {
    if (!isActive) return;
    let now = Date.now();
    let dt = Math.min((now - lastUpdateTime) / 1000, 0.016666);
    lastUpdateTime = now;

    let width = utils.scaleByPixelRatio(canvas.clientWidth), height = utils.scaleByPixelRatio(canvas.clientHeight);
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; initFramebuffers(); }

    if (config.auto) {
      autoTimer += dt * 1000;
      if (autoTimer > 350) {
        autoTimer = 0;
        let rx = 0.15 + Math.random() * 0.7;
        let ry = 0.2 + Math.random() * 0.6;
        splatMultiColor(rx, ry, (Math.random() - 0.5) * config.SPLAT_FORCE, (Math.random() - 0.5) * config.SPLAT_FORCE, 3);
      }
    }

    colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
    if (colorUpdateTimer >= 1) {
      colorUpdateTimer = utils.wrap(colorUpdateTimer, 0, 1);
      pointers.forEach(p => { p.color = utils.generateColor(config.RAINBOW_MODE, config.COLOR); });
    }

    pointers.forEach(p => { if (p.moved) { p.moved = false; splat(p.texcoordX, p.texcoordY, p.deltaX * config.SPLAT_FORCE, p.deltaY * config.SPLAT_FORCE, p.color); } });

    gl.disable(gl.BLEND);
    curlProgram.bind(); gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY); gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0)); blit(curl);
    vorticityProgram.bind(); gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY); gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0)); gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1)); gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL); gl.uniform1f(vorticityProgram.uniforms.dt, dt); blit(velocity.write); velocity.swap();
    divergenceProgram.bind(); gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY); gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0)); blit(divergence);
    clearProgram.bind(); gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0)); gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE); blit(pressure.write); pressure.swap();
    pressureProgram.bind(); gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY); gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) { gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1)); blit(pressure.write); pressure.swap(); }
    gradienSubtractProgram.bind(); gl.uniform2f(gradienSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY); gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read.attach(0)); gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read.attach(1)); blit(velocity.write); velocity.swap();
    advectionProgram.bind(); gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    if (!ext.supportLinearFiltering) gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    let velocityId = velocity.read.attach(0); gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId); gl.uniform1i(advectionProgram.uniforms.uSource, velocityId); gl.uniform1f(advectionProgram.uniforms.dt, dt); gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION); blit(velocity.write); velocity.swap();
    if (!ext.supportLinearFiltering) gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0)); gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1)); gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION); blit(dye.write); dye.swap();

    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.BLEND);
    displayMaterial.bind();
    if (config.SHADING) gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / gl.drawingBufferWidth, 1.0 / gl.drawingBufferHeight);
    gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
    blit(null);

    animationFrameId = requestAnimationFrame(updateFrame);
  }

  function splat(x, y, dx, dy, color) {
    splatProgram.bind(); gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
    gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height); gl.uniform2f(splatProgram.uniforms.point, x, y);
    gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
    gl.uniform1f(splatProgram.uniforms.radius, (config.SPLAT_RADIUS / 100.0) * (canvas.width / canvas.height > 1 ? canvas.width / canvas.height : 1));
    blit(velocity.write); velocity.swap();
    gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0)); gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
    blit(dye.write); dye.swap();
  }

  function splatMultiColor(x, y, baseDx, baseDy, count = 3) {
    for (let i = 0; i < count; i++) {
      const offsetX = (Math.random() - 0.5) * 0.03;
      const offsetY = (Math.random() - 0.5) * 0.03;
      const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.5);
      const force = config.SPLAT_FORCE * (0.6 + Math.random() * 0.4);
      const dx = (baseDx || 0) + Math.cos(angle) * force;
      const dy = (baseDy || 0) + Math.sin(angle) * force;
      const col = utils.generateColor(true, config.COLOR);
      splat(x + offsetX, y + offsetY, dx, dy, { r: col.r * 12, g: col.g * 12, b: col.b * 12 });
    }
  }

  function handleMouseDown(e) {
    let p = pointers[0], posX = utils.scaleByPixelRatio(e.clientX), posY = utils.scaleByPixelRatio(e.clientY);
    p.id = -1; p.down = true; p.moved = false; p.texcoordX = posX / canvas.width; p.texcoordY = 1.0 - posY / canvas.height;
    p.prevTexcoordX = p.texcoordX; p.prevTexcoordY = p.texcoordY; p.deltaX = 0; p.deltaY = 0;
    p.color = utils.generateColor(config.RAINBOW_MODE, config.COLOR);
    const color = { r: p.color.r * 10, g: p.color.g * 10, b: p.color.b * 10 };
    splat(p.texcoordX, p.texcoordY, 10 * (Math.random() - 0.5), 30 * (Math.random() - 0.5), color);
  }

  let firstMove = false;
  function handleMouseMove(e) {
    let p = pointers[0], posX = utils.scaleByPixelRatio(e.clientX), posY = utils.scaleByPixelRatio(e.clientY);
    p.prevTexcoordX = p.texcoordX; p.prevTexcoordY = p.texcoordY; p.texcoordX = posX / canvas.width; p.texcoordY = 1.0 - posY / canvas.height;
    let aspectRatio = canvas.width / canvas.height;
    p.deltaX = (p.texcoordX - p.prevTexcoordX) * (aspectRatio < 1 ? aspectRatio : 1);
    p.deltaY = (p.texcoordY - p.prevTexcoordY) / (aspectRatio > 1 ? aspectRatio : 1);
    p.moved = Math.abs(p.deltaX) > 0 || Math.abs(p.deltaY) > 0;
    if (!firstMove) { p.color = utils.generateColor(config.RAINBOW_MODE, config.COLOR); firstMove = true; }
  }

  function handleTouchStart(e) {
    let p = pointers[0], touches = e.targetTouches;
    for (let i = 0; i < touches.length; i++) {
      let posX = utils.scaleByPixelRatio(touches[i].clientX), posY = utils.scaleByPixelRatio(touches[i].clientY);
      p.id = touches[i].identifier; p.down = true; p.moved = false; p.texcoordX = posX / canvas.width; p.texcoordY = 1.0 - posY / canvas.height;
      p.prevTexcoordX = p.texcoordX; p.prevTexcoordY = p.texcoordY; p.deltaX = 0; p.deltaY = 0;
      p.color = utils.generateColor(config.RAINBOW_MODE, config.COLOR);
    }
  }

  function handleTouchMove(e) {
    let p = pointers[0], touches = e.targetTouches;
    for (let i = 0; i < touches.length; i++) {
      let posX = utils.scaleByPixelRatio(touches[i].clientX), posY = utils.scaleByPixelRatio(touches[i].clientY);
      p.prevTexcoordX = p.texcoordX; p.prevTexcoordY = p.texcoordY; p.texcoordX = posX / canvas.width; p.texcoordY = 1.0 - posY / canvas.height;
      let aspectRatio = canvas.width / canvas.height;
      p.deltaX = (p.texcoordX - p.prevTexcoordX) * (aspectRatio < 1 ? aspectRatio : 1);
      p.deltaY = (p.texcoordY - p.prevTexcoordY) / (aspectRatio > 1 ? aspectRatio : 1);
      p.moved = Math.abs(p.deltaX) > 0 || Math.abs(p.deltaY) > 0;
    }
  }

  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchmove', handleTouchMove, false);
  window.addEventListener('touchend', () => { pointers[0].down = false; });

  updateFrame();

  return () => {
    isActive = false;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    window.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchmove', handleTouchMove);
  };
}

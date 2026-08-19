import React, { useEffect, useRef } from 'react';
import { initFluidSimulation } from './splashCursor/simulationEngine';

function SplashCursor({
  SIM_RESOLUTION = 256,
  DYE_RESOLUTION = 720,
  CAPTURE_RESOLUTION = 256,
  DENSITY_DISSIPATION = 0.2,
  VELOCITY_DISSIPATION = 0.2,
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 40,
  CURL = 3,
  SPLAT_RADIUS = 0.2,
  SPLAT_FORCE = 6000,
  SHADING = true,
  COLOR_UPDATE_SPEED = 30,
  BACK_COLOR = { r: 0.5, g: 0, b: 0 },
  TRANSPARENT = true,
  RAINBOW_MODE = true,
  COLOR = '#ff0000',
  TIMER_DELAY = 5000,
  auto = false,
  styles = {}
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cleanup = initFluidSimulation(canvas, {
      SIM_RESOLUTION,
      DYE_RESOLUTION,
      CAPTURE_RESOLUTION,
      DENSITY_DISSIPATION,
      VELOCITY_DISSIPATION,
      PRESSURE,
      PRESSURE_ITERATIONS,
      CURL,
      SPLAT_RADIUS,
      SPLAT_FORCE,
      SHADING,
      COLOR_UPDATE_SPEED,
      BACK_COLOR,
      TRANSPARENT,
      RAINBOW_MODE,
      COLOR,
      TIMER_DELAY,
      auto
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [
    SIM_RESOLUTION,
    DYE_RESOLUTION,
    CAPTURE_RESOLUTION,
    DENSITY_DISSIPATION,
    VELOCITY_DISSIPATION,
    PRESSURE,
    PRESSURE_ITERATIONS,
    CURL,
    SPLAT_RADIUS,
    SPLAT_FORCE,
    SHADING,
    COLOR_UPDATE_SPEED,
    BACK_COLOR,
    TRANSPARENT,
    RAINBOW_MODE,
    COLOR,
    auto
  ]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        ...styles
      }}
    >
      <canvas
        ref={canvasRef}
        id="fluid"
        style={{
          width: '100vw',
          height: '100vh',
          display: 'block'
        }}
      />
    </div>
  );
}

export default SplashCursor;

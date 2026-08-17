import React from 'react';

const SIZE_MAP = {
    xs: 24,
    sm: 32,
    md: 48,
    lg: 72,
    xl: 96,
    '2xl': 128,
    '3xl': 160
};

const Loader = ({
    size = 'md',
    label = '',
    overlay = false,
    glass = false,
    className = '',
    style = {},
    imgStyle = {},
    src = '/assets/globe.webp',
    ariaLabel = 'Loading...'
}) => {
    let dimension;
    if (typeof size === 'number') {
        dimension = `${size}px`;
    } else if (SIZE_MAP[size]) {
        dimension = `${SIZE_MAP[size]}px`;
    } else {
        dimension = typeof size === 'string' && !isNaN(Number(size)) ? `${size}px` : size;
    }

    const containerStyle = overlay
        ? {
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: glass ? 'rgba(15, 23, 42, 0.75)' : 'rgba(15, 23, 42, 0.9)',
            backdropFilter: glass ? 'blur(8px)' : 'none',
            WebkitBackdropFilter: glass ? 'blur(8px)' : 'none',
            padding: '20px',
            width: '100%',
            height: '100%',
            ...style
        }
        : {
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            maxWidth: '100%',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgb(15, 23, 42)',
            ...style
        };

    return (
        <div
            role="status"
            aria-label={label || ariaLabel}
            className={`globe-loader ${className}`.trim()}
            style={containerStyle}
        >
            <div
                style={{
                    width: dimension,
                    height: dimension,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    flexShrink: 0
                }}
            >
                <img
                    src={src}
                    alt={label || ariaLabel}
                    style={{
                        // width: '100%',
                        // height: '100%',
                        objectFit: 'contain',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.35))',
                        ...imgStyle
                    }}
                />
            </div>
            {label && (
                <span
                    style={{
                        fontSize: typeof size === 'number' && size < 36 ? '0.75rem' : '0.85rem',
                        fontWeight: 500,
                        color: '#94a3b8',
                        textAlign: 'center'
                    }}
                >
                    {label}
                </span>
            )}
        </div>
    );
};

export default Loader;

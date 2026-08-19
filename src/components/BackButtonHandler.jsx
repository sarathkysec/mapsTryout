import React, { useEffect, useRef } from 'react';
import { App } from '@capacitor/app';
import { useNativeState } from 'native-state-react';

const BackButtonHandler = () => {
    const [toastMessage, setToastMessage] = useNativeState('state.toastMessage', '');
    const lastBackPressRef = useRef(0);
    const toastTimeoutRef = useRef(null);

    useEffect(() => {
        let listenerHandle = null;

        const initBackButton = async () => {
            try {
                listenerHandle = await App.addListener('backButton', () => {
                    const now = Date.now();
                    if (now - lastBackPressRef.current < 2000) {
                        App.exitApp();
                    } else {
                        lastBackPressRef.current = now;
                        window?.history?.back();
                        setToastMessage('Press back again to exit');

                        if (toastTimeoutRef.current) {
                            clearTimeout(toastTimeoutRef.current);
                        }
                        toastTimeoutRef.current = setTimeout(() => {
                            setToastMessage('');
                        }, 2000);
                    }
                });
            } catch (err) {
                console.warn('Capacitor backButton listener unavailable:', err);
            }
        };

        initBackButton();

        return () => {
            if (listenerHandle && typeof listenerHandle.remove === 'function') {
                listenerHandle.remove();
            }
            if (toastTimeoutRef.current) {
                clearTimeout(toastTimeoutRef.current);
            }
        };
    }, [setToastMessage]);

    if (!toastMessage) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            color: '#f8fafc',
            padding: '10px 20px',
            borderRadius: '24px',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 9999,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}>
            <span>{toastMessage}</span>
        </div>
    );
};

export default BackButtonHandler;

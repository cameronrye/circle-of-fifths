/**
 * Browser Compatibility and Feature Detection for Circle of Fifths
 * Modern browsers only - IE11 support removed (EOL June 2022)
 *
 * Minimum browser versions:
 * - Chrome 66+
 * - Firefox 60+
 * - Safari 11.1+
 * - Edge 79+
 */

(function () {
    'use strict';

    /**
     * Web Audio API compatibility fixes
     * Safari still requires webkit prefix in some versions
     */
    if (window.webkitAudioContext && !window.AudioContext) {
        window.AudioContext = window.webkitAudioContext;
    }

    /**
     * Touch event detection and normalization
     */
    window.isTouchDevice = function () {
        return (
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
        );
    };

    /**
     * Passive event listener support detection
     */
    window.supportsPassiveEvents = false;
    try {
        const opts = Object.defineProperty({}, 'passive', {
            get: function () {
                window.supportsPassiveEvents = true;
                return true;
            }
        });
        window.addEventListener('testPassive', null, opts);
        window.removeEventListener('testPassive', null, opts);
    } catch {
        // Passive events not supported
    }

    /**
     * Browser detection utilities
     */
    window.browserInfo = {
        isIE:
            navigator.userAgent.indexOf('MSIE') !== -1 ||
            navigator.appVersion.indexOf('Trident/') > -1,
        isEdge: navigator.userAgent.indexOf('Edge') !== -1,
        isChrome: navigator.userAgent.indexOf('Chrome') !== -1,
        isFirefox: navigator.userAgent.indexOf('Firefox') !== -1,
        isSafari:
            navigator.userAgent.indexOf('Safari') !== -1 &&
            navigator.userAgent.indexOf('Chrome') === -1,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        ),
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        isAndroid: /Android/.test(navigator.userAgent)
    };

    /**
     * Feature detection
     */
    window.featureSupport = {
        webAudio: !!(window.AudioContext || window.webkitAudioContext),
        localStorage: !!window.localStorage,
        serviceWorker: 'serviceWorker' in navigator,
        webGL: !!window.WebGLRenderingContext,
        canvas: !!document.createElement('canvas').getContext,
        svg:
            !!document.createElementNS &&
            !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect,
        touch: window.isTouchDevice(),
        passiveEvents: window.supportsPassiveEvents
    };

    // Log browser and feature information in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Browser Info:', window.browserInfo);
        console.log('Feature Support:', window.featureSupport);
    }
})();

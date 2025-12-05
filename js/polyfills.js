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
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(ua);

    // Detect browser name and version
    let browserName = 'Unknown';
    let browserVersion = '';
    if (ua.indexOf('Firefox') !== -1) {
        browserName = 'Firefox';
        browserVersion = ua.match(/Firefox\/(\d+)/)?.[1] || '';
    } else if (ua.indexOf('Edge') !== -1) {
        browserName = 'Edge';
        browserVersion = ua.match(/Edge\/(\d+)/)?.[1] || '';
    } else if (ua.indexOf('Chrome') !== -1) {
        browserName = 'Chrome';
        browserVersion = ua.match(/Chrome\/(\d+)/)?.[1] || '';
    } else if (ua.indexOf('Safari') !== -1) {
        browserName = 'Safari';
        browserVersion = ua.match(/Version\/(\d+)/)?.[1] || '';
    } else if (ua.indexOf('MSIE') !== -1 || ua.indexOf('Trident/') !== -1) {
        browserName = 'IE';
        browserVersion = ua.match(/(?:MSIE |rv:)(\d+)/)?.[1] || '';
    }

    // Detect OS
    let os = 'Unknown';
    if (/Windows/.test(ua)) {
        os = 'Windows';
    } else if (/Mac/.test(ua)) {
        os = 'macOS';
    } else if (/Linux/.test(ua)) {
        os = 'Linux';
    } else if (/Android/.test(ua)) {
        os = 'Android';
    } else if (/iOS|iPhone|iPad|iPod/.test(ua)) {
        os = 'iOS';
    }

    window.browserInfo = {
        name: browserName,
        version: browserVersion,
        isMobile: isMobile,
        isTablet: isTablet,
        isDesktop: !isMobile && !isTablet,
        os: os,
        isIE: ua.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1,
        isEdge: ua.indexOf('Edge') !== -1,
        isChrome: ua.indexOf('Chrome') !== -1,
        isFirefox: ua.indexOf('Firefox') !== -1,
        isSafari: ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1,
        isIOS: /iPad|iPhone|iPod/.test(ua),
        isAndroid: /Android/.test(ua)
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

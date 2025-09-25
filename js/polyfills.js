/**
 * Browser Compatibility Polyfills for Circle of Fifths
 * Ensures compatibility across major browsers and older versions
 */

(function () {
    'use strict';

    /**
     * CustomEvent polyfill for IE
     */
    if (typeof window.CustomEvent !== 'function') {
        function CustomEvent(event, params) {
            params = params || { bubbles: false, cancelable: false, detail: null };
            const evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }
        window.CustomEvent = CustomEvent;
    }

    /**
     * Object.assign polyfill for IE
     */
    if (typeof Object.assign !== 'function') {
        Object.assign = function (target) {
            if (target === null || target === undefined) {
                throw new TypeError('Cannot convert undefined or null to object');
            }

            const to = Object(target);

            for (let index = 1; index < arguments.length; index++) {
                const nextSource = arguments[index];

                if (nextSource !== null && nextSource !== undefined) {
                    for (const nextKey in nextSource) {
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }

            return to;
        };
    }

    /**
     * Array.from polyfill for IE
     */
    if (!Array.from) {
        Array.from = function (arrayLike, mapFn, thisArg) {
            const C = this;
            const items = Object(arrayLike);
            if (arrayLike === null || arrayLike === undefined) {
                throw new TypeError(
                    'Array.from requires an array-like object - not null or undefined'
                );
            }
            const mapFunction = mapFn === undefined ? undefined : mapFn;
            if (typeof mapFunction !== 'undefined' && typeof mapFunction !== 'function') {
                throw new TypeError(
                    'Array.from: when provided, the second argument must be a function'
                );
            }
            const len = parseInt(items.length, 10);
            const A = typeof C === 'function' ? Object(new C(len)) : new Array(len);
            let k = 0;
            let kValue;
            while (k < len) {
                kValue = items[k];
                if (mapFunction) {
                    A[k] =
                        typeof thisArg === 'undefined'
                            ? mapFunction(kValue, k)
                            : mapFunction.call(thisArg, kValue, k);
                } else {
                    A[k] = kValue;
                }
                k += 1;
            }
            A.length = len;
            return A;
        };
    }

    /**
     * Element.closest polyfill for IE
     */
    if (!Element.prototype.closest) {
        Element.prototype.closest = function (s) {
            let el = this;
            do {
                if (Element.prototype.matches.call(el, s)) {
                    return el;
                }
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }

    /**
     * Element.matches polyfill for IE
     */
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }

    /**
     * requestAnimationFrame polyfill
     */
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }

    /**
     * Performance.now polyfill
     */
    if (!window.performance || !window.performance.now) {
        window.performance = window.performance || {};
        window.performance.now = function () {
            return Date.now();
        };
    }

    /**
     * Web Audio API polyfills and compatibility fixes
     */
    if (window.AudioContext || window.webkitAudioContext) {
        // Standardize AudioContext
        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        // Fix for older Chrome versions
        if (AudioContext.prototype.createGain === undefined) {
            AudioContext.prototype.createGain = AudioContext.prototype.createGainNode;
        }

        if (AudioContext.prototype.createDelay === undefined) {
            AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode;
        }

        if (AudioContext.prototype.createScriptProcessor === undefined) {
            AudioContext.prototype.createScriptProcessor =
                AudioContext.prototype.createJavaScriptNode;
        }
    }

    /**
     * localStorage polyfill for older browsers
     */
    if (!window.localStorage) {
        window.localStorage = {
            _data: {},
            setItem: function (id, val) {
                return (this._data[id] = String(val));
            },
            getItem: function (id) {
                return Object.prototype.hasOwnProperty.call(this._data, id) ? this._data[id] : null;
            },
            removeItem: function (id) {
                return delete this._data[id];
            },
            clear: function () {
                return (this._data = {});
            }
        };
    }

    /**
     * matchMedia polyfill for IE
     */
    if (!window.matchMedia) {
        window.matchMedia = function () {
            return {
                matches: false,
                addListener: function () {},
                removeListener: function () {}
            };
        };
    }

    /**
     * CSS.supports polyfill
     */
    if (!window.CSS || !window.CSS.supports) {
        window.CSS = window.CSS || {};
        window.CSS.supports = function () {
            return false;
        };
    }

    /**
     * Intersection Observer polyfill detection
     */
    if (!window.IntersectionObserver) {
        // Simple fallback - could load a full polyfill if needed
        window.IntersectionObserver = function () {
            return {
                observe: function () {},
                unobserve: function () {},
                disconnect: function () {}
            };
        };
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

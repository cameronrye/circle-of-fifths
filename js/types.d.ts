/**
 * Type definitions for Circle of Fifths application
 * This file provides TypeScript type definitions for the JavaScript codebase
 */

// Extend Window interface with custom properties
interface Window {
    // Audio context
    webkitAudioContext?: typeof AudioContext;

    // Touch and feature detection
    isTouchDevice: () => boolean;
    supportsPassiveEvents: boolean;
    browserInfo: {
        name: string;
        version: string;
        isMobile: boolean;
        isTablet: boolean;
        isDesktop: boolean;
        os: string;
        isIE?: boolean;
        isEdge?: boolean;
        isChrome?: boolean;
    };
    featureSupport: {
        webAudio: boolean;
        svg: boolean;
        localStorage: boolean;
        serviceWorker: boolean;
        touch: boolean;
        passiveEvents: boolean;
        webGL?: boolean;
        canvas?: boolean;
    };

    // Application classes
    Logger: any;
    LOG_LEVELS: any;
    logger: any;
    loggers: any;

    MusicTheory: any;
    CIRCLE_OF_FIFTHS: any;
    MAJOR_KEYS: any;
    MINOR_KEYS: any;
    CHORD_PROGRESSIONS: any;

    AudioEngine: any;
    CircleRenderer: any;
    InteractionsHandler: any;
    ThemeManager: any;
    ThemeToggle: any;

    CircleOfFifthsApp: any;
    circleOfFifthsApp: any;
    app: any;
}

// Extend Navigator interface
interface Navigator {
    msMaxTouchPoints?: number;
}

// Extend Element interface for style property
interface Element {
    style?: CSSStyleDeclaration;
}

// Extend EventTarget for common properties
interface EventTarget {
    value?: any;
    checked?: any;
    disabled?: any;
    tagName?: string;
    closest?: (selector: string) => Element | null;
    getAttribute?: (name: string) => string | null;
    setAttribute?: (name: string, value: any) => void;
    clientX?: number;
    clientY?: number;
    touches?: TouchList;
}

// Extend Event interface
interface Event {
    key?: string;
    clientX?: number;
    clientY?: number;
    touches?: TouchList;
}

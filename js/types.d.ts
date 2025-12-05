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
        isFirefox?: boolean;
        isSafari?: boolean;
        isIOS?: boolean;
        isAndroid?: boolean;
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

/**
 * Logger interface with custom methods
 * Note: Logger | Console union type is used in code, so Console methods are also valid
 */
interface Logger {
    name: string;
    level: number;
    isDevelopment: boolean;
    error(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
    log?(message: string, ...args: any[]): void;
    performance(metric: string, value: number, unit?: string): void;
    startTimer(label: string): () => number;
    lifecycle(event: string, data?: object): void;
    userAction(action: string, context?: object): void;
    child(category: string): Logger;
    setLevel(level: number): void;
    shouldLog(level: number): boolean;
}

/**
 * Audio engine settings interface
 */
interface AudioEngineSettings {
    masterVolume: number;
    noteLength: number;
    chordLength: number;
    progressionNoteLength: number;
    waveform: string;
    reverbType: string;
    reverbLevel: number;
    stereoWidth: number;
    useFilterEnvelope: boolean;
    useStereoEnhancement: boolean;
    useMultiOscillator: boolean;
    subOscillatorLevel: number;
    detuneAmount: number;
    percussionVolume: number;
    bassVolume: number;
    [key: string]: any;
}

/**
 * Note event interface for audio-visual sync
 */
interface NoteEvent {
    note: string;
    eventType: 'start' | 'chord-start' | 'progression-chord' | 'end';
    octave?: number;
    duration?: number;
}

/**
 * MusicTheory class - provides music theory calculations
 */
declare class MusicTheory {
    currentKey: string;
    currentMode: string;
    [key: string]: any;
}

/**
 * CircleRenderer class - renders the circle of fifths SVG
 */
declare class CircleRenderer {
    constructor(svgElement: SVGElement, musicTheory: MusicTheory);
    [key: string]: any;
}

/**
 * InteractionsHandler class - handles user interactions
 */
declare class InteractionsHandler {
    constructor(circleRenderer: CircleRenderer, app: CircleOfFifthsApp, musicTheory: MusicTheory);
    [key: string]: any;
}

/**
 * AudioEngine class - handles audio synthesis
 */
declare class AudioEngine {
    constructor(musicTheory: MusicTheory);
    logger: Logger;
    settings: AudioEngineSettings;
    [key: string]: any;
}

/**
 * ThemeManager class - manages theme switching
 */
declare class ThemeManager {
    currentTheme: string;
    themes: string[];
    getCurrentTheme(): string;
    getEffectiveTheme(): string;
    setTheme(theme: string): boolean;
    toggleTheme(): string;
    destroy(): void;
    [key: string]: any;
}

/**
 * ThemeToggle class - UI component for theme switching
 */
declare class ThemeToggle {
    constructor(themeManager: ThemeManager);
    destroy(): void;
    [key: string]: any;
}

/**
 * CircleOfFifthsApp class - main application class
 */
declare class CircleOfFifthsApp {
    musicTheory: MusicTheory;
    circleRenderer: CircleRenderer;
    interactionsHandler: InteractionsHandler;
    audioEngine: AudioEngine | null;
    themeManager: ThemeManager;
    themeToggle: ThemeToggle;
    init(): Promise<boolean>;
    getAudioEngine(): Promise<AudioEngine>;
    destroy(): void;
    [key: string]: any;
}

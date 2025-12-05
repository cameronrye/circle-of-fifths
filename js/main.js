/**
 * Main entry point for Circle of Fifths application
 * ES Module version for Vite bundler
 *
 * This file uses ES6 imports to load all dependencies and initialize the application.
 */

// Import polyfills first
import './polyfills.js';

// Import all modules using ES6 imports
import { logger, loggers } from './logger.js';
import { MusicTheory } from './musicTheory.js';
import { AudioEngine } from './audioEngine.js';
import { CircleRenderer } from './circleRenderer.js';
import { InteractionsHandler } from './interactions.js';
import { ThemeManager } from './themeManager.js';
import { ThemeToggle } from './themeToggle.js';

// Set loggers on window for components that need them (development only)
if (window.location.hostname === 'localhost') {
    window.logger = logger;
    window.loggers = loggers;
}

/**
 * Main application class
 */
class CircleOfFifthsApp {
    constructor() {
        this.logger = loggers.app;
        this.musicTheory = null;
        this.audioEngine = null;
        this.audioEngineLoading = false;
        this.audioEngineLoadPromise = null;
        this.circleRenderer = null;
        this.interactionsHandler = null;
        this.themeManager = null;
        this.themeToggle = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the application
     */
    async init() {
        this.logger.info('Initializing Circle of Fifths application...');

        try {
            // Setup error handling first
            this.setupErrorHandling();

            // Initialize core components
            this.musicTheory = new MusicTheory();
            this.themeManager = new ThemeManager();

            // Audio engine will be lazy loaded on first use
            this.logger.info('Audio engine will be lazy loaded on first audio interaction');

            // Get DOM elements
            const svg = /** @type {SVGElement} */ (
                /** @type {unknown} */ (document.getElementById('circle-svg'))
            );
            const themeSwitcher = document.querySelector('.theme-switcher');

            if (!svg) {
                throw new Error('Required SVG element not found');
            }

            // Initialize renderer
            this.circleRenderer = new CircleRenderer(svg, this.musicTheory);

            // Initialize interactions (pass app instance for lazy audio loading)
            this.interactionsHandler = new InteractionsHandler(
                this.circleRenderer,
                this, // Pass app instance for lazy audio loading
                this.musicTheory
            );

            // Initialize theme toggle if switcher exists
            if (themeSwitcher) {
                this.themeToggle = new ThemeToggle(this.themeManager);
            }

            // Hide loading screen
            this.hideLoadingScreen();

            this.isInitialized = true;
            this.logger.info('Circle of Fifths application initialized successfully');

            return true;
        } catch (error) {
            this.logger.error('Failed to initialize Circle of Fifths application:', error);
            this.handleInitializationError(error);
            return false;
        }
    }

    /**
     * Lazy load and initialize the audio engine
     * Only loads when user first interacts with audio features
     * @async
     * @returns {Promise<AudioEngine>} The initialized audio engine
     * @since 1.1.0
     */
    async getAudioEngine() {
        // Return existing instance if already loaded
        if (this.audioEngine) {
            return this.audioEngine;
        }

        // Return existing promise if already loading
        if (this.audioEngineLoadPromise) {
            return this.audioEngineLoadPromise;
        }

        // Start loading
        this.audioEngineLoading = true;

        this.audioEngineLoadPromise = (async () => {
            try {
                this.logger.info('Lazy loading audio engine...');

                // Create and initialize
                this.audioEngine = new AudioEngine();
                this.audioEngine.logger = /** @type {Logger} */ (
                    /** @type {unknown} */ (loggers.audio)
                );
                await this.audioEngine.initialize();

                this.logger.info('Audio engine loaded and initialized successfully');

                this.audioEngineLoading = false;
                return this.audioEngine;
            } catch (error) {
                this.audioEngineLoading = false;
                this.audioEngineLoadPromise = null;
                this.logger.error('Failed to lazy load audio engine:', error);
                throw error;
            }
        })();

        return this.audioEngineLoadPromise;
    }

    /**
     * Setup global error handlers
     */
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', event => {
            this.logger.error('Global error:', event.error);
            this.handleError(event.error);
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', event => {
            this.logger.error('Unhandled promise rejection:', event.reason);
            this.handleError(event.reason);
        });
    }

    /**
     * Hide the loading screen
     */
    hideLoadingScreen() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.style.display = 'none';
            }, 300);
        }
    }

    /**
     * Handle initialization errors
     */
    handleInitializationError(_error) {
        const loading = document.getElementById('loading');
        if (loading) {
            const loadingText = loading.querySelector('.loading-text');
            if (loadingText) {
                loadingText.textContent = 'Failed to load application. Please refresh the page.';
                loadingText.style.color = 'var(--error-color, #f44336)';
            }
        }
    }

    /**
     * Handle runtime errors
     */
    handleError(error) {
        // Log error
        this.logger.error('Application error:', error);

        // Could show user-friendly error message here
        // For now, just log it
    }

    /**
     * Cleanup and destroy the application
     */
    destroy() {
        this.logger.info('Destroying Circle of Fifths application...');

        if (this.interactionsHandler) {
            this.interactionsHandler.destroy();
        }

        if (this.audioEngine) {
            this.audioEngine.dispose();
        }

        if (this.circleRenderer) {
            this.circleRenderer.destroy();
        }

        if (this.themeToggle) {
            this.themeToggle.destroy();
        }

        if (this.themeManager) {
            this.themeManager.destroy();
        }

        this.isInitialized = false;
    }
}

// Initialize app when DOM is ready
let app = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        app = new CircleOfFifthsApp();
        await app.init();
    } catch (error) {
        // Use console.error here since logger may not be initialized yet
        console.error('Failed to start Circle of Fifths application:', error);

        // Show user-friendly error message
        const loading = document.getElementById('loading');
        if (loading) {
            const loadingText = loading.querySelector('.loading-text');
            if (loadingText) {
                loadingText.textContent = 'Failed to load application. Please refresh the page.';
            }
        }
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (app) {
        app.destroy();
    }
});

// Export for debugging in console (development only)
if (window.location.hostname === 'localhost') {
    window.CircleOfFifthsApp = CircleOfFifthsApp;
    window.app = app;
}

export { CircleOfFifthsApp, app };

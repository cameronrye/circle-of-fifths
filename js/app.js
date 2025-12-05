/**
 * Circle of Fifths Application
 * Main application entry point and initialization
 */

import { loggers } from './logger.js';

/**
 * Main application class for the Circle of Fifths interactive music theory tool.
 * Manages initialization, component coordination, and application lifecycle.
 *
 * @class CircleOfFifthsApp
 * @example
 * const app = new CircleOfFifthsApp();
 * await app.init();
 */
class CircleOfFifthsApp {
    /**
     * Creates a new CircleOfFifthsApp instance.
     * Initializes all component references and binds event handlers.
     *
     * @constructor
     */
    constructor() {
        this.musicTheory = null;
        this.audioEngine = null;
        this.audioEngineLoading = false;
        this.audioEngineLoadPromise = null;
        this.circleRenderer = null;
        this.interactionsHandler = null;
        this.themeManager = null;
        this.themeToggle = null;

        this.isInitialized = false;
        this.initializationPromise = null;

        // Initialize logger
        /** @type {Logger} */
        this.logger = /** @type {Logger} */ (/** @type {unknown} */ (loggers?.app || console));

        // Bind methods
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    /**
     * Initialize the application asynchronously.
     * Sets up all components, event listeners, and performs initial render.
     * Can be called multiple times safely - subsequent calls return the same promise.
     *
     * @async
     * @returns {Promise<boolean>} Promise that resolves to true on success, false on failure
     * @example
     * try {
     *     await app.init();
     *     console.log('App ready!');
     * } catch (error) {
     *     console.error('Failed to initialize:', error);
     * }
     */
    async init() {
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.initializationPromise = this._performInitialization();
        return this.initializationPromise;
    }

    /**
     * Perform the actual initialization process.
     * Private method that handles the core initialization steps.
     *
     * @private
     * @async
     * @returns {Promise<boolean>} Promise that resolves to true on success, false on failure
     */
    async _performInitialization() {
        const initTimer = this.logger.startTimer('Total initialization');

        try {
            this.logger.lifecycle('initialization-start');

            // Wait for DOM to be ready
            const domTimer = this.logger.startTimer('DOM ready');
            await this.waitForDOM();
            domTimer();

            // Initialize core components
            const componentsTimer = this.logger.startTimer('Components initialization');
            this.initializeComponents();
            componentsTimer();

            // Setup global event listeners
            const listenersTimer = this.logger.startTimer('Event listeners setup');
            this.setupGlobalEventListeners();
            listenersTimer();

            // Perform initial render
            const renderTimer = this.logger.startTimer('Initial render');
            this.performInitialRender();
            renderTimer();

            // Setup error handling
            this.setupErrorHandling();

            this.isInitialized = true;
            const totalDuration = initTimer();
            this.logger.lifecycle('initialization-complete');
            this.logger.info(`Application ready in ${totalDuration.toFixed(2)}ms`);

            // Dispatch initialization complete event
            document.dispatchEvent(
                new CustomEvent('circleOfFifthsReady', {
                    detail: { app: this, initDuration: totalDuration }
                })
            );

            return true;
        } catch (error) {
            initTimer();
            this.logger.error('Failed to initialize Circle of Fifths application:', error);
            this.handleInitializationError(error);
            return false;
        }
    }

    /**
     * Wait for DOM to be ready
     */
    waitForDOM() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Initialize core components
     */
    initializeComponents() {
        // Initialize theme manager first (affects visual appearance)
        this.themeManager = new ThemeManager();
        this.logger.debug('Theme manager initialized');

        // Initialize theme toggle UI
        this.themeToggle = new ThemeToggle(this.themeManager);
        this.logger.debug('Theme toggle initialized');

        // Initialize music theory engine
        this.musicTheory = new MusicTheory();
        this.logger.debug('Music theory engine initialized');

        // Audio engine will be lazy loaded on first use
        this.logger.debug('Audio engine will be lazy loaded on first audio interaction');

        // Get SVG element
        const svgElement = /** @type {SVGElement} */ (
            /** @type {unknown} */ (document.getElementById('circle-svg'))
        );
        if (!svgElement) {
            throw new Error('Circle SVG element not found');
        }

        // Initialize circle renderer
        this.circleRenderer = new CircleRenderer(svgElement, this.musicTheory);
        this.logger.debug('Circle renderer initialized');

        // Initialize interactions handler (pass app reference for lazy audio loading)
        this.interactionsHandler = new InteractionsHandler(
            this.circleRenderer,
            this, // Pass app instance for lazy audio loading
            this.musicTheory
        );
        this.logger.debug('Interactions handler initialized');
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
        const loadTimer = this.logger.startTimer('Audio engine lazy load');

        this.audioEngineLoadPromise = (async () => {
            try {
                this.logger.info('Lazy loading audio engine...');

                // Dynamic import of AudioEngine
                const { AudioEngine } = await import('./audioEngine.js');

                // Create and initialize
                this.audioEngine = new AudioEngine();
                await this.audioEngine.initialize();

                const loadDuration = loadTimer();
                this.logger.info(
                    `Audio engine loaded and initialized in ${loadDuration.toFixed(2)}ms`
                );

                this.audioEngineLoading = false;
                return this.audioEngine;
            } catch (error) {
                loadTimer();
                this.audioEngineLoading = false;
                this.audioEngineLoadPromise = null;
                this.logger.error('Failed to lazy load audio engine:', error);
                throw error;
            }
        })();

        return this.audioEngineLoadPromise;
    }

    /**
     * Setup global event listeners
     */
    setupGlobalEventListeners() {
        // Page visibility change handling
        document.addEventListener('visibilitychange', this.handleVisibilityChange);

        // Prevent context menu on circle (for better mobile experience)
        const svg = document.getElementById('circle-svg');
        if (svg) {
            svg.addEventListener('contextmenu', event => {
                event.preventDefault();
            });
        }

        // Note: Window resize and orientation change handling removed
        // SVG viewBox handles responsive scaling automatically

        // Keyboard shortcuts help
        document.addEventListener('keydown', event => {
            if (event.key === 'F1' || (event.key === '?' && event.shiftKey)) {
                event.preventDefault();
                this.showKeyboardShortcuts();
            }
        });
    }

    /**
     * Perform initial render
     */
    performInitialRender() {
        // Set initial key to C major
        this.circleRenderer.selectKey('C');

        // Update initial UI state
        this.updateUIState();

        // Hide loading screen
        const loading = document.getElementById('loading');
        if (loading) {
            setTimeout(() => {
                loading.classList.add('hidden');
            }, 500);
        }
    }

    /**
     * Setup error handling
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

    // Note: Resize handling methods removed - SVG viewBox handles scaling automatically

    /**
     * Handle page visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - stop audio and pause animations
            if (this.audioEngine) {
                this.audioEngine.stopAll();
            }
        } else {
            // Page is visible - resume if needed
            this.updateUIState();
        }
    }

    /**
     * Update UI state
     */
    updateUIState() {
        // Update any time-sensitive UI elements
        if (this.interactionsHandler) {
            // Refresh info panel
            this.interactionsHandler.updateInfoPanel();
        }
    }

    /**
     * Handle initialization errors
     */
    handleInitializationError(error) {
        // Log the detailed error for debugging
        this.logger.error('Application initialization failed:', error);

        const loading = document.getElementById('loading');
        if (loading) {
            const loadingText = loading.querySelector('.loading-text');
            if (loadingText) {
                loadingText.textContent = 'Failed to load application. Please refresh the page.';
            }

            const spinner = loading.querySelector('.loading-spinner');
            if (spinner) {
                spinner.style.display = 'none';
            }
        }

        // Show error message to user
        setTimeout(() => {
            this.showUserError(
                'Failed to initialize the Circle of Fifths application',
                error.message || 'Please refresh the page and try again.'
            );
        }, 1000);
    }

    /**
     * Show user-facing error message
     */
    showUserError(title, message) {
        // Create error notification element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.setAttribute('aria-live', 'assertive');
        errorDiv.innerHTML = `
            <div class="error-content">
                <h3 class="error-title">${this.escapeHtml(title)}</h3>
                <p class="error-message">${this.escapeHtml(message)}</p>
                <button class="error-close" aria-label="Close error message">×</button>
            </div>
        `;

        // Add to document
        document.body.appendChild(errorDiv);

        // Close button handler
        const closeBtn = errorDiv.querySelector('.error-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                errorDiv.remove();
            });
        }

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 10000);
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Handle runtime errors
     */
    handleError(error) {
        // Log error for debugging
        this.logger.error('Application error:', error);

        // Show user-friendly error message
        const errorMessage = this.getUserFriendlyErrorMessage(error);

        // Could implement a proper error modal here
        // For now, use logger and optionally log for critical errors
        if (this.isCriticalError(error)) {
            this.logger.error('Critical error:', errorMessage);
        }
    }

    /**
     * Get user-friendly error message
     */
    getUserFriendlyErrorMessage(error) {
        if (error.name === 'NotAllowedError') {
            return 'Audio access was denied. Please allow audio permissions and try again.';
        } else if (error.name === 'NotSupportedError') {
            return 'Your browser does not support the required audio features.';
        } else if (error.message?.includes('audio')) {
            return 'There was an issue with audio playback. Please check your audio settings.';
        } else {
            return 'An unexpected error occurred. Please refresh the page and try again.';
        }
    }

    /**
     * Check if error is critical
     */
    isCriticalError(error) {
        return (
            error.name === 'NotSupportedError' ||
            error.message?.includes('initialization') ||
            error.message?.includes('critical')
        );
    }

    /**
     * Show keyboard shortcuts help
     */
    showKeyboardShortcuts() {
        const shortcuts = [
            'Click/Tap: Select key',
            'S: Play scale',
            'C: Play chord',
            'P: Play progression',
            'Escape: Stop audio',
            'Ctrl+M: Toggle major/minor',
            'Ctrl+D: Toggle difficulty',
            'F1 or Shift+?: Show this help'
        ];

        this.logger.info('Keyboard Shortcuts:\n\n' + shortcuts.join('\n'));
        // Could implement a proper help modal here instead of alert
    }

    /**
     * Get the current application state.
     * Returns comprehensive state information for debugging and monitoring.
     *
     * @returns {Object} Application state object with properties:
     *   - initialized {boolean} - Whether the app is fully initialized
     *   - musicTheory {boolean|null} - Music theory engine status
     *   - audioEngine {Object|null} - Audio engine state
     *   - circleRenderer {Object|null} - Circle renderer state
     *   - interactions {Object|null} - Interactions handler state
     *   - theme {Object|null} - Theme manager state
     * @example
     * const state = app.getState();
     * console.log('App initialized:', state.initialized);
     */
    getState() {
        if (!this.isInitialized) {
            return { initialized: false };
        }

        return {
            initialized: true,
            musicTheory: this.musicTheory ? true : false,
            audioEngine: this.audioEngine ? this.audioEngine.getState() : null,
            circleRenderer: this.circleRenderer ? this.circleRenderer.getState() : null,
            interactions: this.interactionsHandler ? this.interactionsHandler.getState() : null,
            theme: this.themeManager
                ? {
                      current: this.themeManager.getCurrentTheme(),
                      effective: this.themeManager.getEffectiveTheme()
                  }
                : null
        };
    }

    /**
     * Cleanup all application resources and event listeners.
     * Properly disposes of all components and resets the application state.
     * Should be called before page unload or when restarting the application.
     *
     * @example
     * // Clean shutdown
     * app.destroy();
     */
    destroy() {
        this.logger.info('Destroying Circle of Fifths application...');

        // Remove event listeners
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);

        // Cleanup components
        if (this.audioEngine) {
            this.audioEngine.dispose();
        }

        if (this.themeToggle) {
            this.themeToggle.destroy();
        }

        if (this.themeManager) {
            this.themeManager.destroy();
        }

        // Reset state
        this.isInitialized = false;
        this.initializationPromise = null;

        this.logger.lifecycle('application-destroyed');
    }

    /**
     * Restart the application by destroying and reinitializing.
     * Useful for recovering from errors or applying configuration changes.
     *
     * @async
     * @returns {Promise<boolean>} Promise that resolves to true on success, false on failure
     * @example
     * // Restart after an error
     * await app.restart();
     */
    async restart() {
        this.destroy();
        return this.init();
    }
}

// Initialize application when DOM is ready
let app;

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

// ES6 module export
export { CircleOfFifthsApp, app };

// Set on window for debugging in console (development only)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    window.CircleOfFifthsApp = CircleOfFifthsApp;
    window.circleOfFifthsApp = app;
}

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('./sw.js')
            .then(registration => {
                if (window.logger) {
                    window.logger.debug('Service Worker registered:', registration);
                }
            })
            .catch(registrationError => {
                if (window.logger) {
                    window.logger.warn('Service Worker registration failed:', registrationError);
                }
            });
    });
}

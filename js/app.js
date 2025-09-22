/**
 * Circle of Fifths Application
 * Main application entry point and initialization
 */

class CircleOfFifthsApp {
    constructor() {
        this.musicTheory = null;
        this.audioEngine = null;
        this.circleRenderer = null;
        this.interactionsHandler = null;
        
        this.isInitialized = false;
        this.initializationPromise = null;
        
        // Bind methods
        this.handleResize = this.handleResize.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    /**
     * Initialize the application
     */
    async init() {
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.initializationPromise = this._performInitialization();
        return this.initializationPromise;
    }

    /**
     * Perform the actual initialization
     */
    async _performInitialization() {
        try {
            console.log('Initializing Circle of Fifths application...');

            // Wait for DOM to be ready
            await this.waitForDOM();

            // Initialize core components
            this.initializeComponents();

            // Setup global event listeners
            this.setupGlobalEventListeners();

            // Perform initial render
            this.performInitialRender();

            // Setup error handling
            this.setupErrorHandling();

            this.isInitialized = true;
            console.log('Circle of Fifths application initialized successfully');

            // Dispatch initialization complete event
            document.dispatchEvent(new CustomEvent('circleOfFifthsReady', {
                detail: { app: this }
            }));

            return true;
        } catch (error) {
            console.error('Failed to initialize Circle of Fifths application:', error);
            this.handleInitializationError(error);
            return false;
        }
    }

    /**
     * Wait for DOM to be ready
     */
    waitForDOM() {
        return new Promise((resolve) => {
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
        // Initialize music theory engine
        this.musicTheory = new MusicTheory();
        console.log('Music theory engine initialized');

        // Initialize audio engine
        this.audioEngine = new AudioEngine();
        console.log('Audio engine created (will initialize on first use)');

        // Get SVG element
        const svgElement = document.getElementById('circle-svg');
        if (!svgElement) {
            throw new Error('Circle SVG element not found');
        }

        // Initialize circle renderer
        this.circleRenderer = new CircleRenderer(svgElement, this.musicTheory);
        console.log('Circle renderer initialized');

        // Initialize interactions handler
        this.interactionsHandler = new InteractionsHandler(
            this.circleRenderer,
            this.audioEngine,
            this.musicTheory
        );
        console.log('Interactions handler initialized');
    }

    /**
     * Setup global event listeners
     */
    setupGlobalEventListeners() {
        // Window resize handling
        window.addEventListener('resize', this.handleResize);

        // Page visibility change handling
        document.addEventListener('visibilitychange', this.handleVisibilityChange);

        // Prevent context menu on circle (for better mobile experience)
        const svg = document.getElementById('circle-svg');
        if (svg) {
            svg.addEventListener('contextmenu', (event) => {
                event.preventDefault();
            });
        }

        // Handle orientation change on mobile
        window.addEventListener('orientationchange', () => {
            setTimeout(this.handleResize, 100);
        });

        // Keyboard shortcuts help
        document.addEventListener('keydown', (event) => {
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
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleError(event.error);
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleError(event.reason);
        });
    }

    /**
     * Handle window resize
     */
    handleResize() {
        if (!this.isInitialized) return;

        // Debounce resize handling
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.performResize();
        }, 250);
    }

    /**
     * Perform resize operations
     */
    performResize() {
        // Update circle renderer if needed
        const svg = document.getElementById('circle-svg');
        if (svg && this.circleRenderer) {
            const rect = svg.getBoundingClientRect();
            const size = Math.min(rect.width, rect.height);
            
            // Only resize if significant change
            if (Math.abs(size - this.lastSize) > 50) {
                this.circleRenderer.resize(size);
                this.lastSize = size;
            }
        }
    }

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
            alert('Failed to initialize the Circle of Fifths application. Please refresh the page and try again.');
        }, 1000);
    }

    /**
     * Handle runtime errors
     */
    handleError(error) {
        // Log error for debugging
        console.error('Application error:', error);

        // Show user-friendly error message
        const errorMessage = this.getUserFriendlyErrorMessage(error);
        
        // Could implement a proper error modal here
        // For now, use console and optionally alert for critical errors
        if (this.isCriticalError(error)) {
            alert(errorMessage);
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
        return error.name === 'NotSupportedError' || 
               error.message?.includes('initialization') ||
               error.message?.includes('critical');
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

        alert('Keyboard Shortcuts:\n\n' + shortcuts.join('\n'));
    }

    /**
     * Get application state
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
            interactions: this.interactionsHandler ? this.interactionsHandler.getState() : null
        };
    }

    /**
     * Cleanup resources
     */
    destroy() {
        console.log('Destroying Circle of Fifths application...');

        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);

        // Cleanup components
        if (this.audioEngine) {
            this.audioEngine.dispose();
        }

        // Clear timeouts
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }

        // Reset state
        this.isInitialized = false;
        this.initializationPromise = null;

        console.log('Circle of Fifths application destroyed');
    }

    /**
     * Restart the application
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
        console.error('Failed to start Circle of Fifths application:', error);
    }
});

// Export for global access
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CircleOfFifthsApp;
} else {
    window.CircleOfFifthsApp = CircleOfFifthsApp;
    window.circleOfFifthsApp = app;
}

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

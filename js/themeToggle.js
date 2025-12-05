/**
 * Theme Toggle Component
 * Handles the modern segmented theme switcher UI interactions
 */

import { loggers } from './logger.js';

/**
 * UI component for theme selection with segmented control interface.
 * Provides user interface for switching between light, dark, and system themes.
 *
 * @class ThemeToggle
 * @example
 * const themeToggle = new ThemeToggle(themeManager);
 */
class ThemeToggle {
    /**
     * Creates a new ThemeToggle instance.
     * Sets up the theme selection UI and connects it to the theme manager.
     *
     * @constructor
     * @param {ThemeManager} themeManager - The theme manager instance to control
     */
    constructor(themeManager) {
        this.themeManager = themeManager;

        // DOM elements
        this.switcher = null;
        this.segments = [];

        // Initialize logger
        this.logger = loggers?.theme || console;

        // Bind methods
        this.handleSegmentClick = this.handleSegmentClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleThemeChange = this.handleThemeChange.bind(this);

        // Initialize
        this.init();
    }

    /**
     * Initialize the theme toggle component
     */
    init() {
        this.logger.debug('Initializing Theme Toggle...');

        // Get DOM elements
        this.switcher = document.querySelector('.theme-switcher');
        this.segments = Array.from(document.querySelectorAll('.theme-segment'));

        if (!this.switcher || this.segments.length === 0) {
            this.logger.error('Theme switcher elements not found');
            return;
        }

        // Setup event listeners
        this.setupEventListeners();

        // Update initial state
        this.updateActiveSegment();

        this.logger.debug('Theme Toggle initialized');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Segment clicks
        this.segments.forEach(segment => {
            segment.addEventListener('click', this.handleSegmentClick);
            segment.addEventListener('keydown', this.handleKeyDown);
        });

        // Theme change events
        document.addEventListener('themeChanged', this.handleThemeChange);
    }

    /**
     * Handle segment click
     */
    handleSegmentClick(event) {
        const theme = event.currentTarget.dataset.theme;
        if (theme) {
            this.themeManager.setTheme(theme);
        }
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyDown(event) {
        const currentIndex = this.segments.findIndex(seg => seg === event.target);
        let newIndex = currentIndex;

        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault();
                newIndex = currentIndex <= 0 ? this.segments.length - 1 : currentIndex - 1;
                break;

            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault();
                newIndex = (currentIndex + 1) % this.segments.length;
                break;

            case 'Home':
                event.preventDefault();
                newIndex = 0;
                break;

            case 'End':
                event.preventDefault();
                newIndex = this.segments.length - 1;
                break;

            case 'Enter':
            case ' ':
                event.preventDefault();
                event.target.click();
                return;
        }

        if (newIndex !== currentIndex) {
            this.segments[newIndex].focus();
        }
    }

    /**
     * Handle theme change events
     */
    handleThemeChange(_event) {
        this.updateActiveSegment();
    }

    /**
     * Update active segment based on current theme
     */
    updateActiveSegment() {
        const currentTheme = this.themeManager.getCurrentTheme();

        this.segments.forEach(segment => {
            const isActive = segment.dataset.theme === currentTheme;
            segment.classList.toggle('active', isActive);
            segment.setAttribute('aria-checked', isActive.toString());
            segment.setAttribute('tabindex', isActive ? '0' : '-1');
        });
    }

    /**
     * Cleanup resources
     */
    destroy() {
        this.logger.debug('Destroying Theme Toggle...');

        // Remove event listeners
        this.segments.forEach(segment => {
            segment.removeEventListener('click', this.handleSegmentClick);
            segment.removeEventListener('keydown', this.handleKeyDown);
        });

        document.removeEventListener('themeChanged', this.handleThemeChange);

        this.logger.debug('Theme Toggle destroyed');
    }
}

// ES6 module export
export { ThemeToggle };

// Set on window for debugging in console (development only)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    window.ThemeToggle = ThemeToggle;
}

/**
 * Theme Toggle Component
 * Handles the theme toggle UI interactions
 */

import { loggers } from './logger.js';

/**
 * UI component for theme selection with dropdown interface.
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
        this.toggleBtn = null;
        this.dropdown = null;
        this.options = [];

        // State
        this.isOpen = false;

        // Initialize logger
        this.logger = loggers?.theme || console;

        // Bind methods
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleOptionClick = this.handleOptionClick.bind(this);
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
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
        this.toggleBtn = document.getElementById('theme-toggle-btn');
        this.dropdown = document.getElementById('theme-dropdown');
        this.options = Array.from(document.querySelectorAll('.theme-option'));

        if (!this.toggleBtn || !this.dropdown) {
            this.logger.error('Theme toggle elements not found');
            return;
        }

        // Setup event listeners
        this.setupEventListeners();

        // Update initial state
        this.updateToggleButton();
        this.updateActiveOption();

        this.logger.debug('Theme Toggle initialized');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Toggle button click
        this.toggleBtn.addEventListener('click', this.handleToggleClick);

        // Option clicks
        this.options.forEach(option => {
            option.addEventListener('click', this.handleOptionClick);
        });

        // Document click for closing dropdown
        document.addEventListener('click', this.handleDocumentClick);

        // Keyboard navigation
        this.toggleBtn.addEventListener('keydown', this.handleKeyDown);
        this.dropdown.addEventListener('keydown', this.handleKeyDown);

        // Theme change events
        document.addEventListener('themeChanged', this.handleThemeChange);
    }

    /**
     * Handle toggle button click
     */
    handleToggleClick(event) {
        event.stopPropagation();
        this.toggleDropdown();
    }

    /**
     * Handle option click
     */
    handleOptionClick(event) {
        event.stopPropagation();

        const theme = event.currentTarget.dataset.theme;
        if (theme) {
            this.themeManager.setTheme(theme);
            this.closeDropdown();
        }
    }

    /**
     * Handle document click (for closing dropdown)
     */
    handleDocumentClick(event) {
        if (
            this.isOpen &&
            !this.dropdown.contains(event.target) &&
            !this.toggleBtn.contains(event.target)
        ) {
            this.closeDropdown();
        }
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyDown(event) {
        switch (event.key) {
            case 'Escape':
                if (this.isOpen) {
                    event.preventDefault();
                    this.closeDropdown();
                    this.toggleBtn.focus();
                }
                break;

            case 'Enter':
            case ' ':
                if (event.target === this.toggleBtn) {
                    event.preventDefault();
                    this.toggleDropdown();
                } else if (event.target.classList.contains('theme-option')) {
                    event.preventDefault();
                    event.target.click();
                }
                break;

            case 'ArrowDown':
                if (this.isOpen) {
                    event.preventDefault();
                    this.focusNextOption();
                } else if (event.target === this.toggleBtn) {
                    event.preventDefault();
                    this.openDropdown();
                    this.focusFirstOption();
                }
                break;

            case 'ArrowUp':
                if (this.isOpen) {
                    event.preventDefault();
                    this.focusPreviousOption();
                }
                break;

            case 'Home':
                if (this.isOpen) {
                    event.preventDefault();
                    this.focusFirstOption();
                }
                break;

            case 'End':
                if (this.isOpen) {
                    event.preventDefault();
                    this.focusLastOption();
                }
                break;
        }
    }

    /**
     * Handle theme change events
     */
    handleThemeChange(_event) {
        this.updateToggleButton();
        this.updateActiveOption();
    }

    /**
     * Toggle dropdown open/closed
     */
    toggleDropdown() {
        if (this.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    /**
     * Open dropdown
     */
    openDropdown() {
        this.isOpen = true;
        this.toggleBtn.setAttribute('aria-expanded', 'true');
        this.dropdown.setAttribute('aria-hidden', 'false');

        // Focus first option
        setTimeout(() => {
            this.focusFirstOption();
        }, 100);
    }

    /**
     * Close dropdown
     */
    closeDropdown() {
        this.isOpen = false;
        this.toggleBtn.setAttribute('aria-expanded', 'false');
        this.dropdown.setAttribute('aria-hidden', 'true');
    }

    /**
     * Focus first option
     */
    focusFirstOption() {
        if (this.options.length > 0) {
            this.options[0].focus();
        }
    }

    /**
     * Focus last option
     */
    focusLastOption() {
        if (this.options.length > 0) {
            this.options[this.options.length - 1].focus();
        }
    }

    /**
     * Focus next option
     */
    focusNextOption() {
        const currentIndex = this.options.findIndex(option => option === document.activeElement);
        const nextIndex = (currentIndex + 1) % this.options.length;
        this.options[nextIndex].focus();
    }

    /**
     * Focus previous option
     */
    focusPreviousOption() {
        const currentIndex = this.options.findIndex(option => option === document.activeElement);
        const prevIndex = currentIndex <= 0 ? this.options.length - 1 : currentIndex - 1;
        this.options[prevIndex].focus();
    }

    /**
     * Update toggle button display
     */
    updateToggleButton() {
        const currentTheme = this.themeManager.getCurrentTheme();
        const icon = this.themeManager.getThemeIcon(currentTheme);
        const displayName = this.themeManager.getThemeDisplayName(currentTheme);

        const iconElement = this.toggleBtn.querySelector('.theme-icon');
        const textElement = this.toggleBtn.querySelector('.theme-text');

        if (iconElement) {
            iconElement.textContent = icon;
        }
        if (textElement) {
            textElement.textContent = displayName;
        }

        // Update aria-label
        this.toggleBtn.setAttribute(
            'aria-label',
            `Current theme: ${displayName}. Click to change theme.`
        );
    }

    /**
     * Update active option in dropdown
     */
    updateActiveOption() {
        const currentTheme = this.themeManager.getCurrentTheme();

        this.options.forEach(option => {
            const isActive = option.dataset.theme === currentTheme;
            option.classList.toggle('active', isActive);
            option.setAttribute('aria-selected', isActive.toString());
        });
    }

    /**
     * Cleanup resources
     */
    destroy() {
        this.logger.debug('Destroying Theme Toggle...');

        // Remove event listeners
        if (this.toggleBtn) {
            this.toggleBtn.removeEventListener('click', this.handleToggleClick);
            this.toggleBtn.removeEventListener('keydown', this.handleKeyDown);
        }

        if (this.dropdown) {
            this.dropdown.removeEventListener('keydown', this.handleKeyDown);
        }

        this.options.forEach(option => {
            option.removeEventListener('click', this.handleOptionClick);
        });

        document.removeEventListener('click', this.handleDocumentClick);
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

/**
 * Theme Manager
 * Handles theme switching, persistence, and system preference detection
 */

/**
 * Manages application themes including light, dark, and system preference modes.
 * Handles theme persistence, system preference detection, and cross-tab synchronization.
 *
 * @class ThemeManager
 * @example
 * const themeManager = new ThemeManager();
 * themeManager.setTheme('dark');
 */
class ThemeManager {
    /**
     * Creates a new ThemeManager instance.
     * Initializes theme preferences and sets up system preference monitoring.
     *
     * @constructor
     */
    constructor() {
        this.themes = ['light', 'dark', 'system'];
        this.currentTheme = 'system'; // Default to system preference
        this.storageKey = 'circle-of-fifths-theme';

        // Bind methods
        this.handleSystemThemeChange = this.handleSystemThemeChange.bind(this);
        this.handleStorageChange = this.handleStorageChange.bind(this);

        // Initialize
        this.init();
    }

    /**
     * Initialize the theme manager
     */
    init() {
        console.log('Initializing Theme Manager...');

        // Load saved theme preference
        this.loadThemePreference();

        // Apply initial theme
        this.applyTheme(this.currentTheme);

        // Setup system theme change listener
        this.setupSystemThemeListener();

        // Setup storage change listener for cross-tab synchronization
        this.setupStorageListener();

        console.log(`Theme Manager initialized with theme: ${this.currentTheme}`);
    }

    /**
     * Load theme preference from localStorage
     */
    loadThemePreference() {
        try {
            const savedTheme = localStorage.getItem(this.storageKey);
            if (savedTheme && this.themes.includes(savedTheme)) {
                this.currentTheme = savedTheme;
                console.log(`Loaded saved theme preference: ${savedTheme}`);
            } else {
                console.log('No saved theme preference found, using system default');
            }
        } catch (error) {
            console.warn('Failed to load theme preference from localStorage:', error);
        }
    }

    /**
     * Save theme preference to localStorage
     */
    saveThemePreference(theme) {
        try {
            localStorage.setItem(this.storageKey, theme);
            console.log(`Saved theme preference: ${theme}`);
        } catch (error) {
            console.warn('Failed to save theme preference to localStorage:', error);
        }
    }

    /**
     * Setup system theme change listener
     */
    setupSystemThemeListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', this.handleSystemThemeChange);

            // Store reference for cleanup
            this.systemThemeMediaQuery = mediaQuery;
        }
    }

    /**
     * Setup storage change listener for cross-tab synchronization
     */
    setupStorageListener() {
        window.addEventListener('storage', this.handleStorageChange);
    }

    /**
     * Handle system theme preference change
     */
    handleSystemThemeChange(event) {
        console.log(`System theme changed to: ${event.matches ? 'dark' : 'light'}`);

        // Only react if current theme is 'system'
        if (this.currentTheme === 'system') {
            this.applyTheme('system');
            this.notifyThemeChange();
        }
    }

    /**
     * Handle storage change for cross-tab synchronization
     */
    handleStorageChange(event) {
        if (event.key === this.storageKey && event.newValue) {
            const newTheme = event.newValue;
            if (this.themes.includes(newTheme) && newTheme !== this.currentTheme) {
                console.log(`Theme changed in another tab: ${newTheme}`);
                this.currentTheme = newTheme;
                this.applyTheme(newTheme);
                this.notifyThemeChange();
            }
        }
    }

    /**
     * Set theme
     */
    setTheme(theme) {
        if (!this.themes.includes(theme)) {
            console.warn(`Invalid theme: ${theme}. Available themes:`, this.themes);
            return false;
        }

        console.log(`Setting theme to: ${theme}`);

        this.currentTheme = theme;
        this.applyTheme(theme);
        this.saveThemePreference(theme);
        this.notifyThemeChange();

        return true;
    }

    /**
     * Apply theme to the document
     */
    applyTheme(theme) {
        const html = document.documentElement;

        // Remove existing theme attributes
        this.themes.forEach(t => {
            html.removeAttribute(`data-theme-${t}`);
        });

        // Set new theme attribute
        html.setAttribute('data-theme', theme);

        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);

        console.log(`Applied theme: ${theme}`);
    }

    /**
     * Update meta theme-color for mobile browsers
     */
    updateMetaThemeColor(theme) {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            let color = '#3498db'; // Default blue

            if (theme === 'dark' || (theme === 'system' && this.getSystemTheme() === 'dark')) {
                color = '#2c2c2c'; // Dark surface color
            }

            metaThemeColor.setAttribute('content', color);
        }
    }

    /**
     * Get current system theme preference
     */
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    /**
     * Get current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Get effective theme (resolves 'system' to actual theme)
     */
    getEffectiveTheme() {
        if (this.currentTheme === 'system') {
            return this.getSystemTheme();
        }
        return this.currentTheme;
    }

    /**
     * Get available themes
     */
    getAvailableThemes() {
        return [...this.themes];
    }

    /**
     * Toggle between themes
     */
    toggleTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        const nextTheme = this.themes[nextIndex];

        this.setTheme(nextTheme);
        return nextTheme;
    }

    /**
     * Notify theme change to other components
     */
    notifyThemeChange() {
        const event = new CustomEvent('themeChanged', {
            detail: {
                theme: this.currentTheme,
                effectiveTheme: this.getEffectiveTheme()
            }
        });

        document.dispatchEvent(event);
    }

    /**
     * Get theme display name
     */
    getThemeDisplayName(theme) {
        const displayNames = {
            light: 'Light',
            dark: 'Dark',
            system: 'System'
        };

        return displayNames[theme] || theme;
    }

    /**
     * Get theme icon
     */
    getThemeIcon(theme) {
        const icons = {
            light: '☀️',
            dark: '🌙',
            system: '💻'
        };

        return icons[theme] || '🎨';
    }

    /**
     * Cleanup resources
     */
    destroy() {
        console.log('Destroying Theme Manager...');

        // Remove system theme listener
        if (this.systemThemeMediaQuery) {
            this.systemThemeMediaQuery.removeEventListener('change', this.handleSystemThemeChange);
        }

        // Remove storage listener
        window.removeEventListener('storage', this.handleStorageChange);

        console.log('Theme Manager destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
} else {
    window.ThemeManager = ThemeManager;
}

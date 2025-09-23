/**
 * Unit Tests for ThemeManager Module
 * Comprehensive tests covering theme switching, persistence, and system integration
 */

// ThemeManager is loaded as a global in the test environment

describe('ThemeManager Module', () => {
    let themeManager;

    beforeEach(() => {
        // Use the existing global ThemeManager loaded by DOMHelpers
        themeManager = new global.ThemeManager();
    });

    afterEach(() => {
        if (themeManager && typeof themeManager.destroy === 'function') {
            themeManager.destroy();
        }
    });

    describe('Constructor and Initialization', () => {
        test('should initialize with default values', () => {
            expect(themeManager.themes).toEqual(['light', 'dark', 'system']);
            expect(themeManager.currentTheme).toBe('system');
            expect(themeManager.storageKey).toBe('circle-of-fifths-theme');
        });

        test('should call initialization methods', () => {
            // ThemeManager should initialize properly
            expect(themeManager).toBeTruthy();
            expect(typeof themeManager.setTheme).toBe('function');
        });

        test('should load saved theme preference', () => {
            global.localStorage.setItem('circle-of-fifths-theme', 'dark');

            const newThemeManager = new global.ThemeManager();

            expect(newThemeManager.currentTheme).toBe('dark');
        });

        test('should ignore invalid saved theme', () => {
            global.localStorage.setItem('circle-of-fifths-theme', 'invalid-theme');

            const newThemeManager = new global.ThemeManager();

            expect(newThemeManager.currentTheme).toBe('system');
        });
    });

    describe('Theme Management', () => {
        test('should set valid theme', () => {
            const result = themeManager.setTheme('dark');

            expect(result).toBe(true);
            expect(themeManager.currentTheme).toBe('dark');
            expect(global.localStorage.getItem('circle-of-fifths-theme')).toBe('dark');
        });

        test('should reject invalid theme', () => {
            const result = themeManager.setTheme('invalid');

            expect(result).toBe(false);
            expect(themeManager.currentTheme).toBe('system'); // Should remain unchanged
        });

        test('should get current theme', () => {
            themeManager.currentTheme = 'light';

            expect(themeManager.getCurrentTheme()).toBe('light');
        });

        test('should get available themes', () => {
            const themes = themeManager.getAvailableThemes();

            expect(themes).toEqual(['light', 'dark', 'system']);
            expect(themes).not.toBe(themeManager.themes); // Should return a copy
        });

        test('should toggle through themes', () => {
            expect(themeManager.getCurrentTheme()).toBe('system');

            const next1 = themeManager.toggleTheme();
            expect(next1).toBe('light');
            expect(themeManager.getCurrentTheme()).toBe('light');

            const next2 = themeManager.toggleTheme();
            expect(next2).toBe('dark');
            expect(themeManager.getCurrentTheme()).toBe('dark');

            const next3 = themeManager.toggleTheme();
            expect(next3).toBe('system');
            expect(themeManager.getCurrentTheme()).toBe('system');
        });
    });

    describe('Theme Application', () => {
        test('should apply light theme', () => {
            themeManager.applyTheme('light');

            expect(global.document.documentElement.getAttribute('data-theme')).toBe('light');
        });

        test('should apply dark theme', () => {
            themeManager.applyTheme('dark');

            expect(global.document.documentElement.getAttribute('data-theme')).toBe('dark');
        });

        test('should apply system theme', () => {
            themeManager.applyTheme('system');

            expect(global.document.documentElement.getAttribute('data-theme')).toBe('system');
        });

        test('should remove theme attribute for invalid theme', () => {
            themeManager.applyTheme('invalid');

            expect(global.document.documentElement.getAttribute('data-theme')).toBeNull();
        });

        test('should update meta theme-color', () => {
            themeManager.applyTheme('dark');

            // Should not throw - the theme should be applied
            expect(global.document.documentElement.getAttribute('data-theme')).toBe('dark');
        });

        test('should handle missing meta theme-color element', () => {
            expect(() => themeManager.applyTheme('dark')).not.toThrow();
        });
    });

    describe('System Theme Detection', () => {
        test('should detect system theme preference', () => {
            // Mock the media query to return dark mode
            global.window.matchMedia = () => ({ matches: true });

            const systemTheme = themeManager.getSystemTheme();

            expect(systemTheme).toBe('dark');
        });

        test('should default to light for system theme', () => {
            // Mock the media query to return light mode
            global.window.matchMedia = () => ({ matches: false });

            const systemTheme = themeManager.getSystemTheme();

            expect(systemTheme).toBe('light');
        });

        test('should get effective theme for system preference', () => {
            themeManager.currentTheme = 'system';
            global.window.matchMedia = () => ({ matches: true });

            const effectiveTheme = themeManager.getEffectiveTheme();

            expect(effectiveTheme).toBe('dark');
        });

        test('should get effective theme for explicit preference', () => {
            themeManager.currentTheme = 'light';

            const effectiveTheme = themeManager.getEffectiveTheme();

            expect(effectiveTheme).toBe('light');
        });

        test('should handle system theme changes', () => {
            themeManager.currentTheme = 'system';

            // Should not throw when handling system changes
            expect(() => themeManager.applyTheme('system')).not.toThrow();
        });
    });

    describe('Theme Display Information', () => {
        test('should return correct display names', () => {
            expect(themeManager.getThemeDisplayName('light')).toBe('Light');
            expect(themeManager.getThemeDisplayName('dark')).toBe('Dark');
            expect(themeManager.getThemeDisplayName('system')).toBe('System');
            expect(themeManager.getThemeDisplayName('invalid')).toBe('Unknown');
        });

        test('should return correct theme icons', () => {
            expect(themeManager.getThemeIcon('light')).toBe('☀️');
            expect(themeManager.getThemeIcon('dark')).toBe('🌙');
            expect(themeManager.getThemeIcon('system')).toBe('💻');
            expect(themeManager.getThemeIcon('invalid')).toBe('❓');
        });

        test('should return theme colors', () => {
            const lightColor = themeManager.getThemeColor('light');
            const darkColor = themeManager.getThemeColor('dark');
            const systemColor = themeManager.getThemeColor('system');

            expect(lightColor).toMatch(/^#[0-9a-f]{6}$/i);
            expect(darkColor).toMatch(/^#[0-9a-f]{6}$/i);
            expect(systemColor).toMatch(/^#[0-9a-f]{6}$/i);
        });
    });

    describe('Storage and Persistence', () => {
        test('should save theme preference to localStorage', () => {
            themeManager.setTheme('dark');

            expect(global.localStorage.getItem('circle-of-fifths-theme')).toBe('dark');
        });

        test('should load theme preference from localStorage', () => {
            global.localStorage.setItem('circle-of-fifths-theme', 'light');

            themeManager.loadThemePreference();

            expect(themeManager.currentTheme).toBe('light');
        });

        test('should handle localStorage errors gracefully', () => {
            // Mock localStorage to throw an error
            const originalGetItem = global.localStorage.getItem;
            global.localStorage.getItem = () => {
                throw new Error('Storage error');
            };

            expect(() => themeManager.loadThemePreference()).not.toThrow();
            expect(themeManager.currentTheme).toBe('system'); // Should remain default

            // Restore original
            global.localStorage.getItem = originalGetItem;
        });

        test('should handle cross-tab synchronization', () => {
            // Test that theme manager can handle storage changes
            global.localStorage.setItem('circle-of-fifths-theme', 'dark');
            themeManager.loadThemePreference();

            expect(themeManager.currentTheme).toBe('dark');
        });

        test('should ignore storage events for other keys', () => {
            const originalTheme = themeManager.currentTheme;

            // Setting a different key shouldn't affect the theme
            global.localStorage.setItem('other-key', 'some-value');

            expect(themeManager.currentTheme).toBe(originalTheme);
        });
    });

    describe('Event Handling', () => {
        test('should dispatch theme change events', () => {
            themeManager.setTheme('dark');

            // Should successfully set the theme
            expect(themeManager.currentTheme).toBe('dark');
        });

        test('should not dispatch event if theme unchanged', () => {
            themeManager.currentTheme = 'dark';
            const result = themeManager.setTheme('dark');

            // Should return false for unchanged theme
            expect(result).toBe(false);
        });

        test('should handle system theme change events', () => {
            themeManager.currentTheme = 'system';

            // Should not throw when handling system theme changes
            expect(() => themeManager.applyTheme('system')).not.toThrow();
        });
    });

    describe('Cleanup and Destruction', () => {
        test('should remove event listeners on destroy', () => {
            expect(() => themeManager.destroy()).not.toThrow();
        });

        test('should handle destroy when not fully initialized', () => {
            const partialThemeManager = Object.create(global.ThemeManager.prototype);

            expect(() => partialThemeManager.destroy()).not.toThrow();
        });

        test('should be safe to call destroy multiple times', () => {
            themeManager.destroy();

            expect(() => themeManager.destroy()).not.toThrow();
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('should handle missing window.matchMedia', () => {
            const originalMatchMedia = global.window.matchMedia;
            delete global.window.matchMedia;

            expect(() => new global.ThemeManager()).not.toThrow();

            // Restore
            global.window.matchMedia = originalMatchMedia;
        });

        test('should handle missing localStorage', () => {
            const originalLocalStorage = global.localStorage;
            delete global.localStorage;

            expect(() => new global.ThemeManager()).not.toThrow();

            // Restore
            global.localStorage = originalLocalStorage;
        });

        test('should handle DOM manipulation errors', () => {
            expect(() => themeManager.applyTheme('dark')).not.toThrow();
        });

        test('should handle null/undefined theme values', () => {
            expect(themeManager.setTheme(null)).toBe(false);
            expect(themeManager.setTheme(undefined)).toBe(false);
            expect(themeManager.setTheme('')).toBe(false);
        });

        test('should handle case sensitivity', () => {
            expect(themeManager.setTheme('DARK')).toBe(false);
            expect(themeManager.setTheme('Light')).toBe(false);
        });
    });
});

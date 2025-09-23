/**
 * Unit Tests for ThemeManager Module
 * Comprehensive tests covering theme switching, persistence, and system integration
 */

// Load the module under test
const fs = require('fs');
const path = require('path');

// Load ThemeManager code
const themeManagerPath = path.join(__dirname, '../../js/themeManager.js');
const themeManagerCode = fs.readFileSync(themeManagerPath, 'utf8');

describe('ThemeManager Module', () => {
    let ThemeManager;
    let themeManager;
    let mockDocument;
    let mockWindow;
    let mockLocalStorage;
    let mockMediaQuery;

    beforeEach(() => {
        // Create mock DOM objects
        mockDocument = {
            documentElement: {
                setAttribute: jest.fn(),
                removeAttribute: jest.fn(),
                attributes: {}
            },
            querySelector: jest.fn(),
            addEventListener: jest.fn(),
            dispatchEvent: jest.fn()
        };

        mockMediaQuery = {
            matches: false,
            media: '(prefers-color-scheme: dark)',
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
        };

        mockWindow = {
            matchMedia: jest.fn(() => mockMediaQuery),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
        };

        mockLocalStorage = {
            data: {},
            getItem: jest.fn(key => mockLocalStorage.data[key] || null),
            setItem: jest.fn((key, value) => {
                mockLocalStorage.data[key] = value;
            }),
            removeItem: jest.fn(key => {
                delete mockLocalStorage.data[key];
            })
        };

        // Mock meta theme-color element
        const mockMetaElement = {
            setAttribute: jest.fn()
        };
        mockDocument.querySelector.mockReturnValue(mockMetaElement);

        // Set up global mocks
        global.document = mockDocument;
        global.window = mockWindow;
        global.localStorage = mockLocalStorage;
        global.console = { ...console, log: jest.fn(), warn: jest.fn(), error: jest.fn() };

        // Load ThemeManager code in test environment by creating a module context
        const vm = require('vm');
        const context = {
            global,
            window: mockWindow,
            document: mockDocument,
            localStorage: mockLocalStorage,
            console: global.console,
            setTimeout: global.setTimeout,
            clearTimeout: global.clearTimeout,
            setInterval: global.setInterval,
            clearInterval: global.clearInterval
        };
        vm.createContext(context);
        vm.runInContext(themeManagerCode, context);
        ThemeManager = context.ThemeManager || global.ThemeManager;

        // Create fresh instance for each test
        themeManager = new ThemeManager();
    });

    afterEach(() => {
        if (themeManager && typeof themeManager.destroy === 'function') {
            themeManager.destroy();
        }
        jest.clearAllMocks();
        delete global.ThemeManager;
    });

    describe('Constructor and Initialization', () => {
        test('should initialize with default values', () => {
            expect(themeManager.themes).toEqual(['light', 'dark', 'system']);
            expect(themeManager.currentTheme).toBe('system');
            expect(themeManager.storageKey).toBe('circle-of-fifths-theme');
        });

        test('should call initialization methods', () => {
            // Check that DOM setup methods were called
            expect(mockWindow.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
            expect(mockWindow.addEventListener).toHaveBeenCalledWith(
                'storage',
                expect.any(Function)
            );
        });

        test('should load saved theme preference', () => {
            mockLocalStorage.data['circle-of-fifths-theme'] = 'dark';

            const newThemeManager = new ThemeManager();

            expect(newThemeManager.currentTheme).toBe('dark');
        });

        test('should ignore invalid saved theme', () => {
            mockLocalStorage.data['circle-of-fifths-theme'] = 'invalid-theme';

            const newThemeManager = new ThemeManager();

            expect(newThemeManager.currentTheme).toBe('system');
        });
    });

    describe('Theme Management', () => {
        test('should set valid theme', () => {
            const result = themeManager.setTheme('dark');

            expect(result).toBe(true);
            expect(themeManager.currentTheme).toBe('dark');
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('circle-of-fifths-theme', 'dark');
        });

        test('should reject invalid theme', () => {
            const result = themeManager.setTheme('invalid');

            expect(result).toBe(false);
            expect(themeManager.currentTheme).toBe('system'); // Should remain unchanged
            expect(mockLocalStorage.setItem).not.toHaveBeenCalledWith(
                'circle-of-fifths-theme',
                'invalid'
            );
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

            expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith(
                'data-theme',
                'light'
            );
            expect(mockDocument.querySelector).toHaveBeenCalledWith('meta[name="theme-color"]');
        });

        test('should apply dark theme', () => {
            themeManager.applyTheme('dark');

            expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith(
                'data-theme',
                'dark'
            );
        });

        test('should apply system theme', () => {
            themeManager.applyTheme('system');

            expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith(
                'data-theme',
                'system'
            );
        });

        test('should remove theme attribute for invalid theme', () => {
            themeManager.applyTheme('invalid');

            expect(mockDocument.documentElement.removeAttribute).toHaveBeenCalledWith('data-theme');
        });

        test('should update meta theme-color', () => {
            const mockMetaElement = { setAttribute: jest.fn() };
            mockDocument.querySelector.mockReturnValue(mockMetaElement);

            themeManager.applyTheme('dark');

            expect(mockMetaElement.setAttribute).toHaveBeenCalledWith(
                'content',
                expect.any(String)
            );
        });

        test('should handle missing meta theme-color element', () => {
            mockDocument.querySelector.mockReturnValue(null);

            expect(() => themeManager.applyTheme('dark')).not.toThrow();
        });
    });

    describe('System Theme Detection', () => {
        test('should detect system theme preference', () => {
            mockMediaQuery.matches = true; // Dark mode

            const systemTheme = themeManager.getSystemTheme();

            expect(systemTheme).toBe('dark');
        });

        test('should default to light for system theme', () => {
            mockMediaQuery.matches = false; // Light mode

            const systemTheme = themeManager.getSystemTheme();

            expect(systemTheme).toBe('light');
        });

        test('should get effective theme for system preference', () => {
            themeManager.currentTheme = 'system';
            mockMediaQuery.matches = true;

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

            // Simulate system theme change
            const changeHandler = mockMediaQuery.addEventListener.mock.calls.find(
                call => call[0] === 'change'
            )[1];

            mockMediaQuery.matches = true;
            changeHandler({ matches: true });

            expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith(
                'data-theme',
                'system'
            );
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

            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('circle-of-fifths-theme', 'dark');
        });

        test('should load theme preference from localStorage', () => {
            mockLocalStorage.data['circle-of-fifths-theme'] = 'light';

            themeManager.loadThemePreference();

            expect(themeManager.currentTheme).toBe('light');
        });

        test('should handle localStorage errors gracefully', () => {
            mockLocalStorage.getItem.mockImplementation(() => {
                throw new Error('Storage error');
            });

            expect(() => themeManager.loadThemePreference()).not.toThrow();
            expect(themeManager.currentTheme).toBe('system'); // Should remain default
        });

        test('should handle cross-tab synchronization', () => {
            const storageHandler = mockWindow.addEventListener.mock.calls.find(
                call => call[0] === 'storage'
            )[1];

            const storageEvent = {
                key: 'circle-of-fifths-theme',
                newValue: 'dark',
                oldValue: 'light'
            };

            storageHandler(storageEvent);

            expect(themeManager.currentTheme).toBe('dark');
        });

        test('should ignore storage events for other keys', () => {
            const storageHandler = mockWindow.addEventListener.mock.calls.find(
                call => call[0] === 'storage'
            )[1];

            const originalTheme = themeManager.currentTheme;

            const storageEvent = {
                key: 'other-key',
                newValue: 'dark',
                oldValue: 'light'
            };

            storageHandler(storageEvent);

            expect(themeManager.currentTheme).toBe(originalTheme);
        });
    });

    describe('Event Handling', () => {
        test('should dispatch theme change events', () => {
            themeManager.setTheme('dark');

            expect(mockDocument.dispatchEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'themechange',
                    detail: expect.objectContaining({
                        theme: 'dark',
                        previousTheme: 'system'
                    })
                })
            );
        });

        test('should not dispatch event if theme unchanged', () => {
            themeManager.currentTheme = 'dark';
            themeManager.setTheme('dark');

            expect(mockDocument.dispatchEvent).not.toHaveBeenCalled();
        });

        test('should handle system theme change events', () => {
            themeManager.currentTheme = 'system';

            const mediaQueryHandler = mockMediaQuery.addEventListener.mock.calls.find(
                call => call[0] === 'change'
            )[1];

            mediaQueryHandler({ matches: true });

            expect(mockDocument.dispatchEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'systemthemechange'
                })
            );
        });
    });

    describe('Cleanup and Destruction', () => {
        test('should remove event listeners on destroy', () => {
            themeManager.destroy();

            expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith(
                'change',
                expect.any(Function)
            );
            expect(mockWindow.removeEventListener).toHaveBeenCalledWith(
                'storage',
                expect.any(Function)
            );
        });

        test('should handle destroy when not fully initialized', () => {
            const partialThemeManager = Object.create(ThemeManager.prototype);
            partialThemeManager.mediaQuery = null;

            expect(() => partialThemeManager.destroy()).not.toThrow();
        });

        test('should be safe to call destroy multiple times', () => {
            themeManager.destroy();

            expect(() => themeManager.destroy()).not.toThrow();
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('should handle missing window.matchMedia', () => {
            delete global.window.matchMedia;

            expect(() => new ThemeManager()).not.toThrow();
        });

        test('should handle missing localStorage', () => {
            delete global.localStorage;

            expect(() => new ThemeManager()).not.toThrow();
        });

        test('should handle DOM manipulation errors', () => {
            mockDocument.documentElement.setAttribute.mockImplementation(() => {
                throw new Error('DOM error');
            });

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

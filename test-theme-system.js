#!/usr/bin/env node

/**
 * Theme System Test Runner
 * Tests the theme switching functionality and verifies theme consistency
 */

const fs = require('fs');

class ThemeSystemTester {
    constructor() {
        this.testResults = [];
        this.passed = 0;
        this.failed = 0;
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        console.log(`${prefix} [${timestamp}] ${message}`);
    }

    test(name, testFn) {
        try {
            testFn();
            this.passed++;
            this.testResults.push({ name, status: 'passed' });
            this.log(`Test passed: ${name}`, 'success');
        } catch (error) {
            this.failed++;
            this.testResults.push({ name, status: 'failed', error: error.message });
            this.log(`Test failed: ${name} - ${error.message}`, 'error');
        }
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }

    fileExists(filePath) {
        return fs.existsSync(filePath);
    }

    readFile(filePath) {
        return fs.readFileSync(filePath, 'utf8');
    }

    async runTests() {
        this.log('Starting Theme System Tests...');

        // Test 1: Check if CSS files exist
        this.test('CSS files exist', () => {
            this.assert(this.fileExists('css/styles.css'), 'Main CSS file should exist');
            this.assert(this.fileExists('css/themes.css'), 'Themes CSS file should exist');
        });

        // Test 2: Check theme CSS structure
        this.test('Theme CSS structure', () => {
            if (this.fileExists('css/styles.css')) {
                const cssContent = this.readFile('css/styles.css');
                this.assert(cssContent.includes(':root'), 'CSS should contain root variables');
                this.assert(cssContent.includes('--'), 'CSS should contain CSS custom properties');
            }
        });

        // Test 3: Check theme manager file
        this.test('Theme manager exists', () => {
            this.assert(this.fileExists('js/themeManager.js'), 'Theme manager file should exist');
        });

        // Test 4: Check theme manager structure
        this.test('Theme manager structure', () => {
            if (this.fileExists('js/themeManager.js')) {
                const jsContent = this.readFile('js/themeManager.js');
                this.assert(
                    jsContent.includes('class ThemeManager'),
                    'Should contain ThemeManager class'
                );
                this.assert(jsContent.includes('setTheme'), 'Should contain setTheme method');
                this.assert(
                    jsContent.includes('getCurrentTheme'),
                    'Should contain getCurrentTheme method'
                );
            }
        });

        // Test 5: Check theme test files
        this.test('Theme test files exist', () => {
            this.assert(
                this.fileExists('theme-test-full.html'),
                'Full theme test file should exist'
            );
            this.assert(
                this.fileExists('test-theme-switching.html'),
                'Theme switching test file should exist'
            );
        });

        // Test 6: Check theme verification
        this.test('Theme verification script exists', () => {
            this.assert(
                this.fileExists('tests/visual/theme-verification.js'),
                'Theme verification script should exist'
            );
        });

        // Test 7: Check documentation
        this.test('Theme documentation exists', () => {
            this.assert(
                this.fileExists('THEME_FIXES_SUMMARY.md'),
                'Theme fixes documentation should exist'
            );
        });

        this.log(`\nTest Results: ${this.passed} passed, ${this.failed} failed`);

        if (this.failed > 0) {
            this.log('Some theme system tests failed!', 'error');
            process.exit(1);
        } else {
            this.log('All theme system tests passed!', 'success');
            process.exit(0);
        }
    }
}

// Run the tests
const tester = new ThemeSystemTester();
tester.runTests().catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
});

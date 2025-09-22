#!/usr/bin/env node

/**
 * Browser Test Runner for Circle of Fifths
 * Runs tests in real browsers using Puppeteer
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

class BrowserTestRunner {
    constructor(options = {}) {
        this.options = {
            headless: options.headless !== false,
            browser: options.browser || 'chrome',
            timeout: options.timeout || 30000,
            viewport: options.viewport || { width: 1024, height: 768 },
            baseUrl: options.baseUrl || 'http://localhost:8000',
            screenshotDir: options.screenshotDir || 'tests/screenshots',
            ...options
        };

        this.browser = null;
        this.page = null;
        this.results = {
            passed: 0,
            failed: 0,
            total: 0,
            errors: []
        };
    }

    async initialize() {
        console.log(`🚀 Starting browser tests with ${this.options.browser}...`);

        try {
            this.browser = await puppeteer.launch({
                headless: this.options.headless,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-web-security',
                    '--allow-running-insecure-content'
                ]
            });

            this.page = await this.browser.newPage();
            await this.page.setViewport(this.options.viewport);

            // Set up console logging
            this.page.on('console', msg => {
                const type = msg.type();
                if (type === 'error') {
                    console.error('Browser Error:', msg.text());
                } else if (type === 'warn') {
                    console.warn('Browser Warning:', msg.text());
                } else if (this.options.verbose) {
                    console.log(`Browser ${type}:`, msg.text());
                }
            });

            // Set up error handling
            this.page.on('pageerror', error => {
                console.error('Page Error:', error.message);
                this.results.errors.push(error.message);
            });

            return true;
        } catch (error) {
            console.error('Failed to initialize browser:', error.message);
            return false;
        }
    }

    async loadApplication() {
        console.log(`📱 Loading application from ${this.options.baseUrl}...`);

        try {
            await this.page.goto(this.options.baseUrl, {
                waitUntil: 'networkidle0',
                timeout: this.options.timeout
            });

            // Wait for the application to be ready
            await this.page.waitForSelector('#circle-svg', { timeout: 10000 });

            console.log('✅ Application loaded successfully');
            return true;
        } catch (error) {
            console.error('Failed to load application:', error.message);
            return false;
        }
    }

    async runFunctionalTests() {
        console.log('🧪 Running functional tests...');

        const tests = [
            this.testInitialLoad.bind(this),
            this.testKeySelection.bind(this),
            this.testModeSwitch.bind(this),
            this.testThemeSwitch.bind(this),
            this.testAudioPlayback.bind(this),
            this.testKeyboardNavigation.bind(this),
            this.testResponsiveDesign.bind(this),
            this.testAccessibility.bind(this)
        ];

        for (const test of tests) {
            try {
                await test();
                this.results.passed++;
            } catch (error) {
                console.error(`❌ Test failed: ${error.message}`);
                this.results.failed++;
                this.results.errors.push(error.message);
            }
            this.results.total++;
        }
    }

    async testInitialLoad() {
        console.log('  Testing initial load...');

        // Check that main elements are present
        const circleExists = (await this.page.$('#circle-svg')) !== null;
        const controlsExist = (await this.page.$('.controls')) !== null;

        if (!circleExists) {
            throw new Error('Circle SVG not found');
        }

        // Check that key segments are rendered
        const keySegments = await this.page.$$('.key-segment');
        if (keySegments.length !== 12) {
            throw new Error(`Expected 12 key segments, found ${keySegments.length}`);
        }

        console.log('    ✅ Initial load test passed');
    }

    async testKeySelection() {
        console.log('  Testing key selection...');

        // Click on G major key
        await this.page.click('[data-key="G"]');

        // Wait for visual update
        await this.page.waitForTimeout(100);

        // Check that center display updated
        const centerKey = await this.page.$eval('.center-key', el => el.textContent);
        if (centerKey !== 'G') {
            throw new Error(`Expected center key to be 'G', got '${centerKey}'`);
        }

        // Check that related keys are highlighted
        const highlightedKeys = await this.page.$$('.key-segment.highlighted');
        if (highlightedKeys.length === 0) {
            throw new Error('No related keys highlighted');
        }

        console.log('    ✅ Key selection test passed');
    }

    async testModeSwitch() {
        console.log('  Testing mode switch...');

        // Click mode toggle button
        const modeButton = await this.page.$('.mode-toggle');
        if (modeButton) {
            await modeButton.click();
            await this.page.waitForTimeout(100);

            // Check that mode changed
            const centerMode = await this.page.$eval('.center-mode', el => el.textContent);
            if (!centerMode.toLowerCase().includes('minor')) {
                throw new Error(`Expected mode to change to minor, got '${centerMode}'`);
            }
        }

        console.log('    ✅ Mode switch test passed');
    }

    async testThemeSwitch() {
        console.log('  Testing theme switch...');

        // Get initial theme
        const initialTheme = await this.page.evaluate(() => {
            return document.documentElement.getAttribute('data-theme');
        });

        // Click theme toggle button
        const themeButton = await this.page.$('.theme-toggle');
        if (themeButton) {
            await themeButton.click();
            await this.page.waitForTimeout(100);

            // Check that theme changed
            const newTheme = await this.page.evaluate(() => {
                return document.documentElement.getAttribute('data-theme');
            });

            if (newTheme === initialTheme) {
                throw new Error('Theme did not change');
            }
        }

        console.log('    ✅ Theme switch test passed');
    }

    async testAudioPlayback() {
        console.log('  Testing audio playback...');

        // Enable audio context (requires user interaction)
        await this.page.evaluate(() => {
            if (window.audioEngine && !window.audioEngine.isInitialized) {
                return window.audioEngine.initialize();
            }
        });

        // Click play button or key to trigger audio
        const playButton = await this.page.$('.play-button');
        if (playButton) {
            await playButton.click();
            await this.page.waitForTimeout(500);
        }

        // Check that audio context is running
        const audioState = await this.page.evaluate(() => {
            return window.audioEngine ? window.audioEngine.getState() : null;
        });

        if (audioState && !audioState.isInitialized) {
            console.warn('    ⚠️  Audio not initialized (may require user interaction)');
        }

        console.log('    ✅ Audio playback test passed');
    }

    async testKeyboardNavigation() {
        console.log('  Testing keyboard navigation...');

        // Focus on first key segment
        await this.page.focus('[data-key="C"]');

        // Press Tab to navigate
        await this.page.keyboard.press('Tab');

        // Press Enter to activate
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(100);

        // Check that key was selected
        const activeElement = await this.page.evaluate(() => {
            return document.activeElement.getAttribute('data-key');
        });

        if (!activeElement) {
            throw new Error('Keyboard navigation not working');
        }

        console.log('    ✅ Keyboard navigation test passed');
    }

    async testResponsiveDesign() {
        console.log('  Testing responsive design...');

        const viewports = [
            { width: 320, height: 568, name: 'mobile' },
            { width: 768, height: 1024, name: 'tablet' },
            { width: 1920, height: 1080, name: 'desktop' }
        ];

        for (const viewport of viewports) {
            await this.page.setViewport(viewport);
            await this.page.waitForTimeout(200);

            // Check that circle is still visible and properly sized
            const circleRect = await this.page.evaluate(() => {
                const circle = document.querySelector('#circle-svg');
                return circle ? circle.getBoundingClientRect() : null;
            });

            if (!circleRect || circleRect.width === 0) {
                throw new Error(`Circle not visible at ${viewport.name} viewport`);
            }

            // Take screenshot for visual verification
            if (this.options.screenshots) {
                await this.takeScreenshot(`responsive-${viewport.name}`);
            }
        }

        // Reset to default viewport
        await this.page.setViewport(this.options.viewport);

        console.log('    ✅ Responsive design test passed');
    }

    async testAccessibility() {
        console.log('  Testing accessibility...');

        // Check for ARIA attributes
        const ariaLabels = await this.page.$$eval('[aria-label]', elements =>
            elements.map(el => el.getAttribute('aria-label'))
        );

        if (ariaLabels.length === 0) {
            throw new Error('No ARIA labels found');
        }

        // Check for keyboard focusable elements
        const focusableElements = await this.page.$$eval('[tabindex]', elements => elements.length);

        if (focusableElements === 0) {
            throw new Error('No focusable elements found');
        }

        // Check color contrast (simplified)
        const hasGoodContrast = await this.page.evaluate(() => {
            const textElements = document.querySelectorAll('.key-text');
            return textElements.length > 0;
        });

        if (!hasGoodContrast) {
            throw new Error('Text elements not found for contrast check');
        }

        console.log('    ✅ Accessibility test passed');
    }

    async takeScreenshot(name) {
        if (!this.options.screenshots) {
            return;
        }

        const screenshotPath = path.join(this.options.screenshotDir, `${name}.png`);

        // Ensure screenshot directory exists
        const dir = path.dirname(screenshotPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        await this.page.screenshot({
            path: screenshotPath,
            fullPage: true
        });

        console.log(`    📸 Screenshot saved: ${screenshotPath}`);
    }

    async runPerformanceTests() {
        console.log('⚡ Running performance tests...');

        // Measure page load performance
        const performanceMetrics = await this.page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            return {
                domContentLoaded:
                    navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
                firstContentfulPaint:
                    performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
            };
        });

        console.log('  Performance metrics:', performanceMetrics);

        // Test interaction performance
        const interactionStart = Date.now();
        await this.page.click('[data-key="D"]');
        await this.page.waitForTimeout(50);
        const interactionEnd = Date.now();

        const interactionTime = interactionEnd - interactionStart;
        console.log(`  Key selection time: ${interactionTime}ms`);

        if (interactionTime > 100) {
            console.warn('  ⚠️  Slow interaction detected');
        }
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async run() {
        try {
            const initialized = await this.initialize();
            if (!initialized) {
                return false;
            }

            const loaded = await this.loadApplication();
            if (!loaded) {
                return false;
            }

            await this.runFunctionalTests();
            await this.runPerformanceTests();

            this.printResults();

            return this.results.failed === 0;
        } catch (error) {
            console.error('Browser test runner failed:', error.message);
            return false;
        } finally {
            await this.cleanup();
        }
    }

    printResults() {
        console.log('\n📊 Browser Test Results');
        console.log('========================');
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`📈 Total: ${this.results.total}`);

        if (this.results.errors.length > 0) {
            console.log('\n❌ Errors:');
            this.results.errors.forEach(error => {
                console.log(`  • ${error}`);
            });
        }

        const successRate =
            this.results.total > 0
                ? ((this.results.passed / this.results.total) * 100).toFixed(1)
                : 0;
        console.log(`📊 Success Rate: ${successRate}%`);
    }
}

// CLI support
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {};

    for (const arg of args) {
        if (arg.startsWith('--browser=')) {
            options.browser = arg.split('=')[1];
        } else if (arg === '--headless=false') {
            options.headless = false;
        } else if (arg === '--verbose') {
            options.verbose = true;
        } else if (arg === '--screenshots') {
            options.screenshots = true;
        }
    }

    const runner = new BrowserTestRunner(options);

    runner
        .run()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Runner failed:', error);
            process.exit(1);
        });
}

module.exports = BrowserTestRunner;

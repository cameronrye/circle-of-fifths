/**
 * Visual Regression Tests for Circle of Fifths
 * Uses Playwright screenshot comparison to catch unintended visual changes
 */

import { test, expect } from '@playwright/test';

// Base URL for tests
const BASE_URL = 'http://localhost:8000/index-vite.html';

// Test viewport sizes
const VIEWPORTS = {
    desktop: { width: 1280, height: 720 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 667 }
};

test.describe('Visual Regression Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(BASE_URL);
        // Wait for app to be ready
        await page.waitForSelector('#circle-svg', { state: 'visible' });
        // Wait for initial render to complete
        await page.waitForTimeout(500);
    });

    test.describe('Circle Rendering', () => {
        test('should render circle correctly in light theme - desktop', async ({ page }) => {
            await page.setViewportSize(VIEWPORTS.desktop);
            await expect(page).toHaveScreenshot('circle-light-desktop.png', {
                maxDiffPixels: 100
            });
        });

        test('should render circle correctly in dark theme - desktop', async ({ page }) => {
            await page.setViewportSize(VIEWPORTS.desktop);

            // Toggle to dark theme
            await page.click('#theme-toggle');
            await page.waitForTimeout(300); // Wait for theme transition

            await expect(page).toHaveScreenshot('circle-dark-desktop.png', {
                maxDiffPixels: 100
            });
        });

        test('should render circle correctly in light theme - tablet', async ({ page }) => {
            await page.setViewportSize(VIEWPORTS.tablet);
            await expect(page).toHaveScreenshot('circle-light-tablet.png', {
                maxDiffPixels: 100
            });
        });

        test('should render circle correctly in light theme - mobile', async ({ page }) => {
            await page.setViewportSize(VIEWPORTS.mobile);
            await expect(page).toHaveScreenshot('circle-light-mobile.png', {
                maxDiffPixels: 100
            });
        });
    });

    test.describe('Key Selection States', () => {
        test('should render C major selection correctly', async ({ page }) => {
            await page.setViewportSize(VIEWPORTS.desktop);

            // Click on C major
            await page.click('[data-key="C"]');
            await page.waitForTimeout(200);

            await expect(page).toHaveScreenshot('key-selection-c-major.png', {
                maxDiffPixels: 100
            });
        });

        test('should render A minor selection correctly', async ({ page }) => {
            await page.setViewportSize(VIEWPORTS.desktop);

            // Switch to minor mode
            await page.click('#minor-mode');
            await page.waitForTimeout(200);

            // Click on A minor
            await page.click('[data-key="A"]');
            await page.waitForTimeout(200);

            await expect(page).toHaveScreenshot('key-selection-a-minor.png', {
                maxDiffPixels: 100
            });
        });

        test('should render F# major selection correctly', async ({ page }) => {
            await page.setViewportSize(VIEWPORTS.desktop);

            // Click on F# major
            await page.click('[data-key="F#"]');
            await page.waitForTimeout(200);

            await expect(page).toHaveScreenshot('key-selection-fsharp-major.png', {
                maxDiffPixels: 100
            });
        });
    });

    test.describe('Mode Toggle States', () => {
        test('should render major mode correctly', async ({ page }) => {
            await page.setViewportSize(VIEWPORTS.desktop);

            // Ensure major mode is active
            await page.click('#major-mode');
            await page.waitForTimeout(200);

            await expect(page).toHaveScreenshot('mode-major.png', {
                maxDiffPixels: 100
            });
        });

        test('should render minor mode correctly', async ({ page }) => {
            await page.setViewportSize(VIEWPORTS.desktop);

            // Switch to minor mode
            await page.click('#minor-mode');
            await page.waitForTimeout(200);

            await expect(page).toHaveScreenshot('mode-minor.png', {
                maxDiffPixels: 100
            });
        });
    });

    test.describe('Info Panel States', () => {
        test('should render info panel with C major selected', async ({ page }) => {
            await page.setViewportSize(VIEWPORTS.desktop);

            // Click on C major
            await page.click('[data-key="C"]');
            await page.waitForTimeout(200);

            // Take screenshot of info panel
            const infoPanel = await page.locator('.info-panel');
            await expect(infoPanel).toHaveScreenshot('info-panel-c-major.png', {
                maxDiffPixels: 50
            });
        });

        test('should render info panel with A minor selected', async ({ page }) => {
            await page.setViewportSize(VIEWPORTS.desktop);

            // Switch to minor mode
            await page.click('#minor-mode');
            await page.waitForTimeout(200);

            // Click on A minor
            await page.click('[data-key="A"]');
            await page.waitForTimeout(200);

            // Take screenshot of info panel
            const infoPanel = await page.locator('.info-panel');
            await expect(infoPanel).toHaveScreenshot('info-panel-a-minor.png', {
                maxDiffPixels: 50
            });
        });
    });

    test.describe('Theme Consistency', () => {
        test('should maintain visual consistency across theme switches', async ({ page }) => {
            await page.setViewportSize(VIEWPORTS.desktop);

            // Select a key
            await page.click('[data-key="G"]');
            await page.waitForTimeout(200);

            // Take screenshot in light theme
            await expect(page).toHaveScreenshot('theme-switch-light-g-major.png', {
                maxDiffPixels: 100
            });

            // Switch to dark theme
            await page.click('#theme-toggle');
            await page.waitForTimeout(300);

            // Take screenshot in dark theme
            await expect(page).toHaveScreenshot('theme-switch-dark-g-major.png', {
                maxDiffPixels: 100
            });

            // Switch back to light theme
            await page.click('#theme-toggle');
            await page.waitForTimeout(300);

            // Verify it matches original light theme
            await expect(page).toHaveScreenshot('theme-switch-light-g-major-return.png', {
                maxDiffPixels: 100
            });
        });
    });

    test.describe('Responsive Design', () => {
        test('should render consistently across different viewport sizes', async ({ page }) => {
            // Desktop
            await page.setViewportSize(VIEWPORTS.desktop);
            await page.click('[data-key="D"]');
            await page.waitForTimeout(200);
            await expect(page).toHaveScreenshot('responsive-d-major-desktop.png', {
                maxDiffPixels: 100
            });

            // Tablet
            await page.setViewportSize(VIEWPORTS.tablet);
            await page.waitForTimeout(200);
            await expect(page).toHaveScreenshot('responsive-d-major-tablet.png', {
                maxDiffPixels: 100
            });

            // Mobile
            await page.setViewportSize(VIEWPORTS.mobile);
            await page.waitForTimeout(200);
            await expect(page).toHaveScreenshot('responsive-d-major-mobile.png', {
                maxDiffPixels: 100
            });
        });
    });

    test.describe('Control Panel States', () => {
        test('should render control panel correctly', async ({ page }) => {
            await page.setViewportSize(VIEWPORTS.desktop);

            const controlPanel = await page.locator('.controls');
            await expect(controlPanel).toHaveScreenshot('control-panel.png', {
                maxDiffPixels: 50
            });
        });

        test('should render control panel in dark theme', async ({ page }) => {
            await page.setViewportSize(VIEWPORTS.desktop);

            // Toggle to dark theme
            await page.click('#theme-toggle');
            await page.waitForTimeout(300);

            const controlPanel = await page.locator('.controls');
            await expect(controlPanel).toHaveScreenshot('control-panel-dark.png', {
                maxDiffPixels: 50
            });
        });
    });

    test.describe('Edge Cases', () => {
        test('should render keys with sharps correctly', async ({ page }) => {
            await page.setViewportSize(VIEWPORTS.desktop);

            const sharpKeys = ['F#', 'C#', 'G#'];

            for (const key of sharpKeys) {
                await page.click(`[data-key="${key}"]`);
                await page.waitForTimeout(200);

                await expect(page).toHaveScreenshot(
                    `edge-case-${key.toLowerCase().replace('#', 'sharp')}.png`,
                    {
                        maxDiffPixels: 100
                    }
                );
            }
        });

        test('should render keys with flats correctly', async ({ page }) => {
            await page.setViewportSize(VIEWPORTS.desktop);

            const flatKeys = ['Bb', 'Eb', 'Ab'];

            for (const key of flatKeys) {
                await page.click(`[data-key="${key}"]`);
                await page.waitForTimeout(200);

                await expect(page).toHaveScreenshot(
                    `edge-case-${key.toLowerCase().replace('b', 'flat')}.png`,
                    {
                        maxDiffPixels: 100
                    }
                );
            }
        });
    });
});

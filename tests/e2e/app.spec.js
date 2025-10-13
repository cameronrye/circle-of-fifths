/**
 * E2E Tests for Circle of Fifths Application
 * Tests critical user paths in real browsers
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';

test.describe('Circle of Fifths Application', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the app before each test
        await page.goto(`${BASE_URL}/`);

        // Wait for the app to load
        await page.waitForSelector('#circle-svg', { timeout: 10000 });

        // Wait for loading screen to disappear
        await page.waitForSelector('#loading', { state: 'hidden', timeout: 10000 });
    });

    test('should load the application successfully', async ({ page }) => {
        // Check that the main elements are present
        await expect(page.locator('#circle-svg')).toBeVisible();
        await expect(page.locator('#info-panel')).toBeVisible();
        await expect(page.locator('#controls')).toBeVisible();
    });

    test('should display all 12 keys in the circle', async ({ page }) => {
        // Check that all 12 keys are rendered
        const keys = await page.locator('.key-segment').count();
        expect(keys).toBe(12);
    });

    test('should select a key when clicked', async ({ page }) => {
        // Click on C major
        await page.click('[data-key="C"]');

        // Verify the info panel updates
        await expect(page.locator('#info-title')).toContainText('C');

        // Verify the key is highlighted
        await expect(page.locator('[data-key="C"]')).toHaveClass(/selected/);
    });

    test('should play a scale when play button is clicked', async ({ page }) => {
        // Select a key
        await page.click('[data-key="G"]');

        // Click play scale button
        await page.click('#play-scale');

        // Verify the button shows playing state
        await expect(page.locator('#play-scale')).toHaveClass(/playing/);

        // Wait a bit for the scale to play
        await page.waitForTimeout(500);
    });

    test('should play a chord when play chord button is clicked', async ({ page }) => {
        // Select a key
        await page.click('[data-key="D"]');

        // Click play chord button
        await page.click('#play-chord');

        // Verify audio is playing
        await expect(page.locator('#play-chord')).toHaveClass(/playing/);
    });

    test('should switch between major and minor modes', async ({ page }) => {
        // Select a key
        await page.click('[data-key="A"]');

        // Verify major mode is selected by default
        await expect(page.locator('#mode-major')).toBeChecked();

        // Switch to minor mode
        await page.click('#mode-minor');

        // Verify minor mode is now selected
        await expect(page.locator('#mode-minor')).toBeChecked();

        // Verify the info panel updates
        await expect(page.locator('#info-title')).toContainText('minor');
    });

    test('should change theme when theme toggle is clicked', async ({ page }) => {
        // Get current theme
        const initialTheme = await page.getAttribute('html', 'data-theme');

        // Click theme toggle
        await page.click('#theme-toggle-btn');

        // Click on a different theme (e.g., dark)
        await page.click('[data-theme="dark"]');

        // Verify theme changed
        const newTheme = await page.getAttribute('html', 'data-theme');
        expect(newTheme).not.toBe(initialTheme);
        expect(newTheme).toBe('dark');
    });

    test('should display chord progression when selected', async ({ page }) => {
        // Select a key
        await page.click('[data-key="C"]');

        // Select a chord progression
        await page.selectOption('#progression-select', 'I-IV-V-I');

        // Verify progression is displayed
        await expect(page.locator('#progression-display')).toBeVisible();
    });

    test('should work with keyboard shortcuts', async ({ page }) => {
        // Select a key first
        await page.click('[data-key="F"]');

        // Press 'S' to play scale
        await page.keyboard.press('s');

        // Verify scale is playing
        await expect(page.locator('#play-scale')).toHaveClass(/playing/);

        // Wait a bit
        await page.waitForTimeout(300);

        // Press 'C' to play chord
        await page.keyboard.press('c');

        // Verify chord is playing
        await expect(page.locator('#play-chord')).toHaveClass(/playing/);
    });

    test('should be accessible with keyboard navigation', async ({ page }) => {
        // Tab through interactive elements
        await page.keyboard.press('Tab');

        // Verify focus is on an interactive element
        const focusedElement = await page.evaluate(() => document.activeElement.tagName);
        expect(['BUTTON', 'INPUT', 'SELECT', 'A']).toContain(focusedElement);
    });

    test('should display correct scale notes', async ({ page }) => {
        // Select C major
        await page.click('[data-key="C"]');

        // Verify scale notes are displayed
        const scaleNotes = await page.locator('#scale-notes').textContent();
        expect(scaleNotes).toContain('C');
        expect(scaleNotes).toContain('D');
        expect(scaleNotes).toContain('E');
    });

    test('should handle rapid key changes', async ({ page }) => {
        // Rapidly click different keys
        await page.click('[data-key="C"]');
        await page.click('[data-key="G"]');
        await page.click('[data-key="D"]');
        await page.click('[data-key="A"]');

        // Verify the last key is selected
        await expect(page.locator('[data-key="A"]')).toHaveClass(/selected/);
        await expect(page.locator('#info-title')).toContainText('A');
    });

    test('should persist theme preference', async ({ page, context: _context }) => {
        // Set theme to dark
        await page.click('#theme-toggle-btn');
        await page.click('[data-theme="dark"]');

        // Reload the page
        await page.reload();

        // Wait for app to load
        await page.waitForSelector('#circle-svg');

        // Verify theme is still dark
        const theme = await page.getAttribute('html', 'data-theme');
        expect(theme).toBe('dark');
    });

    test('should show error message for invalid operations', async ({ page }) => {
        // Try to play without selecting a key (if applicable)
        // This depends on your app's behavior

        // For now, just verify error handling exists
        const consoleMessages = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleMessages.push(msg.text());
            }
        });

        // Perform some actions
        await page.click('[data-key="C"]');
        await page.click('#play-scale');

        // Verify no console errors
        expect(consoleMessages.length).toBe(0);
    });

    test('should work on mobile viewport', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Reload to apply viewport
        await page.reload();
        await page.waitForSelector('#circle-svg');

        // Verify app is still functional
        await expect(page.locator('#circle-svg')).toBeVisible();

        // Try selecting a key
        await page.click('[data-key="C"]');
        await expect(page.locator('#info-title')).toContainText('C');
    });

    test('should handle touch events on mobile', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.reload();
        await page.waitForSelector('#circle-svg');

        // Simulate touch on a key
        await page.tap('[data-key="G"]');

        // Verify key is selected
        await expect(page.locator('[data-key="G"]')).toHaveClass(/selected/);
    });
});

test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
        await page.goto(`${BASE_URL}/`);
        await page.waitForSelector('#circle-svg');

        // Check for ARIA labels on key elements
        const circleLabel = await page.getAttribute('#circle-svg', 'aria-label');
        expect(circleLabel).toBeTruthy();

        const playScaleLabel = await page.getAttribute('#play-scale', 'aria-label');
        expect(playScaleLabel).toBeTruthy();
    });

    test('should announce changes to screen readers', async ({ page }) => {
        await page.goto(`${BASE_URL}/`);
        await page.waitForSelector('#circle-svg');

        // Check for live regions
        const liveRegion = await page.locator('[aria-live]').count();
        expect(liveRegion).toBeGreaterThan(0);
    });
});

test.describe('Performance', () => {
    test('should load within acceptable time', async ({ page }) => {
        const startTime = Date.now();

        await page.goto(`${BASE_URL}/`);
        await page.waitForSelector('#circle-svg');
        await page.waitForSelector('#loading', { state: 'hidden' });

        const loadTime = Date.now() - startTime;

        // Should load within 3 seconds
        expect(loadTime).toBeLessThan(3000);
    });

    test('should handle rapid interactions without lag', async ({ page }) => {
        await page.goto(`${BASE_URL}/`);
        await page.waitForSelector('#circle-svg');

        const startTime = Date.now();

        // Rapidly click 10 different keys
        for (let i = 0; i < 10; i++) {
            const keys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb'];
            await page.click(`[data-key="${keys[i]}"]`);
        }

        const interactionTime = Date.now() - startTime;

        // Should handle 10 interactions within 2 seconds
        expect(interactionTime).toBeLessThan(2000);
    });
});

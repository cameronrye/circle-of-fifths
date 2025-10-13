/**
 * ES6 Module Loader for CommonJS Test Environment
 * This file loads ES6 modules and makes them available to CommonJS tests
 */

const path = require('path');

// Cache for loaded modules
const moduleCache = {};

/**
 * Load an ES6 module dynamically
 */
async function loadES6Module(modulePath) {
    if (moduleCache[modulePath]) {
        return moduleCache[modulePath];
    }

    const absolutePath = path.resolve(__dirname, '../..', modulePath);
    const fileUrl = `file://${absolutePath}`;

    try {
        const module = await import(fileUrl);
        moduleCache[modulePath] = module;
        return module;
    } catch (error) {
        console.error(`Failed to load ES6 module ${modulePath}:`, error.message);
        throw error;
    }
}

/**
 * Load all application modules and set them as globals
 */
async function loadAllModules() {
    try {
        // Load logger
        const loggerModule = await loadES6Module('js/logger.js');
        global.Logger = loggerModule.Logger;
        global.LOG_LEVELS = loggerModule.LOG_LEVELS;
        global.logger = loggerModule.logger;
        global.loggers = loggerModule.loggers;

        // Load musicTheory
        const musicTheoryModule = await loadES6Module('js/musicTheory.js');
        global.MusicTheory = musicTheoryModule.MusicTheory;
        global.CIRCLE_OF_FIFTHS = musicTheoryModule.CIRCLE_OF_FIFTHS;
        global.MAJOR_KEYS = musicTheoryModule.MAJOR_KEYS;
        global.MINOR_KEYS = musicTheoryModule.MINOR_KEYS;
        global.CHORD_PROGRESSIONS = musicTheoryModule.CHORD_PROGRESSIONS;
        global.NOTES = musicTheoryModule.NOTES;
        global.SCALE_PATTERNS = musicTheoryModule.SCALE_PATTERNS;

        // Load audioEngine
        const audioEngineModule = await loadES6Module('js/audioEngine.js');
        global.AudioEngine = audioEngineModule.AudioEngine;

        // Load circleRenderer
        const circleRendererModule = await loadES6Module('js/circleRenderer.js');
        global.CircleRenderer = circleRendererModule.CircleRenderer;

        // Load interactions
        const interactionsModule = await loadES6Module('js/interactions.js');
        global.InteractionsHandler = interactionsModule.InteractionsHandler;

        // Load themeManager
        const themeManagerModule = await loadES6Module('js/themeManager.js');
        global.ThemeManager = themeManagerModule.ThemeManager;

        // Load themeToggle
        const themeToggleModule = await loadES6Module('js/themeToggle.js');
        global.ThemeToggle = themeToggleModule.ThemeToggle;

        // Load app
        const appModule = await loadES6Module('js/app.js');
        global.CircleOfFifthsApp = appModule.CircleOfFifthsApp;
        global.app = appModule.app;

        return true;
    } catch (error) {
        console.error('Failed to load modules:', error);
        return false;
    }
}

module.exports = {
    loadES6Module,
    loadAllModules
};

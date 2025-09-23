#!/usr/bin/env node

/**
 * Test Framework Validation Script
 * Validates that the test framework is properly configured and working
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating test framework...');

// Check if required test files exist
const requiredFiles = [
    'tests/framework/TestRunner.js',
    'tests/framework/Assertions.js',
    'tests/framework/DOMHelpers.js',
    'tests/test-config.js',
    'tests/run-tests.js'
];

let allFilesExist = true;

for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} exists`);
    } else {
        console.error(`❌ ${file} is missing`);
        allFilesExist = false;
    }
}

// Check if application modules exist
const appModules = [
    'js/musicTheory.js',
    'js/audioEngine.js',
    'js/circleRenderer.js',
    'js/themeManager.js',
    'js/themeToggle.js',
    'js/interactions.js'
];

for (const module of appModules) {
    if (fs.existsSync(module)) {
        console.log(`✅ ${module} exists`);
    } else {
        console.error(`❌ ${module} is missing`);
        allFilesExist = false;
    }
}

// Test basic module loading
try {
    const { setupTestEnvironment } = require('./tests/test-config.js');
    console.log('✅ Test configuration loads successfully');
    
    // Try to setup test environment
    setupTestEnvironment();
    console.log('✅ Test environment setup successful');
    
} catch (error) {
    console.error('❌ Test framework setup failed:', error.message);
    allFilesExist = false;
}

if (allFilesExist) {
    console.log('✅ Test framework validation passed');
    process.exit(0);
} else {
    console.error('❌ Test framework validation failed');
    process.exit(1);
}

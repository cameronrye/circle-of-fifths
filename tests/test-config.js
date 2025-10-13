/**
 * Test Configuration for Circle of Fifths
 * Central configuration for all test settings and utilities
 */

// Import test framework components
const TestRunner = require('./framework/TestRunner');
const { expect } = require('./framework/Assertions');
const { setupDOMEnvironment, cleanupDOMEnvironment } = require('./framework/DOMHelpers');

/**
 * Global test configuration
 */
const testConfig = {
    // Test runner options
    runner: {
        verbose: process.env.TEST_VERBOSE === 'true',
        bail: process.env.TEST_BAIL === 'true',
        timeout: parseInt(process.env.TEST_TIMEOUT, 10) || 5000,
        coverage: process.env.TEST_COVERAGE === 'true',
        reporter: process.env.TEST_REPORTER || 'default'
    },

    // Test environment setup
    environment: {
        setupDOM: true,
        mockAudio: true,
        mockStorage: true,
        mockTimers: false
    },

    // Test file patterns
    patterns: {
        unit: 'tests/unit/*.test.js',
        integration: 'tests/integration/*.test.js',
        e2e: 'tests/e2e/*.test.js'
    },

    // Coverage settings
    coverage: {
        threshold: {
            global: {
                branches: 80,
                functions: 80,
                lines: 80,
                statements: 80
            }
        },
        exclude: ['tests/**', 'node_modules/**']
    }
};

/**
 * Global test setup
 */
async function setupTestEnvironment() {
    // Setup DOM environment if needed
    if (testConfig.environment.setupDOM) {
        setupDOMEnvironment();
    }

    // Ensure CustomEvent is available as a proper constructor
    if (!global.CustomEvent || typeof global.CustomEvent !== 'function') {
        const { MockCustomEvent } = require('./framework/DOMHelpers');
        global.CustomEvent = MockCustomEvent;
    }

    // Load ES6 modules using the loader
    const { loadAllModules } = require('./loaders/es6-loader.cjs');
    const modulesLoaded = await loadAllModules();

    if (!modulesLoaded) {
        console.error('❌ Failed to load ES6 modules');
        process.exit(1);
    }

    // Setup global test utilities
    global.testRunner = new TestRunner(testConfig.runner);
    global.expect = expect;
    global.describe = global.testRunner.describe.bind(global.testRunner);
    global.test = global.testRunner.test.bind(global.testRunner);
    global.it = global.testRunner.it.bind(global.testRunner);
    global.beforeAll = global.testRunner.beforeAll.bind(global.testRunner);
    global.afterAll = global.testRunner.afterAll.bind(global.testRunner);
    global.beforeEach = global.testRunner.beforeEach.bind(global.testRunner);
    global.afterEach = global.testRunner.afterEach.bind(global.testRunner);

    // Store original timer functions for restoration
    const originalTimers = {
        setTimeout: global.setTimeout,
        clearTimeout: global.clearTimeout,
        setInterval: global.setInterval,
        clearInterval: global.clearInterval
    };

    global.jest = {
        fn: global.testRunner.fn.bind(global.testRunner),
        spyOn: global.testRunner.spyOn.bind(global.testRunner),
        mock: global.testRunner.mock.bind(global.testRunner),
        clearAllMocks: global.testRunner.clearAllMocks.bind(global.testRunner),
        restoreAllMocks: global.testRunner.restoreAllMocks.bind(global.testRunner),
        useFakeTimers: () => {
            setupTimerMocks();
            // Set up jest timer methods
            global.jest.advanceTimersByTime = time => {
                if (global.advanceTimers) {
                    global.advanceTimers(time);
                }
            };
            global.jest.runAllTimers = () => {
                if (global.runAllTimers) {
                    global.runAllTimers();
                }
            };
        },
        useRealTimers: () => {
            global.setTimeout = originalTimers.setTimeout;
            global.clearTimeout = originalTimers.clearTimeout;
            global.setInterval = originalTimers.setInterval;
            global.clearInterval = originalTimers.clearInterval;
            // Clean up timer mock globals
            delete global.advanceTimers;
            delete global.runAllTimers;
            delete global.jest.advanceTimersByTime;
            delete global.jest.runAllTimers;
        }
    };

    // Setup console capture for testing
    global.captureConsole = () => {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const logs = [];

        console.log = (...args) => logs.push({ type: 'log', args });
        console.error = (...args) => logs.push({ type: 'error', args });
        console.warn = (...args) => logs.push({ type: 'warn', args });

        return {
            logs,
            restore: () => {
                console.log = originalLog;
                console.error = originalError;
                console.warn = originalWarn;
            }
        };
    };

    // Setup timer mocks if needed
    if (testConfig.environment.mockTimers) {
        setupTimerMocks();
    }

    if (testConfig.runner.verbose) {
        console.log('Test environment setup complete');
    }
}

/**
 * Global test cleanup
 */
function cleanupTestEnvironment() {
    // Cleanup DOM environment
    if (testConfig.environment.setupDOM) {
        cleanupDOMEnvironment();
    }

    // Restore all mocks
    if (global.testRunner) {
        global.testRunner.restoreAllMocks();
    }

    // Clean up globals
    delete global.testRunner;
    delete global.expect;
    delete global.describe;
    delete global.test;
    delete global.it;
    delete global.beforeAll;
    delete global.afterAll;
    delete global.beforeEach;
    delete global.afterEach;
    delete global.jest;
    delete global.captureConsole;

    if (testConfig.runner.verbose) {
        console.log('Test environment cleanup complete');
    }
}

/**
 * Timer mocks for testing time-dependent code
 */
function setupTimerMocks() {
    const timers = {
        timeouts: new Map(),
        intervals: new Map(),
        currentTime: 0,
        nextId: 1
    };

    global.setTimeout = (callback, delay = 0) => {
        const id = timers.nextId++;
        timers.timeouts.set(id, {
            callback,
            time: timers.currentTime + delay
        });
        return id;
    };

    global.clearTimeout = id => {
        timers.timeouts.delete(id);
    };

    global.setInterval = (callback, delay = 0) => {
        const id = timers.nextId++;
        timers.intervals.set(id, {
            callback,
            delay,
            nextTime: timers.currentTime + delay
        });
        return id;
    };

    global.clearInterval = id => {
        timers.intervals.delete(id);
    };

    global.advanceTimers = time => {
        timers.currentTime += time;

        // Execute timeouts
        for (const [id, timer] of timers.timeouts) {
            if (timer.time <= timers.currentTime) {
                timer.callback();
                timers.timeouts.delete(id);
            }
        }

        // Execute intervals
        for (const [_id, timer] of timers.intervals) {
            while (timer.nextTime <= timers.currentTime) {
                timer.callback();
                timer.nextTime += timer.delay;
            }
        }
    };

    global.runAllTimers = () => {
        while (timers.timeouts.size > 0 || timers.intervals.size > 0) {
            const nextTimeout = Math.min(
                ...Array.from(timers.timeouts.values()).map(t => t.time),
                Infinity
            );
            const nextInterval = Math.min(
                ...Array.from(timers.intervals.values()).map(t => t.nextTime),
                Infinity
            );

            const nextTime = Math.min(nextTimeout, nextInterval);
            if (nextTime === Infinity) {
                break;
            }

            global.advanceTimers(nextTime - timers.currentTime);
        }
    };
}

/**
 * Load and execute a test file
 */
async function loadTestFile(filePath) {
    try {
        if (testConfig.runner.verbose) {
            console.log(`🔍 Loading test file: ${filePath}`);
        }

        // Clear module cache to ensure fresh load
        delete require.cache[require.resolve(filePath)];

        // Load the test file
        require(filePath);

        if (testConfig.runner.verbose) {
            console.log(`✅ Loaded test file: ${filePath}`);
            console.log(`🔍 After loading ${filePath}:`);
            console.log(`  Suites: ${global.testRunner.suites.length}`);
            console.log(`  Tests: ${global.testRunner.tests.length}`);
        }
    } catch (error) {
        console.error(`❌ Failed to load test file ${filePath}:`, error.message);
        if (testConfig.runner.verbose) {
            console.error('Stack trace:', error.stack);
        }
        throw error;
    }
}

/**
 * Run tests from multiple files
 */
async function runTestFiles(patterns) {
    const _fs = require('fs');
    const path = require('path');
    const glob = require('glob');

    const testFiles = [];

    // Resolve patterns to actual files
    for (const pattern of patterns) {
        try {
            const files = glob.sync(pattern, { cwd: process.cwd() });
            testFiles.push(...files.map(f => path.resolve(f)));
        } catch (error) {
            console.warn(`Failed to resolve pattern ${pattern}:`, error.message);
        }
    }

    if (testFiles.length === 0) {
        console.warn('No test files found');
        return { passed: 0, failed: 0, total: 0 };
    }

    if (testConfig.runner.verbose) {
        console.log(`Found ${testFiles.length} test files`);
    }

    // Load all test files
    for (const file of testFiles) {
        await loadTestFile(file);
    }

    if (testConfig.runner.verbose) {
        console.log('🔍 All test files loaded. Checking test runner state...');
        console.log('Suites:', global.testRunner.suites.length);
        console.log('Tests:', global.testRunner.tests.length);
    }

    // Collect tests to verify they exist
    const allTests = global.testRunner.collectTests();
    if (testConfig.runner.verbose) {
        console.log('🔍 Collected tests:', allTests.length);
    }

    if (allTests.length === 0) {
        console.warn('⚠️ No tests found to run');
        return { passed: 0, failed: 0, skipped: 0, total: 0, suites: {}, duration: 0 };
    }

    // Run all tests
    if (testConfig.runner.verbose) {
        console.log('🔍 Starting test runner...');
    }
    const results = await global.testRunner.run();
    if (testConfig.runner.verbose) {
        console.log('🔍 Test runner completed');
    }

    return results;
}

/**
 * Main test runner function
 */
async function runTests(options = {}) {
    // Add a global timeout to prevent hanging (longer for CI environments)
    const timeoutDuration = process.env.CI ? 120000 : 60000; // 2 minutes for CI, 1 minute for local
    const timeoutId = setTimeout(() => {
        console.error(`❌ Test runner timed out after ${timeoutDuration / 1000} seconds`);
        console.error('This may indicate an infinite loop or hanging test');
        process.exit(1);
    }, timeoutDuration);

    try {
        if (testConfig.runner.verbose) {
            console.log('🔍 Starting runTests...');
        }

        // Setup test environment
        if (testConfig.runner.verbose) {
            console.log('🔍 Setting up test environment...');
        }
        await setupTestEnvironment();

        // Determine which tests to run
        const patterns = [];
        if (options.unit !== false) {
            patterns.push(testConfig.patterns.unit);
        }
        if (options.integration) {
            patterns.push(testConfig.patterns.integration);
        }
        if (options.e2e) {
            patterns.push(testConfig.patterns.e2e);
        }

        // Default to unit tests if no specific type requested
        if (patterns.length === 0) {
            patterns.push(testConfig.patterns.unit);
        }

        if (testConfig.runner.verbose) {
            console.log('🔍 Test patterns:', patterns);
        }

        // Run tests
        if (testConfig.runner.verbose) {
            console.log('🔍 Running test files...');
        }
        const results = await runTestFiles(patterns);
        if (testConfig.runner.verbose) {
            console.log('🔍 Test files completed');
        }

        clearTimeout(timeoutId);
        return results;
    } catch (error) {
        clearTimeout(timeoutId);
        console.error('❌ Test runner failed:', error);
        console.error('Stack:', error.stack);
        if (typeof process !== 'undefined') {
            process.exit(1);
        }
        throw error;
    } finally {
        // Cleanup test environment
        if (testConfig.runner.verbose) {
            console.log('🔍 Cleaning up test environment...');
        }
        cleanupTestEnvironment();
    }
}

// Export configuration and utilities
module.exports = {
    testConfig,
    setupTestEnvironment,
    cleanupTestEnvironment,
    loadTestFile,
    runTestFiles,
    runTests
};

// CLI support
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {};

    // Parse command line arguments
    for (const arg of args) {
        if (arg === '--integration') {
            options.integration = true;
        }
        if (arg === '--e2e') {
            options.e2e = true;
        }
        if (arg === '--unit-only') {
            options.integration = false;
        }
        if (arg === '--verbose') {
            process.env.TEST_VERBOSE = 'true';
        }
        if (arg === '--bail') {
            process.env.TEST_BAIL = 'true';
        }
        if (arg === '--coverage') {
            process.env.TEST_COVERAGE = 'true';
        }
    }

    runTests(options);
}

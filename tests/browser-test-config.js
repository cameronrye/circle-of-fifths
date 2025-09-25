/**
 * Browser Test Configuration for Circle of Fifths
 * Simplified configuration for browser-based testing
 */

// Global test configuration for browser environment
const testConfig = {
    // Test runner options
    runner: {
        verbose: true,
        bail: false,
        timeout: 5000,
        coverage: false,
        reporter: 'html'
    },

    // Test environment setup
    environment: {
        setupDOM: true,
        mockAudio: true,
        mockStorage: true,
        mockTimers: false
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
        }
    }
};

/**
 * Simple test environment setup for browser
 */
function setupTestEnvironment() {
    console.log('Setting up browser test environment...');

    // Setup global test utilities (simplified versions)
    window.testConfig = testConfig;

    // Simple expect function
    window.expect = function (actual) {
        return {
            toBe: function (expected) {
                if (actual !== expected) {
                    throw new Error(`Expected ${actual} to be ${expected}`);
                }
            },
            toEqual: function (expected) {
                if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                    throw new Error(
                        `Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`
                    );
                }
            },
            toBeTruthy: function () {
                if (!actual) {
                    throw new Error(`Expected ${actual} to be truthy`);
                }
            },
            toBeFalsy: function () {
                if (actual) {
                    throw new Error(`Expected ${actual} to be falsy`);
                }
            },
            toBeNull: function () {
                if (actual !== null) {
                    throw new Error(`Expected ${actual} to be null`);
                }
            },
            toBeUndefined: function () {
                if (actual !== undefined) {
                    throw new Error(`Expected ${actual} to be undefined`);
                }
            },
            toBeDefined: function () {
                if (actual === undefined) {
                    throw new Error(`Expected ${actual} to be defined`);
                }
            },
            toBeInstanceOf: function (expected) {
                if (!(actual instanceof expected)) {
                    throw new Error(`Expected ${actual} to be instance of ${expected.name}`);
                }
            },
            toBeGreaterThan: function (expected) {
                if (actual <= expected) {
                    throw new Error(`Expected ${actual} to be greater than ${expected}`);
                }
            },
            toBeLessThan: function (expected) {
                if (actual >= expected) {
                    throw new Error(`Expected ${actual} to be less than ${expected}`);
                }
            },
            toBeCloseTo: function (expected, precision = 2) {
                const diff = Math.abs(actual - expected);
                const tolerance = Math.pow(10, -precision) / 2;
                if (diff >= tolerance) {
                    throw new Error(`Expected ${actual} to be close to ${expected}`);
                }
            },
            toContain: function (expected) {
                if (typeof actual === 'string') {
                    if (!actual.includes(expected)) {
                        throw new Error(`Expected "${actual}" to contain "${expected}"`);
                    }
                } else if (Array.isArray(actual)) {
                    if (!actual.includes(expected)) {
                        throw new Error(`Expected [${actual.join(', ')}] to contain ${expected}`);
                    }
                } else {
                    throw new Error(`Cannot check if ${actual} contains ${expected}`);
                }
            },
            toHaveLength: function (expected) {
                if (!actual || actual.length !== expected) {
                    throw new Error(`Expected ${actual} to have length ${expected}`);
                }
            },
            toHaveProperty: function (property, value) {
                if (!(property in actual)) {
                    throw new Error(
                        `Expected ${JSON.stringify(actual)} to have property "${property}"`
                    );
                }
                if (value !== undefined && actual[property] !== value) {
                    throw new Error(
                        `Expected property "${property}" to be ${value}, got ${actual[property]}`
                    );
                }
            },
            toThrow: function (expected) {
                if (typeof actual !== 'function') {
                    throw new Error('Expected value must be a function');
                }

                let threw = false;
                let error = null;

                try {
                    actual();
                } catch (e) {
                    threw = true;
                    error = e;
                }

                if (!threw) {
                    throw new Error('Expected function to throw');
                }

                if (expected && typeof expected === 'string') {
                    if (!error.message.includes(expected)) {
                        throw new Error(
                            `Expected error message to contain "${expected}", got "${error.message}"`
                        );
                    }
                }
            },
            not: {
                toBe: function (expected) {
                    if (actual === expected) {
                        throw new Error(`Expected ${actual} not to be ${expected}`);
                    }
                },
                toEqual: function (expected) {
                    if (JSON.stringify(actual) === JSON.stringify(expected)) {
                        throw new Error(
                            `Expected ${JSON.stringify(actual)} not to equal ${JSON.stringify(expected)}`
                        );
                    }
                },
                toThrow: function () {
                    if (typeof actual !== 'function') {
                        throw new Error('Expected value must be a function');
                    }

                    try {
                        actual();
                    } catch {
                        throw new Error('Expected function not to throw');
                    }
                }
            }
        };
    };

    console.log('Browser test environment setup complete');
}

/**
 * Clean up test environment
 */
function cleanupTestEnvironment() {
    delete window.testConfig;
    delete window.expect;
    console.log('Browser test environment cleanup complete');
}

// Auto-setup when loaded
if (typeof window !== 'undefined') {
    window.testConfig = testConfig;
    window.setupTestEnvironment = setupTestEnvironment;
    window.cleanupTestEnvironment = cleanupTestEnvironment;
}

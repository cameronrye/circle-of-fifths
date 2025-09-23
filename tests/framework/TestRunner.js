/**
 * Comprehensive Test Framework for Circle of Fifths
 * Jest-like testing framework that works in both browser and Node.js environments
 */

class TestRunner {
    constructor(options = {}) {
        this.tests = [];
        this.suites = [];
        this.currentSuite = null;
        this.results = {
            passed: 0,
            failed: 0,
            skipped: 0,
            total: 0,
            suites: {},
            startTime: null,
            endTime: null,
            duration: 0
        };
        this.options = {
            verbose: options.verbose || false,
            bail: options.bail || false,
            timeout: options.timeout || 5000,
            coverage: options.coverage || false,
            reporter: options.reporter || 'default'
        };
        this.hooks = {
            beforeAll: [],
            afterAll: [],
            beforeEach: [],
            afterEach: []
        };
        this.mocks = new Map();
        this.spies = new Map();
    }

    /**
     * Define a test suite
     */
    describe(name, fn) {
        const suite = {
            name,
            tests: [],
            hooks: {
                beforeAll: [],
                afterAll: [],
                beforeEach: [],
                afterEach: []
            },
            parent: this.currentSuite
        };

        this.suites.push(suite);
        const previousSuite = this.currentSuite;
        this.currentSuite = suite;

        try {
            fn();
        } finally {
            this.currentSuite = previousSuite;
        }

        return suite;
    }

    /**
     * Define a test case
     */
    test(name, fn, timeout = this.options.timeout) {
        const test = {
            name,
            fn,
            timeout,
            suite: this.currentSuite,
            skip: false,
            only: false
        };

        if (this.currentSuite) {
            this.currentSuite.tests.push(test);
        } else {
            this.tests.push(test);
        }

        return test;
    }

    /**
     * Alias for test
     */
    it(name, fn, timeout) {
        return this.test(name, fn, timeout);
    }

    /**
     * Skip a test
     */
    skip(name, fn) {
        const test = this.test(name, fn);
        test.skip = true;
        return test;
    }

    /**
     * Run only this test
     */
    only(name, fn, timeout) {
        const test = this.test(name, fn, timeout);
        test.only = true;
        return test;
    }

    /**
     * Setup hooks
     */
    beforeAll(fn) {
        if (this.currentSuite) {
            this.currentSuite.hooks.beforeAll.push(fn);
        } else {
            this.hooks.beforeAll.push(fn);
        }
    }

    afterAll(fn) {
        if (this.currentSuite) {
            this.currentSuite.hooks.afterAll.push(fn);
        } else {
            this.hooks.afterAll.push(fn);
        }
    }

    beforeEach(fn) {
        if (this.currentSuite) {
            this.currentSuite.hooks.beforeEach.push(fn);
        } else {
            this.hooks.beforeEach.push(fn);
        }
    }

    afterEach(fn) {
        if (this.currentSuite) {
            this.currentSuite.hooks.afterEach.push(fn);
        } else {
            this.hooks.afterEach.push(fn);
        }
    }

    /**
     * Create a mock function
     */
    fn(implementation) {
        const mockFn = (...args) => {
            mockFn.calls.push(args);
            mockFn.callCount++;
            if (mockFn.implementation) {
                return mockFn.implementation(...args);
            }
        };

        mockFn.calls = [];
        mockFn.callCount = 0;
        mockFn.implementation = implementation;
        mockFn.mockReturnValue = value => {
            mockFn.implementation = () => value;
            return mockFn;
        };
        mockFn.mockResolvedValue = value => {
            mockFn.implementation = () => Promise.resolve(value);
            return mockFn;
        };
        mockFn.mockRejectedValue = value => {
            mockFn.implementation = () => Promise.reject(value);
            return mockFn;
        };
        mockFn.mockImplementation = impl => {
            mockFn.implementation = impl;
            return mockFn;
        };
        mockFn.mockClear = () => {
            mockFn.calls = [];
            mockFn.callCount = 0;
            return mockFn;
        };

        return mockFn;
    }

    /**
     * Spy on an object method
     */
    spyOn(object, method) {
        const original = object[method];
        const spy = this.fn(original);
        spy.original = original;
        spy.mockRestore = () => {
            object[method] = original;
        };
        object[method] = spy;
        this.spies.set(`${object.constructor.name}.${method}`, spy);
        return spy;
    }

    /**
     * Mock a module or object
     */
    mock(name, implementation) {
        this.mocks.set(name, implementation);
        return implementation;
    }

    /**
     * Clear all mocks
     */
    clearAllMocks() {
        this.mocks.clear();
        this.spies.forEach(spy => spy.mockClear());
    }

    /**
     * Restore all mocks
     */
    restoreAllMocks() {
        this.spies.forEach(spy => spy.mockRestore());
        this.spies.clear();
        this.mocks.clear();
    }

    /**
     * Run a single test
     */
    async runTest(test) {
        if (this.options.verbose) {
            console.log(`🔍 TestRunner: Starting test: ${test.name}`);
        }
        const result = {
            name: test.name,
            suite: test.suite?.name,
            passed: false,
            error: null,
            duration: 0,
            skipped: test.skip
        };

        if (test.skip) {
            if (this.options.verbose) {
                console.log(`🔍 TestRunner: Skipping test: ${test.name}`);
            }
            this.results.skipped++;
            return result;
        }

        const startTime = Date.now();

        try {
            // Run beforeEach hooks
            if (this.options.verbose) {
                console.log(`🔍 TestRunner: Running beforeEach hooks for: ${test.name}`);
            }
            await this.runHooks('beforeEach', test.suite);

            // Run the test with timeout
            if (this.options.verbose) {
                console.log(`🔍 TestRunner: Executing test function: ${test.name}`);
            }
            await this.withTimeout(Promise.resolve(test.fn()), test.timeout);

            result.passed = true;
            this.results.passed++;
            if (this.options.verbose) {
                console.log(`🔍 TestRunner: Test passed: ${test.name}`);
            }
        } catch (error) {
            // Always log test failures for CI visibility
            console.log(`❌ Test failed: ${test.name} - ${error.message}`);
            result.error = error;
            result.passed = false;
            this.results.failed++;

            if (this.options.bail) {
                throw error;
            }
        } finally {
            // Run afterEach hooks
            if (this.options.verbose) {
                console.log(`🔍 TestRunner: Running afterEach hooks for: ${test.name}`);
            }
            await this.runHooks('afterEach', test.suite);
            result.duration = Date.now() - startTime;
            if (this.options.verbose) {
                console.log(`🔍 TestRunner: Test completed: ${test.name} (${result.duration}ms)`);
            }
        }

        return result;
    }

    /**
     * Run hooks for a suite
     */
    async runHooks(type, suite) {
        // Run global hooks
        for (const hook of this.hooks[type]) {
            await hook();
        }

        // Run suite hooks (including parent suites)
        const suiteHooks = [];
        let currentSuite = suite;
        while (currentSuite) {
            suiteHooks.unshift(...currentSuite.hooks[type]);
            currentSuite = currentSuite.parent;
        }

        for (const hook of suiteHooks) {
            await hook();
        }
    }

    /**
     * Add timeout to a promise
     */
    withTimeout(promise, timeout) {
        return Promise.race([
            promise,
            new Promise((_, reject) => {
                setTimeout(() => reject(new Error(`Test timeout after ${timeout}ms`)), timeout);
            })
        ]);
    }

    /**
     * Run all tests
     */
    async run() {
        this.results.startTime = Date.now();
        if (this.options.verbose) {
            console.log('🔍 TestRunner: Starting test run...');
        }

        try {
            // Run global beforeAll hooks
            if (this.options.verbose) {
                console.log('🔍 TestRunner: Running beforeAll hooks...');
            }
            await this.runHooks('beforeAll');

            // Collect all tests
            if (this.options.verbose) {
                console.log('🔍 TestRunner: Collecting tests...');
            }
            const allTests = this.collectTests();
            this.results.total = allTests.length;

            // Always show test count for CI visibility
            console.log(`Running ${allTests.length} tests...`);

            // Filter tests (only, skip)
            const testsToRun = this.filterTests(allTests);
            if (this.options.verbose && testsToRun.length !== allTests.length) {
                console.log(`🔍 TestRunner: Running ${testsToRun.length} tests (${allTests.length - testsToRun.length} skipped)`);
            }

            // Run tests
            for (let i = 0; i < testsToRun.length; i++) {
                const test = testsToRun[i];
                if (this.options.verbose) {
                    console.log(
                        `🔍 TestRunner: Running test ${i + 1}/${testsToRun.length}: ${test.name}`
                    );
                }

                try {
                    const result = await this.runTest(test);

                    if (!this.results.suites[result.suite || 'global']) {
                        this.results.suites[result.suite || 'global'] = [];
                    }
                    this.results.suites[result.suite || 'global'].push(result);

                    if (this.options.verbose) {
                        this.logTestResult(result);
                    }
                } catch (error) {
                    console.error('❌ Test execution failed:', error.message);
                    if (this.options.verbose && error.stack) {
                        console.error(error.stack);
                    }
                    throw error;
                }
            }

            // Run global afterAll hooks
            if (this.options.verbose) {
                console.log('🔍 TestRunner: Running afterAll hooks...');
            }
            await this.runHooks('afterAll');
        } catch (error) {
            console.error('❌ Test run failed:', error.message);
            if (this.options.verbose && error.stack) {
                console.error(error.stack);
            }
            throw error;
        } finally {
            this.results.endTime = Date.now();
            this.results.duration = this.results.endTime - this.results.startTime;
            if (this.options.verbose) {
                console.log('🔍 TestRunner: Test run completed');
            }
        }

        this.generateReport();
        return this.results;
    }

    /**
     * Collect all tests from suites and global
     */
    collectTests() {
        const allTests = [...this.tests];

        const collectFromSuite = suite => {
            allTests.push(...suite.tests);
            // Handle nested suites recursively
            this.suites.forEach(nestedSuite => {
                if (nestedSuite.parent === suite) {
                    collectFromSuite(nestedSuite);
                }
            });
        };

        // Collect from top-level suites (those without parents)
        this.suites.forEach(suite => {
            if (!suite.parent) {
                collectFromSuite(suite);
            }
        });

        return allTests;
    }

    /**
     * Filter tests based on only/skip
     */
    filterTests(tests) {
        const onlyTests = tests.filter(test => test.only);
        if (onlyTests.length > 0) {
            return onlyTests;
        }
        return tests.filter(test => !test.skip);
    }

    /**
     * Log individual test result
     */
    logTestResult(result) {
        const icon = result.skipped ? '⏭' : result.passed ? '✓' : '✗';
        const color = result.skipped ? '\x1b[33m' : result.passed ? '\x1b[32m' : '\x1b[31m';
        const reset = '\x1b[0m';

        console.log(`${color}${icon} ${result.name} (${result.duration}ms)${reset}`);

        if (result.error) {
            console.log(`  ${result.error.message}`);
            if (result.error.stack) {
                console.log(`  ${result.error.stack}`);
            }
        }
    }

    /**
     * Generate test report
     */
    generateReport() {
        const { passed, failed, skipped, total, duration } = this.results;

        if (this.options.verbose) {
            console.log('\n' + '='.repeat(50));
            console.log('TEST RESULTS');
            console.log('='.repeat(50));
        } else {
            console.log('\n📊 Test Results:');
        }

        console.log(
            `Tests: ${passed} passed, ${failed} failed, ${skipped} skipped, ${total} total`
        );
        console.log(`Time: ${duration}ms`);

        if (failed > 0) {
            console.log('\n❌ Failed Tests:');
            Object.entries(this.results.suites).forEach(([suiteName, tests]) => {
                const failedTests = tests.filter(test => !test.passed && !test.skipped);
                if (failedTests.length > 0) {
                    console.log(`\n${suiteName}:`);
                    failedTests.forEach(test => {
                        console.log(`  ✗ ${test.name}`);
                        if (test.error) {
                            console.log(`    ${test.error.message}`);
                            // Only show stack trace in verbose mode
                            if (this.options.verbose && test.error.stack) {
                                console.log(`    ${test.error.stack}`);
                            }
                        }
                    });
                }
            });
        }

        const success = failed === 0;
        const resultIcon = success ? '✅' : '❌';
        const resultText = success ? 'PASSED' : 'FAILED';
        console.log(`\n${resultIcon} Test suite ${resultText}`);

        return this.results;
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestRunner;
} else if (typeof window !== 'undefined') {
    window.TestRunner = TestRunner;
}

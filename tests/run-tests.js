#!/usr/bin/env node

/**
 * Test Runner Script for Circle of Fifths
 * Runs all tests with proper setup and reporting
 */

const { runTests } = require('./test-config.js');
const path = require('path');
const fs = require('fs');

// ANSI color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function colorize(text, color) {
    return `${colors[color]}${text}${colors.reset}`;
}

function printHeader() {
    console.log(colorize('\n🧪 Circle of Fifths Test Suite', 'cyan'));
    console.log(colorize('='.repeat(50), 'blue'));
}

function printUsage() {
    console.log(colorize('\nUsage:', 'yellow'));
    console.log('  node tests/run-tests.js [options]');
    console.log('\nOptions:');
    console.log('  --unit          Run unit tests only (default)');
    console.log('  --integration   Run integration tests');
    console.log('  --all           Run all tests');
    console.log('  --verbose       Verbose output');
    console.log('  --bail          Stop on first failure');
    console.log('  --coverage      Generate coverage report');
    console.log('  --watch         Watch for file changes');
    console.log('  --help          Show this help message');
    console.log('\nExamples:');
    console.log('  node tests/run-tests.js --unit --verbose');
    console.log('  node tests/run-tests.js --all --coverage');
    console.log('  node tests/run-tests.js --integration');
}

function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        unit: true,
        integration: false,
        verbose: false,
        bail: false,
        coverage: false,
        watch: false,
        help: false
    };

    for (const arg of args) {
        switch (arg) {
            case '--unit':
                options.unit = true;
                options.integration = false;
                break;
            case '--integration':
                options.integration = true;
                options.unit = false;
                break;
            case '--all':
                options.unit = true;
                options.integration = true;
                break;
            case '--verbose':
                options.verbose = true;
                process.env.TEST_VERBOSE = 'true';
                break;
            case '--bail':
                options.bail = true;
                process.env.TEST_BAIL = 'true';
                break;
            case '--coverage':
                options.coverage = true;
                process.env.TEST_COVERAGE = 'true';
                break;
            case '--watch':
                options.watch = true;
                break;
            case '--help':
                options.help = true;
                break;
            default:
                console.warn(colorize(`Unknown option: ${arg}`, 'yellow'));
        }
    }

    return options;
}

function checkTestFiles() {
    const testDirs = [
        path.join(__dirname, 'unit'),
        path.join(__dirname, 'integration'),
        path.join(__dirname, 'framework')
    ];

    const missingDirs = testDirs.filter(dir => !fs.existsSync(dir));
    if (missingDirs.length > 0) {
        console.error(colorize('Missing test directories:', 'red'));
        missingDirs.forEach(dir => console.error(`  ${dir}`));
        return false;
    }

    const unitTests = fs
        .readdirSync(path.join(__dirname, 'unit'))
        .filter(file => file.endsWith('.test.js'));

    const integrationTests = fs
        .readdirSync(path.join(__dirname, 'integration'))
        .filter(file => file.endsWith('.test.js'));

    console.log(colorize(`Found ${unitTests.length} unit test files`, 'green'));
    console.log(colorize(`Found ${integrationTests.length} integration test files`, 'green'));

    return unitTests.length > 0 || integrationTests.length > 0;
}

function printTestSummary(results) {
    const { passed, failed, skipped, total, duration } = results;

    console.log(colorize('\n📊 Test Summary', 'cyan'));
    console.log(colorize('-'.repeat(30), 'blue'));

    if (passed > 0) {
        console.log(colorize(`✅ Passed: ${passed}`, 'green'));
    }
    if (failed > 0) {
        console.log(colorize(`❌ Failed: ${failed}`, 'red'));
    }
    if (skipped > 0) {
        console.log(colorize(`⏭️  Skipped: ${skipped}`, 'yellow'));
    }

    console.log(colorize(`📈 Total: ${total}`, 'blue'));
    console.log(colorize(`⏱️  Duration: ${duration}ms`, 'blue'));

    const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
    console.log(
        colorize(
            `📊 Success Rate: ${successRate}%`,
            successRate >= 90 ? 'green' : successRate >= 70 ? 'yellow' : 'red'
        )
    );
}

function printFailedTests(results) {
    if (results.failed === 0) {
        return;
    }

    console.log(colorize('\n❌ Failed Tests:', 'red'));
    console.log(colorize('-'.repeat(30), 'red'));

    Object.entries(results.suites).forEach(([suiteName, tests]) => {
        const failedTests = tests.filter(test => !test.passed && !test.skipped);
        if (failedTests.length > 0) {
            console.log(colorize(`\n${suiteName}:`, 'red'));
            failedTests.forEach(test => {
                console.log(colorize(`  • ${test.name}`, 'red'));
                if (test.error && test.error.message) {
                    console.log(colorize(`    ${test.error.message}`, 'yellow'));
                }
            });
        }
    });
}

function generateCoverageReport(results) {
    if (!process.env.TEST_COVERAGE) {
        return;
    }

    console.log(colorize('\n📋 Coverage Report', 'cyan'));
    console.log(colorize('-'.repeat(30), 'blue'));
    console.log(colorize('Coverage reporting not yet implemented', 'yellow'));
    console.log(colorize('This would show line/branch/function coverage', 'yellow'));
}

async function watchMode(options) {
    console.log(colorize('\n👀 Watch mode enabled', 'cyan'));
    console.log(colorize('Watching for file changes...', 'blue'));
    console.log(colorize('Press Ctrl+C to exit', 'yellow'));

    const chokidar = require('chokidar');

    const watcher = chokidar.watch(['js/**/*.js', 'tests/**/*.js'], {
        ignored: /node_modules/,
        persistent: true
    });

    let isRunning = false;

    const runTestsDebounced = debounce(async() => {
        if (isRunning) {
            return;
        }
        isRunning = true;

        console.log(colorize('\n🔄 File changed, running tests...', 'cyan'));
        try {
            await runTests(options);
        } catch (error) {
            console.error(colorize('Test run failed:', 'red'), error.message);
        }
        isRunning = false;
    }, 1000);

    watcher.on('change', runTestsDebounced);

    // Run tests initially
    await runTests(options);

    // Keep process alive
    process.stdin.resume();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function main() {
    const options = parseArgs();

    if (options.help) {
        printHeader();
        printUsage();
        return;
    }

    printHeader();

    // Check if test files exist
    if (!checkTestFiles()) {
        console.error(colorize('\n❌ No test files found!', 'red'));
        process.exit(1);
    }

    console.log(colorize('\n🚀 Starting test run...', 'green'));

    if (options.verbose) {
        console.log(colorize('Verbose mode enabled', 'blue'));
    }
    if (options.bail) {
        console.log(colorize('Bail mode enabled (stop on first failure)', 'blue'));
    }
    if (options.coverage) {
        console.log(colorize('Coverage reporting enabled', 'blue'));
    }

    try {
        if (options.watch) {
            await watchMode(options);
        } else {
            const results = await runTests(options);

            printTestSummary(results);
            printFailedTests(results);
            generateCoverageReport(results);

            // Exit with appropriate code
            const exitCode = results.failed > 0 ? 1 : 0;

            if (exitCode === 0) {
                console.log(colorize('\n🎉 All tests passed!', 'green'));
            } else {
                console.log(colorize('\n💥 Some tests failed!', 'red'));
            }

            process.exit(exitCode);
        }
    } catch (error) {
        console.error(colorize('\n💥 Test runner failed:', 'red'));
        console.error(error.message);
        if (options.verbose && error.stack) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', error => {
    console.error(colorize('\n💥 Uncaught Exception:', 'red'));
    console.error(error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(colorize('\n💥 Unhandled Rejection:', 'red'));
    console.error(reason);
    process.exit(1);
});

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { main, parseArgs, checkTestFiles };

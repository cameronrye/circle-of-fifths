# Circle of Fifths - Comprehensive Testing Suite

This directory contains a complete testing framework for the Circle of Fifths application, including unit tests, integration tests, and testing utilities.

## 🧪 Test Framework Overview

The testing system is built with a custom Jest-like framework that provides:

- **Unit Tests**: Test individual modules in isolation
- **Integration Tests**: Test component interactions and data flow
- **Mock System**: Comprehensive mocking for DOM, Web Audio API, and other browser APIs
- **Assertion Library**: Rich set of matchers for thorough testing
- **Test Runner**: Advanced test execution with reporting and watch mode

## 📁 Directory Structure

```
tests/
├── framework/           # Custom testing framework
│   ├── TestRunner.js   # Main test runner with Jest-like API
│   ├── Assertions.js   # Assertion library with expect() matchers
│   └── DOMHelpers.js   # DOM and Web API mocks
├── unit/               # Unit tests for individual modules
│   ├── musicTheory.test.js     # Tests for music theory calculations
│   ├── audioEngine.test.js     # Tests for audio synthesis
│   ├── themeManager.test.js    # Tests for theme management
│   └── circleRenderer.test.js  # Tests for SVG rendering
├── integration/        # Integration tests
│   └── app-integration.test.js # End-to-end component interaction tests
├── test-config.js      # Test configuration and setup
├── run-tests.js        # CLI test runner script
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites

```bash
# Install Node.js (version 14 or higher)
# Install dependencies
npm install
```

### Running Tests

```bash
# Run all unit tests (default)
npm test

# Run specific test types
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests only
npm run test:all           # All tests

# Run with options
npm run test:verbose       # Detailed output
npm run test:coverage      # With coverage report
npm run test:watch         # Watch mode for development
npm run test:bail          # Stop on first failure

# Run specific module tests
npm run test:music-theory
npm run test:audio-engine
npm run test:theme-manager
npm run test:circle-renderer
```

### Command Line Options

```bash
node tests/run-tests.js [options]

Options:
  --unit          Run unit tests only (default)
  --integration   Run integration tests
  --all           Run all tests
  --verbose       Verbose output
  --bail          Stop on first failure
  --coverage      Generate coverage report
  --watch         Watch for file changes
  --help          Show help message
```

## 📋 Test Coverage

### Unit Tests

#### MusicTheory Module (`musicTheory.test.js`)

- ✅ Constructor and initialization
- ✅ Note index calculations
- ✅ Scale generation (major, minor, harmonic minor, melodic minor)
- ✅ Key signature information
- ✅ Related key relationships
- ✅ Chord progressions
- ✅ Roman numeral to chord conversion
- ✅ Chord note generation
- ✅ Note frequency calculations
- ✅ Key validation
- ✅ Enharmonic equivalents
- ✅ Circle of fifths operations
- ✅ Error handling and edge cases

#### AudioEngine Module (`audioEngine.test.js`)

- ✅ Constructor and initialization
- ✅ Web Audio API setup and mocking
- ✅ Oscillator creation and configuration
- ✅ Note playback with envelopes
- ✅ Chord playback (multiple simultaneous notes)
- ✅ Scale playback (sequential notes)
- ✅ Chord progression playback
- ✅ Chord quality determination
- ✅ Audio controls (volume, waveform, duration)
- ✅ Resource management and cleanup
- ✅ Error handling for audio failures

#### ThemeManager Module (`themeManager.test.js`)

- ✅ Theme initialization and defaults
- ✅ Theme switching (light, dark, system)
- ✅ System preference detection
- ✅ LocalStorage persistence
- ✅ Cross-tab synchronization
- ✅ DOM manipulation for theme application
- ✅ Event handling and dispatching
- ✅ Theme display information (names, icons, colors)
- ✅ Error handling for missing APIs
- ✅ Resource cleanup

#### CircleRenderer Module (`circleRenderer.test.js`)

- ✅ SVG element creation and manipulation
- ✅ Key segment rendering
- ✅ Path and text element generation
- ✅ Color scheme and visual states
- ✅ Key selection and highlighting
- ✅ Mode switching (major/minor)
- ✅ Center information display
- ✅ Hover effects and interactions
- ✅ Coordinate and angle calculations
- ✅ Animation and transitions
- ✅ Responsive design and resizing
- ✅ Accessibility (ARIA attributes)

### Integration Tests

#### Component Interactions (`app-integration.test.js`)

- ✅ MusicTheory ↔ CircleRenderer integration
- ✅ MusicTheory ↔ AudioEngine integration
- ✅ CircleRenderer ↔ AudioEngine coordination
- ✅ Full application workflows
- ✅ Error handling across components
- ✅ Performance and resource management

## 🔧 Testing Framework Features

### Custom Test Runner

- Jest-like API (`describe`, `test`, `beforeEach`, `afterEach`)
- Async/await support
- Test timeouts and error handling
- Detailed reporting with colors
- Watch mode for development

### Assertion Library

```javascript
expect(value).toBe(expected)
expect(value).toEqual(expected)
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()
expect(value).toBeUndefined()
expect(value).toBeInstanceOf(Class)
expect(value).toBeGreaterThan(number)
expect(value).toBeCloseTo(number, precision)
expect(string).toMatch(regex)
expect(array).toContain(item)
expect(array).toHaveLength(number)
expect(object).toHaveProperty(key, value)
expect(function).toThrow(error)
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith(args)
expect(promise).resolves.toBe(value)
expect(promise).rejects.toThrow(error)
```

### Mock System

- **DOM Mocking**: Complete DOM API simulation
- **Web Audio API**: Full AudioContext, OscillatorNode, GainNode mocking
- **Storage APIs**: localStorage, sessionStorage simulation
- **Event System**: Event creation and dispatching
- **Timer Functions**: setTimeout, setInterval with manual control

### Test Utilities

```javascript
// Mock functions
const mockFn = jest.fn();
const spy = jest.spyOn(object, 'method');

// DOM setup
setupDOMEnvironment();
cleanupDOMEnvironment();

// Console capture
const console = captureConsole();
console.restore();

// Timer control (when enabled)
advanceTimers(1000);
runAllTimers();
```

## 📊 Test Reporting

The test runner provides detailed reporting including:

- **Pass/Fail Counts**: Clear summary of test results
- **Duration Tracking**: Performance monitoring
- **Error Details**: Stack traces and failure messages
- **Success Rate**: Percentage of passing tests
- **Suite Breakdown**: Results organized by test suite

Example output:

```
🧪 Circle of Fifths Test Suite
==================================================
Found 4 unit test files
Found 1 integration test files

🚀 Starting test run...

✓ MusicTheory Module (45 tests, 234ms)
✓ AudioEngine Module (38 tests, 189ms)
✓ ThemeManager Module (42 tests, 156ms)
✓ CircleRenderer Module (51 tests, 298ms)
✓ Integration Tests (15 tests, 445ms)

📊 Test Summary
------------------------------
✅ Passed: 191
❌ Failed: 0
📈 Total: 191
⏱️  Duration: 1322ms
📊 Success Rate: 100.0%

🎉 All tests passed!
```

## 🔍 Debugging Tests

### Verbose Mode

```bash
npm run test:verbose
```

Shows detailed output for each test including:

- Individual test results
- Error messages and stack traces
- Mock function call details
- Timing information

### Debugging Individual Tests

```javascript
// Add debugging to specific tests
test('should do something', () => {
    console.log('Debug info:', someValue);
    expect(someValue).toBe(expected);
});
```

### Mock Inspection

```javascript
// Check mock function calls
expect(mockFn).toHaveBeenCalledTimes(3);
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
console.log('Mock calls:', mockFn.mock.calls);
```

## 🚀 Development Workflow

### Watch Mode

```bash
npm run test:watch
```

Automatically runs tests when files change, perfect for TDD.

### Adding New Tests

1. **Unit Tests**: Add to `tests/unit/[module].test.js`
2. **Integration Tests**: Add to `tests/integration/[feature].test.js`
3. **Follow naming convention**: `describe` for modules, `test` for individual cases
4. **Use proper setup/teardown**: `beforeEach`, `afterEach` for clean state

### Test Structure

```javascript
describe('Module Name', () => {
    let instance;

    beforeEach(() => {
        // Setup before each test
        instance = new Module();
    });

    afterEach(() => {
        // Cleanup after each test
        jest.clearAllMocks();
    });

    describe('Feature Group', () => {
        test('should do specific thing', () => {
            // Arrange
            const input = 'test';

            // Act
            const result = instance.method(input);

            // Assert
            expect(result).toBe('expected');
        });
    });
});
```

## 🎯 Best Practices

1. **Test Isolation**: Each test should be independent
2. **Clear Naming**: Descriptive test and suite names
3. **AAA Pattern**: Arrange, Act, Assert structure
4. **Mock External Dependencies**: Use mocks for browser APIs
5. **Test Edge Cases**: Include error conditions and boundary values
6. **Keep Tests Fast**: Unit tests should run quickly
7. **Maintain Tests**: Update tests when code changes

## 🔧 Extending the Framework

The testing framework is modular and can be extended:

- **Add new matchers** in `Assertions.js`
- **Add new mocks** in `DOMHelpers.js`
- **Extend test runner** in `TestRunner.js`
- **Add new test types** by creating new directories

## 📚 Resources

- [Testing Best Practices](https://jestjs.io/docs/getting-started)
- [Web Audio API Testing](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [DOM Testing Strategies](https://testing-library.com/docs/dom-testing-library/intro)
- [Mocking Patterns](https://martinfowler.com/articles/mocksArentStubs.html)

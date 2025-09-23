/**
 * Assertion Library for Circle of Fifths Test Framework
 * Jest-like assertions with comprehensive matchers
 */

class AssertionError extends Error {
    constructor(message, actual, expected) {
        super(message);
        this.name = 'AssertionError';
        this.actual = actual;
        this.expected = expected;
    }
}

class Assertions {
    constructor(actual) {
        this.actual = actual;
        this.isNot = false;
    }

    get not() {
        const assertion = new Assertions(this.actual);
        assertion.isNot = !this.isNot;
        return assertion;
    }

    /**
     * Basic equality
     */
    toBe(expected) {
        const passed = Object.is(this.actual, expected);
        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected ${this.actual} ${this.isNot ? 'not ' : ''}to be ${expected}`,
                this.actual,
                expected
            );
        }
        return this;
    }

    /**
     * Deep equality
     */
    toEqual(expected) {
        const passed = this.deepEqual(this.actual, expected);
        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'not ' : ''}to equal ${JSON.stringify(expected)}`,
                this.actual,
                expected
            );
        }
        return this;
    }

    /**
     * Truthiness
     */
    toBeTruthy() {
        const passed = Boolean(this.actual);
        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected ${this.actual} ${this.isNot ? 'not ' : ''}to be truthy`,
                this.actual,
                true
            );
        }
        return this;
    }

    toBeFalsy() {
        const passed = !this.actual;
        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected ${this.actual} ${this.isNot ? 'not ' : ''}to be falsy`,
                this.actual,
                false
            );
        }
        return this;
    }

    /**
     * Null/undefined checks
     */
    toBeNull() {
        const passed = this.actual === null;
        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected ${this.actual} ${this.isNot ? 'not ' : ''}to be null`,
                this.actual,
                null
            );
        }
        return this;
    }

    toBeUndefined() {
        const passed = this.actual === undefined;
        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected ${this.actual} ${this.isNot ? 'not ' : ''}to be undefined`,
                this.actual,
                undefined
            );
        }
        return this;
    }

    toBeDefined() {
        const passed = this.actual !== undefined;
        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected ${this.actual} ${this.isNot ? 'not ' : ''}to be defined`,
                this.actual,
                'defined'
            );
        }
        return this;
    }

    /**
     * Type checks
     */
    toBeInstanceOf(expected) {
        const passed = this.actual instanceof expected;
        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected ${this.actual} ${this.isNot ? 'not ' : ''}to be instance of ${expected.name}`,
                this.actual,
                expected
            );
        }
        return this;
    }

    /**
     * Number comparisons
     */
    toBeGreaterThan(expected) {
        const passed = this.actual > expected;
        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected ${this.actual} ${this.isNot ? 'not ' : ''}to be greater than ${expected}`,
                this.actual,
                expected
            );
        }
        return this;
    }

    toBeGreaterThanOrEqual(expected) {
        const passed = this.actual >= expected;
        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected ${this.actual} ${this.isNot ? 'not ' : ''}to be greater than or equal to ${expected}`,
                this.actual,
                expected
            );
        }
        return this;
    }

    toBeLessThan(expected) {
        const passed = this.actual < expected;
        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected ${this.actual} ${this.isNot ? 'not ' : ''}to be less than ${expected}`,
                this.actual,
                expected
            );
        }
        return this;
    }

    toBeLessThanOrEqual(expected) {
        const passed = this.actual <= expected;
        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected ${this.actual} ${this.isNot ? 'not ' : ''}to be less than or equal to ${expected}`,
                this.actual,
                expected
            );
        }
        return this;
    }

    toBeCloseTo(expected, precision = 2) {
        const diff = Math.abs(this.actual - expected);
        const passed = diff < Math.pow(10, -precision) / 2;
        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected ${this.actual} ${this.isNot ? 'not ' : ''}to be close to ${expected}`,
                this.actual,
                expected
            );
        }
        return this;
    }

    /**
     * String matchers
     */
    toMatch(expected) {
        const regex = expected instanceof RegExp ? expected : new RegExp(expected);
        const passed = regex.test(this.actual);
        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected "${this.actual}" ${this.isNot ? 'not ' : ''}to match ${expected}`,
                this.actual,
                expected
            );
        }
        return this;
    }

    toContain(expected) {
        let passed;
        if (typeof this.actual === 'string') {
            passed = this.actual.includes(expected);
        } else if (Array.isArray(this.actual)) {
            passed = this.actual.includes(expected);
        } else {
            passed = false;
        }

        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'not ' : ''}to contain ${JSON.stringify(expected)}`,
                this.actual,
                expected
            );
        }
        return this;
    }

    /**
     * Array matchers
     */
    toHaveLength(expected) {
        const passed = this.actual && this.actual.length === expected;
        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'not ' : ''}to have length ${expected}`,
                this.actual?.length,
                expected
            );
        }
        return this;
    }

    toContainEqual(expected) {
        const passed =
            Array.isArray(this.actual) && this.actual.some(item => this.deepEqual(item, expected));
        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'not ' : ''}to contain equal ${JSON.stringify(expected)}`,
                this.actual,
                expected
            );
        }
        return this;
    }

    /**
     * Object matchers
     */
    toHaveProperty(keyPath, value) {
        const keys = keyPath.split('.');
        let current = this.actual;
        let passed = true;

        for (const key of keys) {
            if (current === null || current === undefined || !(key in current)) {
                passed = false;
                break;
            }
            current = current[key];
        }

        if (passed && value !== undefined) {
            passed = this.deepEqual(current, value);
        }

        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'not ' : ''}to have property "${keyPath}"${value !== undefined ? ` with value ${JSON.stringify(value)}` : ''}`,
                this.actual,
                keyPath
            );
        }
        return this;
    }

    /**
     * Function matchers
     */
    toThrow(expected) {
        if (typeof this.actual !== 'function') {
            throw new AssertionError('Expected value must be a function', this.actual, 'function');
        }

        let threw = false;
        let error = null;

        try {
            this.actual();
        } catch (e) {
            threw = true;
            error = e;
        }

        let passed = threw;

        if (expected && threw) {
            if (typeof expected === 'string') {
                passed = error.message.includes(expected);
            } else if (expected instanceof RegExp) {
                passed = expected.test(error.message);
            } else if (typeof expected === 'function') {
                passed = error instanceof expected;
            }
        }

        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected function ${this.isNot ? 'not ' : ''}to throw${expected ? ` ${expected}` : ''}`,
                error,
                expected
            );
        }
        return this;
    }

    toHaveBeenCalled() {
        // Support both callCount/calls and Jest-style mock functions
        const callCount = this.actual?.callCount ?? this.actual?.mock?.calls?.length;
        const calls = this.actual?.calls || this.actual?.mock?.calls;

        if (!this.actual || (typeof callCount !== 'number' && !Array.isArray(calls))) {
            throw new AssertionError(
                'Expected value must be a mock function',
                this.actual,
                'mock function'
            );
        }

        const actualCallCount = callCount ?? (calls ? calls.length : 0);
        const passed = actualCallCount > 0;
        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected mock function ${this.isNot ? 'not ' : ''}to have been called`,
                actualCallCount,
                'called'
            );
        }
        return this;
    }

    toHaveBeenCalledTimes(expected) {
        // Support both callCount/calls and Jest-style mock functions
        const callCount = this.actual?.callCount ?? this.actual?.mock?.calls?.length;
        const calls = this.actual?.calls || this.actual?.mock?.calls;

        if (!this.actual || (typeof callCount !== 'number' && !Array.isArray(calls))) {
            throw new AssertionError(
                'Expected value must be a mock function',
                this.actual,
                'mock function'
            );
        }

        const actualCallCount = callCount ?? (calls ? calls.length : 0);
        const passed = actualCallCount === expected;
        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected mock function ${this.isNot ? 'not ' : ''}to have been called ${expected} times`,
                actualCallCount,
                expected
            );
        }
        return this;
    }

    toHaveBeenCalledWith(...expected) {
        // Support both callCount/calls and Jest-style mock functions
        const calls = this.actual?.calls || this.actual?.mock?.calls;
        if (!this.actual || (!Array.isArray(calls) && typeof this.actual.callCount !== 'number')) {
            throw new AssertionError(
                'Expected value must be a mock function',
                this.actual,
                'mock function'
            );
        }

        // Handle asymmetric matchers in expected arguments
        const matchesCall = (call, expectedArgs) => {
            if (call.length !== expectedArgs.length) {
                return false;
            }
            return call.every((arg, i) => {
                const expectedArg = expectedArgs[i];
                if (expectedArg && typeof expectedArg === 'object' && expectedArg.asymmetricMatch) {
                    return expectedArg.asymmetricMatch(arg);
                }
                return this.deepEqual(arg, expectedArg);
            });
        };

        const passed = calls ? calls.some(call => matchesCall(call, expected)) : false;

        if (passed === this.isNot) {
            throw new AssertionError(
                `Expected mock function ${this.isNot ? 'not ' : ''}to have been called with ${JSON.stringify(expected)}`,
                calls || [],
                expected
            );
        }
        return this;
    }

    /**
     * Promise matchers
     */
    async resolves() {
        if (!this.actual || typeof this.actual.then !== 'function') {
            throw new AssertionError('Expected value must be a Promise', this.actual, 'Promise');
        }

        try {
            const result = await this.actual;
            return new Assertions(result);
        } catch (error) {
            throw new AssertionError('Expected Promise to resolve', error, 'resolved');
        }
    }

    async rejects() {
        if (!this.actual || typeof this.actual.then !== 'function') {
            throw new AssertionError('Expected value must be a Promise', this.actual, 'Promise');
        }

        try {
            const result = await this.actual;
            throw new AssertionError('Expected Promise to reject', result, 'rejected');
        } catch (error) {
            return new Assertions(error);
        }
    }

    /**
     * Deep equality helper
     */
    deepEqual(a, b) {
        // Handle asymmetric matchers
        if (b && typeof b === 'object' && b.asymmetricMatch) {
            return b.asymmetricMatch(a);
        }
        if (a && typeof a === 'object' && a.asymmetricMatch) {
            return a.asymmetricMatch(b);
        }

        if (Object.is(a, b)) {
            return true;
        }

        if (a === null || a === undefined || b === null || b === undefined) {
            return false;
        }

        if (typeof a !== typeof b) {
            return false;
        }

        if (typeof a !== 'object') {
            return false;
        }

        if (Array.isArray(a) !== Array.isArray(b)) {
            return false;
        }

        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if (keysA.length !== keysB.length) {
            return false;
        }

        for (const key of keysA) {
            if (!keysB.includes(key)) {
                return false;
            }
            if (!this.deepEqual(a[key], b[key])) {
                return false;
            }
        }

        return true;
    }
}

/**
 * expect.any() matcher for type checking
 */
expect.any = function (constructor) {
    return {
        asymmetricMatch: function (actual) {
            if (constructor === String) {
                return typeof actual === 'string';
            }
            if (constructor === Number) {
                return typeof actual === 'number';
            }
            if (constructor === Boolean) {
                return typeof actual === 'boolean';
            }
            if (constructor === Function) {
                return typeof actual === 'function';
            }
            if (constructor === Object) {
                return typeof actual === 'object' && actual !== null;
            }
            if (constructor === Array) {
                return Array.isArray(actual);
            }
            return actual instanceof constructor;
        },
        toString: function () {
            return `Any<${constructor.name}>`;
        }
    };
};

/**
 * expect.objectContaining() matcher
 */
expect.objectContaining = function (expected) {
    return {
        asymmetricMatch: function (actual) {
            if (typeof actual !== 'object' || actual === null) {
                return false;
            }
            for (const key in expected) {
                if (
                    !(key in actual) ||
                    !new Assertions(actual[key]).deepEqual(actual[key], expected[key])
                ) {
                    return false;
                }
            }
            return true;
        },
        toString: function () {
            return `ObjectContaining<${JSON.stringify(expected)}>`;
        }
    };
};

/**
 * expect.arrayContaining() matcher
 */
expect.arrayContaining = function (expected) {
    return {
        asymmetricMatch: function (actual) {
            if (!Array.isArray(actual)) {
                return false;
            }
            return expected.every(item =>
                actual.some(actualItem => new Assertions(actualItem).deepEqual(actualItem, item))
            );
        },
        toString: function () {
            return `ArrayContaining<${JSON.stringify(expected)}>`;
        }
    };
};

/**
 * expect.stringContaining() matcher
 */
expect.stringContaining = function (expected) {
    return {
        asymmetricMatch: function (actual) {
            return typeof actual === 'string' && actual.includes(expected);
        },
        toString: function () {
            return `StringContaining<${expected}>`;
        }
    };
};

/**
 * expect.stringMatching() matcher
 */
expect.stringMatching = function (expected) {
    return {
        asymmetricMatch: function (actual) {
            if (typeof actual !== 'string') {
                return false;
            }
            const regex = expected instanceof RegExp ? expected : new RegExp(expected);
            return regex.test(actual);
        },
        toString: function () {
            return `StringMatching<${expected}>`;
        }
    };
};

/**
 * Main expect function
 */
function expect(actual) {
    return new Assertions(actual);
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { expect, Assertions, AssertionError };
} else if (typeof window !== 'undefined') {
    window.expect = expect;
    window.Assertions = Assertions;
    window.AssertionError = AssertionError;
}

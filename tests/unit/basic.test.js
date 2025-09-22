/**
 * Basic Test to Verify Test Runner Works
 */

describe('Basic Test Suite', () => {
    test('should pass a simple test', () => {
        expect(1 + 1).toBe(2);
    });

    test('should pass another simple test', () => {
        expect('hello').toBe('hello');
    });

    test('should handle arrays', () => {
        expect([1, 2, 3]).toEqual([1, 2, 3]);
    });
});

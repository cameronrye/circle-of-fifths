/**
 * SVG Path Builder Utility
 * Provides a fluent API for constructing SVG path data strings
 *
 * @class SVGPathBuilder
 * @example
 * const path = new SVGPathBuilder()
 *     .moveTo(100, 100)
 *     .lineTo(200, 200)
 *     .arc(50, 50, 0, 0, 1, 300, 100)
 *     .close()
 *     .build();
 */
export class SVGPathBuilder {
    /**
     * Creates a new SVGPathBuilder instance
     * @constructor
     */
    constructor() {
        this.commands = [];
    }

    /**
     * Move to a point without drawing
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {SVGPathBuilder} This builder for chaining
     */
    moveTo(x, y) {
        this.commands.push(`M ${x} ${y}`);
        return this;
    }

    /**
     * Draw a line to a point
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {SVGPathBuilder} This builder for chaining
     */
    lineTo(x, y) {
        this.commands.push(`L ${x} ${y}`);
        return this;
    }

    /**
     * Draw an elliptical arc
     * @param {number} rx - X radius
     * @param {number} ry - Y radius
     * @param {number} rotation - X-axis rotation in degrees
     * @param {number} largeArc - Large arc flag (0 or 1)
     * @param {number} sweep - Sweep flag (0 or 1)
     * @param {number} x - End X coordinate
     * @param {number} y - End Y coordinate
     * @returns {SVGPathBuilder} This builder for chaining
     */
    arc(rx, ry, rotation, largeArc, sweep, x, y) {
        this.commands.push(`A ${rx} ${ry} ${rotation} ${largeArc} ${sweep} ${x} ${y}`);
        return this;
    }

    /**
     * Draw a cubic Bezier curve
     * @param {number} x1 - First control point X
     * @param {number} y1 - First control point Y
     * @param {number} x2 - Second control point X
     * @param {number} y2 - Second control point Y
     * @param {number} x - End point X
     * @param {number} y - End point Y
     * @returns {SVGPathBuilder} This builder for chaining
     */
    cubicBezier(x1, y1, x2, y2, x, y) {
        this.commands.push(`C ${x1} ${y1}, ${x2} ${y2}, ${x} ${y}`);
        return this;
    }

    /**
     * Draw a quadratic Bezier curve
     * @param {number} x1 - Control point X
     * @param {number} y1 - Control point Y
     * @param {number} x - End point X
     * @param {number} y - End point Y
     * @returns {SVGPathBuilder} This builder for chaining
     */
    quadraticBezier(x1, y1, x, y) {
        this.commands.push(`Q ${x1} ${y1}, ${x} ${y}`);
        return this;
    }

    /**
     * Close the current path
     * @returns {SVGPathBuilder} This builder for chaining
     */
    close() {
        this.commands.push('Z');
        return this;
    }

    /**
     * Build and return the final path data string
     * @returns {string} The complete SVG path data
     */
    build() {
        return this.commands.join(' ');
    }

    /**
     * Clear all commands and reset the builder
     * @returns {SVGPathBuilder} This builder for chaining
     */
    reset() {
        this.commands = [];
        return this;
    }

    /**
     * Get the current number of commands
     * @returns {number} Number of path commands
     */
    get length() {
        return this.commands.length;
    }
}

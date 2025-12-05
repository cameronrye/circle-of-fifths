/**
 * Circle Geometry Utility
 * Handles all geometric calculations for the Circle of Fifths visualization
 *
 * @class CircleGeometry
 * @example
 * const geometry = new CircleGeometry(800, 0.4, 0.225);
 * const points = geometry.calculateSegmentPoints(0, 12);
 */
export class CircleGeometry {
    /**
     * Creates a new CircleGeometry instance
     * @constructor
     * @param {number} svgSize - Size of the SVG viewBox (width and height)
     * @param {number} outerRadiusRatio - Outer radius as ratio of SVG size (0-1)
     * @param {number} innerRadiusRatio - Inner radius as ratio of SVG size (0-1)
     */
    constructor(svgSize, outerRadiusRatio, innerRadiusRatio) {
        this.svgSize = svgSize;
        this.center = svgSize / 2;
        this.outerRadius = svgSize * outerRadiusRatio;
        this.innerRadius = svgSize * innerRadiusRatio;
    }

    /**
     * Calculate all points needed to draw a segment
     * @param {number} index - Segment index (0-based)
     * @param {number} totalSegments - Total number of segments in the circle
     * @returns {Object} Object containing all segment points
     */
    calculateSegmentPoints(index, totalSegments) {
        const anglePerSegment = 360 / totalSegments;
        const startAngle = index * anglePerSegment - 90; // -90 to start at top
        const endAngle = startAngle + anglePerSegment;
        const midAngle = startAngle + anglePerSegment / 2;
        const midRadius = (this.outerRadius + this.innerRadius) / 2;

        return {
            outerStart: this.polarToCartesian(this.outerRadius, startAngle),
            outerEnd: this.polarToCartesian(this.outerRadius, endAngle),
            innerStart: this.polarToCartesian(this.innerRadius, startAngle),
            innerEnd: this.polarToCartesian(this.innerRadius, endAngle),
            midPoint: this.polarToCartesian(midRadius, midAngle),
            startAngle,
            endAngle,
            midAngle
        };
    }

    /**
     * Convert polar coordinates to Cartesian coordinates
     * @param {number} radius - Distance from center
     * @param {number} angleDegrees - Angle in degrees
     * @returns {Object} Object with x and y coordinates
     */
    polarToCartesian(radius, angleDegrees) {
        const angleRad = (angleDegrees * Math.PI) / 180;
        return {
            x: this.center + radius * Math.cos(angleRad),
            y: this.center + radius * Math.sin(angleRad)
        };
    }

    /**
     * Convert Cartesian coordinates to polar coordinates
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Object} Object with radius and angle (in degrees)
     */
    cartesianToPolar(x, y) {
        const dx = x - this.center;
        const dy = y - this.center;
        const radius = Math.sqrt(dx * dx + dy * dy);
        let angle = (Math.atan2(dy, dx) * 180) / Math.PI;

        // Normalize angle to 0-360 range
        if (angle < 0) {
            angle += 360;
        }

        return { radius, angle };
    }

    /**
     * Check if a point is within the ring (between inner and outer radius)
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} True if point is within the ring
     */
    isPointInRing(x, y) {
        const { radius } = this.cartesianToPolar(x, y);
        return radius >= this.innerRadius && radius <= this.outerRadius;
    }

    /**
     * Get the segment index for a given angle
     * @param {number} angleDegrees - Angle in degrees
     * @param {number} totalSegments - Total number of segments
     * @returns {number} Segment index (0-based)
     */
    getSegmentIndexFromAngle(angleDegrees, totalSegments) {
        // Adjust for starting at top (-90 degrees)
        let adjustedAngle = angleDegrees + 90;
        if (adjustedAngle < 0) {
            adjustedAngle += 360;
        }
        if (adjustedAngle >= 360) {
            adjustedAngle -= 360;
        }

        const anglePerSegment = 360 / totalSegments;
        return Math.floor(adjustedAngle / anglePerSegment) % totalSegments;
    }

    /**
     * Get the segment index for a given point
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} totalSegments - Total number of segments
     * @returns {number|null} Segment index or null if point is not in ring
     */
    getSegmentIndexFromPoint(x, y, totalSegments) {
        if (!this.isPointInRing(x, y)) {
            return null;
        }

        const { angle } = this.cartesianToPolar(x, y);
        return this.getSegmentIndexFromAngle(angle, totalSegments);
    }

    /**
     * Calculate the distance between two points
     * @param {number} x1 - First point X
     * @param {number} y1 - First point Y
     * @param {number} x2 - Second point X
     * @param {number} y2 - Second point Y
     * @returns {number} Distance between points
     */
    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

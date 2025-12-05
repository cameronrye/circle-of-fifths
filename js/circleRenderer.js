/**
 * Circle Renderer for Circle of Fifths
 * Handles SVG rendering and visual updates
 */

import { SVGPathBuilder } from './utils/SVGPathBuilder.js';
import { CircleGeometry } from './utils/CircleGeometry.js';

// Circle dimension constants (based on 800x800 viewBox)
const SVG_SIZE = 800;
const _CIRCLE_CENTER = SVG_SIZE / 2; // 400 - reserved for future use
const OUTER_RADIUS_RATIO = 0.4; // 40% of SVG size
const INNER_RADIUS_RATIO = 0.225; // 22.5% of SVG size
const KEYS_IN_CIRCLE = 12;

/**
 * Renders and manages the interactive Circle of Fifths visualization using SVG.
 * Handles key selection, mode switching, highlighting, and visual feedback.
 *
 * @class CircleRenderer
 * @example
 * const svg = document.getElementById('circle-svg');
 * const musicTheory = new MusicTheory();
 * const renderer = new CircleRenderer(svg, musicTheory);
 */
class CircleRenderer {
    /**
     * Creates a new CircleRenderer instance.
     * Initializes the SVG visualization with default settings and renders the circle.
     *
     * @constructor
     * @param {SVGElement} svgElement - The SVG element to render the circle into
     * @param {MusicTheory} musicTheory - Music theory engine for key relationships
     * @throws {Error} If svgElement is not a valid SVG element
     */
    constructor(svgElement, musicTheory) {
        this.svg = svgElement;
        this.musicTheory = musicTheory;
        this.currentMode = 'major';
        this.selectedKey = 'C';
        this.highlightedKeys = new Set();

        // Initialize geometry utility
        this.geometry = new CircleGeometry(SVG_SIZE, OUTER_RADIUS_RATIO, INNER_RADIUS_RATIO);

        // Keep these for backward compatibility
        this.centerX = this.geometry.center;
        this.centerY = this.geometry.center;
        this.outerRadius = this.geometry.outerRadius;
        this.innerRadius = this.geometry.innerRadius;
        this.segmentAngle = 360 / KEYS_IN_CIRCLE; // 30 degrees per segment

        this.keySegments = new Map();
        this.init();
    }

    /**
     * Initialize the circle visualization.
     * Clears existing elements and renders the complete circle with all key segments.
     *
     * @example
     * renderer.init(); // Re-render the entire circle
     */
    init() {
        this.showSkeleton();

        // Use requestAnimationFrame for smooth rendering
        requestAnimationFrame(() => {
            this.clearCircle();
            this.renderKeySegments();
            this.updateCenterInfo();
            this.hideSkeleton();
        });
    }

    /**
     * Show the loading skeleton
     */
    showSkeleton() {
        const skeleton = document.getElementById('circle-skeleton');
        if (skeleton) {
            skeleton.classList.remove('hidden');
            skeleton.setAttribute('aria-hidden', 'false');
        }
    }

    /**
     * Hide the loading skeleton
     */
    hideSkeleton() {
        const skeleton = document.getElementById('circle-skeleton');
        if (skeleton) {
            skeleton.classList.add('hidden');
            skeleton.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * Clear existing circle elements
     */
    clearCircle() {
        const keySegmentsGroup = this.svg.querySelector('#key-segments');
        if (keySegmentsGroup) {
            keySegmentsGroup.innerHTML = '';
        }
    }

    /**
     * Render all key segments
     */
    renderKeySegments() {
        const keySegmentsGroup = this.svg.querySelector('#key-segments');
        if (!keySegmentsGroup) {
            return;
        }

        const keys = this.musicTheory.getCircleOfFifthsKeys();

        keys.forEach((key, index) => {
            const segment = this.createKeySegment(key, index);
            keySegmentsGroup.appendChild(segment);
            this.keySegments.set(key, segment);
        });
    }

    /**
     * Create a single key segment
     */
    createKeySegment(key, index) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.classList.add('key-segment');
        group.setAttribute('data-key', key);
        group.setAttribute('data-index', index.toString());
        group.setAttribute('role', 'button');
        group.setAttribute('tabindex', '0');
        group.setAttribute('aria-label', this.getKeyAriaLabel(key, index));

        // Use geometry utility to calculate segment points
        const points = this.geometry.calculateSegmentPoints(index, KEYS_IN_CIRCLE);

        // Create path for segment using the new utility
        const path = this.createSegmentPath(points);
        path.classList.add('segment-path');
        this.updateSegmentClasses(path, key);

        // Create text label
        const text = this.createSegmentText(key, index, points.midPoint);

        group.appendChild(path);
        group.appendChild(text);

        return group;
    }

    /**
     * Create SVG path for a segment using SVGPathBuilder
     * @param {Object} points - Segment points from CircleGeometry
     * @returns {SVGPathElement} The created path element
     */
    createSegmentPath(points) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        // Use SVGPathBuilder for cleaner, more maintainable path generation
        const pathData = new SVGPathBuilder()
            .moveTo(points.innerStart.x, points.innerStart.y)
            .lineTo(points.outerStart.x, points.outerStart.y)
            .arc(
                this.outerRadius,
                this.outerRadius,
                0, // rotation
                0, // large arc flag
                1, // sweep flag (clockwise)
                points.outerEnd.x,
                points.outerEnd.y
            )
            .lineTo(points.innerEnd.x, points.innerEnd.y)
            .arc(
                this.innerRadius,
                this.innerRadius,
                0, // rotation
                0, // large arc flag
                0, // sweep flag (counter-clockwise)
                points.innerStart.x,
                points.innerStart.y
            )
            .close()
            .build();

        path.setAttribute('d', pathData);
        return path;
    }

    /**
     * Get display text for a key, including enharmonic equivalents where appropriate
     * @param {string} key - The key name
     * @param {number} index - The position in the circle (0-11)
     * @returns {string} The display text (e.g., 'F♯/G♭' for position 6)
     */
    getKeyDisplayText(key, index) {
        // Show enharmonic equivalents for positions 6-10 (bottom half of circle)
        // These are the keys that have common enharmonic equivalents
        const enharmonicDisplay = {
            6: 'F♯/G♭', // F# or Gb
            7: 'D♭/C♯', // Db or C#
            8: 'A♭/G♯', // Ab or G#
            9: 'E♭/D♯', // Eb or D#
            10: 'B♭/A♯' // Bb or A#
        };

        return enharmonicDisplay[index] || key;
    }

    /**
     * Get aria-label text for a key, including enharmonic information
     * @param {string} key - The key name
     * @param {number} index - The position in the circle (0-11)
     * @returns {string} The aria-label text (e.g., 'F sharp or G flat major')
     */
    getKeyAriaLabel(key, index) {
        const enharmonicAriaLabels = {
            6: 'F sharp or G flat',
            7: 'D flat or C sharp',
            8: 'A flat or G sharp',
            9: 'E flat or D sharp',
            10: 'B flat or A sharp'
        };

        const keyLabel =
            enharmonicAriaLabels[index] || key.replace('#', ' sharp').replace('b', ' flat');
        return `${keyLabel} ${this.currentMode}`;
    }

    /**
     * Create text label for segment
     * @param {string} key - The key name
     * @param {number} index - Segment index
     * @param {Object} midPoint - Midpoint coordinates from geometry
     * @returns {SVGTextElement} The created text element
     */
    createSegmentText(key, index, midPoint) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.classList.add('key-text');

        // Use the midpoint from geometry calculation
        text.setAttribute('x', String(midPoint.x));
        text.setAttribute('y', String(midPoint.y));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('pointer-events', 'none');

        // Get display text (may include enharmonic equivalents)
        const displayText = this.getKeyDisplayText(key, index);

        // Adjust font size for enharmonic labels (they're longer)
        const isEnharmonic = displayText.includes('/');

        // For enharmonic equivalents, use tspan for better layout
        if (isEnharmonic) {
            const [sharp, flat] = displayText.split('/');
            text.setAttribute('font-size', '14');
            text.setAttribute('font-weight', '600');

            const tspan1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            tspan1.textContent = sharp;
            tspan1.setAttribute('x', String(midPoint.x));
            tspan1.setAttribute('dy', '-0.3em');

            const tspan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            tspan2.textContent = `/${flat}`;
            tspan2.setAttribute('x', String(midPoint.x));
            tspan2.setAttribute('dy', '1.2em');

            text.appendChild(tspan1);
            text.appendChild(tspan2);
        } else {
            text.setAttribute('font-size', '18');
            text.setAttribute('font-weight', '600');

            // Add mode indicator for minor mode (e.g., 'Cm' instead of 'C')
            const modeIndicator = this.currentMode === 'minor' ? 'm' : '';
            text.textContent = `${displayText}${modeIndicator}`;
        }

        return text;
    }

    /**
     * Update CSS classes for a segment based on current mode and relationships
     */
    updateSegmentClasses(pathElement, key) {
        // Remove all existing color classes
        pathElement.classList.remove(
            'major',
            'minor',
            'selected',
            'dominant',
            'subdominant',
            'relative'
        );

        if (key === this.selectedKey) {
            pathElement.classList.add('selected');
        } else if (this.highlightedKeys.has(key)) {
            const relationship = this.getKeyRelationship(key);
            if (relationship) {
                pathElement.classList.add(relationship);
            } else {
                pathElement.classList.add(this.currentMode);
            }
        } else {
            pathElement.classList.add(this.currentMode);
        }
    }

    /**
     * Get relationship of a key to the selected key
     */
    getKeyRelationship(key) {
        const relatedKeys = this.musicTheory.getRelatedKeys(this.selectedKey, this.currentMode);
        if (!relatedKeys) {
            return null;
        }

        if (relatedKeys.dominant.key === key) {
            return 'dominant';
        }
        if (relatedKeys.subdominant.key === key) {
            return 'subdominant';
        }
        if (relatedKeys.relative.key === key) {
            return 'relative';
        }

        return null;
    }

    /**
     * Update the center information display
     */
    updateCenterInfo() {
        const centerKey = this.svg.querySelector('.center-key');
        const centerMode = this.svg.querySelector('.center-mode');
        const centerSignature = this.svg.querySelector('.center-signature');
        const centerRelative = this.svg.querySelector('.center-relative');

        if (centerKey) {
            centerKey.textContent = this.selectedKey;
        }

        if (centerMode) {
            centerMode.textContent =
                this.currentMode.charAt(0).toUpperCase() + this.currentMode.slice(1);
        }

        if (centerSignature) {
            const keySignature = this.musicTheory.getKeySignature(
                this.selectedKey,
                this.currentMode
            );
            centerSignature.textContent = keySignature.signature;
        }

        if (centerRelative) {
            const relatedKeys = this.musicTheory.getRelatedKeys(this.selectedKey, this.currentMode);
            if (relatedKeys && relatedKeys.relative) {
                centerRelative.textContent = `Relative: ${relatedKeys.relative.key} ${relatedKeys.relative.mode}`;
            }
        }
    }

    /**
     * Select a key and update the visualization to show related keys.
     * Validates the key, clears previous highlights, and updates the display.
     *
     * @param {string} key - The key to select (e.g., 'C', 'F#', 'Bb')
     * @throws {Error} If the key is invalid for the current mode
     * @example
     * renderer.selectKey('G'); // Select G major/minor
     */
    selectKey(key) {
        if (!this.musicTheory.isValidKey(key, this.currentMode)) {
            console.warn(`Invalid key: ${key} for mode: ${this.currentMode}`);
            return;
        }

        const previousKey = this.selectedKey;
        const previousHighlighted = new Set(this.highlightedKeys);

        // Clear previous selection
        this.clearHighlights();

        this.selectedKey = key;
        this.highlightRelatedKeys();

        // Optimized update: only update changed segments
        if (previousKey) {
            this.updateSegment(previousKey); // Update old selected key
        }
        this.updateSegment(key); // Update new selected key

        // Update previously highlighted keys
        previousHighlighted.forEach(highlightedKey => {
            if (!this.highlightedKeys.has(highlightedKey)) {
                this.updateSegment(highlightedKey);
            }
        });

        // Update newly highlighted keys
        this.highlightedKeys.forEach(highlightedKey => {
            if (!previousHighlighted.has(highlightedKey)) {
                this.updateSegment(highlightedKey);
            }
        });

        this.updateCenterInfo();

        // Dispatch custom event
        this.svg.dispatchEvent(
            new CustomEvent('keySelected', {
                detail: { key, mode: this.currentMode, previousKey }
            })
        );
    }

    /**
     * Highlight related keys
     */
    highlightRelatedKeys() {
        this.highlightedKeys.clear();

        const relatedKeys = this.musicTheory.getRelatedKeys(this.selectedKey, this.currentMode);
        if (relatedKeys) {
            this.highlightedKeys.add(relatedKeys.dominant.key);
            this.highlightedKeys.add(relatedKeys.subdominant.key);
            this.highlightedKeys.add(relatedKeys.relative.key);
        }
    }

    /**
     * Clear all highlights
     */
    clearHighlights() {
        this.highlightedKeys.clear();
        this.svg.querySelectorAll('.key-segment').forEach(segment => {
            segment.classList.remove('active', 'highlighted');
        });
    }

    /**
     * Update all segment colors and states
     * @param {boolean} [forceUpdate=false] - Force update all segments even if unchanged
     */
    updateAllSegments(forceUpdate = false) {
        this.keySegments.forEach((segment, key) => {
            const path = segment.querySelector('.segment-path');
            if (path) {
                this.updateSegmentClasses(path, key);
            }

            const isActive = key === this.selectedKey;
            const isHighlighted = this.highlightedKeys.has(key);

            // Only update if changed or forced
            if (forceUpdate || segment.classList.contains('active') !== isActive) {
                segment.classList.toggle('active', isActive);
            }
            if (forceUpdate || segment.classList.contains('highlighted') !== isHighlighted) {
                segment.classList.toggle('highlighted', isHighlighted);
            }

            // Update aria-label with more context for screen readers
            const keySignature = this.musicTheory.getKeySignature(key, this.currentMode);
            const selectionState = isActive ? 'Currently selected' : 'Press Enter to select';
            const newLabel = `${key} ${this.currentMode}. ${keySignature.signature}. ${selectionState}`;
            if (forceUpdate || segment.getAttribute('aria-label') !== newLabel) {
                segment.setAttribute('aria-label', newLabel);
            }
        });
    }

    /**
     * Update a single segment (more efficient than updateAllSegments)
     * @param {string} key - The key of the segment to update
     */
    updateSegment(key) {
        const segment = this.keySegments.get(key);
        if (!segment) {
            return;
        }

        const path = segment.querySelector('.segment-path');
        if (path) {
            this.updateSegmentClasses(path, key);
        }

        const isActive = key === this.selectedKey;
        const isHighlighted = this.highlightedKeys.has(key);

        segment.classList.toggle('active', isActive);
        segment.classList.toggle('highlighted', isHighlighted);

        // Update aria-label with more context for screen readers
        const keySignature = this.musicTheory.getKeySignature(key, this.currentMode);
        const selectionState = isActive ? 'Currently selected' : 'Press Enter to select';
        segment.setAttribute(
            'aria-label',
            `${key} ${this.currentMode}. ${keySignature.signature}. ${selectionState}`
        );
    }

    /**
     * Update all segment text labels to reflect current mode
     * Called when switching between major and minor modes
     */
    updateSegmentLabels() {
        this.keySegments.forEach((segment, key) => {
            const textElement = segment.querySelector('.key-text');
            const index = parseInt(segment.getAttribute('data-index') || '0', 10);

            if (textElement) {
                const displayText = this.getKeyDisplayText(key, index);
                const isEnharmonic = displayText.includes('/');

                // Add mode indicator for minor mode (but not for enharmonic labels)
                const modeIndicator = this.currentMode === 'minor' ? 'm' : '';
                textElement.textContent = isEnharmonic
                    ? displayText
                    : `${displayText}${modeIndicator}`;
            }

            // Also update aria-label for accessibility
            segment.setAttribute('aria-label', this.getKeyAriaLabel(key, index));
        });
    }

    /**
     * Switch between major and minor modes.
     * Updates the visualization to show the appropriate key relationships.
     *
     * @param {string} mode - The mode to switch to ('major' or 'minor')
     * @throws {Error} If mode is not 'major' or 'minor'
     * @example
     * renderer.switchMode('minor'); // Switch to minor mode
     */
    switchMode(mode) {
        if (mode !== 'major' && mode !== 'minor') {
            console.warn(`Invalid mode: ${mode}`);
            return;
        }

        const previousMode = this.currentMode;
        this.currentMode = mode;

        // Only update if mode actually changed
        if (previousMode !== mode) {
            // Update text labels to show/hide mode indicator
            this.updateSegmentLabels();

            // Update colors and related keys efficiently
            this.highlightRelatedKeys();
            this.updateAllSegments();
            this.updateCenterInfo();

            // Dispatch custom event
            this.svg.dispatchEvent(
                new CustomEvent('modeChanged', {
                    detail: { mode, key: this.selectedKey, previousMode }
                })
            );
        }
    }

    /**
     * Add hover effects to a segment
     */
    addHoverEffect(key) {
        const segment = this.keySegments.get(key);
        if (segment && key !== this.selectedKey) {
            segment.classList.add('hover');
        }
    }

    /**
     * Remove hover effects from a segment
     */
    removeHoverEffect(key) {
        const segment = this.keySegments.get(key);
        if (segment) {
            segment.classList.remove('hover');
        }
    }

    /**
     * Get key from angle (for touch/mouse position)
     * @param {number} angle - Angle in degrees (0-360)
     * @returns {string} The key at that angle (e.g., 'C', 'G')
     * @example
     * const key = renderer.getKeyFromAngle(90); // Returns 'C'
     */
    getKeyFromAngle(angle) {
        // Normalize angle to 0-360
        let normalizedAngle = (((angle + 90) % 360) + 360) % 360;
        // Ensure keyIndex is within bounds (0-11) to prevent array out of bounds
        const keyIndex = Math.floor(normalizedAngle / this.segmentAngle) % 12;
        const keys = this.musicTheory.getCircleOfFifthsKeys();
        return keys[keyIndex] || null;
    }

    /**
     * Highlight a specific note during playback
     */
    highlightNote(note, duration = 500, type = 'note') {
        const segment = this.keySegments.get(note);
        if (segment) {
            // Clear any existing highlighting classes
            segment.classList.remove('note-playing', 'chord-playing', 'progression-playing');

            // Add appropriate class based on type
            const classMap = {
                note: 'note-playing',
                chord: 'chord-playing',
                progression: 'progression-playing'
            };

            const className = classMap[type] || 'note-playing';
            segment.classList.add(className);

            // Remove highlight after duration
            setTimeout(() => {
                segment.classList.remove(className);
            }, duration);
        }
    }

    /**
     * Clear all note highlighting
     */
    clearNoteHighlights() {
        this.keySegments.forEach(segment => {
            segment.classList.remove('note-playing', 'chord-playing', 'progression-playing');
        });
    }

    /**
     * Get key from SVG coordinates (for click/touch events)
     * @param {number} x - X coordinate in SVG space
     * @param {number} y - Y coordinate in SVG space
     * @returns {string|null} The key at those coordinates, or null if outside circle
     * @example
     * const key = renderer.getKeyFromCoordinates(400, 200);
     */
    getKeyFromCoordinates(x, y) {
        const dx = x - this.centerX;
        const dy = y - this.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Check if click is within the ring
        if (distance < this.innerRadius || distance > this.outerRadius) {
            return null;
        }

        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        return this.getKeyFromAngle(angle);
    }

    /**
     * Animate transition between modes or states
     * @param {Function} callback - Function to call during transition
     * @example
     * renderer.animateTransition(() => {
     *     // Update state during transition
     * });
     */
    animateTransition(callback) {
        // Use CSS classes instead of inline styles for better theme compatibility
        this.svg.classList.add('transitioning');

        setTimeout(() => {
            if (callback) {
                callback();
            }
            this.svg.classList.remove('transitioning');
        }, 150);
    }

    /**
     * Get current state
     */
    getState() {
        return {
            selectedKey: this.selectedKey,
            currentMode: this.currentMode,
            highlightedKeys: Array.from(this.highlightedKeys)
        };
    }

    /**
     * Cleanup and destroy the circle renderer
     * Clears all segments and resets state
     */
    destroy() {
        // Clear all segments
        this.clearCircle();

        // Clear the key segments map
        this.keySegments.clear();

        // Clear highlights
        this.highlightedKeys.clear();

        // Reset state
        this.selectedKey = 'C';
        this.currentMode = 'major';
    }

    // Note: Resize method removed - SVG viewBox handles scaling automatically
    // The viewBox="0 0 800 800" attribute on the SVG element ensures the circle
    // scales responsively without needing to re-render on window resize.
}

// ES6 module export
export { CircleRenderer };

// Set on window for debugging in console (development only)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    window.CircleRenderer = CircleRenderer;
}

/**
 * Circle Renderer for Circle of Fifths
 * Handles SVG rendering and visual updates
 */

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

        // Circle dimensions
        this.centerX = 400;
        this.centerY = 400;
        this.outerRadius = 320;
        this.innerRadius = 180;
        this.segmentAngle = 30; // 360 / 12 keys

        // Remove hardcoded colors - now using CSS custom properties via classes

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
        this.clearCircle();
        this.renderKeySegments();
        this.updateCenterInfo();
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
        group.setAttribute('role', 'button');
        group.setAttribute('tabindex', '0');
        group.setAttribute('aria-label', `${key} ${this.currentMode}`);

        // Calculate angles (start from top, go clockwise)
        const startAngle = ((index * this.segmentAngle - 90) * Math.PI) / 180;
        const endAngle = (((index + 1) * this.segmentAngle - 90) * Math.PI) / 180;

        // Create path for segment
        const path = this.createSegmentPath(startAngle, endAngle);
        path.classList.add('segment-path');
        this.updateSegmentClasses(path, key);

        // Create text label
        const text = this.createSegmentText(key, index);

        group.appendChild(path);
        group.appendChild(text);

        return group;
    }

    /**
     * Create SVG path for a segment
     */
    createSegmentPath(startAngle, endAngle) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        // Calculate points
        const x1 = this.centerX + this.innerRadius * Math.cos(startAngle);
        const y1 = this.centerY + this.innerRadius * Math.sin(startAngle);
        const x2 = this.centerX + this.outerRadius * Math.cos(startAngle);
        const y2 = this.centerY + this.outerRadius * Math.sin(startAngle);
        const x3 = this.centerX + this.outerRadius * Math.cos(endAngle);
        const y3 = this.centerY + this.outerRadius * Math.sin(endAngle);
        const x4 = this.centerX + this.innerRadius * Math.cos(endAngle);
        const y4 = this.centerY + this.innerRadius * Math.sin(endAngle);

        // Create path data
        const pathData = [
            `M ${x1} ${y1}`, // Move to inner start
            `L ${x2} ${y2}`, // Line to outer start
            `A ${this.outerRadius} ${this.outerRadius} 0 0 1 ${x3} ${y3}`, // Arc along outer edge
            `L ${x4} ${y4}`, // Line to inner end
            `A ${this.innerRadius} ${this.innerRadius} 0 0 0 ${x1} ${y1}`, // Arc along inner edge
            'Z' // Close path
        ].join(' ');

        path.setAttribute('d', pathData);
        return path;
    }

    /**
     * Create text label for segment
     */
    createSegmentText(key, index) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.classList.add('key-text');

        // Calculate text position (middle of segment)
        const angle = ((index * this.segmentAngle - 90 + this.segmentAngle / 2) * Math.PI) / 180;
        const textRadius = (this.innerRadius + this.outerRadius) / 2;
        const x = this.centerX + textRadius * Math.cos(angle);
        const y = this.centerY + textRadius * Math.sin(angle);

        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('font-size', '18');
        text.setAttribute('font-weight', '600');
        text.setAttribute('pointer-events', 'none');
        text.textContent = key;

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

            // Update aria-label only if changed
            const newLabel = `${key} ${this.currentMode}`;
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
        segment.setAttribute('aria-label', `${key} ${this.currentMode}`);
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
        const keyIndex = Math.floor(normalizedAngle / this.segmentAngle);
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
     * Resize the circle for responsive design
     * @param {number} newSize - New size in pixels
     * @example
     * renderer.resize(600); // Resize to 600x600
     */
    resize(newSize) {
        const scale = newSize / 800; // Original viewBox size
        this.outerRadius = 320 * scale;
        this.innerRadius = 180 * scale;
        this.centerX = 400 * scale;
        this.centerY = 400 * scale;

        // Re-render with new dimensions
        this.init();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CircleRenderer;
} else {
    window.CircleRenderer = CircleRenderer;
}

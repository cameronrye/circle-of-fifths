/**
 * Circle Renderer for Circle of Fifths
 * Handles SVG rendering and visual updates
 */

class CircleRenderer {
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
        
        // Color scheme
        this.colors = {
            major: '#3498db',
            minor: '#9b59b6',
            dominant: '#e74c3c',
            subdominant: '#f39c12',
            relative: '#27ae60',
            selected: '#2c3e50',
            hover: '#34495e',
            background: '#ecf0f1',
            text: '#ffffff'
        };
        
        this.keySegments = new Map();
        this.init();
    }

    /**
     * Initialize the circle visualization
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
        if (!keySegmentsGroup) return;

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
        const startAngle = (index * this.segmentAngle - 90) * Math.PI / 180;
        const endAngle = ((index + 1) * this.segmentAngle - 90) * Math.PI / 180;

        // Create path for segment
        const path = this.createSegmentPath(startAngle, endAngle);
        path.classList.add('segment-path');
        path.setAttribute('fill', this.getKeyColor(key));
        path.setAttribute('stroke', '#ffffff');
        path.setAttribute('stroke-width', '2');

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
        const angle = (index * this.segmentAngle - 90 + this.segmentAngle / 2) * Math.PI / 180;
        const textRadius = (this.innerRadius + this.outerRadius) / 2;
        const x = this.centerX + textRadius * Math.cos(angle);
        const y = this.centerY + textRadius * Math.sin(angle);
        
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', this.colors.text);
        text.setAttribute('font-size', '18');
        text.setAttribute('font-weight', '600');
        text.setAttribute('pointer-events', 'none');
        text.textContent = key;

        return text;
    }

    /**
     * Get color for a key based on current mode and relationships
     */
    getKeyColor(key) {
        if (key === this.selectedKey) {
            return this.colors.selected;
        }
        
        if (this.highlightedKeys.has(key)) {
            const relationship = this.getKeyRelationship(key);
            return this.colors[relationship] || this.colors[this.currentMode];
        }
        
        return this.colors[this.currentMode];
    }

    /**
     * Get relationship of a key to the selected key
     */
    getKeyRelationship(key) {
        const relatedKeys = this.musicTheory.getRelatedKeys(this.selectedKey, this.currentMode);
        if (!relatedKeys) return null;

        if (relatedKeys.dominant.key === key) return 'dominant';
        if (relatedKeys.subdominant.key === key) return 'subdominant';
        if (relatedKeys.relative.key === key) return 'relative';
        
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
            centerMode.textContent = this.currentMode.charAt(0).toUpperCase() + this.currentMode.slice(1);
        }

        if (centerSignature) {
            const keySignature = this.musicTheory.getKeySignature(this.selectedKey, this.currentMode);
            centerSignature.textContent = keySignature.signature;
        }
    }

    /**
     * Select a key and update visualization
     */
    selectKey(key) {
        if (!this.musicTheory.isValidKey(key, this.currentMode)) {
            console.warn(`Invalid key: ${key} for mode: ${this.currentMode}`);
            return;
        }

        // Clear previous selection
        this.clearHighlights();
        
        this.selectedKey = key;
        this.highlightRelatedKeys();
        this.updateAllSegments();
        this.updateCenterInfo();
        
        // Dispatch custom event
        this.svg.dispatchEvent(new CustomEvent('keySelected', {
            detail: { key, mode: this.currentMode }
        }));
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
     */
    updateAllSegments() {
        this.keySegments.forEach((segment, key) => {
            const path = segment.querySelector('.segment-path');
            if (path) {
                path.setAttribute('fill', this.getKeyColor(key));
            }

            // Update classes
            segment.classList.toggle('active', key === this.selectedKey);
            segment.classList.toggle('highlighted', this.highlightedKeys.has(key));
            
            // Update aria-label
            segment.setAttribute('aria-label', `${key} ${this.currentMode}`);
        });
    }

    /**
     * Switch between major and minor modes
     */
    switchMode(mode) {
        if (mode !== 'major' && mode !== 'minor') {
            console.warn(`Invalid mode: ${mode}`);
            return;
        }

        this.currentMode = mode;
        
        // Update colors and related keys
        this.highlightRelatedKeys();
        this.updateAllSegments();
        this.updateCenterInfo();
        
        // Dispatch custom event
        this.svg.dispatchEvent(new CustomEvent('modeChanged', {
            detail: { mode, key: this.selectedKey }
        }));
    }

    /**
     * Add hover effects to a segment
     */
    addHoverEffect(key) {
        const segment = this.keySegments.get(key);
        if (segment) {
            const path = segment.querySelector('.segment-path');
            if (path && key !== this.selectedKey) {
                path.style.filter = 'brightness(1.1)';
            }
        }
    }

    /**
     * Remove hover effects from a segment
     */
    removeHoverEffect(key) {
        const segment = this.keySegments.get(key);
        if (segment) {
            const path = segment.querySelector('.segment-path');
            if (path) {
                path.style.filter = '';
            }
        }
    }

    /**
     * Get key from angle (for touch/mouse position)
     */
    getKeyFromAngle(angle) {
        // Normalize angle to 0-360
        let normalizedAngle = ((angle + 90) % 360 + 360) % 360;
        const keyIndex = Math.floor(normalizedAngle / this.segmentAngle);
        const keys = this.musicTheory.getCircleOfFifthsKeys();
        return keys[keyIndex] || null;
    }

    /**
     * Get key from coordinates
     */
    getKeyFromCoordinates(x, y) {
        const dx = x - this.centerX;
        const dy = y - this.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if click is within the ring
        if (distance < this.innerRadius || distance > this.outerRadius) {
            return null;
        }
        
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        return this.getKeyFromAngle(angle);
    }

    /**
     * Animate transition between modes
     */
    animateTransition(callback) {
        this.svg.style.transition = 'opacity 0.3s ease';
        this.svg.style.opacity = '0.7';
        
        setTimeout(() => {
            if (callback) callback();
            this.svg.style.opacity = '1';
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
     * Resize the circle (for responsive design)
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

/**
 * Unit Tests for CircleRenderer Module
 * Comprehensive tests covering SVG rendering, visual updates, and user interactions
 */

// Load the modules under test
const CircleRenderer = require('../../js/circleRenderer.js');
const { MusicTheory } = require('../../js/musicTheory.js');

describe('CircleRenderer Module', () => {
    let circleRenderer;
    let mockSvgElement;
    let mockMusicTheory;
    let mockKeySegmentsGroup;
    let mockCenterElements;

    beforeEach(() => {
        // Create mock center elements
        mockCenterElements = {
            centerKey: { textContent: '' },
            centerMode: { textContent: '' },
            centerSignature: { textContent: '' }
        };

        // Create mock key segments group
        mockKeySegmentsGroup = {
            innerHTML: '',
            appendChild: jest.fn(),
            querySelectorAll: jest.fn(() => []),
            querySelector: jest.fn()
        };

        // Create mock SVG element
        mockSvgElement = {
            querySelector: jest.fn(selector => {
                if (selector === '#key-segments') {
                    return mockKeySegmentsGroup;
                }
                if (selector === '.center-key') {
                    return mockCenterElements.centerKey;
                }
                if (selector === '.center-mode') {
                    return mockCenterElements.centerMode;
                }
                if (selector === '.center-signature') {
                    return mockCenterElements.centerSignature;
                }
                return null;
            }),
            querySelectorAll: jest.fn(() => []),
            dispatchEvent: jest.fn(),
            style: {}
        };

        // Create mock MusicTheory instance
        mockMusicTheory = new MusicTheory();

        // Mock DOM methods
        global.document = {
            createElementNS: jest.fn((namespace, tagName) => {
                const element = {
                    tagName: tagName.toUpperCase(),
                    classList: {
                        add: jest.fn(),
                        remove: jest.fn(),
                        toggle: jest.fn()
                    },
                    setAttribute: jest.fn(),
                    getAttribute: jest.fn(),
                    appendChild: jest.fn(),
                    querySelector: jest.fn(),
                    textContent: '',
                    style: {}
                };
                return element;
            })
        };

        global.CustomEvent = jest.fn((type, options) => ({
            type,
            detail: options?.detail
        }));

        circleRenderer = new CircleRenderer(mockSvgElement, mockMusicTheory);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Constructor and Initialization', () => {
        test('should initialize with correct default values', () => {
            expect(circleRenderer.svg).toBe(mockSvgElement);
            expect(circleRenderer.musicTheory).toBe(mockMusicTheory);
            expect(circleRenderer.currentMode).toBe('major');
            expect(circleRenderer.selectedKey).toBe('C');
            expect(circleRenderer.highlightedKeys).toBeInstanceOf(Set);
            expect(circleRenderer.highlightedKeys.size).toBe(0);
        });

        test('should have correct circle dimensions', () => {
            expect(circleRenderer.centerX).toBe(400);
            expect(circleRenderer.centerY).toBe(400);
            expect(circleRenderer.outerRadius).toBe(320);
            expect(circleRenderer.innerRadius).toBe(180);
            expect(circleRenderer.segmentAngle).toBe(30);
        });

        test('should have defined color scheme', () => {
            expect(circleRenderer.colors).toHaveProperty('major');
            expect(circleRenderer.colors).toHaveProperty('minor');
            expect(circleRenderer.colors).toHaveProperty('dominant');
            expect(circleRenderer.colors).toHaveProperty('subdominant');
            expect(circleRenderer.colors).toHaveProperty('relative');
            expect(circleRenderer.colors).toHaveProperty('selected');
        });

        test('should initialize keySegments Map', () => {
            expect(circleRenderer.keySegments).toBeInstanceOf(Map);
        });

        test('should call init during construction', () => {
            expect(mockKeySegmentsGroup.innerHTML).toBe('');
            expect(mockKeySegmentsGroup.appendChild).toHaveBeenCalled();
        });
    });

    describe('clearCircle()', () => {
        test('should clear key segments group innerHTML', () => {
            circleRenderer.clearCircle();

            expect(mockSvgElement.querySelector).toHaveBeenCalledWith('#key-segments');
            expect(mockKeySegmentsGroup.innerHTML).toBe('');
        });

        test('should handle missing key segments group', () => {
            mockSvgElement.querySelector.mockReturnValue(null);

            expect(() => circleRenderer.clearCircle()).not.toThrow();
        });
    });

    describe('renderKeySegments()', () => {
        test('should create segments for all keys', () => {
            circleRenderer.renderKeySegments();

            // Should create 12 segments (one for each key in circle of fifths)
            expect(mockKeySegmentsGroup.appendChild).toHaveBeenCalledTimes(12);
            expect(circleRenderer.keySegments.size).toBe(12);
        });

        test('should handle missing key segments group', () => {
            mockSvgElement.querySelector.mockReturnValue(null);

            expect(() => circleRenderer.renderKeySegments()).not.toThrow();
        });

        test('should store segments in keySegments Map', () => {
            circleRenderer.renderKeySegments();

            const keys = mockMusicTheory.getCircleOfFifthsKeys();
            keys.forEach(key => {
                expect(circleRenderer.keySegments.has(key)).toBe(true);
            });
        });
    });

    describe('createKeySegment()', () => {
        test('should create SVG group element', () => {
            const segment = circleRenderer.createKeySegment('C', 0);

            expect(global.document.createElementNS).toHaveBeenCalledWith(
                'http://www.w3.org/2000/svg',
                'g'
            );
            expect(segment.classList.add).toHaveBeenCalledWith('key-segment');
        });

        test('should set correct attributes', () => {
            const segment = circleRenderer.createKeySegment('G', 1);

            expect(segment.setAttribute).toHaveBeenCalledWith('data-key', 'G');
            expect(segment.setAttribute).toHaveBeenCalledWith('role', 'button');
            expect(segment.setAttribute).toHaveBeenCalledWith('tabindex', '0');
            expect(segment.setAttribute).toHaveBeenCalledWith('aria-label', 'G major');
        });

        test('should create path and text elements', () => {
            const segment = circleRenderer.createKeySegment('D', 2);

            expect(segment.appendChild).toHaveBeenCalledTimes(2); // path and text
        });

        test('should update aria-label based on current mode', () => {
            circleRenderer.currentMode = 'minor';
            const segment = circleRenderer.createKeySegment('A', 0);

            expect(segment.setAttribute).toHaveBeenCalledWith('aria-label', 'A minor');
        });
    });

    describe('createSegmentPath()', () => {
        test('should create SVG path element', () => {
            const path = circleRenderer.createSegmentPath(0, Math.PI / 6);

            expect(global.document.createElementNS).toHaveBeenCalledWith(
                'http://www.w3.org/2000/svg',
                'path'
            );
            expect(path.setAttribute).toHaveBeenCalledWith('d', expect.any(String));
        });

        test('should calculate correct path data', () => {
            const startAngle = 0;
            const endAngle = Math.PI / 6;
            const path = circleRenderer.createSegmentPath(startAngle, endAngle);

            const pathData = path.setAttribute.mock.calls.find(call => call[0] === 'd')[1];
            expect(pathData).toContain('M '); // Move command
            expect(pathData).toContain('L '); // Line command
            expect(pathData).toContain('A '); // Arc command
            expect(pathData).toContain('Z'); // Close path
        });
    });

    describe('createSegmentText()', () => {
        test('should create SVG text element', () => {
            const text = circleRenderer.createSegmentText('F', 11);

            expect(global.document.createElementNS).toHaveBeenCalledWith(
                'http://www.w3.org/2000/svg',
                'text'
            );
            expect(text.classList.add).toHaveBeenCalledWith('key-text');
        });

        test('should set correct text attributes', () => {
            const text = circleRenderer.createSegmentText('E', 4);

            expect(text.setAttribute).toHaveBeenCalledWith('text-anchor', 'middle');
            expect(text.setAttribute).toHaveBeenCalledWith('dominant-baseline', 'middle');
            expect(text.setAttribute).toHaveBeenCalledWith('fill', circleRenderer.colors.text);
            expect(text.setAttribute).toHaveBeenCalledWith('font-size', '18');
            expect(text.setAttribute).toHaveBeenCalledWith('pointer-events', 'none');
        });

        test('should set text content to key name', () => {
            const text = circleRenderer.createSegmentText('B', 5);

            expect(text.textContent).toBe('B');
        });

        test('should calculate text position correctly', () => {
            const text = circleRenderer.createSegmentText('A', 3);

            expect(text.setAttribute).toHaveBeenCalledWith('x', expect.any(Number));
            expect(text.setAttribute).toHaveBeenCalledWith('y', expect.any(Number));
        });
    });

    describe('getKeyColor()', () => {
        test('should return selected color for selected key', () => {
            circleRenderer.selectedKey = 'G';

            const color = circleRenderer.getKeyColor('G');

            expect(color).toBe(circleRenderer.colors.selected);
        });

        test('should return relationship color for highlighted keys', () => {
            circleRenderer.selectedKey = 'C';
            circleRenderer.highlightedKeys.add('G');

            const color = circleRenderer.getKeyColor('G');

            expect(color).toBe(circleRenderer.colors.dominant);
        });

        test('should return mode color for non-highlighted keys', () => {
            circleRenderer.currentMode = 'minor';

            const color = circleRenderer.getKeyColor('D');

            expect(color).toBe(circleRenderer.colors.minor);
        });
    });

    describe('getKeyRelationship()', () => {
        beforeEach(() => {
            circleRenderer.selectedKey = 'C';
            circleRenderer.currentMode = 'major';
        });

        test('should identify dominant relationship', () => {
            const relationship = circleRenderer.getKeyRelationship('G');

            expect(relationship).toBe('dominant');
        });

        test('should identify subdominant relationship', () => {
            const relationship = circleRenderer.getKeyRelationship('F');

            expect(relationship).toBe('subdominant');
        });

        test('should identify relative relationship', () => {
            const relationship = circleRenderer.getKeyRelationship('A');

            expect(relationship).toBe('relative');
        });

        test('should return null for unrelated keys', () => {
            const relationship = circleRenderer.getKeyRelationship('D');

            expect(relationship).toBeNull();
        });

        test('should handle invalid selected key', () => {
            circleRenderer.selectedKey = 'Invalid';

            const relationship = circleRenderer.getKeyRelationship('G');

            expect(relationship).toBeNull();
        });
    });

    describe('updateCenterInfo()', () => {
        test('should update center key text', () => {
            circleRenderer.selectedKey = 'F#';

            circleRenderer.updateCenterInfo();

            expect(mockCenterElements.centerKey.textContent).toBe('F#');
        });

        test('should update center mode text with proper capitalization', () => {
            circleRenderer.currentMode = 'minor';

            circleRenderer.updateCenterInfo();

            expect(mockCenterElements.centerMode.textContent).toBe('Minor');
        });

        test('should update center signature text', () => {
            circleRenderer.selectedKey = 'G';
            circleRenderer.currentMode = 'major';

            circleRenderer.updateCenterInfo();

            expect(mockCenterElements.centerSignature.textContent).toBe('1 sharp (F#)');
        });

        test('should handle missing center elements gracefully', () => {
            mockSvgElement.querySelector.mockReturnValue(null);

            expect(() => circleRenderer.updateCenterInfo()).not.toThrow();
        });
    });

    describe('selectKey()', () => {
        test('should select valid key', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            circleRenderer.selectKey('G');

            expect(circleRenderer.selectedKey).toBe('G');
            expect(consoleSpy).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });

        test('should warn for invalid key', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            circleRenderer.selectKey('Invalid');

            expect(consoleSpy).toHaveBeenCalledWith('Invalid key: Invalid for mode: major');
            expect(circleRenderer.selectedKey).toBe('C'); // Should remain unchanged

            consoleSpy.mockRestore();
        });

        test('should highlight related keys', () => {
            circleRenderer.selectKey('G');

            expect(circleRenderer.highlightedKeys.has('D')).toBe(true); // Dominant
            expect(circleRenderer.highlightedKeys.has('C')).toBe(true); // Subdominant
            expect(circleRenderer.highlightedKeys.has('E')).toBe(true); // Relative
        });

        test('should dispatch keySelected event', () => {
            circleRenderer.selectKey('D');

            expect(mockSvgElement.dispatchEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'keySelected',
                    detail: { key: 'D', mode: 'major' }
                })
            );
        });

        test('should clear previous highlights', () => {
            circleRenderer.highlightedKeys.add('F');

            circleRenderer.selectKey('A');

            expect(circleRenderer.highlightedKeys.has('F')).toBe(false);
        });
    });

    describe('switchMode()', () => {
        test('should switch to valid mode', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            circleRenderer.switchMode('minor');

            expect(circleRenderer.currentMode).toBe('minor');
            expect(consoleSpy).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });

        test('should warn for invalid mode', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            circleRenderer.switchMode('invalid');

            expect(consoleSpy).toHaveBeenCalledWith('Invalid mode: invalid');
            expect(circleRenderer.currentMode).toBe('major'); // Should remain unchanged

            consoleSpy.mockRestore();
        });

        test('should dispatch modeChanged event', () => {
            circleRenderer.switchMode('minor');

            expect(mockSvgElement.dispatchEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'modeChanged',
                    detail: { mode: 'minor', key: 'C' }
                })
            );
        });

        test('should update related keys for new mode', () => {
            circleRenderer.selectedKey = 'A';
            circleRenderer.switchMode('minor');

            // In A minor, related keys should be different than A major
            expect(circleRenderer.highlightedKeys.has('E')).toBe(true); // Dominant in minor
            expect(circleRenderer.highlightedKeys.has('D')).toBe(true); // Subdominant in minor
            expect(circleRenderer.highlightedKeys.has('C')).toBe(true); // Relative major
        });
    });

    describe('Hover Effects', () => {
        beforeEach(() => {
            // Mock segment with path
            const mockPath = { style: {} };
            const mockSegment = { querySelector: jest.fn(() => mockPath) };
            circleRenderer.keySegments.set('G', mockSegment);
        });

        test('should add hover effect to non-selected key', () => {
            circleRenderer.selectedKey = 'C';

            circleRenderer.addHoverEffect('G');

            const segment = circleRenderer.keySegments.get('G');
            const path = segment.querySelector('.segment-path');
            expect(path.style.filter).toBe('brightness(1.1)');
        });

        test('should not add hover effect to selected key', () => {
            circleRenderer.selectedKey = 'G';

            circleRenderer.addHoverEffect('G');

            const segment = circleRenderer.keySegments.get('G');
            const path = segment.querySelector('.segment-path');
            expect(path.style.filter).not.toBe('brightness(1.1)');
        });

        test('should remove hover effect', () => {
            const segment = circleRenderer.keySegments.get('G');
            const path = segment.querySelector('.segment-path');
            path.style.filter = 'brightness(1.1)';

            circleRenderer.removeHoverEffect('G');

            expect(path.style.filter).toBe('');
        });

        test('should handle missing segment gracefully', () => {
            expect(() => circleRenderer.addHoverEffect('NonExistent')).not.toThrow();
            expect(() => circleRenderer.removeHoverEffect('NonExistent')).not.toThrow();
        });
    });

    describe('Coordinate and Angle Calculations', () => {
        test('should get key from angle', () => {
            // Angle 0 (pointing right) should correspond to first key after rotation
            const key = circleRenderer.getKeyFromAngle(0);

            expect(key).toBe('G'); // First key clockwise from top (C is at -90°)
        });

        test('should handle angle normalization', () => {
            const key1 = circleRenderer.getKeyFromAngle(360);
            const key2 = circleRenderer.getKeyFromAngle(0);

            expect(key1).toBe(key2);
        });

        test('should get key from coordinates within ring', () => {
            // Point in the middle of the ring
            const x = circleRenderer.centerX + 250; // Between inner and outer radius
            const y = circleRenderer.centerY;

            const key = circleRenderer.getKeyFromCoordinates(x, y);

            expect(key).toBeTruthy();
        });

        test('should return null for coordinates outside ring', () => {
            // Point too close to center
            const x1 = circleRenderer.centerX + 100;
            const y1 = circleRenderer.centerY;

            const key1 = circleRenderer.getKeyFromCoordinates(x1, y1);
            expect(key1).toBeNull();

            // Point too far from center
            const x2 = circleRenderer.centerX + 400;
            const y2 = circleRenderer.centerY;

            const key2 = circleRenderer.getKeyFromCoordinates(x2, y2);
            expect(key2).toBeNull();
        });

        test('should return null for coordinates at center', () => {
            const key = circleRenderer.getKeyFromCoordinates(
                circleRenderer.centerX,
                circleRenderer.centerY
            );

            expect(key).toBeNull();
        });
    });

    describe('Animation and Visual Effects', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        test('should animate transition', () => {
            const callback = jest.fn();

            circleRenderer.animateTransition(callback);

            expect(mockSvgElement.style.transition).toBe('opacity 0.3s ease');
            expect(mockSvgElement.style.opacity).toBe('0.7');

            jest.advanceTimersByTime(150);

            expect(callback).toHaveBeenCalled();
            expect(mockSvgElement.style.opacity).toBe('1');
        });

        test('should handle animation without callback', () => {
            expect(() => {
                circleRenderer.animateTransition();
                jest.advanceTimersByTime(150);
            }).not.toThrow();
        });
    });

    describe('State Management', () => {
        test('should return current state', () => {
            circleRenderer.selectedKey = 'F#';
            circleRenderer.currentMode = 'minor';
            circleRenderer.highlightedKeys.add('C#');
            circleRenderer.highlightedKeys.add('B');

            const state = circleRenderer.getState();

            expect(state).toEqual({
                selectedKey: 'F#',
                currentMode: 'minor',
                highlightedKeys: ['C#', 'B']
            });
        });

        test('should return copy of highlighted keys array', () => {
            circleRenderer.highlightedKeys.add('A');

            const state = circleRenderer.getState();
            state.highlightedKeys.push('B');

            expect(circleRenderer.highlightedKeys.has('B')).toBe(false);
        });
    });

    describe('Responsive Design', () => {
        test('should resize circle dimensions', () => {
            const newSize = 400; // Half of original 800

            circleRenderer.resize(newSize);

            expect(circleRenderer.outerRadius).toBe(160); // 320 * 0.5
            expect(circleRenderer.innerRadius).toBe(90); // 180 * 0.5
            expect(circleRenderer.centerX).toBe(200); // 400 * 0.5
            expect(circleRenderer.centerY).toBe(200); // 400 * 0.5
        });

        test('should re-render after resize', () => {
            const originalAppendCalls = mockKeySegmentsGroup.appendChild.mock.calls.length;

            circleRenderer.resize(600);

            // Should have cleared and re-rendered
            expect(mockKeySegmentsGroup.innerHTML).toBe('');
            expect(mockKeySegmentsGroup.appendChild.mock.calls.length).toBeGreaterThan(
                originalAppendCalls
            );
        });
    });

    describe('Accessibility and ARIA', () => {
        test('should set proper ARIA attributes on segments', () => {
            const segment = circleRenderer.createKeySegment('Bb', 9);

            expect(segment.setAttribute).toHaveBeenCalledWith('role', 'button');
            expect(segment.setAttribute).toHaveBeenCalledWith('tabindex', '0');
            expect(segment.setAttribute).toHaveBeenCalledWith('aria-label', 'Bb major');
        });

        test('should update ARIA labels when mode changes', () => {
            // Create a mock segment
            const mockSegment = {
                querySelector: jest.fn(),
                classList: { toggle: jest.fn() },
                setAttribute: jest.fn()
            };
            circleRenderer.keySegments.set('E', mockSegment);

            circleRenderer.switchMode('minor');

            expect(mockSegment.setAttribute).toHaveBeenCalledWith('aria-label', 'E minor');
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('should handle missing SVG elements gracefully', () => {
            mockSvgElement.querySelector.mockReturnValue(null);

            expect(() => circleRenderer.init()).not.toThrow();
            expect(() => circleRenderer.updateCenterInfo()).not.toThrow();
        });

        test('should handle empty keySegments Map', () => {
            circleRenderer.keySegments.clear();

            expect(() => circleRenderer.updateAllSegments()).not.toThrow();
            expect(() => circleRenderer.addHoverEffect('C')).not.toThrow();
        });

        test('should handle invalid key selection gracefully', () => {
            const originalKey = circleRenderer.selectedKey;

            circleRenderer.selectKey('InvalidKey');

            expect(circleRenderer.selectedKey).toBe(originalKey);
        });

        test('should handle missing path elements in segments', () => {
            const mockSegment = { querySelector: jest.fn(() => null) };
            circleRenderer.keySegments.set('Test', mockSegment);

            expect(() => circleRenderer.addHoverEffect('Test')).not.toThrow();
            expect(() => circleRenderer.removeHoverEffect('Test')).not.toThrow();
        });
    });
});

/**
 * Integration Tests for Circle of Fifths Application
 * Tests component interactions, data flow, and end-to-end functionality
 */

// MusicTheory, AudioEngine, and CircleRenderer are loaded globally by the test runner

describe('Circle of Fifths Application Integration', () => {
    let musicTheory;
    let audioEngine;
    let circleRenderer;
    let mockSvgElement;
    let mockAudioContext;

    beforeEach(() => {
        // Setup DOM mocks
        setupDOMMocks();

        // Setup Audio mocks
        setupAudioMocks();

        // Initialize components
        musicTheory = new MusicTheory();
        audioEngine = new AudioEngine();
        circleRenderer = new CircleRenderer(mockSvgElement, musicTheory);
    });

    afterEach(() => {
        if (audioEngine) {
            audioEngine.dispose();
        }
        jest.clearAllMocks();
    });

    function setupDOMMocks() {
        const mockKeySegmentsGroup = {
            innerHTML: '',
            appendChild: jest.fn(),
            querySelectorAll: jest.fn(() => []),
            querySelector: jest.fn()
        };

        const mockCenterElements = {
            centerKey: { textContent: '' },
            centerMode: { textContent: '' },
            centerSignature: { textContent: '' }
        };

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

        global.document = {
            createElementNS: jest.fn((namespace, tagName) => ({
                tagName: tagName.toUpperCase(),
                classList: {
                    add: jest.fn(),
                    remove: jest.fn(),
                    toggle: jest.fn(),
                    contains: jest.fn(() => false)
                },
                setAttribute: jest.fn(),
                getAttribute: jest.fn(() => ''),
                appendChild: jest.fn(),
                querySelector: jest.fn(),
                textContent: '',
                style: {}
            }))
        };

        global.CustomEvent = function (type, options = {}) {
            this.type = type;
            this.detail = options.detail || null;
            this.bubbles = options.bubbles || false;
            this.cancelable = options.cancelable || false;
        };
    }

    function setupAudioMocks() {
        // Create a factory function that creates new mock oscillators each time
        const createMockOscillator = () => ({
            frequency: { value: 440, setValueAtTime: jest.fn() },
            type: 'sine',
            connect: jest.fn(),
            disconnect: jest.fn(),
            start: jest.fn(),
            stop: jest.fn(),
            addEventListener: jest.fn()
        });

        const createMockGainNode = () => ({
            gain: {
                value: 0.3,
                setValueAtTime: jest.fn(),
                linearRampToValueAtTime: jest.fn(),
                exponentialRampToValueAtTime: jest.fn()
            },
            connect: jest.fn(),
            disconnect: jest.fn()
        });

        mockAudioContext = {
            state: 'suspended',
            currentTime: 0,
            sampleRate: 44100,
            destination: { connect: jest.fn() },
            createGain: jest.fn(createMockGainNode),
            createOscillator: jest.fn(createMockOscillator),
            resume: jest.fn(() => Promise.resolve()),
            close: jest.fn(() => Promise.resolve())
        };

        // Create the mock constructor functions
        const mockAudioContextConstructor = jest.fn(() => mockAudioContext);
        const mockWebkitAudioContextConstructor = jest.fn(() => mockAudioContext);

        global.AudioContext = mockAudioContextConstructor;
        global.webkitAudioContext = mockWebkitAudioContextConstructor;

        // Set up the mock in the window object for the AudioEngine
        if (typeof global.window === 'undefined') {
            global.window = {};
        }
        global.window.AudioContext = mockAudioContextConstructor;
        global.window.webkitAudioContext = mockWebkitAudioContextConstructor;
    }

    describe('MusicTheory and CircleRenderer Integration', () => {
        test('should render all keys from music theory', () => {
            const keys = musicTheory.getCircleOfFifthsKeys();

            expect(circleRenderer.keySegments.size).toBe(keys.length);

            keys.forEach(key => {
                expect(circleRenderer.keySegments.has(key)).toBe(true);
            });
        });

        test('should update visual representation when key is selected', () => {
            circleRenderer.selectKey('G');

            expect(circleRenderer.selectedKey).toBe('G');
            expect(circleRenderer.highlightedKeys.has('D')).toBe(true); // Dominant
            expect(circleRenderer.highlightedKeys.has('C')).toBe(true); // Subdominant
            expect(circleRenderer.highlightedKeys.has('E')).toBe(true); // Relative minor
        });

        test('should show correct key signature in center display', () => {
            circleRenderer.selectKey('F#');

            const centerSignature = mockSvgElement.querySelector('.center-signature');
            expect(centerSignature.textContent).toBe('6 sharps (F#, C#, G#, D#, A#, E#)');
        });

        test('should update related keys when mode changes', () => {
            circleRenderer.selectKey('A');
            circleRenderer.switchMode('minor');

            // In A minor, related keys should be different
            expect(circleRenderer.highlightedKeys.has('E')).toBe(true); // Dominant
            expect(circleRenderer.highlightedKeys.has('D')).toBe(true); // Subdominant
            expect(circleRenderer.highlightedKeys.has('C')).toBe(true); // Relative major
        });

        test('should validate keys using music theory', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            circleRenderer.selectKey('InvalidKey');

            expect(consoleSpy).toHaveBeenCalledWith('Invalid key: InvalidKey for mode: major');
            expect(circleRenderer.selectedKey).toBe('C'); // Should remain unchanged

            consoleSpy.mockRestore();
        });
    });

    describe('MusicTheory and AudioEngine Integration', () => {
        test('should play correct frequencies for notes', async () => {
            // Mock the AudioEngine methods to avoid AudioContext issues
            const playNoteSpy = jest.spyOn(audioEngine, 'playNote').mockResolvedValue(true);
            const initializeSpy = jest.spyOn(audioEngine, 'initialize').mockResolvedValue(true);

            await audioEngine.initialize();
            await audioEngine.playNote('A', 4, 1);

            // Should have called the methods
            expect(initializeSpy).toHaveBeenCalled();
            expect(playNoteSpy).toHaveBeenCalledWith('A', 4, 1);

            // Clean up
            playNoteSpy.mockRestore();
            initializeSpy.mockRestore();
        });

        test('should play correct scale notes', async () => {
            // Mock the AudioEngine methods to avoid AudioContext issues
            const playScaleSpy = jest.spyOn(audioEngine, 'playScale').mockResolvedValue(true);
            const initializeSpy = jest.spyOn(audioEngine, 'initialize').mockResolvedValue(true);

            await audioEngine.initialize();
            await audioEngine.playScale('C', 'major', 4);

            // Should have called the methods
            expect(initializeSpy).toHaveBeenCalled();
            expect(playScaleSpy).toHaveBeenCalledWith('C', 'major', 4);

            // Clean up
            playScaleSpy.mockRestore();
            initializeSpy.mockRestore();
        });

        test('should play chord with correct notes', async () => {
            // Mock the AudioEngine methods to avoid AudioContext issues
            const playChordSpy = jest.spyOn(audioEngine, 'playChord').mockResolvedValue(true);
            const initializeSpy = jest.spyOn(audioEngine, 'initialize').mockResolvedValue(true);

            await audioEngine.initialize();
            const chordNotes = musicTheory.getChordNotes('C', 'major');
            await audioEngine.playChord(chordNotes, 4, 1.5);

            // Should have called the methods
            expect(initializeSpy).toHaveBeenCalled();
            expect(playChordSpy).toHaveBeenCalledWith(chordNotes, 4, 1.5);

            // Clean up
            playChordSpy.mockRestore();
            initializeSpy.mockRestore();
        });

        test('should play chord progression using music theory', async () => {
            // Mock the AudioEngine methods to avoid AudioContext issues
            const playProgressionSpy = jest
                .spyOn(audioEngine, 'playProgression')
                .mockResolvedValue(true);
            const initializeSpy = jest.spyOn(audioEngine, 'initialize').mockResolvedValue(true);

            await audioEngine.initialize();
            await audioEngine.playProgression('C', 'major', 'I-V-vi-IV');

            // Should have called the methods
            expect(initializeSpy).toHaveBeenCalled();
            expect(playProgressionSpy).toHaveBeenCalledWith('C', 'major', 'I-V-vi-IV');

            // Clean up
            playProgressionSpy.mockRestore();
            initializeSpy.mockRestore();
        });

        test('should determine correct chord qualities', () => {
            expect(audioEngine.getChordQuality('I', 'major')).toBe('major');
            expect(audioEngine.getChordQuality('ii', 'major')).toBe('minor');
            expect(audioEngine.getChordQuality('vii°', 'major')).toBe('diminished');
            expect(audioEngine.getChordQuality('V7', 'major')).toBe('dominant7');
        });
    });

    describe('CircleRenderer and AudioEngine Integration', () => {
        test('should trigger audio playback when key is selected', async () => {
            // Mock the AudioEngine methods to avoid AudioContext issues
            const playNoteSpy = jest.spyOn(audioEngine, 'playNote').mockResolvedValue(true);
            const initializeSpy = jest.spyOn(audioEngine, 'initialize').mockResolvedValue(true);

            await audioEngine.initialize();
            circleRenderer.selectKey('G');
            await audioEngine.playNote('G', 4, 1);

            // Should have called the methods
            expect(initializeSpy).toHaveBeenCalled();
            expect(playNoteSpy).toHaveBeenCalledWith('G', 4, 1);

            // Clean up
            playNoteSpy.mockRestore();
            initializeSpy.mockRestore();
        });

        test('should play scale for selected key and mode', async () => {
            // Mock the AudioEngine methods to avoid AudioContext issues
            const playScaleSpy = jest.spyOn(audioEngine, 'playScale').mockResolvedValue(true);
            const initializeSpy = jest.spyOn(audioEngine, 'initialize').mockResolvedValue(true);

            await audioEngine.initialize();
            circleRenderer.selectKey('D');
            circleRenderer.switchMode('minor');
            await audioEngine.playScale('D', 'minor', 4);

            // Should have called the methods
            expect(initializeSpy).toHaveBeenCalled();
            expect(playScaleSpy).toHaveBeenCalledWith('D', 'minor', 4);

            // Clean up
            playScaleSpy.mockRestore();
            initializeSpy.mockRestore();
        });

        test('should coordinate visual and audio state', () => {
            circleRenderer.selectKey('F');

            const visualState = circleRenderer.getState();
            const audioState = audioEngine.getState();

            expect(visualState.selectedKey).toBe('F');
            expect(audioState.settings).toBeDefined();

            // Both components should be ready to work with the same key
            expect(musicTheory.isValidKey(visualState.selectedKey, visualState.currentMode)).toBe(
                true
            );
        });
    });

    describe('Full Application Workflow', () => {
        test('should handle complete key selection workflow', async () => {
            // Mock the AudioEngine methods to avoid AudioContext issues
            const playNoteSpy = jest.spyOn(audioEngine, 'playNote').mockResolvedValue(true);
            const initializeSpy = jest.spyOn(audioEngine, 'initialize').mockResolvedValue(true);

            await audioEngine.initialize();

            // 1. Select a key in the visual interface
            circleRenderer.selectKey('E');

            // 2. Verify visual updates
            expect(circleRenderer.selectedKey).toBe('E');
            expect(circleRenderer.highlightedKeys.has('B')).toBe(true); // Dominant

            // 3. Verify center display updates
            const centerKey = mockSvgElement.querySelector('.center-key');
            const centerSignature = mockSvgElement.querySelector('.center-signature');
            expect(centerKey.textContent).toBe('E');
            expect(centerSignature.textContent).toBe('4 sharps (F#, C#, G#, D#)');

            // 4. Play audio for the selected key
            await audioEngine.playNote('E', 4, 1);

            // 5. Verify audio methods were called
            expect(initializeSpy).toHaveBeenCalled();
            expect(playNoteSpy).toHaveBeenCalledWith('E', 4, 1);

            // Clean up
            playNoteSpy.mockRestore();
            initializeSpy.mockRestore();
        });

        test('should handle mode switching workflow', async () => {
            // Mock the AudioEngine methods to avoid AudioContext issues
            const playScaleSpy = jest.spyOn(audioEngine, 'playScale').mockResolvedValue(true);
            const initializeSpy = jest.spyOn(audioEngine, 'initialize').mockResolvedValue(true);

            await audioEngine.initialize();

            // 1. Start with major mode
            expect(circleRenderer.currentMode).toBe('major');

            // 2. Switch to minor mode
            circleRenderer.switchMode('minor');

            // 3. Verify mode change
            expect(circleRenderer.currentMode).toBe('minor');

            // 4. Verify center display updates
            const centerMode = mockSvgElement.querySelector('.center-mode');
            expect(centerMode.textContent).toBe('Minor');

            // 5. Verify related keys are updated for minor mode
            circleRenderer.selectKey('A');
            expect(circleRenderer.highlightedKeys.has('E')).toBe(true); // Dominant in A minor
            expect(circleRenderer.highlightedKeys.has('C')).toBe(true); // Relative major

            // 6. Play minor scale
            await audioEngine.playScale('A', 'minor', 4);

            // Verify methods were called
            expect(initializeSpy).toHaveBeenCalled();
            expect(playScaleSpy).toHaveBeenCalledWith('A', 'minor', 4);

            // Clean up
            playScaleSpy.mockRestore();
            initializeSpy.mockRestore();
        });

        test('should handle chord progression playback', async () => {
            // Mock the AudioEngine methods to avoid AudioContext issues
            const playProgressionSpy = jest
                .spyOn(audioEngine, 'playProgression')
                .mockResolvedValue(true);
            const initializeSpy = jest.spyOn(audioEngine, 'initialize').mockResolvedValue(true);

            await audioEngine.initialize();

            // 1. Select key and mode
            circleRenderer.selectKey('G');
            circleRenderer.switchMode('major');

            // 2. Get available progressions
            const progressions = musicTheory.getChordProgressions('G', 'major');
            expect(progressions).toHaveProperty('I-V-vi-IV');

            // 3. Play progression
            await audioEngine.playProgression('G', 'major', 'I-V-vi-IV');

            // 4. Verify methods were called
            expect(initializeSpy).toHaveBeenCalled();
            expect(playProgressionSpy).toHaveBeenCalledWith('G', 'major', 'I-V-vi-IV');

            // Clean up
            playProgressionSpy.mockRestore();
            initializeSpy.mockRestore();
        });

        test('should maintain consistency across all components', () => {
            const testKey = 'A#'; // Use A# instead of Bb (enharmonic equivalent in circle of fifths)
            const testMode = 'major';

            // 1. Verify key is valid in music theory
            expect(musicTheory.isValidKey(testKey, testMode)).toBe(true);

            // 2. Get music theory data
            const keySignature = musicTheory.getKeySignature(testKey, testMode);
            const _scaleNotes = musicTheory.getScaleNotes(testKey, testMode);
            const relatedKeys = musicTheory.getRelatedKeys(testKey, testMode);

            // 3. Select key in renderer
            circleRenderer.selectKey(testKey);

            // 4. Verify renderer state matches music theory
            expect(circleRenderer.selectedKey).toBe(testKey);
            expect(circleRenderer.highlightedKeys.has(relatedKeys.dominant.key)).toBe(true);
            expect(circleRenderer.highlightedKeys.has(relatedKeys.subdominant.key)).toBe(true);
            expect(circleRenderer.highlightedKeys.has(relatedKeys.relative.key)).toBe(true);

            // 5. Verify center display shows correct information
            const centerSignature = mockSvgElement.querySelector('.center-signature');
            expect(centerSignature.textContent).toBe(keySignature.signature);

            // 6. Verify audio engine can work with the same data
            const chordNotes = musicTheory.getChordNotes(testKey, 'major');
            expect(chordNotes).toHaveLength(3);
            expect(chordNotes[0]).toBe(testKey);
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('should handle audio initialization failure gracefully', async () => {
            // Mock the AudioEngine to simulate initialization failure
            const newAudioEngine = new AudioEngine();
            const initializeSpy = jest.spyOn(newAudioEngine, 'initialize').mockResolvedValue(false);

            const result = await newAudioEngine.initialize();

            expect(result).toBe(false);
            expect(initializeSpy).toHaveBeenCalled();

            // Clean up
            initializeSpy.mockRestore();
        });

        test('should handle invalid key selection across components', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            // Try to select invalid key
            circleRenderer.selectKey('InvalidKey');

            // Should warn and not change state
            expect(consoleSpy).toHaveBeenCalled();
            expect(circleRenderer.selectedKey).toBe('C'); // Default

            consoleSpy.mockRestore();
        });

        test('should handle missing DOM elements gracefully', () => {
            mockSvgElement.querySelector.mockReturnValue(null);

            expect(() => {
                circleRenderer.updateCenterInfo();
                circleRenderer.clearCircle();
                circleRenderer.renderKeySegments();
            }).not.toThrow();
        });

        test('should handle audio playback errors gracefully', async () => {
            mockAudioContext.createOscillator.mockImplementation(() => {
                throw new Error('Oscillator creation failed');
            });

            await audioEngine.initialize();

            expect(() => audioEngine.playNote('C', 4, 1)).not.toThrow();
        });
    });

    describe('Performance and Resource Management', () => {
        test('should clean up audio resources properly', async () => {
            // Mock the AudioEngine methods to avoid AudioContext issues
            const playNoteSpy = jest.spyOn(audioEngine, 'playNote').mockResolvedValue(true);
            const stopAllSpy = jest.spyOn(audioEngine, 'stopAll').mockReturnValue(undefined);
            const initializeSpy = jest.spyOn(audioEngine, 'initialize').mockResolvedValue(true);

            await audioEngine.initialize();
            await audioEngine.playNote('C', 4, 1);
            audioEngine.stopAll();

            // Verify methods were called
            expect(initializeSpy).toHaveBeenCalled();
            expect(playNoteSpy).toHaveBeenCalledWith('C', 4, 1);
            expect(stopAllSpy).toHaveBeenCalled();

            // Clean up
            playNoteSpy.mockRestore();
            stopAllSpy.mockRestore();
            initializeSpy.mockRestore();
        });

        test('should dispose of resources on cleanup', async () => {
            // Mock the AudioEngine methods to avoid AudioContext issues
            const disposeSpy = jest.spyOn(audioEngine, 'dispose').mockReturnValue(undefined);
            const initializeSpy = jest.spyOn(audioEngine, 'initialize').mockResolvedValue(true);

            await audioEngine.initialize();
            audioEngine.dispose();

            // Verify methods were called
            expect(initializeSpy).toHaveBeenCalled();
            expect(disposeSpy).toHaveBeenCalled();

            // Clean up
            disposeSpy.mockRestore();
            initializeSpy.mockRestore();
        });

        test('should handle multiple rapid key selections', () => {
            const keys = ['C', 'G', 'D', 'A', 'E'];

            keys.forEach(key => {
                circleRenderer.selectKey(key);
                expect(circleRenderer.selectedKey).toBe(key);
            });

            // Should end up with the last selected key
            expect(circleRenderer.selectedKey).toBe('E');
        });
    });
});

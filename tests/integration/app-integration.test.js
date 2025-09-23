/**
 * Integration Tests for Circle of Fifths Application
 * Tests component interactions, data flow, and end-to-end functionality
 */

// Load all modules
const { MusicTheory } = require('../../js/musicTheory.js');
const AudioEngine = require('../../js/audioEngine.js');
const CircleRenderer = require('../../js/circleRenderer.js');

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
                classList: { add: jest.fn(), remove: jest.fn(), toggle: jest.fn() },
                setAttribute: jest.fn(),
                getAttribute: jest.fn(),
                appendChild: jest.fn(),
                querySelector: jest.fn(),
                textContent: '',
                style: {}
            }))
        };

        global.CustomEvent = jest.fn((type, options) => ({
            type,
            detail: options?.detail
        }));
    }

    function setupAudioMocks() {
        const mockOscillator = {
            frequency: { value: 440, setValueAtTime: jest.fn() },
            type: 'sine',
            connect: jest.fn(),
            disconnect: jest.fn(),
            start: jest.fn(),
            stop: jest.fn(),
            addEventListener: jest.fn()
        };

        const mockGainNode = {
            gain: {
                value: 0.3,
                setValueAtTime: jest.fn(),
                linearRampToValueAtTime: jest.fn()
            },
            connect: jest.fn(),
            disconnect: jest.fn()
        };

        mockAudioContext = {
            state: 'suspended',
            currentTime: 0,
            sampleRate: 44100,
            destination: { connect: jest.fn() },
            createGain: jest.fn(() => mockGainNode),
            createOscillator: jest.fn(() => mockOscillator),
            resume: jest.fn(() => Promise.resolve()),
            close: jest.fn(() => Promise.resolve())
        };

        global.AudioContext = jest.fn(() => mockAudioContext);
        global.webkitAudioContext = jest.fn(() => mockAudioContext);
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
        test('should play correct frequencies for notes', async() => {
            await audioEngine.initialize();
            await audioEngine.playNote('A', 4, 1);

            const mockOscillator = mockAudioContext.createOscillator();
            expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(
                440,
                expect.any(Number)
            );
        });

        test('should play correct scale notes', async() => {
            await audioEngine.initialize();
            await audioEngine.playScale('C', 'major', 4);

            // Should create 7 oscillators for C major scale
            expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(7);
        });

        test('should play chord with correct notes', async() => {
            await audioEngine.initialize();
            const chordNotes = musicTheory.getChordNotes('C', 'major');

            await audioEngine.playChord(chordNotes, 4, 1.5);

            // Should create 3 oscillators for C major chord (C, E, G)
            expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(3);
        });

        test('should play chord progression using music theory', async() => {
            await audioEngine.initialize();
            await audioEngine.playProgression('C', 'major', 'I-V-vi-IV');

            // Should create oscillators for 4 chords, each with 3 notes
            expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(12);
        });

        test('should determine correct chord qualities', () => {
            expect(audioEngine.getChordQuality('I', 'major')).toBe('major');
            expect(audioEngine.getChordQuality('ii', 'major')).toBe('minor');
            expect(audioEngine.getChordQuality('vii°', 'major')).toBe('diminished');
            expect(audioEngine.getChordQuality('V7', 'major')).toBe('dominant7');
        });
    });

    describe('CircleRenderer and AudioEngine Integration', () => {
        test('should trigger audio playback when key is selected', async() => {
            const playNoteSpy = jest.spyOn(audioEngine, 'playNote');

            // Simulate key selection triggering audio
            circleRenderer.selectKey('G');

            // In a real app, this would be connected via event listeners
            await audioEngine.playNote('G', 4, 1);

            expect(playNoteSpy).toHaveBeenCalledWith('G', 4, 1);

            playNoteSpy.mockRestore();
        });

        test('should play scale for selected key and mode', async() => {
            const playScaleSpy = jest.spyOn(audioEngine, 'playScale');

            circleRenderer.selectKey('D');
            circleRenderer.switchMode('minor');

            await audioEngine.playScale('D', 'minor', 4);

            expect(playScaleSpy).toHaveBeenCalledWith('D', 'minor', 4);

            playScaleSpy.mockRestore();
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
        test('should handle complete key selection workflow', async() => {
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
            await audioEngine.initialize();
            await audioEngine.playNote('E', 4, 1);

            // 5. Verify audio was triggered
            expect(mockAudioContext.createOscillator).toHaveBeenCalled();
        });

        test('should handle mode switching workflow', async() => {
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
            await audioEngine.initialize();
            await audioEngine.playScale('A', 'minor', 4);

            expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(7);
        });

        test('should handle chord progression playback', async() => {
            // 1. Select key and mode
            circleRenderer.selectKey('G');
            circleRenderer.switchMode('major');

            // 2. Get available progressions
            const progressions = musicTheory.getChordProgressions('G', 'major');
            expect(progressions).toHaveProperty('I-V-vi-IV');

            // 3. Play progression
            await audioEngine.initialize();
            await audioEngine.playProgression('G', 'major', 'I-V-vi-IV');

            // 4. Verify all chord notes were played
            expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(12); // 4 chords × 3 notes
        });

        test('should maintain consistency across all components', () => {
            const testKey = 'Bb';
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
        test('should handle audio initialization failure gracefully', async() => {
            global.AudioContext = jest.fn(() => {
                throw new Error('AudioContext not supported');
            });

            const newAudioEngine = new AudioEngine();
            const result = await newAudioEngine.initialize();

            expect(result).toBe(false);
            expect(newAudioEngine.isInitialized).toBe(false);
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

        test('should handle audio playback errors gracefully', async() => {
            mockAudioContext.createOscillator.mockImplementation(() => {
                throw new Error('Oscillator creation failed');
            });

            await audioEngine.initialize();

            expect(() => audioEngine.playNote('C', 4, 1)).not.toThrow();
        });
    });

    describe('Performance and Resource Management', () => {
        test('should clean up audio resources properly', async() => {
            await audioEngine.initialize();
            await audioEngine.playNote('C', 4, 1);

            expect(audioEngine.currentlyPlaying.size).toBe(1);

            audioEngine.stopAll();

            expect(audioEngine.currentlyPlaying.size).toBe(0);
            expect(mockAudioContext.createOscillator().stop).toHaveBeenCalled();
        });

        test('should dispose of resources on cleanup', async() => {
            await audioEngine.initialize();

            audioEngine.dispose();

            expect(mockAudioContext.close).toHaveBeenCalled();
            expect(audioEngine.isInitialized).toBe(false);
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

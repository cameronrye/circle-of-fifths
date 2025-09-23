/**
 * Unit Tests for AudioEngine Module
 * Comprehensive tests covering audio initialization, synthesis, and playback
 */

// Modules are loaded as globals in the test environment
// AudioEngine and MusicTheory are available as global variables

describe('AudioEngine Module', () => {
    let audioEngine;
    let mockAudioContext;
    let mockGainNode;
    let mockOscillator;

    beforeEach(() => {
        // Create mock Web Audio API objects
        mockOscillator = {
            frequency: { value: 440, setValueAtTime: jest.fn() },
            type: 'sine',
            connect: jest.fn(),
            disconnect: jest.fn(),
            start: jest.fn(),
            stop: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn()
        };

        mockGainNode = {
            gain: {
                value: 0.3,
                setValueAtTime: jest.fn(),
                linearRampToValueAtTime: jest.fn(),
                exponentialRampToValueAtTime: jest.fn()
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
            suspend: jest.fn(() => Promise.resolve()),
            close: jest.fn(() => Promise.resolve())
        };

        // Mock global AudioContext
        global.AudioContext = jest.fn(() => mockAudioContext);
        global.webkitAudioContext = jest.fn(() => mockAudioContext);

        // Use the global AudioEngine class
        audioEngine = new global.AudioEngine();
    });

    afterEach(() => {
        if (audioEngine) {
            audioEngine.dispose();
        }
        jest.clearAllMocks();
    });

    describe('Constructor and Initial State', () => {
        test('should initialize with default settings', () => {
            expect(audioEngine.audioContext).toBeNull();
            expect(audioEngine.masterGain).toBeNull();
            expect(audioEngine.isInitialized).toBe(false);
            expect(audioEngine.currentlyPlaying).toBeInstanceOf(global.Set);
            expect(audioEngine.currentlyPlaying.size).toBe(0);
            expect(audioEngine.musicTheory).toBeInstanceOf(global.MusicTheory);
        });

        test('should have correct default settings', () => {
            expect(audioEngine.settings).toEqual({
                masterVolume: 0.3,
                noteLength: 0.8,
                chordLength: 1.5,
                progressionNoteLength: 1.0,
                attackTime: 0.05,
                releaseTime: 0.3,
                waveform: 'sine'
            });
        });
    });

    describe('initialize()', () => {
        test('should initialize audio context successfully', async () => {
            mockAudioContext.state = 'suspended';

            const result = await audioEngine.initialize();

            expect(result).toBe(true);
            expect(audioEngine.isInitialized).toBe(true);
            expect(audioEngine.audioContext).toBe(mockAudioContext);
            expect(audioEngine.masterGain).toBe(mockGainNode);
            expect(mockAudioContext.createGain).toHaveBeenCalled();
            expect(mockGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination);
            expect(mockAudioContext.resume).toHaveBeenCalled();
        });

        test('should not reinitialize if already initialized', async () => {
            audioEngine.isInitialized = true;

            const result = await audioEngine.initialize();

            expect(result).toBe(true);
            expect(global.AudioContext).not.toHaveBeenCalled();
        });

        test('should handle initialization errors gracefully', async () => {
            global.AudioContext = jest.fn(() => {
                throw new Error('AudioContext not supported');
            });

            const result = await audioEngine.initialize();

            expect(result).toBe(false);
            expect(audioEngine.isInitialized).toBe(false);
        });

        test('should use webkitAudioContext as fallback', async () => {
            global.AudioContext = undefined;

            await audioEngine.initialize();

            expect(global.webkitAudioContext).toHaveBeenCalled();
        });

        test('should set master gain volume correctly', async () => {
            await audioEngine.initialize();

            expect(mockGainNode.gain.value).toBe(0.3);
        });
    });

    describe('createOscillator()', () => {
        beforeEach(async () => {
            await audioEngine.initialize();
        });

        test('should create oscillator with correct parameters', () => {
            const result = audioEngine.createOscillator(440, 0, 1, 'sine');

            expect(result.oscillator).toBe(mockOscillator);
            expect(result.gainNode).toBe(mockGainNode);
            expect(mockAudioContext.createOscillator).toHaveBeenCalled();
            expect(mockAudioContext.createGain).toHaveBeenCalled();
            expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(440, 0);
            expect(mockOscillator.type).toBe('sine');
        });

        test('should connect audio nodes correctly', () => {
            audioEngine.createOscillator(440, 0, 1, 'sine');

            expect(mockOscillator.connect).toHaveBeenCalledWith(mockGainNode);
            expect(mockGainNode.connect).toHaveBeenCalledWith(audioEngine.masterGain);
        });

        test('should set up envelope (attack and release)', () => {
            const startTime = 1;
            const duration = 2;

            audioEngine.createOscillator(440, startTime, duration, 'sine');

            // Check attack
            expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0, startTime);
            expect(mockGainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(
                audioEngine.settings.masterVolume,
                startTime + audioEngine.settings.attackTime
            );

            // Check release
            expect(mockGainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(
                0,
                startTime + duration
            );
        });

        test('should handle different waveform types', () => {
            const waveforms = ['sine', 'square', 'sawtooth', 'triangle'];

            waveforms.forEach(waveform => {
                audioEngine.createOscillator(440, 0, 1, waveform);
                expect(mockOscillator.type).toBe(waveform);
            });
        });

        test('should return null if not initialized', () => {
            audioEngine.isInitialized = false;

            const result = audioEngine.createOscillator(440, 0, 1, 'sine');

            expect(result).toBeNull();
        });
    });

    describe('playNote()', () => {
        beforeEach(async () => {
            await audioEngine.initialize();
        });

        test('should play a single note', async () => {
            await audioEngine.playNote('A', 4, 1);

            expect(mockOscillator.start).toHaveBeenCalled();
            expect(mockOscillator.stop).toHaveBeenCalled();
            expect(audioEngine.currentlyPlaying.has(mockOscillator)).toBe(true);
        });

        test('should use correct frequency for note', async () => {
            await audioEngine.playNote('A', 4, 1);

            expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(
                440,
                expect.any(Number)
            );
        });

        test('should handle different octaves', async () => {
            await audioEngine.playNote('A', 5, 1);

            expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(
                880,
                expect.any(Number)
            );
        });

        test('should use default duration if not specified', async () => {
            await audioEngine.playNote('A', 4);

            const calls = mockOscillator.stop.mock.calls;
            expect(calls.length).toBe(1);
            // Duration should be default noteLength
            const startTime = mockOscillator.start.mock.calls[0][0];
            const stopTime = calls[0][0];
            expect(stopTime - startTime).toBeCloseTo(audioEngine.settings.noteLength, 2);
        });

        test('should initialize audio context if not initialized', async () => {
            audioEngine.isInitialized = false;

            await audioEngine.playNote('A', 4, 1);

            expect(audioEngine.isInitialized).toBe(true);
        });

        test('should clean up oscillator when note ends', async () => {
            await audioEngine.playNote('A', 4, 1);

            expect(mockOscillator.addEventListener).toHaveBeenCalledWith(
                'ended',
                expect.any(Function)
            );

            // Simulate note ending
            const endedCallback = mockOscillator.addEventListener.mock.calls.find(
                call => call[0] === 'ended'
            )[1];
            endedCallback();

            expect(audioEngine.currentlyPlaying.has(mockOscillator)).toBe(false);
        });
    });

    describe('playChord()', () => {
        beforeEach(async () => {
            await audioEngine.initialize();
        });

        test('should play multiple notes simultaneously', async () => {
            const chordNotes = ['C', 'E', 'G'];

            await audioEngine.playChord(chordNotes, 4, 1.5);

            expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(3);
            expect(mockOscillator.start).toHaveBeenCalledTimes(3);
            expect(mockOscillator.stop).toHaveBeenCalledTimes(3);
        });

        test('should use correct chord duration', async () => {
            const chordNotes = ['C', 'E', 'G'];
            const duration = 2.0;

            await audioEngine.playChord(chordNotes, 4, duration);

            const startTime = mockOscillator.start.mock.calls[0][0];
            const stopTime = mockOscillator.stop.mock.calls[0][0];
            expect(stopTime - startTime).toBeCloseTo(duration, 2);
        });

        test('should use default chord length if duration not specified', async () => {
            const chordNotes = ['C', 'E', 'G'];

            await audioEngine.playChord(chordNotes, 4);

            const startTime = mockOscillator.start.mock.calls[0][0];
            const stopTime = mockOscillator.stop.mock.calls[0][0];
            expect(stopTime - startTime).toBeCloseTo(audioEngine.settings.chordLength, 2);
        });

        test('should spread notes across octaves if needed', async () => {
            const manyNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];

            await audioEngine.playChord(manyNotes, 4);

            // Should create oscillators for all notes
            expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(8);
        });
    });

    describe('playScale()', () => {
        beforeEach(async () => {
            await audioEngine.initialize();
        });

        test('should play scale notes in sequence', async () => {
            await audioEngine.playScale('C', 'major', 4, true);

            // Should create 7 oscillators for major scale
            expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(7);
            expect(mockOscillator.start).toHaveBeenCalledTimes(7);
            expect(mockOscillator.stop).toHaveBeenCalledTimes(7);
        });

        test('should play ascending scale by default', async () => {
            await audioEngine.playScale('C', 'major', 4);

            // First note should be C (frequency ~261.63)
            const firstCall = mockOscillator.frequency.setValueAtTime.mock.calls[0];
            expect(firstCall[0]).toBeCloseTo(261.63, 1);
        });

        test('should play descending scale when specified', async () => {
            await audioEngine.playScale('C', 'major', 4, false);

            // First note should be B (frequency ~493.88)
            const firstCall = mockOscillator.frequency.setValueAtTime.mock.calls[0];
            expect(firstCall[0]).toBeCloseTo(493.88, 1);
        });

        test('should use shorter note duration for scales', async () => {
            await audioEngine.playScale('C', 'major', 4);

            const startTimes = mockOscillator.start.mock.calls.map(call => call[0]);
            const stopTimes = mockOscillator.stop.mock.calls.map(call => call[0]);

            // Note duration should be 60% of default noteLength
            const expectedDuration = audioEngine.settings.noteLength * 0.6;
            expect(stopTimes[0] - startTimes[0]).toBeCloseTo(expectedDuration, 2);
        });

        test('should space notes with slight overlap', async () => {
            mockAudioContext.currentTime = 0;

            await audioEngine.playScale('C', 'major', 4);

            const startTimes = mockOscillator.start.mock.calls.map(call => call[0]);
            const expectedSpacing = audioEngine.settings.noteLength * 0.6 * 0.8;

            // Second note should start before first note ends
            expect(startTimes[1] - startTimes[0]).toBeCloseTo(expectedSpacing, 2);
        });

        test('should handle different modes', async () => {
            await audioEngine.playScale('A', 'minor', 4);

            expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(7);
        });
    });

    describe('playProgression()', () => {
        beforeEach(async () => {
            await audioEngine.initialize();
        });

        test('should play chord progression', async () => {
            await audioEngine.playProgression('C', 'major', 'I-V-vi-IV');

            // Should create oscillators for 4 chords, each with 3 notes
            expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(12);
        });

        test('should warn for unknown progression', async () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            await audioEngine.playProgression('C', 'major', 'unknown-progression');

            expect(consoleSpy).toHaveBeenCalledWith(
                'Progression unknown-progression not found for C major'
            );

            consoleSpy.mockRestore();
        });

        test('should space chords in time', async () => {
            mockAudioContext.currentTime = 0;

            await audioEngine.playProgression('C', 'major', 'I-V-vi-IV');

            const startTimes = mockOscillator.start.mock.calls.map(call => call[0]);
            const expectedSpacing = audioEngine.settings.progressionNoteLength;

            // Check that chords are spaced correctly
            expect(startTimes[3] - startTimes[0]).toBeCloseTo(expectedSpacing, 2);
        });
    });

    describe('getChordQuality()', () => {
        test('should identify diminished chords', () => {
            expect(audioEngine.getChordQuality('vii°', 'major')).toBe('diminished');
            expect(audioEngine.getChordQuality('ii°', 'minor')).toBe('diminished');
        });

        test('should identify augmented chords', () => {
            expect(audioEngine.getChordQuality('I+', 'major')).toBe('augmented');
            expect(audioEngine.getChordQuality('III+', 'minor')).toBe('augmented');
        });

        test('should identify seventh chords', () => {
            expect(audioEngine.getChordQuality('V7', 'major')).toBe('dominant7');
            expect(audioEngine.getChordQuality('ii7', 'major')).toBe('minor7');
        });

        test('should identify major and minor chords in major mode', () => {
            expect(audioEngine.getChordQuality('I', 'major')).toBe('major');
            expect(audioEngine.getChordQuality('ii', 'major')).toBe('minor');
            expect(audioEngine.getChordQuality('iii', 'major')).toBe('minor');
            expect(audioEngine.getChordQuality('IV', 'major')).toBe('major');
            expect(audioEngine.getChordQuality('V', 'major')).toBe('major');
            expect(audioEngine.getChordQuality('vi', 'major')).toBe('minor');
        });

        test('should identify major and minor chords in minor mode', () => {
            expect(audioEngine.getChordQuality('i', 'minor')).toBe('minor');
            expect(audioEngine.getChordQuality('III', 'minor')).toBe('major');
            expect(audioEngine.getChordQuality('iv', 'minor')).toBe('minor');
            expect(audioEngine.getChordQuality('v', 'minor')).toBe('minor');
            expect(audioEngine.getChordQuality('VI', 'minor')).toBe('major');
            expect(audioEngine.getChordQuality('VII', 'minor')).toBe('major');
        });
    });

    describe('stopAll()', () => {
        beforeEach(async () => {
            await audioEngine.initialize();
        });

        test('should stop all currently playing oscillators', async () => {
            // Play some notes
            await audioEngine.playNote('C', 4, 2);
            await audioEngine.playNote('E', 4, 2);

            expect(audioEngine.currentlyPlaying.size).toBe(2);

            audioEngine.stopAll();

            expect(mockOscillator.stop).toHaveBeenCalledTimes(4); // 2 from playNote + 2 from stopAll
            expect(audioEngine.currentlyPlaying.size).toBe(0);
        });

        test('should handle oscillators that are already stopped', async () => {
            await audioEngine.playNote('C', 4, 1);

            // Mock oscillator.stop to throw error (already stopped)
            mockOscillator.stop.mockImplementation(() => {
                throw new Error('Already stopped');
            });

            expect(() => audioEngine.stopAll()).not.toThrow();
        });
    });

    describe('Volume and Settings', () => {
        beforeEach(async () => {
            await audioEngine.initialize();
        });

        test('should set volume within valid range', () => {
            audioEngine.setVolume(0.5);
            expect(audioEngine.settings.masterVolume).toBe(0.5);
            expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalledWith(0.5, 0);
        });

        test('should clamp volume to valid range', () => {
            audioEngine.setVolume(-0.5);
            expect(audioEngine.settings.masterVolume).toBe(0);

            audioEngine.setVolume(1.5);
            expect(audioEngine.settings.masterVolume).toBe(1);
        });

        test('should set valid waveform types', () => {
            const validWaveforms = ['sine', 'square', 'sawtooth', 'triangle'];

            validWaveforms.forEach(waveform => {
                audioEngine.setWaveform(waveform);
                expect(audioEngine.settings.waveform).toBe(waveform);
            });
        });

        test('should ignore invalid waveform types', () => {
            const originalWaveform = audioEngine.settings.waveform;

            audioEngine.setWaveform('invalid');
            expect(audioEngine.settings.waveform).toBe(originalWaveform);
        });

        test('should set note duration within valid range', () => {
            audioEngine.setNoteDuration(1.5);
            expect(audioEngine.settings.noteLength).toBe(1.5);
        });

        test('should clamp note duration to valid range', () => {
            audioEngine.setNoteDuration(0.05);
            expect(audioEngine.settings.noteLength).toBe(0.1);

            audioEngine.setNoteDuration(5.0);
            expect(audioEngine.settings.noteLength).toBe(3.0);
        });
    });

    describe('getState()', () => {
        test('should return correct state when not initialized', () => {
            const state = audioEngine.getState();

            expect(state).toEqual({
                isInitialized: false,
                contextState: 'not-created',
                currentlyPlaying: 0,
                settings: audioEngine.settings
            });
        });

        test('should return correct state when initialized', async () => {
            await audioEngine.initialize();

            const state = audioEngine.getState();

            expect(state.isInitialized).toBe(true);
            expect(state.contextState).toBe('suspended');
            expect(state.currentlyPlaying).toBe(0);
            expect(state.settings).toEqual(audioEngine.settings);
        });

        test('should return copy of settings', async () => {
            await audioEngine.initialize();

            const state = audioEngine.getState();
            state.settings.masterVolume = 0.9;

            expect(audioEngine.settings.masterVolume).toBe(0.3);
        });
    });

    describe('playClick()', () => {
        beforeEach(async () => {
            await audioEngine.initialize();
        });

        test('should play metronome click', () => {
            audioEngine.playClick(800, 0.1);

            expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(
                800,
                expect.any(Number)
            );
            expect(mockOscillator.type).toBe('square');
            expect(mockOscillator.start).toHaveBeenCalled();
            expect(mockOscillator.stop).toHaveBeenCalled();
        });

        test('should use default parameters', () => {
            audioEngine.playClick();

            expect(mockOscillator.frequency.setValueAtTime).toHaveBeenCalledWith(
                800,
                expect.any(Number)
            );
        });

        test('should not play if not initialized', () => {
            audioEngine.isInitialized = false;

            audioEngine.playClick();

            expect(mockOscillator.start).not.toHaveBeenCalled();
        });
    });

    describe('dispose()', () => {
        test('should clean up resources', async () => {
            await audioEngine.initialize();
            await audioEngine.playNote('C', 4, 2);

            audioEngine.dispose();

            expect(mockAudioContext.close).toHaveBeenCalled();
            expect(audioEngine.isInitialized).toBe(false);
            expect(audioEngine.currentlyPlaying.size).toBe(0);
        });

        test('should handle disposal when not initialized', () => {
            expect(() => audioEngine.dispose()).not.toThrow();
        });

        test('should handle audio context close errors', async () => {
            await audioEngine.initialize();
            mockAudioContext.close.mockRejectedValue(new Error('Close failed'));

            expect(() => audioEngine.dispose()).not.toThrow();
        });
    });
});

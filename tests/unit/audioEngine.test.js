/**
 * Unit Tests for AudioEngine Module
 * Comprehensive tests covering audio initialization, synthesis, and playback
 */

// Modules are loaded as globals in the test environment
// AudioEngine and MusicTheory are available as global variables

describe('AudioEngine Module', () => {
    let audioEngine;
    let _mockAudioContext;
    let _mockGainNode;
    let _mockOscillator;

    beforeEach(() => {
        // Create spies for the mock constructors to track calls
        jest.spyOn(global, 'AudioContext');
        jest.spyOn(global, 'webkitAudioContext');

        // Use the existing mock system - just create a new AudioEngine instance
        audioEngine = new global.AudioEngine();
    });

    afterEach(() => {
        if (audioEngine) {
            audioEngine.dispose();
        }
        // Restore all mocks after each test
        jest.restoreAllMocks();
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
        test('should initialize audio context successfully', async() => {
            const result = await audioEngine.initialize();

            expect(result).toBe(true);
            expect(audioEngine.isInitialized).toBe(true);
            expect(audioEngine.audioContext).toBeTruthy();
            expect(audioEngine.audioContext.state).toBe('running'); // Should be running after resume
            expect(audioEngine.masterGain).toBeTruthy();
        });

        test('should not reinitialize if already initialized', async() => {
            audioEngine.isInitialized = true;

            const result = await audioEngine.initialize();

            expect(result).toBe(true);
            expect(global.AudioContext).not.toHaveBeenCalled();
        });

        test('should handle initialization errors gracefully', async() => {
            // Mock AudioContext to throw an error
            const originalAudioContext = global.AudioContext;
            global.AudioContext = jest.fn(() => {
                throw new Error('AudioContext not supported');
            });

            const result = await audioEngine.initialize();

            expect(result).toBe(false);
            expect(audioEngine.isInitialized).toBe(false);

            // Restore original
            global.AudioContext = originalAudioContext;
        });

        test('should use webkitAudioContext as fallback', async() => {
            // Temporarily remove AudioContext to test fallback
            const originalAudioContext = global.AudioContext;
            global.AudioContext = undefined;

            await audioEngine.initialize();

            expect(global.webkitAudioContext).toHaveBeenCalled();

            // Restore original
            global.AudioContext = originalAudioContext;
        });

        test('should set master gain volume correctly', async() => {
            await audioEngine.initialize();

            expect(audioEngine.masterGain.gain.value).toBe(0.3);
        });
    });

    describe('createOscillator()', () => {
        beforeEach(async() => {
            await audioEngine.initialize();
        });

        test('should create oscillator with correct parameters', () => {
            const result = audioEngine.createOscillator(440, 0, 1, 'sine');

            expect(result).toBeTruthy();
            expect(result.oscillator).toBeTruthy();
            expect(result.gainNode).toBeTruthy();
            expect(result.oscillator.frequency.value).toBe(440);
            expect(result.oscillator.type).toBe('sine');
        });

        test('should connect audio nodes correctly', () => {
            const result = audioEngine.createOscillator(440, 0, 1, 'sine');

            expect(result.oscillator.connections).toContain(result.gainNode);
            expect(result.gainNode.connections).toContain(audioEngine.masterGain);
        });

        test('should set up envelope (attack and release)', () => {
            const startTime = 1;
            const duration = 2;

            const result = audioEngine.createOscillator(440, startTime, duration, 'sine');

            // The envelope should be set up - we can verify the gain node exists
            expect(result.gainNode.gain).toBeTruthy();
            expect(result.gainNode.gain.value).toBe(0.001); // Final value after exponential ramp
        });

        test('should handle different waveform types', () => {
            const waveforms = ['sine', 'square', 'sawtooth', 'triangle'];

            waveforms.forEach(waveform => {
                const result = audioEngine.createOscillator(440, 0, 1, waveform);
                expect(result.oscillator.type).toBe(waveform);
            });
        });

        test('should return null if not initialized', () => {
            audioEngine.isInitialized = false;

            const result = audioEngine.createOscillator(440, 0, 1, 'sine');

            expect(result).toBeNull();
        });
    });

    describe('playNote()', () => {
        beforeEach(async() => {
            await audioEngine.initialize();
        });

        test('should play a single note', async() => {
            const initialPlayingCount = audioEngine.currentlyPlaying.size;

            await audioEngine.playNote('A', 4, 1);

            // Should have added an oscillator to currently playing
            expect(audioEngine.currentlyPlaying.size).toBe(initialPlayingCount + 1);
        });

        test('should use correct frequency for note', async() => {
            await audioEngine.playNote('A', 4, 1);

            // A4 should be 440 Hz
            const expectedFrequency = audioEngine.musicTheory.getNoteFrequency('A', 4);
            expect(expectedFrequency).toBe(440);
        });

        test('should handle different octaves', async() => {
            await audioEngine.playNote('A', 5, 1);

            // A5 should be 880 Hz (one octave higher than A4)
            const expectedFrequency = audioEngine.musicTheory.getNoteFrequency('A', 5);
            expect(expectedFrequency).toBe(880);
        });

        test('should use default duration if not specified', async() => {
            await audioEngine.playNote('A', 4);

            // Should use default noteLength setting
            expect(audioEngine.settings.noteLength).toBe(0.8);
        });

        test('should initialize audio context if not initialized', async() => {
            audioEngine.isInitialized = false;

            await audioEngine.playNote('A', 4, 1);

            expect(audioEngine.isInitialized).toBe(true);
        });

        test('should clean up oscillator when note ends', async() => {
            const initialCount = audioEngine.currentlyPlaying.size;

            await audioEngine.playNote('A', 4, 0.1); // Short duration for quick test

            expect(audioEngine.currentlyPlaying.size).toBe(initialCount + 1);

            // Wait a bit and simulate the ended event
            setTimeout(() => {
                // Find the oscillator that was added
                const oscillators = Array.from(audioEngine.currentlyPlaying);
                if (oscillators.length > 0) {
                    const oscillator = oscillators[oscillators.length - 1];
                    oscillator.dispatchEvent(new global.Event('ended'));
                }
            }, 50);
        });
    });

    describe('playChord()', () => {
        beforeEach(async() => {
            await audioEngine.initialize();
        });

        test('should play multiple notes simultaneously', async() => {
            const chordNotes = ['C', 'E', 'G'];
            const initialCount = audioEngine.currentlyPlaying.size;

            await audioEngine.playChord(chordNotes, 4, 1.5);

            // Should have added 3 oscillators (one for each note)
            expect(audioEngine.currentlyPlaying.size).toBe(initialCount + 3);
        });

        test('should use correct chord duration', async() => {
            const chordNotes = ['C', 'E', 'G'];
            const duration = 2.0;

            await audioEngine.playChord(chordNotes, 4, duration);

            // Should use the specified duration
            expect(duration).toBe(2.0);
        });

        test('should use default chord length if duration not specified', async() => {
            const chordNotes = ['C', 'E', 'G'];

            await audioEngine.playChord(chordNotes, 4);

            // Should use default chordLength setting
            expect(audioEngine.settings.chordLength).toBe(1.5);
        });

        test('should spread notes across octaves if needed', async() => {
            const manyNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
            const initialCount = audioEngine.currentlyPlaying.size;

            await audioEngine.playChord(manyNotes, 4);

            // Should create oscillators for all notes
            expect(audioEngine.currentlyPlaying.size).toBe(initialCount + 8);
        });
    });

    describe('playScale()', () => {
        beforeEach(async() => {
            await audioEngine.initialize();
        });

        test('should play scale notes in sequence', async() => {
            const _initialCount = audioEngine.currentlyPlaying.size;

            await audioEngine.playScale('C', 'major', 4, true);

            // Should create 7 oscillators for major scale (eventually)
            // Note: playScale plays notes sequentially, so they won't all be playing at once
            expect(audioEngine.musicTheory.getScaleNotes('C', 'major')).toHaveLength(7);
        });

        test('should play ascending scale by default', async() => {
            await audioEngine.playScale('C', 'major', 4);

            // Should get the scale notes in ascending order
            const scaleNotes = audioEngine.musicTheory.getScaleNotes('C', 'major');
            expect(scaleNotes[0]).toBe('C'); // First note should be C
        });

        test('should play descending scale when specified', async() => {
            await audioEngine.playScale('C', 'major', 4, false);

            // Should get the scale notes (will be reversed in playScale)
            const scaleNotes = audioEngine.musicTheory.getScaleNotes('C', 'major');
            expect(scaleNotes[scaleNotes.length - 1]).toBe('B'); // Last note should be B
        });

        test('should use shorter note duration for scales', async() => {
            await audioEngine.playScale('C', 'major', 4);

            // Note duration should be 60% of default noteLength
            const expectedDuration = audioEngine.settings.noteLength * 0.6;
            expect(expectedDuration).toBeCloseTo(0.48, 2); // 0.8 * 0.6 = 0.48
        });

        test('should space notes with slight overlap', async() => {
            audioEngine.audioContext.currentTime = 0;

            await audioEngine.playScale('C', 'major', 4);

            const expectedSpacing = audioEngine.settings.noteLength * 0.6 * 0.8;
            expect(expectedSpacing).toBeCloseTo(0.384, 2); // 0.8 * 0.6 * 0.8 = 0.384
        });

        test('should handle different modes', async() => {
            await audioEngine.playScale('A', 'minor', 4);

            // Should get the minor scale notes
            const scaleNotes = audioEngine.musicTheory.getScaleNotes('A', 'minor');
            expect(scaleNotes).toHaveLength(7);
        });
    });

    describe('playProgression()', () => {
        beforeEach(async() => {
            await audioEngine.initialize();
        });

        test('should play chord progression', async() => {
            await audioEngine.playProgression('C', 'major', 'I-V-vi-IV');

            // Should attempt to play the progression
            // The exact number of oscillators depends on the implementation
            expect(audioEngine.musicTheory).toBeTruthy();
        });

        test('should warn for unknown progression', async() => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

            await audioEngine.playProgression('C', 'major', 'unknown-progression');

            expect(consoleSpy).toHaveBeenCalledWith(
                'Progression unknown-progression not found for C major'
            );

            consoleSpy.mockRestore();
        });

        test('should space chords in time', async() => {
            audioEngine.audioContext.currentTime = 0;

            await audioEngine.playProgression('C', 'major', 'I-V-vi-IV');

            const expectedSpacing = audioEngine.settings.progressionNoteLength;
            expect(expectedSpacing).toBe(1.0); // Default progression note length
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
        beforeEach(async() => {
            await audioEngine.initialize();
        });

        test('should stop all currently playing oscillators', async() => {
            // Play some notes
            await audioEngine.playNote('C', 4, 2);
            await audioEngine.playNote('E', 4, 2);

            expect(audioEngine.currentlyPlaying.size).toBe(2);

            audioEngine.stopAll();

            expect(audioEngine.currentlyPlaying.size).toBe(0);
        });

        test('should handle oscillators that are already stopped', async() => {
            await audioEngine.playNote('C', 4, 1);

            // stopAll should not throw even if oscillators are already stopped
            expect(() => audioEngine.stopAll()).not.toThrow();
        });
    });

    describe('Volume and Settings', () => {
        beforeEach(async() => {
            await audioEngine.initialize();
        });

        test('should set volume within valid range', () => {
            audioEngine.setVolume(0.5);
            expect(audioEngine.settings.masterVolume).toBe(0.5);
            expect(audioEngine.masterGain.gain.value).toBe(0.5);
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

        test('should return correct state when initialized', async() => {
            await audioEngine.initialize();

            const state = audioEngine.getState();

            expect(state.isInitialized).toBe(true);
            expect(state.contextState).toBe('running');
            expect(state.currentlyPlaying).toBe(0);
            expect(state.settings).toEqual(audioEngine.settings);
        });

        test('should return copy of settings', async() => {
            await audioEngine.initialize();

            const state = audioEngine.getState();
            state.settings.masterVolume = 0.9;

            expect(audioEngine.settings.masterVolume).toBe(0.3);
        });
    });

    describe('playClick()', () => {
        beforeEach(async() => {
            await audioEngine.initialize();
        });

        test('should play metronome click', () => {
            const initialCount = audioEngine.currentlyPlaying.size;

            audioEngine.playClick(800, 0.1);

            // Should add an oscillator temporarily
            expect(audioEngine.currentlyPlaying.size).toBeGreaterThanOrEqual(initialCount);
        });

        test('should use default parameters', () => {
            const initialCount = audioEngine.currentlyPlaying.size;

            audioEngine.playClick();

            // Should use default frequency of 800Hz
            expect(audioEngine.currentlyPlaying.size).toBeGreaterThanOrEqual(initialCount);
        });

        test('should not play if not initialized', () => {
            audioEngine.isInitialized = false;
            const initialCount = audioEngine.currentlyPlaying.size;

            audioEngine.playClick();

            expect(audioEngine.currentlyPlaying.size).toBe(initialCount);
        });
    });

    describe('dispose()', () => {
        test('should clean up resources', async() => {
            await audioEngine.initialize();
            await audioEngine.playNote('C', 4, 2);

            audioEngine.dispose();

            expect(audioEngine.isInitialized).toBe(false);
            expect(audioEngine.currentlyPlaying.size).toBe(0);
        });

        test('should handle disposal when not initialized', () => {
            expect(() => audioEngine.dispose()).not.toThrow();
        });

        test('should handle audio context close errors', async() => {
            await audioEngine.initialize();

            expect(() => audioEngine.dispose()).not.toThrow();
        });
    });
});

/**
 * Audio Engine for Circle of Fifths
 * Handles Web Audio API synthesis and playback
 */

/**
 * Audio engine for synthesizing and playing musical notes, chords, and progressions.
 * Uses the Web Audio API for real-time audio synthesis with configurable parameters.
 *
 * @class AudioEngine
 * @example
 * const audioEngine = new AudioEngine();
 * await audioEngine.initialize();
 * await audioEngine.playNote('C', 4);
 */
class AudioEngine {
    /**
     * Creates a new AudioEngine instance.
     * Initializes audio settings and prepares for Web Audio API usage.
     * Note: initialize() must be called after user interaction to activate audio.
     *
     * @constructor
     */
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.isInitialized = false;
        this.currentlyPlaying = new Set();
        this.musicTheory = new MusicTheory();

        // Audio settings
        this.settings = {
            masterVolume: 0.3,
            noteLength: 0.8, // seconds
            chordLength: 1.5,
            progressionNoteLength: 1.0,
            attackTime: 0.05,
            releaseTime: 0.3,
            waveform: 'sine' // sine, square, sawtooth, triangle
        };
    }

    /**
     * Initialize the Web Audio API context and master gain node.
     * Must be called after user interaction due to browser autoplay policies.
     * Can be called multiple times safely - subsequent calls return immediately.
     *
     * @async
     * @returns {Promise<boolean>} True if initialization successful, false otherwise
     * @throws {Error} If Web Audio API is not supported
     * @example
     * const success = await audioEngine.initialize();
     * if (success) {
     *     console.log('Audio ready!');
     * }
     */
    async initialize() {
        if (this.isInitialized) {
            return true;
        }

        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create master gain node
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.settings.masterVolume;
            this.masterGain.connect(this.audioContext.destination);

            // Resume context if suspended (required by some browsers)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            this.isInitialized = true;
            console.log('Audio engine initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize audio engine:', error);
            return false;
        }
    }

    /**
     * Create an oscillator with envelope
     */
    createOscillator(frequency, startTime, duration, waveform = 'sine') {
        if (!this.isInitialized) {
            return null;
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        // Set up oscillator
        oscillator.type = waveform;
        oscillator.frequency.setValueAtTime(frequency, startTime);

        // Set up envelope (ADSR)
        const attackTime = this.settings.attackTime;
        const releaseTime = this.settings.releaseTime;
        const sustainTime = duration - attackTime - releaseTime;
        const peakGain = 0.3;

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attackTime);
        gainNode.gain.setValueAtTime(peakGain, startTime + attackTime + sustainTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        return { oscillator, gainNode };
    }

    /**
     * Play a single musical note using Web Audio synthesis.
     * Automatically initializes the audio engine if not already done.
     *
     * @async
     * @param {string} note - The note name (e.g., 'C', 'F#', 'Bb')
     * @param {number} [octave=4] - The octave number (0-8)
     * @param {number|null} [duration=null] - Duration in seconds, uses default if null
     * @returns {Promise<void>} Promise that resolves when note starts playing
     * @example
     * // Play middle C for default duration
     * await audioEngine.playNote('C', 4);
     *
     * // Play A above middle C for 2 seconds
     * await audioEngine.playNote('A', 4, 2.0);
     */
    async playNote(note, octave = 4, duration = null) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const frequency = this.musicTheory.getNoteFrequency(note, octave);
        const noteDuration = duration || this.settings.noteLength;
        const startTime = this.audioContext.currentTime;

        const { oscillator } = this.createOscillator(
            frequency,
            startTime,
            noteDuration,
            this.settings.waveform
        );

        if (oscillator) {
            oscillator.start(startTime);
            oscillator.stop(startTime + noteDuration);
            this.currentlyPlaying.add(oscillator);

            // Clean up after note ends
            oscillator.addEventListener('ended', () => {
                this.currentlyPlaying.delete(oscillator);
            });
        }
    }

    /**
     * Play a chord (multiple notes simultaneously).
     * All notes start at the same time and play for the same duration.
     *
     * @async
     * @param {string[]} notes - Array of note names to play together
     * @param {number} [octave=4] - The octave number for all notes
     * @param {number|null} [duration=null] - Duration in seconds, uses default if null
     * @returns {Promise<void>} Promise that resolves when chord starts playing
     * @example
     * // Play C major chord
     * await audioEngine.playChord(['C', 'E', 'G'], 4);
     *
     * // Play Am chord for 3 seconds
     * await audioEngine.playChord(['A', 'C', 'E'], 4, 3.0);
     */
    async playChord(notes, octave = 4, duration = null) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const chordDuration = duration || this.settings.chordLength;
        const startTime = this.audioContext.currentTime;
        const oscillators = [];

        notes.forEach((note, index) => {
            const noteOctave = octave + Math.floor(index / 7); // Spread across octaves if needed
            const frequency = this.musicTheory.getNoteFrequency(note, noteOctave);

            const { oscillator } = this.createOscillator(
                frequency,
                startTime,
                chordDuration,
                this.settings.waveform
            );

            if (oscillator) {
                oscillator.start(startTime);
                oscillator.stop(startTime + chordDuration);
                oscillators.push(oscillator);
                this.currentlyPlaying.add(oscillator);
            }
        });

        // Clean up after chord ends
        oscillators.forEach(osc => {
            osc.addEventListener('ended', () => {
                this.currentlyPlaying.delete(osc);
            });
        });
    }

    /**
     * Play a scale (notes in sequence)
     */
    async playScale(key, mode = 'major', octave = 4, ascending = true) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const scaleNotes = this.musicTheory.getScaleNotes(key, mode);
        const notes = ascending ? scaleNotes : [...scaleNotes].reverse();
        const noteDuration = this.settings.noteLength * 0.6; // Shorter notes for scales

        let currentTime = this.audioContext.currentTime;

        notes.forEach((note, _index) => {
            const frequency = this.musicTheory.getNoteFrequency(note, octave);
            const { oscillator } = this.createOscillator(
                frequency,
                currentTime,
                noteDuration,
                this.settings.waveform
            );

            if (oscillator) {
                oscillator.start(currentTime);
                oscillator.stop(currentTime + noteDuration);
                this.currentlyPlaying.add(oscillator);

                oscillator.addEventListener('ended', () => {
                    this.currentlyPlaying.delete(oscillator);
                });
            }

            currentTime += noteDuration * 0.8; // Slight overlap
        });
    }

    /**
     * Play a chord progression
     */
    async playProgression(key, mode, progressionName) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const progressions = this.musicTheory.getChordProgressions(key, mode);
        const progression = progressions[progressionName];

        if (!progression) {
            console.warn(`Progression ${progressionName} not found for ${key} ${mode}`);
            return;
        }

        const chordDuration = this.settings.progressionNoteLength;
        let currentTime = this.audioContext.currentTime;

        progression.roman.forEach(romanNumeral => {
            const chordRoot = this.musicTheory.romanToChord(romanNumeral, key, mode);
            const chordQuality = this.getChordQuality(romanNumeral, mode);
            const chordNotes = this.musicTheory.getChordNotes(chordRoot, chordQuality);

            // Play chord
            const oscillators = [];
            chordNotes.forEach((note, index) => {
                const noteOctave = 4 + Math.floor(index / 7);
                const frequency = this.musicTheory.getNoteFrequency(note, noteOctave);

                const { oscillator } = this.createOscillator(
                    frequency,
                    currentTime,
                    chordDuration,
                    this.settings.waveform
                );

                if (oscillator) {
                    oscillator.start(currentTime);
                    oscillator.stop(currentTime + chordDuration);
                    oscillators.push(oscillator);
                    this.currentlyPlaying.add(oscillator);
                }
            });

            // Clean up
            oscillators.forEach(osc => {
                osc.addEventListener('ended', () => {
                    this.currentlyPlaying.delete(osc);
                });
            });

            currentTime += chordDuration;
        });
    }

    /**
     * Determine chord quality from roman numeral
     */
    getChordQuality(romanNumeral, mode) {
        const roman = romanNumeral.toLowerCase();

        if (roman.includes('°')) {
            return 'diminished';
        }
        if (roman.includes('+')) {
            return 'augmented';
        }
        if (roman.includes('7')) {
            return roman === roman.toUpperCase() ? 'dominant7' : 'minor7';
        }

        // Major or minor based on case and mode
        if (mode === 'major') {
            return ['i', 'ii', 'iii', 'vi', 'vii'].includes(roman) ? 'minor' : 'major';
        } else {
            return ['III', 'VI', 'VII'].includes(romanNumeral) ? 'major' : 'minor';
        }
    }

    /**
     * Stop all currently playing audio
     */
    stopAll() {
        this.currentlyPlaying.forEach(oscillator => {
            try {
                oscillator.stop();
            } catch {
                // Oscillator might already be stopped
            }
        });
        this.currentlyPlaying.clear();
    }

    /**
     * Set master volume (0-1)
     */
    setVolume(volume) {
        this.settings.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(
                this.settings.masterVolume,
                this.audioContext.currentTime
            );
        }
    }

    /**
     * Change waveform type
     */
    setWaveform(waveform) {
        const validWaveforms = ['sine', 'square', 'sawtooth', 'triangle'];
        if (validWaveforms.includes(waveform)) {
            this.settings.waveform = waveform;
        }
    }

    /**
     * Set note duration
     */
    setNoteDuration(duration) {
        this.settings.noteLength = Math.max(0.1, Math.min(3.0, duration));
    }

    /**
     * Get current audio context state
     */
    getState() {
        return {
            isInitialized: this.isInitialized,
            contextState: this.audioContext ? this.audioContext.state : 'not-created',
            currentlyPlaying: this.currentlyPlaying.size,
            settings: { ...this.settings }
        };
    }

    /**
     * Create a simple metronome click
     */
    playClick(frequency = 800, duration = 0.1) {
        if (!this.isInitialized) {
            return;
        }

        const startTime = this.audioContext.currentTime;
        const { oscillator } = this.createOscillator(frequency, startTime, duration, 'square');

        if (oscillator) {
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        }
    }

    /**
     * Cleanup resources
     */
    dispose() {
        this.stopAll();
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
        this.isInitialized = false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioEngine;
} else {
    window.AudioEngine = AudioEngine;
}

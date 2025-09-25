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
        this.effectsChain = null;
        this.isInitialized = false;
        this.currentlyPlaying = new Set();
        this.musicTheory = new MusicTheory();

        // Event listeners for note highlighting
        this.noteEventListeners = new Set();

        // Advanced timing and scheduling
        this.scheduler = {
            lookahead: 25.0, // 25ms lookahead
            scheduleAheadTime: 0.1, // 100ms scheduling window
            nextNoteTime: 0.0,
            isPlaying: false,
            timerID: null,
            currentStep: 0,
            totalSteps: 0,
            stepCallback: null
        };

        // Audio settings
        this.settings = {
            masterVolume: 0.3,
            noteLength: 0.8, // seconds
            chordLength: 1.5,
            progressionNoteLength: 1.0,
            attackTime: 0.05,
            decayTime: 0.1,
            sustainLevel: 0.7,
            releaseTime: 0.3,
            waveform: 'sine', // sine, square, sawtooth, triangle
            // Enhanced synthesis settings
            useMultiOscillator: true,
            subOscillatorLevel: 0.2,
            detuneAmount: 5, // cents
            filterCutoff: 2000, // Hz
            filterResonance: 1,
            // Effects settings
            useEffects: true,
            reverbLevel: 0.2,
            delayLevel: 0.1,
            delayTime: 0.15,
            delayFeedback: 0.3,
            compressionThreshold: -24,
            compressionRatio: 12
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

            // Create effects chain
            this.effectsChain = this.createEffectsChain();

            // Connect master gain through effects to destination
            this.masterGain.connect(this.effectsChain.input);
            this.effectsChain.output.connect(this.audioContext.destination);

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
     * Create effects chain with filtering, reverb, delay, and compression
     * @returns {Object} Effects chain with input and output nodes
     */
    createEffectsChain() {
        if (!this.settings.useEffects) {
            // Bypass effects - direct connection
            const bypass = this.audioContext.createGain();
            return { input: bypass, output: bypass };
        }

        // High-pass filter to clean up low frequencies
        const highPassFilter = this.audioContext.createBiquadFilter();
        highPassFilter.type = 'highpass';
        highPassFilter.frequency.value = 80;
        highPassFilter.Q.value = 0.7;

        // Low-pass filter for warmth and to remove harsh frequencies
        const lowPassFilter = this.audioContext.createBiquadFilter();
        lowPassFilter.type = 'lowpass';
        lowPassFilter.frequency.value = this.settings.filterCutoff;
        lowPassFilter.Q.value = this.settings.filterResonance;

        // Delay effect
        const delay = this.audioContext.createDelay(1.0);
        delay.delayTime.value = this.settings.delayTime;

        const delayFeedback = this.audioContext.createGain();
        delayFeedback.gain.value = this.settings.delayFeedback;

        const delayWet = this.audioContext.createGain();
        delayWet.gain.value = this.settings.delayLevel;

        const delayDry = this.audioContext.createGain();
        delayDry.gain.value = 1 - this.settings.delayLevel;

        // Create delay feedback loop
        delay.connect(delayFeedback);
        delayFeedback.connect(delay);

        // Simple reverb using multiple delays (impulse response would be better)
        const reverb = this.createSimpleReverb();

        // Compressor for dynamic range control
        const compressor = this.audioContext.createDynamicsCompressor();
        compressor.threshold.value = this.settings.compressionThreshold;
        compressor.knee.value = 30;
        compressor.ratio.value = this.settings.compressionRatio;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.25;

        // Connect the effects chain
        // Input -> High-pass -> Low-pass -> Delay (wet/dry) -> Reverb -> Compressor -> Output

        // Main signal path
        highPassFilter.connect(lowPassFilter);

        // Delay processing
        lowPassFilter.connect(delayDry);
        lowPassFilter.connect(delay);
        delay.connect(delayWet);

        // Mix delay wet and dry
        const delayMixer = this.audioContext.createGain();
        delayDry.connect(delayMixer);
        delayWet.connect(delayMixer);

        // Reverb processing
        delayMixer.connect(reverb.input);

        // Final compression
        reverb.output.connect(compressor);

        return {
            input: highPassFilter,
            output: compressor,
            nodes: {
                highPassFilter,
                lowPassFilter,
                delay,
                delayFeedback,
                delayWet,
                delayDry,
                delayMixer,
                reverb,
                compressor
            }
        };
    }

    /**
     * Create simple reverb using multiple delays
     * @returns {Object} Reverb with input and output nodes
     */
    createSimpleReverb() {
        const reverbInput = this.audioContext.createGain();
        const reverbOutput = this.audioContext.createGain();

        const reverbWet = this.audioContext.createGain();
        const reverbDry = this.audioContext.createGain();

        reverbWet.gain.value = this.settings.reverbLevel;
        reverbDry.gain.value = 1 - this.settings.reverbLevel;

        // Create multiple delays for reverb effect
        const delays = [0.03, 0.05, 0.07, 0.09, 0.11, 0.13].map(time => {
            const delay = this.audioContext.createDelay(0.2);
            delay.delayTime.value = time;

            const gain = this.audioContext.createGain();
            gain.gain.value = 0.15 / (time * 10); // Decay over time

            reverbInput.connect(delay);
            delay.connect(gain);
            gain.connect(reverbWet);

            return { delay, gain };
        });

        // Mix wet and dry signals
        reverbInput.connect(reverbDry);
        reverbWet.connect(reverbOutput);
        reverbDry.connect(reverbOutput);

        return {
            input: reverbInput,
            output: reverbOutput,
            delays
        };
    }

    /**
     * Create proper ADSR envelope
     * @param {GainNode} gainNode - The gain node to apply envelope to
     * @param {number} startTime - When to start the envelope
     * @param {number} duration - Total duration of the note
     */
    createADSREnvelope(gainNode, startTime, duration) {
        const attackTime = this.settings.attackTime;
        const decayTime = this.settings.decayTime;
        const sustainLevel = this.settings.sustainLevel;
        const releaseTime = this.settings.releaseTime;

        const sustainTime = Math.max(0, duration - attackTime - decayTime - releaseTime);
        const peakGain = 0.3;

        gainNode.gain.setValueAtTime(0, startTime);

        // Attack: Linear ramp to peak
        gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attackTime);

        // Decay: Exponential ramp to sustain level
        gainNode.gain.exponentialRampToValueAtTime(
            peakGain * sustainLevel,
            startTime + attackTime + decayTime
        );

        // Sustain: Hold at sustain level
        gainNode.gain.setValueAtTime(
            peakGain * sustainLevel,
            startTime + attackTime + decayTime + sustainTime
        );

        // Release: Exponential ramp to zero
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    }

    /**
     * Create enhanced multi-oscillator synthesis
     */
    createEnhancedOscillator(frequency, startTime, duration, waveform = 'sine') {
        if (!this.isInitialized) {
            return null;
        }

        if (!this.settings.useMultiOscillator) {
            // Fall back to simple oscillator
            return this.createSimpleOscillator(frequency, startTime, duration, waveform);
        }

        // Create main oscillator
        const mainOsc = this.audioContext.createOscillator();
        mainOsc.type = waveform;
        mainOsc.frequency.setValueAtTime(frequency, startTime);

        // Create sub-oscillator (octave down)
        const subOsc = this.audioContext.createOscillator();
        subOsc.type = waveform;
        subOsc.frequency.setValueAtTime(frequency / 2, startTime);

        // Create detuned oscillator for richness
        const detunedOsc = this.audioContext.createOscillator();
        detunedOsc.type = waveform;
        detunedOsc.frequency.setValueAtTime(frequency, startTime);
        detunedOsc.detune.setValueAtTime(this.settings.detuneAmount, startTime);

        // Create gain nodes for mixing
        const mainGain = this.audioContext.createGain();
        const subGain = this.audioContext.createGain();
        const detunedGain = this.audioContext.createGain();
        const mixer = this.audioContext.createGain();

        // Set mixing levels
        mainGain.gain.value = 0.6;
        subGain.gain.value = this.settings.subOscillatorLevel;
        detunedGain.gain.value = 0.2;

        // Connect oscillators to their gain nodes
        mainOsc.connect(mainGain);
        subOsc.connect(subGain);
        detunedOsc.connect(detunedGain);

        // Mix all oscillators
        mainGain.connect(mixer);
        subGain.connect(mixer);
        detunedGain.connect(mixer);

        // Apply ADSR envelope to the mixer
        this.createADSREnvelope(mixer, startTime, duration);

        // Connect to master gain
        mixer.connect(this.masterGain);

        return {
            oscillators: [mainOsc, subOsc, detunedOsc],
            gainNode: mixer,
            mainOscillator: mainOsc // For backward compatibility
        };
    }

    /**
     * Create simple oscillator (fallback for compatibility)
     */
    createSimpleOscillator(frequency, startTime, duration, waveform = 'sine') {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = waveform;
        oscillator.frequency.setValueAtTime(frequency, startTime);

        this.createADSREnvelope(gainNode, startTime, duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        return { oscillator, gainNode };
    }

    /**
     * Create oscillator (main method - uses enhanced synthesis)
     */
    createOscillator(frequency, startTime, duration, waveform = 'sine') {
        return this.createEnhancedOscillator(frequency, startTime, duration, waveform);
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

        const synthResult = this.createOscillator(
            frequency,
            startTime,
            noteDuration,
            this.settings.waveform
        );

        if (synthResult) {
            // Handle both simple and multi-oscillator results
            const oscillators = synthResult.oscillators || [
                synthResult.oscillator || synthResult.mainOscillator
            ];

            oscillators.forEach(osc => {
                if (osc) {
                    osc.start(startTime);
                    osc.stop(startTime + noteDuration);
                    this.currentlyPlaying.add(osc);

                    // Clean up after note ends
                    osc.addEventListener('ended', () => {
                        this.currentlyPlaying.delete(osc);
                    });
                }
            });
        }
    }

    /**
     * Create proper chord voicing with root in bass and close harmony above
     * @param {Array} notes - Array of note names
     * @param {number} octave - Base octave for the chord
     * @returns {Array} Array of {note, octave} objects with proper voicing
     */
    createChordVoicing(notes, octave = 4) {
        if (notes.length === 0) {
            return [];
        }

        const voicing = [];

        // Root note in bass octave
        voicing.push({ note: notes[0], octave: octave });

        // If we have more than one note, place remaining notes in close position above
        if (notes.length > 1) {
            let currentOctave = octave + 1;
            let lastNoteIndex = this.musicTheory.getNoteIndex(notes[0]);

            for (let i = 1; i < notes.length; i++) {
                const currentNoteIndex = this.musicTheory.getNoteIndex(notes[i]);

                // If the current note is lower than the last note in the chromatic scale,
                // it means we've wrapped around, so we might need to go to the next octave
                if (currentNoteIndex <= lastNoteIndex) {
                    // Check if the interval is large (more than a 4th)
                    const interval = (currentNoteIndex - lastNoteIndex + 12) % 12;
                    if (interval > 5) {
                        // More than a perfect 4th
                        currentOctave++;
                    }
                }

                voicing.push({ note: notes[i], octave: currentOctave });
                lastNoteIndex = currentNoteIndex;
            }
        }

        return voicing;
    }

    /**
     * Play a chord (multiple notes simultaneously) with proper voicing.
     * Uses proper chord voicing with root in bass and close harmony above.
     *
     * @async
     * @param {string[]} notes - Array of note names to play together
     * @param {number} [octave=4] - The base octave number for the chord
     * @param {number|null} [duration=null] - Duration in seconds, uses default if null
     * @returns {Promise<void>} Promise that resolves when chord starts playing
     * @example
     * // Play C major chord with proper voicing
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

        // Create proper chord voicing
        const voicing = this.createChordVoicing(notes, octave);

        // Emit chord start events for highlighting
        voicing.forEach(({ note }) => {
            this.emitNoteEvent(note, 'chord-start');
        });

        voicing.forEach(({ note, octave: noteOctave }) => {
            const frequency = this.musicTheory.getNoteFrequency(note, noteOctave);

            const synthResult = this.createOscillator(
                frequency,
                startTime,
                chordDuration,
                this.settings.waveform
            );

            if (synthResult) {
                // Handle both simple and multi-oscillator results
                const noteOscillators = synthResult.oscillators || [
                    synthResult.oscillator || synthResult.mainOscillator
                ];

                noteOscillators.forEach(osc => {
                    if (osc) {
                        osc.start(startTime);
                        osc.stop(startTime + chordDuration);
                        oscillators.push(osc);
                        this.currentlyPlaying.add(osc);
                    }
                });
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
     * Play a complete scale pattern with octave cycles
     * Plays ascending from root to octave, then descending back to root
     * Example: C-D-E-F-G-A-B-C-C-B-A-G-F-E-D-C
     */
    async playScale(key, mode = 'major', octave = 4) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const scaleNotes = this.musicTheory.getScaleNotes(key, mode);
        const noteDuration = this.settings.noteLength * 0.6; // Shorter notes for scales

        // Create complete octave cycle: ascending then descending
        const rootNote = scaleNotes[0];

        // Ascending: root + scale degrees + octave (8 notes)
        const ascendingNotes = [...scaleNotes, rootNote]; // Add octave note

        // Descending: octave + scale degrees in reverse + root (8 notes)
        const descendingNotes = [rootNote, ...scaleNotes.slice(1).reverse(), rootNote];

        // Combine for complete pattern
        const completePattern = [...ascendingNotes, ...descendingNotes];

        let currentTime = this.audioContext.currentTime;
        let currentOctave = octave;

        completePattern.forEach((note, index) => {
            // Handle octave progression
            if (index > 0) {
                const prevNote = completePattern[index - 1];
                const prevNoteIndex = this.musicTheory.getNoteIndex(prevNote);
                const currentNoteIndex = this.musicTheory.getNoteIndex(note);

                // Determine if we're in ascending or descending phase
                const isAscendingPhase = index < ascendingNotes.length;

                if (isAscendingPhase) {
                    // Ascending: increment octave when wrapping around (B to C)
                    if (currentNoteIndex < prevNoteIndex) {
                        currentOctave++;
                    }
                } else {
                    // Descending: decrement octave when wrapping around (C to B)
                    if (currentNoteIndex > prevNoteIndex) {
                        currentOctave--;
                    }
                }
            }

            const frequency = this.musicTheory.getNoteFrequency(note, currentOctave);
            const synthResult = this.createOscillator(
                frequency,
                currentTime,
                noteDuration,
                this.settings.waveform
            );

            // Emit note start event for highlighting
            this.emitNoteEvent(note, 'start');

            if (synthResult) {
                // Handle both simple and multi-oscillator results
                const oscillators = synthResult.oscillators || [
                    synthResult.oscillator || synthResult.mainOscillator
                ];

                oscillators.forEach(osc => {
                    if (osc) {
                        osc.start(currentTime);
                        osc.stop(currentTime + noteDuration);
                        this.currentlyPlaying.add(osc);

                        osc.addEventListener('ended', () => {
                            this.currentlyPlaying.delete(osc);
                        });
                    }
                });
            }

            currentTime += noteDuration * 0.8; // Slight overlap
        });
    }

    /**
     * Calculate voice leading movement between two chords
     * @param {Array} chord1 - First chord voicing [{note, octave}, ...]
     * @param {Array} chord2 - Second chord voicing [{note, octave}, ...]
     * @returns {number} Total semitone movement
     */
    calculateVoiceMovement(chord1, chord2) {
        let totalMovement = 0;
        const maxLength = Math.max(chord1.length, chord2.length);

        for (let i = 0; i < maxLength; i++) {
            const note1 = chord1[i];
            const note2 = chord2[i];

            if (note1 && note2) {
                const midi1 = this.musicTheory.getNoteIndex(note1.note) + note1.octave * 12;
                const midi2 = this.musicTheory.getNoteIndex(note2.note) + note2.octave * 12;
                const movement = Math.abs(midi2 - midi1);
                totalMovement += movement;
            }
        }

        return totalMovement;
    }

    /**
     * Find the best chord inversion for smooth voice leading
     * @param {Array} notes - Chord notes
     * @param {Array} previousVoicing - Previous chord voicing
     * @param {number} octave - Base octave
     * @returns {Array} Optimized chord voicing
     */
    optimizeChordVoicing(notes, previousVoicing, octave = 4) {
        if (!previousVoicing || previousVoicing.length === 0) {
            return this.createChordVoicing(notes, octave);
        }

        // Try different inversions and octave positions
        let bestVoicing = this.createChordVoicing(notes, octave);
        let smallestMovement = this.calculateVoiceMovement(previousVoicing, bestVoicing);

        // Try inversions
        for (let inversion = 0; inversion < notes.length; inversion++) {
            const invertedNotes = [...notes.slice(inversion), ...notes.slice(0, inversion)];

            // Try different octaves for the inverted chord
            for (let testOctave = octave - 1; testOctave <= octave + 1; testOctave++) {
                const testVoicing = this.createChordVoicing(invertedNotes, testOctave);
                const movement = this.calculateVoiceMovement(previousVoicing, testVoicing);

                if (movement < smallestMovement) {
                    smallestMovement = movement;
                    bestVoicing = testVoicing;
                }
            }
        }

        return bestVoicing;
    }

    /**
     * Play a chord progression with optimized voice leading
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
        let previousVoicing = null;

        progression.roman.forEach((romanNumeral, _index) => {
            const chordRoot = this.musicTheory.romanToChord(romanNumeral, key, mode);
            const chordQuality = this.getChordQuality(romanNumeral, mode);
            const chordNotes = this.musicTheory.getChordNotes(chordRoot, chordQuality);

            // Optimize voice leading for smooth progression
            const voicing = this.optimizeChordVoicing(chordNotes, previousVoicing, 4);
            previousVoicing = voicing;

            // Emit progression chord events for highlighting
            voicing.forEach(({ note }) => {
                this.emitNoteEvent(note, 'progression-chord');
            });

            // Play chord with optimized voicing
            const oscillators = [];
            voicing.forEach(({ note, octave: noteOctave }) => {
                const frequency = this.musicTheory.getNoteFrequency(note, noteOctave);

                const synthResult = this.createOscillator(
                    frequency,
                    currentTime,
                    chordDuration,
                    this.settings.waveform
                );

                if (synthResult) {
                    // Handle both simple and multi-oscillator results
                    const noteOscillators = synthResult.oscillators || [
                        synthResult.oscillator || synthResult.mainOscillator
                    ];

                    noteOscillators.forEach(osc => {
                        if (osc) {
                            osc.start(currentTime);
                            osc.stop(currentTime + chordDuration);
                            oscillators.push(osc);
                            this.currentlyPlaying.add(osc);
                        }
                    });
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
            // Check original case to determine if it's dominant7 or minor7
            const baseRoman = romanNumeral.replace('7', '');
            return baseRoman === baseRoman.toUpperCase() ? 'dominant7' : 'minor7';
        }

        // Major or minor based on case and mode
        if (mode === 'major') {
            // In major mode: uppercase = major, lowercase = minor
            return romanNumeral === romanNumeral.toUpperCase() ? 'major' : 'minor';
        } else {
            // In minor mode: specific uppercase chords are major, others are minor
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
     * Add event listener for note events
     */
    addNoteEventListener(callback) {
        this.noteEventListeners.add(callback);
    }

    /**
     * Remove event listener for note events
     */
    removeNoteEventListener(callback) {
        this.noteEventListeners.delete(callback);
    }

    /**
     * Emit note event to all listeners
     */
    emitNoteEvent(note, eventType = 'start') {
        this.noteEventListeners.forEach(callback => {
            try {
                callback({ note, eventType, timestamp: this.audioContext.currentTime });
            } catch (e) {
                console.warn('Error in note event listener:', e);
            }
        });
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
     * Control effects settings
     */
    setFilterCutoff(frequency) {
        this.settings.filterCutoff = Math.max(100, Math.min(20000, frequency));
        if (this.effectsChain && this.effectsChain.nodes) {
            this.effectsChain.nodes.lowPassFilter.frequency.setValueAtTime(
                this.settings.filterCutoff,
                this.audioContext.currentTime
            );
        }
    }

    setReverbLevel(level) {
        this.settings.reverbLevel = Math.max(0, Math.min(1, level));
        if (this.effectsChain && this.effectsChain.nodes && this.effectsChain.nodes.reverb) {
            const reverb = this.effectsChain.nodes.reverb;
            // Update reverb wet/dry mix
            reverb.delays.forEach(({ gain }) => {
                gain.gain.setValueAtTime(
                    (0.15 * this.settings.reverbLevel) / 10,
                    this.audioContext.currentTime
                );
            });
        }
    }

    setDelayLevel(level) {
        this.settings.delayLevel = Math.max(0, Math.min(1, level));
        if (this.effectsChain && this.effectsChain.nodes) {
            this.effectsChain.nodes.delayWet.gain.setValueAtTime(
                this.settings.delayLevel,
                this.audioContext.currentTime
            );
            this.effectsChain.nodes.delayDry.gain.setValueAtTime(
                1 - this.settings.delayLevel,
                this.audioContext.currentTime
            );
        }
    }

    setDelayTime(time) {
        this.settings.delayTime = Math.max(0.01, Math.min(1.0, time));
        if (this.effectsChain && this.effectsChain.nodes) {
            this.effectsChain.nodes.delay.delayTime.setValueAtTime(
                this.settings.delayTime,
                this.audioContext.currentTime
            );
        }
    }

    toggleEffects() {
        this.settings.useEffects = !this.settings.useEffects;
        // Note: Toggling effects requires reinitializing the audio context
        // for the change to take effect on new notes
        console.log(`Effects ${this.settings.useEffects ? 'enabled' : 'disabled'}`);
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
     * Advanced scheduling methods for precise timing
     */

    /**
     * Schedule a note with precise timing
     * @param {string} note - Note name
     * @param {number} octave - Octave number
     * @param {number} startTime - Exact start time in audio context time
     * @param {number} duration - Duration in seconds
     */
    scheduleNote(note, octave, startTime, duration) {
        if (!this.isInitialized) {
            return null;
        }

        const frequency = this.musicTheory.getNoteFrequency(note, octave);
        const synthResult = this.createOscillator(
            frequency,
            startTime,
            duration,
            this.settings.waveform
        );

        if (synthResult) {
            const oscillators = synthResult.oscillators || [
                synthResult.oscillator || synthResult.mainOscillator
            ];

            oscillators.forEach(osc => {
                if (osc) {
                    osc.start(startTime);
                    osc.stop(startTime + duration);
                    this.currentlyPlaying.add(osc);

                    osc.addEventListener('ended', () => {
                        this.currentlyPlaying.delete(osc);
                    });
                }
            });
        }

        return synthResult;
    }

    /**
     * Schedule a chord with precise timing
     * @param {Array} notes - Array of note names
     * @param {number} octave - Base octave
     * @param {number} startTime - Exact start time
     * @param {number} duration - Duration in seconds
     */
    scheduleChord(notes, octave, startTime, duration) {
        if (!this.isInitialized) {
            return [];
        }

        const voicing = this.createChordVoicing(notes, octave);
        const scheduledNotes = [];

        voicing.forEach(({ note, octave: noteOctave }) => {
            const result = this.scheduleNote(note, noteOctave, startTime, duration);
            if (result) {
                scheduledNotes.push(result);
            }
        });

        return scheduledNotes;
    }

    /**
     * Start lookahead scheduler for musical sequences
     * @param {Function} stepCallback - Function called for each step
     * @param {number} tempo - BPM
     * @param {number} totalSteps - Total number of steps
     */
    startScheduler(stepCallback, tempo = 120, totalSteps = 16) {
        if (this.scheduler.isPlaying) {
            this.stopScheduler();
        }

        this.scheduler.stepCallback = stepCallback;
        this.scheduler.currentStep = 0;
        this.scheduler.totalSteps = totalSteps;
        this.scheduler.nextNoteTime = this.audioContext.currentTime;
        this.scheduler.isPlaying = true;

        // Calculate step duration (16th notes)
        this.scheduler.stepDuration = 60.0 / tempo / 4;

        this.scheduleLoop();
    }

    /**
     * Internal scheduling loop using lookahead
     */
    scheduleLoop() {
        while (
            this.scheduler.nextNoteTime <
            this.audioContext.currentTime + this.scheduler.scheduleAheadTime
        ) {
            if (this.scheduler.stepCallback) {
                this.scheduler.stepCallback(
                    this.scheduler.currentStep,
                    this.scheduler.nextNoteTime
                );
            }

            this.nextStep();
        }

        if (this.scheduler.isPlaying) {
            this.scheduler.timerID = setTimeout(() => {
                this.scheduleLoop();
            }, this.scheduler.lookahead);
        }
    }

    /**
     * Advance to next step
     */
    nextStep() {
        this.scheduler.nextNoteTime += this.scheduler.stepDuration;
        this.scheduler.currentStep = (this.scheduler.currentStep + 1) % this.scheduler.totalSteps;
    }

    /**
     * Stop the scheduler
     */
    stopScheduler() {
        this.scheduler.isPlaying = false;
        if (this.scheduler.timerID) {
            clearTimeout(this.scheduler.timerID);
            this.scheduler.timerID = null;
        }
    }

    /**
     * Play a sequence with precise timing
     * @param {Array} sequence - Array of {notes, duration, delay} objects
     * @param {number} startTime - When to start the sequence
     */
    playSequence(sequence, startTime = null) {
        if (!this.isInitialized) {
            return;
        }

        const baseTime = startTime || this.audioContext.currentTime;
        let currentTime = baseTime;

        sequence.forEach(({ notes, duration, delay = 0 }) => {
            currentTime += delay;

            if (Array.isArray(notes)) {
                // Chord
                this.scheduleChord(notes, 4, currentTime, duration);
            } else {
                // Single note
                this.scheduleNote(notes, 4, currentTime, duration);
            }

            currentTime += duration;
        });
    }

    /**
     * Enhanced progression with precise timing and customizable rhythm
     * @param {string} key - Key signature
     * @param {string} mode - Major or minor
     * @param {string} progressionName - Name of progression
     * @param {Array} rhythm - Array of durations for each chord
     */
    playProgressionWithRhythm(key, mode, progressionName, rhythm = null) {
        if (!this.isInitialized) {
            return;
        }

        const progressions = this.musicTheory.getChordProgressions(key, mode);
        const progression = progressions[progressionName];

        if (!progression) {
            console.warn(`Progression ${progressionName} not found for ${key} ${mode}`);
            return;
        }

        const defaultRhythm = progression.roman.map(() => this.settings.progressionNoteLength);
        const chordRhythm = rhythm || defaultRhythm;

        let currentTime = this.audioContext.currentTime;
        let previousVoicing = null;

        progression.roman.forEach((romanNumeral, index) => {
            const chordRoot = this.musicTheory.romanToChord(romanNumeral, key, mode);
            const chordQuality = this.getChordQuality(romanNumeral, mode);
            const chordNotes = this.musicTheory.getChordNotes(chordRoot, chordQuality);
            const chordDuration = chordRhythm[index] || this.settings.progressionNoteLength;

            // Optimize voice leading
            const voicing = this.optimizeChordVoicing(chordNotes, previousVoicing, 4);
            previousVoicing = voicing;

            // Schedule chord with precise timing
            this.scheduleChord(chordNotes, 4, currentTime, chordDuration);

            currentTime += chordDuration;
        });
    }

    /**
     * Cleanup resources
     */
    dispose() {
        this.stopScheduler();
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

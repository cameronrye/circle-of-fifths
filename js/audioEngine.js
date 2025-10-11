/**
 * Audio Engine for Circle of Fifths
 * Handles Web Audio API synthesis and playback
 */

/**
 * Node pool for reusing audio nodes to improve performance
 * @class NodePool
 */
class NodePool {
    constructor(audioContext, createFn, maxSize = 50) {
        this.audioContext = audioContext;
        this.createFn = createFn;
        this.maxSize = maxSize;
        this.pool = [];
    }

    acquire() {
        if (this.pool.length > 0) {
            return this.pool.pop();
        }
        return this.createFn(this.audioContext);
    }

    release(node) {
        if (!node) {
            return; // Guard against undefined/null nodes
        }
        if (this.pool.length < this.maxSize) {
            node.disconnect();
            // Reset to default state
            if (node.gain) {
                node.gain.value = 1;
            }
            if (node.frequency) {
                node.frequency.value = 350;
            }
            this.pool.push(node);
        }
    }

    clear() {
        this.pool.forEach(node => {
            try {
                node.disconnect();
            } catch (e) {
                // Node might already be disconnected
            }
        });
        this.pool = [];
    }
}

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

        // Custom waveforms for enhanced sound quality
        this.customWaves = null;

        // Node pools for performance optimization
        this.nodePools = null;

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
            waveform: 'warmSine', // warmSine, piano, organ, sine, square, sawtooth, triangle
            // Enhanced synthesis settings
            useMultiOscillator: true,
            useStereoEnhancement: true,
            useFilterEnvelope: true,
            subOscillatorLevel: 0.2,
            detuneAmount: 5, // cents
            stereoWidth: 0.25, // 0-1, amount of stereo spread
            filterCutoff: 2000, // Hz
            filterResonance: 2.5, // Increased for more character
            filterEnvelopeAmount: 4, // Multiplier for filter frequency
            // Effects settings
            useEffects: true,
            reverbType: 'room', // room, hall, plate
            reverbLevel: 0.2,
            delayLevel: 0.1,
            delayTime: 0.15,
            delayFeedback: 0.3,
            compressionThreshold: -18, // Less aggressive
            compressionRatio: 4, // Gentler ratio
            compressionKnee: 12, // Softer knee
            makeupGain: 1.5, // Compensate for compression
            useLimiter: true,
            // Percussion settings
            percussionEnabled: false,
            percussionVolume: 0.4
        };

        // Looping state
        this.loopState = {
            enabled: false,
            timeoutId: null,
            currentKey: null,
            currentMode: null,
            currentProgression: null,
            previousVoicing: null
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

            // Create custom waveforms for enhanced sound quality
            this.createCustomWaveforms();

            // Initialize node pools for performance
            this.initializeNodePools();

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
     * Initialize node pools for performance optimization
     */
    initializeNodePools() {
        this.nodePools = {
            gain: new NodePool(this.audioContext, ctx => ctx.createGain(), 50),
            filter: new NodePool(this.audioContext, ctx => ctx.createBiquadFilter(), 30),
            panner: new NodePool(
                this.audioContext,
                ctx => {
                    // Use StereoPannerNode if available, otherwise use PannerNode as fallback
                    if (ctx.createStereoPanner) {
                        return ctx.createStereoPanner();
                    } else {
                        // Fallback to PannerNode for test environments
                        const panner = ctx.createPanner();
                        panner.panningModel = 'equalpower';
                        panner.setPosition(0, 0, 0);
                        return panner;
                    }
                },
                30
            )
        };
    }

    /**
     * Create custom waveforms with rich harmonic content
     */
    createCustomWaveforms() {
        // Check if createPeriodicWave is available (browser environment)
        if (!this.audioContext.createPeriodicWave) {
            console.warn('createPeriodicWave not available, using basic waveforms');
            this.customWaves = null;
            return;
        }

        try {
            this.customWaves = {
                piano: this.createPianoWave(),
                warmSine: this.createWarmSineWave(),
                softSquare: this.createSoftSquareWave(),
                organ: this.createOrganWave()
            };
        } catch (error) {
            console.warn('Failed to create custom waveforms:', error);
            this.customWaves = null;
        }
    }

    /**
     * Piano-like tone with natural harmonic decay
     */
    createPianoWave() {
        const real = new Float32Array([0, 1.0, 0.5, 0.3, 0.2, 0.15, 0.1, 0.05, 0.02]);
        const imag = new Float32Array(real.length);
        return this.audioContext.createPeriodicWave(real, imag, { disableNormalization: false });
    }

    /**
     * Warm sine with subtle harmonics for richness
     */
    createWarmSineWave() {
        const real = new Float32Array([0, 1.0, 0.05, 0.02, 0.01]);
        const imag = new Float32Array(real.length);
        return this.audioContext.createPeriodicWave(real, imag, { disableNormalization: false });
    }

    /**
     * Soft square wave with reduced high harmonics (less harsh)
     */
    createSoftSquareWave() {
        const harmonics = 16;
        const real = new Float32Array(harmonics);
        const imag = new Float32Array(harmonics);

        for (let i = 1; i < harmonics; i += 2) {
            const harmonic = (i + 1) / 2;
            real[i] = (1 / i) * Math.pow(0.8, harmonic);
        }

        return this.audioContext.createPeriodicWave(real, imag, { disableNormalization: false });
    }

    /**
     * Organ-like tone with specific harmonic ratios
     */
    createOrganWave() {
        const real = new Float32Array([0, 0.8, 0.6, 0.4, 0.5, 0.3, 0.2, 0.1]);
        const imag = new Float32Array(real.length);
        return this.audioContext.createPeriodicWave(real, imag, { disableNormalization: false });
    }

    /**
     * Generate impulse response buffer algorithmically for convolution reverb
     * @param {string} type - 'room', 'hall', or 'plate'
     * @returns {AudioBuffer} Impulse response buffer
     */
    generateImpulseResponse(type = 'room') {
        const sampleRate = this.audioContext.sampleRate;
        let duration, decay;

        switch (type) {
            case 'hall':
                duration = 3.0;
                decay = 3.0;
                break;
            case 'plate':
                duration = 1.5;
                decay = 1.5;
                break;
            case 'room':
            default:
                duration = 1.0;
                decay = 1.0;
        }

        const length = sampleRate * duration;
        const impulse = this.audioContext.createBuffer(2, length, sampleRate);
        const leftChannel = impulse.getChannelData(0);
        const rightChannel = impulse.getChannelData(1);

        for (let i = 0; i < length; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t / decay);

            leftChannel[i] = (Math.random() * 2 - 1) * envelope;
            rightChannel[i] = (Math.random() * 2 - 1) * envelope;

            if (t < 0.05) {
                const reflectionDecay = Math.exp(-t / 0.01);
                leftChannel[i] += (Math.random() * 2 - 1) * reflectionDecay * 0.5;
                rightChannel[i] += (Math.random() * 2 - 1) * reflectionDecay * 0.5;
            }
        }

        return impulse;
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

        // High-quality convolution reverb
        const reverb = this.createConvolutionReverb(this.settings.reverbType);

        // Musical compressor with softer settings
        const compressor = this.audioContext.createDynamicsCompressor();
        compressor.threshold.value = this.settings.compressionThreshold;
        compressor.knee.value = this.settings.compressionKnee;
        compressor.ratio.value = this.settings.compressionRatio;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.25;

        // Makeup gain to compensate for compression
        const makeupGain = this.audioContext.createGain();
        makeupGain.gain.value = this.settings.makeupGain;

        // Safety limiter to prevent clipping
        let limiter = null;
        if (this.settings.useLimiter) {
            limiter = this.createSafetyLimiter();
        }

        // Connect the effects chain
        // Input -> High-pass -> Low-pass -> Delay (wet/dry) -> Reverb -> Compressor -> Makeup Gain -> Limiter -> Output

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

        // Compression and limiting
        reverb.output.connect(compressor);
        compressor.connect(makeupGain);

        const finalOutput = limiter || makeupGain;
        if (limiter) {
            makeupGain.connect(limiter);
        }

        return {
            input: highPassFilter,
            output: finalOutput,
            nodes: {
                highPassFilter,
                lowPassFilter,
                delay,
                delayFeedback,
                delayWet,
                delayDry,
                delayMixer,
                reverb,
                compressor,
                makeupGain,
                limiter
            }
        };
    }

    /**
     * Create high-quality convolution reverb with algorithmic impulse response
     * Falls back to simple delay-based reverb if ConvolverNode is not available
     * @param {string} type - 'room', 'hall', or 'plate'
     * @returns {Object} Reverb with input and output nodes
     */
    createConvolutionReverb(type = 'room') {
        // Check if createConvolver is available (browser environment)
        if (!this.audioContext.createConvolver) {
            console.warn('createConvolver not available, using simple delay-based reverb');
            return this.createSimpleDelayReverb();
        }

        try {
            const convolver = this.audioContext.createConvolver();
            const reverbInput = this.audioContext.createGain();
            const reverbOutput = this.audioContext.createGain();
            const reverbWet = this.audioContext.createGain();
            const reverbDry = this.audioContext.createGain();

            reverbWet.gain.value = this.settings.reverbLevel;
            reverbDry.gain.value = 1 - this.settings.reverbLevel;

            // Generate and set impulse response
            convolver.buffer = this.generateImpulseResponse(type);
            convolver.normalize = true;

            // Connect: input → dry → output
            reverbInput.connect(reverbDry);
            reverbDry.connect(reverbOutput);

            // Connect: input → convolver → wet → output
            reverbInput.connect(convolver);
            convolver.connect(reverbWet);
            reverbWet.connect(reverbOutput);

            return {
                input: reverbInput,
                output: reverbOutput,
                convolver
            };
        } catch (error) {
            console.warn('Failed to create convolution reverb, using simple delay-based reverb:', error);
            return this.createSimpleDelayReverb();
        }
    }

    /**
     * Create simple delay-based reverb as fallback
     * Used when ConvolverNode is not available (e.g., in test environments)
     * @returns {Object} Reverb with input and output nodes
     */
    createSimpleDelayReverb() {
        const reverbInput = this.audioContext.createGain();
        const reverbOutput = this.audioContext.createGain();
        const delays = [0.037, 0.053, 0.079, 0.097];

        delays.forEach(time => {
            const delay = this.audioContext.createDelay();
            delay.delayTime.value = time;
            const gain = this.audioContext.createGain();
            gain.gain.value = this.settings.reverbLevel / delays.length;

            reverbInput.connect(delay);
            delay.connect(gain);
            gain.connect(reverbOutput);
        });

        // Also connect dry signal
        const dryGain = this.audioContext.createGain();
        dryGain.gain.value = 1 - this.settings.reverbLevel;
        reverbInput.connect(dryGain);
        dryGain.connect(reverbOutput);

        return {
            input: reverbInput,
            output: reverbOutput
        };
    }

    /**
     * Create safety limiter to prevent clipping
     * @returns {DynamicsCompressorNode} Limiter node
     */
    createSafetyLimiter() {
        const limiter = this.audioContext.createDynamicsCompressor();
        limiter.threshold.value = -1.0; // Just below 0dB
        limiter.knee.value = 0.0; // Hard knee (brick wall)
        limiter.ratio.value = 20.0; // Heavy limiting
        limiter.attack.value = 0.001; // Very fast attack
        limiter.release.value = 0.01; // Fast release
        return limiter;
    }

    /**
     * Create improved ADSR envelope with anti-click protection
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
        const minGain = 0.00001; // Very small but not zero to prevent issues

        // Start from very small value (anti-click)
        gainNode.gain.setValueAtTime(minGain, startTime);

        // Attack: Linear ramp to peak (smooth start)
        gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attackTime);

        // Decay: Exponential ramp to sustain level
        gainNode.gain.exponentialRampToValueAtTime(
            Math.max(peakGain * sustainLevel, minGain),
            startTime + attackTime + decayTime
        );

        // Sustain: Hold at sustain level
        gainNode.gain.setValueAtTime(
            Math.max(peakGain * sustainLevel, minGain),
            startTime + attackTime + decayTime + sustainTime
        );

        // Release: Use setTargetAtTime for smoother exponential decay
        const releaseStart = startTime + attackTime + decayTime + sustainTime;
        gainNode.gain.setTargetAtTime(minGain, releaseStart, releaseTime / 5);

        // Final safety ramp to ensure complete silence
        gainNode.gain.setValueAtTime(minGain, startTime + duration);
    }

    /**
     * Create filter with envelope modulation for expressive sound
     * @param {number} frequency - Note frequency
     * @param {number} startTime - Start time
     * @param {number} duration - Duration
     * @returns {BiquadFilterNode} Configured filter
     */
    createDynamicFilter(frequency, startTime, duration) {
        const filter = this.nodePools.filter.acquire();
        filter.type = 'lowpass';
        filter.Q.value = this.settings.filterResonance;

        // Calculate filter frequencies based on note frequency
        const baseFreq = Math.max(frequency * 1.5, 200);
        const peakFreq = Math.min(frequency * this.settings.filterEnvelopeAmount, 8000);
        const sustainFreq = Math.max(frequency * 2.5, 400);

        const attackTime = this.settings.attackTime;
        const decayTime = this.settings.decayTime;

        // Filter envelope follows ADSR
        filter.frequency.setValueAtTime(baseFreq, startTime);
        filter.frequency.exponentialRampToValueAtTime(peakFreq, startTime + attackTime);
        filter.frequency.exponentialRampToValueAtTime(
            sustainFreq,
            startTime + attackTime + decayTime
        );

        // Release: Filter closes
        filter.frequency.exponentialRampToValueAtTime(baseFreq, startTime + duration);

        return filter;
    }

    /**
     * Calculate appropriate gain based on number of notes and frequency
     * @param {number} noteCount - Number of simultaneous notes
     * @param {number} frequency - Average frequency
     * @returns {number} Gain multiplier
     */
    calculateDynamicGain(noteCount, frequency) {
        // Base gain reduction for multiple notes
        const countGain = 1 / Math.sqrt(noteCount);

        // Frequency-dependent gain (equal-loudness compensation)
        let freqGain = 1.0;
        if (frequency < 200) {
            freqGain = 1.1; // Slight boost for bass
        } else if (frequency > 2000) {
            freqGain = 0.9; // Slight cut for highs
        }

        return countGain * freqGain;
    }

    /**
     * Create enhanced multi-oscillator synthesis with all improvements
     * Includes: custom waveforms, stereo enhancement, filter envelope, dynamic gain
     * @param {number} frequency - Note frequency in Hz
     * @param {number} startTime - Start time in audio context time
     * @param {number} duration - Duration in seconds
     * @param {string} waveform - Waveform type
     * @param {number} _pan - Pan position (reserved for future use, currently handled by chord voicing)
     */
    createEnhancedOscillator(frequency, startTime, duration, waveform = 'warmSine', _pan = 0) {
        if (!this.isInitialized) {
            return null;
        }

        if (!this.settings.useMultiOscillator) {
            return this.createSimpleOscillator(frequency, startTime, duration, waveform);
        }

        const oscillators = [];

        // Create main oscillator (center)
        const mainOsc = this.audioContext.createOscillator();
        const mainGain = this.nodePools.gain.acquire();
        mainGain.gain.value = 0.5;

        // Create sub-oscillator (octave down, center, for bass)
        const subOsc = this.audioContext.createOscillator();
        const subGain = this.nodePools.gain.acquire();
        subOsc.frequency.setValueAtTime(frequency / 2, startTime);
        subGain.gain.value = this.settings.subOscillatorLevel;

        // Set waveforms (use custom waveforms if available)
        [mainOsc, subOsc].forEach(osc => {
            osc.frequency.setValueAtTime(frequency, startTime);
            if (this.customWaves && this.customWaves[waveform]) {
                osc.setPeriodicWave(this.customWaves[waveform]);
            } else {
                osc.type = waveform;
            }
        });

        oscillators.push(mainOsc, subOsc);

        // Stereo enhancement with detuned oscillators
        let leftOsc, rightOsc, leftGain, rightGain, leftPanner, rightPanner;

        if (this.settings.useStereoEnhancement) {
            // Left detuned oscillator
            leftOsc = this.audioContext.createOscillator();
            leftGain = this.nodePools.gain.acquire();
            leftPanner = this.nodePools.panner.acquire();
            leftOsc.frequency.setValueAtTime(frequency, startTime);
            leftOsc.detune.setValueAtTime(-this.settings.detuneAmount, startTime);
            leftPanner.pan.value = -this.settings.stereoWidth;
            leftGain.gain.value = 0.25;

            // Right detuned oscillator
            rightOsc = this.audioContext.createOscillator();
            rightGain = this.nodePools.gain.acquire();
            rightPanner = this.nodePools.panner.acquire();
            rightOsc.frequency.setValueAtTime(frequency, startTime);
            rightOsc.detune.setValueAtTime(this.settings.detuneAmount, startTime);
            rightPanner.pan.value = this.settings.stereoWidth;
            rightGain.gain.value = 0.25;

            // Set waveforms for stereo oscillators
            [leftOsc, rightOsc].forEach(osc => {
                if (this.customWaves && this.customWaves[waveform]) {
                    osc.setPeriodicWave(this.customWaves[waveform]);
                } else {
                    osc.type = waveform;
                }
            });

            oscillators.push(leftOsc, rightOsc);
        }

        // Create mixer
        const mixer = this.nodePools.gain.acquire();

        // Connect oscillators
        mainOsc.connect(mainGain).connect(mixer);
        subOsc.connect(subGain).connect(mixer);

        if (this.settings.useStereoEnhancement) {
            leftOsc.connect(leftGain).connect(leftPanner).connect(mixer);
            rightOsc.connect(rightGain).connect(rightPanner).connect(mixer);
        }

        // Apply ADSR envelope to mixer
        this.createADSREnvelope(mixer, startTime, duration);

        // Add dynamic filter envelope if enabled
        let filter = null;
        if (this.settings.useFilterEnvelope) {
            filter = this.createDynamicFilter(frequency, startTime, duration);
            mixer.connect(filter);
            filter.connect(this.masterGain);
        } else {
            mixer.connect(this.masterGain);
        }

        // Schedule cleanup and node pool release
        const stopBuffer = 0.05; // 50ms buffer after envelope completes
        const cleanupTime = (startTime + duration + stopBuffer - this.audioContext.currentTime) * 1000;

        setTimeout(() => {
            this.nodePools.gain.release(mainGain);
            this.nodePools.gain.release(subGain);
            this.nodePools.gain.release(mixer);
            // Release stereo enhancement nodes if they were created
            if (leftGain) {
                this.nodePools.gain.release(leftGain);
            }
            if (rightGain) {
                this.nodePools.gain.release(rightGain);
            }
            if (leftPanner) {
                this.nodePools.panner.release(leftPanner);
            }
            if (rightPanner) {
                this.nodePools.panner.release(rightPanner);
            }
            if (filter) {
                this.nodePools.filter.release(filter);
            }
        }, Math.max(0, cleanupTime));

        return {
            oscillators: oscillators,
            gainNode: mixer,
            filter: filter,
            mainOscillator: mainOsc,
            stopBuffer: stopBuffer // Return buffer time for proper oscillator stopping
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
            const oscillators = synthResult.oscillators || [
                synthResult.oscillator || synthResult.mainOscillator
            ];
            const stopBuffer = synthResult.stopBuffer || 0.05;
            const stopTime = startTime + noteDuration + stopBuffer;

            oscillators.forEach(osc => {
                if (osc) {
                    osc.start(startTime);
                    osc.stop(stopTime); // Stop after envelope completes
                    this.currentlyPlaying.add(osc);

                    osc.addEventListener('ended', () => {
                        this.currentlyPlaying.delete(osc);
                    });
                }
            });
        }
    }

    /**
     * Create proper chord voicing with close harmony and musical spacing
     * Uses close position voicing in a comfortable musical range (octaves 3-4)
     * @param {Array} notes - Array of note names
     * @param {number} octave - Base octave for the chord (default 3 for better range)
     * @returns {Array} Array of {note, octave, pan} objects with proper voicing
     */
    createChordVoicing(notes, octave = 3) {
        if (notes.length === 0) {
            return [];
        }

        const voicing = [];

        // Start with the root note in the bass
        const rootNoteIndex = this.musicTheory.getNoteIndex(notes[0]);
        voicing.push({ note: notes[0], octave: octave, pan: 0 });

        // Place remaining notes in true close position (within an octave above bass)
        if (notes.length > 1) {
            let currentOctave = octave;

            for (let i = 1; i < notes.length; i++) {
                const currentNoteIndex = this.musicTheory.getNoteIndex(notes[i]);
                const previousNoteIndex = this.musicTheory.getNoteIndex(notes[i - 1]);

                // If current note is lower in chromatic scale than previous,
                // we need to go up an octave to maintain ascending order
                if (currentNoteIndex <= previousNoteIndex) {
                    currentOctave++;
                }

                voicing.push({ note: notes[i], octave: currentOctave, pan: 0 });
            }

            // Ensure upper voices aren't too high - keep within reasonable range
            // If the highest note is more than 2 octaves above root, bring everything down
            const highestVoice = voicing[voicing.length - 1];
            const rootMidi = rootNoteIndex + octave * 12;
            const highestMidi = this.musicTheory.getNoteIndex(highestVoice.note) + highestVoice.octave * 12;

            if (highestMidi - rootMidi > 19) { // More than an octave + perfect 5th
                // Bring upper voices down an octave for better spacing
                for (let i = 1; i < voicing.length; i++) {
                    voicing[i].octave--;
                }
            }
        }

        // Add pan positions for stereo spread
        const noteCount = voicing.length;
        voicing.forEach((voice, index) => {
            // Spread notes across stereo field: -0.4 to +0.4
            voice.pan =
                noteCount > 1 ? ((index / (noteCount - 1)) - 0.5) * 0.8 : 0;
        });

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

        // Create proper chord voicing with pan positions
        const voicing = this.createChordVoicing(notes, octave);

        // Calculate dynamic gain based on chord size
        const avgFrequency =
            voicing.reduce(
                (sum, v) => sum + this.musicTheory.getNoteFrequency(v.note, v.octave),
                0
            ) / voicing.length;
        const dynamicGainValue = this.calculateDynamicGain(voicing.length, avgFrequency);

        // Create dynamic gain node for the entire chord
        const chordGain = this.nodePools.gain.acquire();
        chordGain.gain.value = dynamicGainValue;
        chordGain.connect(this.masterGain);

        // Emit chord start events for highlighting
        voicing.forEach(({ note }) => {
            this.emitNoteEvent(note, 'chord-start');
        });

        voicing.forEach(({ note, octave: noteOctave, pan }) => {
            const frequency = this.musicTheory.getNoteFrequency(note, noteOctave);

            const synthResult = this.createOscillator(
                frequency,
                startTime,
                chordDuration,
                this.settings.waveform,
                pan
            );

            if (synthResult) {
                const noteOscillators = synthResult.oscillators || [
                    synthResult.oscillator || synthResult.mainOscillator
                ];
                const stopBuffer = synthResult.stopBuffer || 0.05;
                const stopTime = startTime + chordDuration + stopBuffer;

                // Disconnect from master gain and connect through chord gain instead
                if (synthResult.filter) {
                    synthResult.filter.disconnect();
                    synthResult.filter.connect(chordGain);
                } else if (synthResult.gainNode) {
                    synthResult.gainNode.disconnect();
                    synthResult.gainNode.connect(chordGain);
                }

                noteOscillators.forEach(osc => {
                    if (osc) {
                        osc.start(startTime);
                        osc.stop(stopTime);
                        oscillators.push(osc);
                        this.currentlyPlaying.add(osc);
                    }
                });
            }
        });

        // Clean up after chord ends
        const cleanupTime = (startTime + chordDuration + 0.1 - this.audioContext.currentTime) * 1000;
        setTimeout(() => {
            this.nodePools.gain.release(chordGain);
        }, Math.max(0, cleanupTime));

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
                const oscillators = synthResult.oscillators || [
                    synthResult.oscillator || synthResult.mainOscillator
                ];
                const stopBuffer = synthResult.stopBuffer || 0.05;
                const stopTime = currentTime + noteDuration + stopBuffer;

                oscillators.forEach(osc => {
                    if (osc) {
                        osc.start(currentTime);
                        osc.stop(stopTime);
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
     * Find optimal voice assignment between two chords for smooth voice leading
     * Uses greedy algorithm: prioritize common tones, then smallest movements
     * @param {Array} voicing1 - First chord voicing [{note, octave}, ...]
     * @param {Array} voicing2 - Second chord voicing [{note, octave}, ...]
     * @returns {Object} Assignment info with movements array and total movement
     */
    findOptimalVoiceAssignment(voicing1, voicing2) {
        if (!voicing1 || !voicing2 || voicing1.length === 0 || voicing2.length === 0) {
            return { movements: [], totalMovement: 0, maxLeap: 0, topVoiceMovement: 0 };
        }

        // Convert voicings to MIDI numbers for easier calculation
        const getMidi = (voice) => this.musicTheory.getNoteIndex(voice.note) + voice.octave * 12;

        const chord1Midi = voicing1.map(v => ({ ...v, midi: getMidi(v) }));
        const chord2Midi = voicing2.map(v => ({ ...v, midi: getMidi(v) }));

        // Track which notes in chord2 have been assigned
        const assigned = new Array(chord2Midi.length).fill(false);
        const movements = [];

        // Phase 1: Assign common tones (same note name, prefer same octave)
        for (let i = 0; i < chord1Midi.length; i++) {
            const voice1 = chord1Midi[i];
            let bestMatch = -1;
            let bestDistance = Infinity;

            // Look for same note name
            for (let j = 0; j < chord2Midi.length; j++) {
                if (!assigned[j] && voice1.note === chord2Midi[j].note) {
                    const distance = Math.abs(voice1.midi - chord2Midi[j].midi);
                    if (distance < bestDistance) {
                        bestDistance = distance;
                        bestMatch = j;
                    }
                }
            }

            // If we found a common tone, assign it
            if (bestMatch !== -1) {
                assigned[bestMatch] = true;
                movements.push({
                    from: voice1,
                    to: chord2Midi[bestMatch],
                    distance: bestDistance
                });
            }
        }

        // Phase 2: Assign remaining voices using greedy nearest-neighbor
        for (let i = 0; i < chord1Midi.length; i++) {
            // Skip if already assigned in phase 1
            if (movements.find(m => m.from === chord1Midi[i])) {
                continue;
            }

            const voice1 = chord1Midi[i];
            let bestMatch = -1;
            let bestDistance = Infinity;

            // Find closest unassigned note
            for (let j = 0; j < chord2Midi.length; j++) {
                if (!assigned[j]) {
                    const distance = Math.abs(voice1.midi - chord2Midi[j].midi);
                    if (distance < bestDistance) {
                        bestDistance = distance;
                        bestMatch = j;
                    }
                }
            }

            if (bestMatch !== -1) {
                assigned[bestMatch] = true;
                movements.push({
                    from: voice1,
                    to: chord2Midi[bestMatch],
                    distance: bestDistance
                });
            }
        }

        // Calculate metrics
        const totalMovement = movements.reduce((sum, m) => sum + m.distance, 0);
        const maxLeap = movements.length > 0 ? Math.max(...movements.map(m => m.distance)) : 0;
        const topVoiceMovement = movements.length > 0 ? movements[movements.length - 1].distance : 0;

        return { movements, totalMovement, maxLeap, topVoiceMovement };
    }

    /**
     * Calculate voice leading movement between two chords using optimal voice assignment
     * @param {Array} chord1 - First chord voicing [{note, octave}, ...]
     * @param {Array} chord2 - Second chord voicing [{note, octave}, ...]
     * @returns {number} Total semitone movement
     */
    calculateVoiceMovement(chord1, chord2) {
        const assignment = this.findOptimalVoiceAssignment(chord1, chord2);
        return assignment.totalMovement;
    }

    /**
     * Generate multiple voicing candidates for a chord
     * Includes root position, inversions, and different octave placements
     * @param {Array} notes - Chord notes
     * @param {number} targetOctave - Target octave for voicings
     * @returns {Array} Array of voicing candidates
     */
    generateVoicingCandidates(notes, targetOctave = 3) {
        const candidates = [];

        // Try each inversion
        for (let inversion = 0; inversion < notes.length; inversion++) {
            const invertedNotes = [...notes.slice(inversion), ...notes.slice(0, inversion)];

            // Try different octave placements (octave 2, 3, and 4)
            for (let octave = Math.max(2, targetOctave - 1); octave <= targetOctave + 1; octave++) {
                const voicing = this.createChordVoicing(invertedNotes, octave);
                candidates.push(voicing);
            }
        }

        return candidates;
    }

    /**
     * Score a voicing based on multiple musical criteria
     * Lower scores are better
     * @param {Array} voicing - Chord voicing to score
     * @param {Array} previousVoicing - Previous chord voicing (for voice leading)
     * @returns {number} Score (lower is better)
     */
    scoreVoicing(voicing, previousVoicing = null) {
        let score = 0;

        // If no previous voicing, just score the voicing itself
        if (!previousVoicing || previousVoicing.length === 0) {
            // Prefer voicings in comfortable range (C3 to C5)
            const getMidi = (voice) => this.musicTheory.getNoteIndex(voice.note) + voice.octave * 12;
            const avgMidi = voicing.reduce((sum, v) => sum + getMidi(v), 0) / voicing.length;
            const idealMidi = 60; // C4
            score += Math.abs(avgMidi - idealMidi) * 0.5; // Range penalty

            return score;
        }

        // Get optimal voice assignment
        const assignment = this.findOptimalVoiceAssignment(previousVoicing, voicing);

        // Factor 1: Total voice movement (40% weight)
        // Prefer minimal total movement
        score += assignment.totalMovement * 0.4;

        // Factor 2: Top voice smoothness (40% weight)
        // The melody (top voice) should move smoothly
        score += assignment.topVoiceMovement * 0.8;

        // Factor 3: Maximum leap penalty (20% weight)
        // Penalize large leaps in any voice
        if (assignment.maxLeap > 7) { // More than a perfect 5th
            score += (assignment.maxLeap - 7) * 2;
        }

        // Factor 4: Range penalty
        // Prefer voicings in comfortable range
        const getMidi = (voice) => this.musicTheory.getNoteIndex(voice.note) + voice.octave * 12;
        const avgMidi = voicing.reduce((sum, v) => sum + getMidi(v), 0) / voicing.length;
        const idealMidi = 60; // C4
        score += Math.abs(avgMidi - idealMidi) * 0.3;

        // Factor 5: Spacing penalty
        // Penalize overly wide spacing in upper voices
        if (voicing.length >= 2) {
            const topTwoMidi = voicing.slice(-2).map(getMidi);
            const spacing = topTwoMidi[1] - topTwoMidi[0];
            if (spacing > 12) { // More than an octave between top two voices
                score += (spacing - 12) * 0.5;
            }
        }

        return score;
    }

    /**
     * Find the best chord voicing for smooth voice leading
     * Uses comprehensive search and scoring based on multiple musical criteria
     * @param {Array} notes - Chord notes
     * @param {Array} previousVoicing - Previous chord voicing
     * @param {number} octave - Base octave (default 3 for better range)
     * @returns {Array} Optimized chord voicing
     */
    optimizeChordVoicing(notes, previousVoicing, octave = 3) {
        if (!previousVoicing || previousVoicing.length === 0) {
            return this.createChordVoicing(notes, octave);
        }

        // Generate multiple voicing candidates
        const candidates = this.generateVoicingCandidates(notes, octave);

        // Score each candidate
        let bestVoicing = candidates[0];
        let bestScore = this.scoreVoicing(candidates[0], previousVoicing);

        for (let i = 1; i < candidates.length; i++) {
            const score = this.scoreVoicing(candidates[i], previousVoicing);
            if (score < bestScore) {
                bestScore = score;
                bestVoicing = candidates[i];
            }
        }

        return bestVoicing;
    }

    /**
     * Play a chord progression with optimized voice leading
     *
     * @param {string} key - Key signature (e.g., 'C', 'G', 'F#')
     * @param {string} mode - Major or minor
     * @param {string} progressionName - Name of the progression (e.g., 'ii-V-I', 'I-V-vi-IV')
     * @param {Object} previousVoicing - Previous voicing for voice leading (optional)
     * @returns {Object} Object containing finalVoicing and totalDuration
     *
     * @description
     * This method plays a chord progression with sophisticated voice leading optimization:
     *
     * 1. **Key Consistency**: All chords are derived from the specified key and mode.
     *    Roman numerals are converted to actual chord roots using the scale of the given key.
     *    Example: In C major, 'ii' → D minor, 'V' → G major, 'I' → C major
     *
     * 2. **Voice Leading Optimization**: Each chord is voiced to minimize voice movement
     *    from the previous chord, creating smooth melodic lines in all voices.
     *    - Common tones are retained in the same voice
     *    - Other voices move by the smallest possible interval
     *    - Top voice (melody) is prioritized for smooth stepwise motion
     *
     * 3. **Diatonic Integrity**: All chord notes are guaranteed to be diatonic to the key
     *    (except in minor mode where the V chord may use the raised leading tone)
     *
     * 4. **Loop Compatibility**: Returns the final voicing so it can be used as the
     *    previousVoicing parameter in the next iteration, ensuring smooth loop transitions
     */
    async playProgression(key, mode, progressionName, previousVoicing = null) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const progressions = this.musicTheory.getChordProgressions(key, mode);
        const progression = progressions[progressionName];

        if (!progression) {
            console.warn(`Progression ${progressionName} not found for ${key} ${mode}`);
            return { finalVoicing: null, totalDuration: 0 };
        }

        const chordDuration = this.settings.progressionNoteLength;
        let currentTime = this.audioContext.currentTime;
        let lastVoicing = previousVoicing;

        // Process each chord in the progression
        // All chords are derived from the same key - no modulation occurs
        progression.roman.forEach((romanNumeral, _index) => {
            // Convert roman numeral to actual chord root in the current key
            // This ensures all chords are diatonic to the key
            const chordRoot = this.musicTheory.romanToChord(romanNumeral, key, mode);

            // Determine chord quality (major, minor, diminished) from roman numeral
            const chordQuality = this.getChordQuality(romanNumeral, mode);

            // Get the actual notes of the chord
            const chordNotes = this.musicTheory.getChordNotes(chordRoot, chordQuality);

            // Optimize voice leading for smooth progression
            // This chooses the best inversion and octave placement to minimize voice movement
            const voicing = this.optimizeChordVoicing(chordNotes, lastVoicing, 3);
            lastVoicing = voicing;

            // Emit progression chord events for highlighting
            voicing.forEach(({ note }) => {
                this.emitNoteEvent(note, 'progression-chord');
            });

            // Calculate dynamic gain for this chord
            const avgFrequency =
                voicing.reduce(
                    (sum, v) => sum + this.musicTheory.getNoteFrequency(v.note, v.octave),
                    0
                ) / voicing.length;
            const dynamicGainValue = this.calculateDynamicGain(voicing.length, avgFrequency);

            // Create dynamic gain node for this chord
            const chordGain = this.nodePools.gain.acquire();
            chordGain.gain.value = dynamicGainValue;
            chordGain.connect(this.masterGain);

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
                    const noteOscillators = synthResult.oscillators || [
                        synthResult.oscillator || synthResult.mainOscillator
                    ];
                    const stopBuffer = synthResult.stopBuffer || 0.05;
                    const stopTime = currentTime + chordDuration + stopBuffer;

                    // Disconnect from master gain and connect through chord gain
                    if (synthResult.filter) {
                        synthResult.filter.disconnect();
                        synthResult.filter.connect(chordGain);
                    } else if (synthResult.gainNode) {
                        synthResult.gainNode.disconnect();
                        synthResult.gainNode.connect(chordGain);
                    }

                    noteOscillators.forEach(osc => {
                        if (osc) {
                            osc.start(currentTime);
                            osc.stop(stopTime);
                            oscillators.push(osc);
                            this.currentlyPlaying.add(osc);
                        }
                    });
                }
            });

            // Play percussion pattern if enabled
            if (this.settings.percussionEnabled) {
                this.playPercussionPattern(currentTime, chordDuration);
            }

            // Schedule cleanup for chord gain
            const cleanupDelay = (currentTime + chordDuration + 0.1 - this.audioContext.currentTime) * 1000;
            setTimeout(() => {
                this.nodePools.gain.release(chordGain);
            }, Math.max(0, cleanupDelay));

            // Clean up
            oscillators.forEach(osc => {
                osc.addEventListener('ended', () => {
                    this.currentlyPlaying.delete(osc);
                });
            });

            currentTime += chordDuration;
        });

        const totalDuration = progression.roman.length * chordDuration;
        return { finalVoicing: lastVoicing, totalDuration };
    }

    /**
     * Play a chord progression with looping
     * Maintains consistent key and smooth voice leading across loop boundaries
     *
     * @param {string} key - Key signature (e.g., 'C', 'G', 'F#')
     * @param {string} mode - Major or minor
     * @param {string} progressionName - Name of the progression (e.g., 'ii-V-I')
     *
     * @description
     * This method ensures that:
     * 1. The progression stays in the same key throughout all loop iterations
     * 2. Voice leading is optimized across loop boundaries (last chord → first chord)
     * 3. The final voicing of each iteration is used as the starting point for the next
     * 4. No key modulation occurs - all chords remain diatonic to the original key
     */
    async playProgressionLoop(key, mode, progressionName) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        // Store loop parameters - these remain constant throughout all iterations
        // This ensures the progression never changes keys
        this.loopState.enabled = true;
        this.loopState.currentKey = key;           // Key is locked for all iterations
        this.loopState.currentMode = mode;         // Mode is locked for all iterations
        this.loopState.currentProgression = progressionName;

        // Play first iteration
        // If previousVoicing exists from a previous loop, use it for smooth continuation
        const result = await this.playProgression(key, mode, progressionName, this.loopState.previousVoicing);

        if (!result || result.totalDuration === 0) {
            this.loopState.enabled = false;
            return;
        }

        // Store final voicing for smooth loop transition
        // This voicing will be used to optimize voice leading when looping back to the first chord
        this.loopState.previousVoicing = result.finalVoicing;

        // Schedule next iteration if looping is still enabled
        if (this.loopState.enabled) {
            const scheduleNextLoop = () => {
                if (!this.loopState.enabled) {
                    return;
                }

                // Play next iteration with voice leading from previous
                // IMPORTANT: We always use the stored key, mode, and progression
                // This guarantees no key changes occur during looping
                this.playProgression(
                    this.loopState.currentKey,        // Same key as first iteration
                    this.loopState.currentMode,       // Same mode as first iteration
                    this.loopState.currentProgression,
                    this.loopState.previousVoicing    // Voice leading from last chord
                ).then(nextResult => {
                    if (nextResult && nextResult.finalVoicing) {
                        // Update voicing for next loop iteration
                        this.loopState.previousVoicing = nextResult.finalVoicing;
                    }

                    // Schedule next loop after current one completes
                    if (this.loopState.enabled) {
                        this.loopState.timeoutId = setTimeout(scheduleNextLoop, nextResult.totalDuration * 1000);
                    }
                });
            };

            // Schedule next loop to start when current one completes
            this.loopState.timeoutId = setTimeout(scheduleNextLoop, result.totalDuration * 1000);
        }
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
     * Create kick drum sound using oscillator with pitch envelope
     * @param {number} startTime - When to start the kick drum
     * @returns {Object} Audio nodes for cleanup
     */
    createKickDrum(startTime) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        // Kick drum: pitch envelope from 150Hz to 40Hz
        osc.frequency.setValueAtTime(150, startTime);
        osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.05);

        // Volume envelope: quick attack, short decay
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(this.settings.percussionVolume * 1.2, startTime + 0.001);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGain);

        const stopTime = startTime + 0.15;
        osc.start(startTime);
        osc.stop(stopTime);

        this.currentlyPlaying.add(osc);
        osc.addEventListener('ended', () => {
            this.currentlyPlaying.delete(osc);
        });

        return { oscillator: osc, gainNode: gain };
    }

    /**
     * Create snare drum sound using noise with bandpass filter
     * @param {number} startTime - When to start the snare drum
     * @returns {Object} Audio nodes for cleanup
     */
    createSnareDrum(startTime) {
        // Create noise buffer
        const bufferSize = this.audioContext.sampleRate * 0.1;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        filter.Q.value = 1;

        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(this.settings.percussionVolume * 0.8, startTime + 0.001);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        const stopTime = startTime + 0.1;
        noise.start(startTime);
        noise.stop(stopTime);

        this.currentlyPlaying.add(noise);
        noise.addEventListener('ended', () => {
            this.currentlyPlaying.delete(noise);
        });

        return { source: noise, filter: filter, gainNode: gain };
    }

    /**
     * Create hi-hat sound using high-frequency noise
     * @param {number} startTime - When to start the hi-hat
     * @returns {Object} Audio nodes for cleanup
     */
    createHiHat(startTime) {
        // Create noise buffer
        const bufferSize = this.audioContext.sampleRate * 0.05;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 7000;

        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(this.settings.percussionVolume * 0.3, startTime + 0.001);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        const stopTime = startTime + 0.05;
        noise.start(startTime);
        noise.stop(stopTime);

        this.currentlyPlaying.add(noise);
        noise.addEventListener('ended', () => {
            this.currentlyPlaying.delete(noise);
        });

        return { source: noise, filter: filter, gainNode: gain };
    }

    /**
     * Play percussion pattern for one chord duration
     * @param {number} startTime - When to start the pattern
     * @param {number} duration - Duration of the chord (pattern length)
     */
    playPercussionPattern(startTime, duration) {
        if (!this.settings.percussionEnabled) {
            return;
        }

        // Kick drum on beat 1
        this.createKickDrum(startTime);

        // Hi-hat pattern: every quarter beat (4 hits per chord)
        const hiHatInterval = duration / 4;
        for (let i = 0; i < 4; i++) {
            this.createHiHat(startTime + i * hiHatInterval);
        }

        // Snare on beat 3 (halfway through)
        this.createSnareDrum(startTime + duration / 2);
    }

    /**
     * Enable or disable percussion
     * @param {boolean} enabled - Whether percussion should be enabled
     */
    setPercussionEnabled(enabled) {
        this.settings.percussionEnabled = enabled;
    }

    /**
     * Enable or disable looping
     * @param {boolean} enabled - Whether looping should be enabled
     */
    setLoopingEnabled(enabled) {
        if (!enabled && this.loopState.enabled) {
            // Disable looping - clear timeout but let current iteration finish
            if (this.loopState.timeoutId) {
                clearTimeout(this.loopState.timeoutId);
                this.loopState.timeoutId = null;
            }
            this.loopState.enabled = false;
        }
        // Note: enabling is handled by playProgressionLoop
    }

    /**
     * Check if looping is currently enabled
     * @returns {boolean} True if looping is active
     */
    isLooping() {
        return this.loopState.enabled;
    }

    /**
     * Check if percussion is currently enabled
     * @returns {boolean} True if percussion is active
     */
    isPercussionEnabled() {
        return this.settings.percussionEnabled;
    }

    /**
     * Stop all currently playing audio
     */
    stopAll() {
        // Clear loop timeout if active
        if (this.loopState.timeoutId) {
            clearTimeout(this.loopState.timeoutId);
            this.loopState.timeoutId = null;
        }

        // Reset loop state
        this.loopState.enabled = false;
        this.loopState.currentKey = null;
        this.loopState.currentMode = null;
        this.loopState.currentProgression = null;
        this.loopState.previousVoicing = null;

        this.currentlyPlaying.forEach(oscillator => {
            try {
                oscillator.stop();
            } catch (error) {
                // Oscillator might already be stopped - this is expected behavior
                // Only log if it's an unexpected error
                if (error.name !== 'InvalidStateError') {
                    console.warn('Unexpected error stopping oscillator:', error);
                }
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
            const stopBuffer = synthResult.stopBuffer || 0.05;
            const stopTime = startTime + duration + stopBuffer;

            oscillators.forEach(osc => {
                if (osc) {
                    osc.start(startTime);
                    osc.stop(stopTime);
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

            // Optimize voice leading (octave 3 for better range)
            const voicing = this.optimizeChordVoicing(chordNotes, previousVoicing, 3);
            previousVoicing = voicing;

            // Schedule chord with precise timing
            this.scheduleChord(chordNotes, 3, currentTime, chordDuration);

            currentTime += chordDuration;
        });
    }

    /**
     * Cleanup resources
     */
    dispose() {
        this.stopScheduler();
        this.stopAll();

        // Clear node pools
        if (this.nodePools) {
            Object.values(this.nodePools).forEach(pool => {
                if (pool && pool.clear) {
                    pool.clear();
                }
            });
        }

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

/**
 * Interactions Handler for Circle of Fifths
 * Manages user input, events, and UI updates
 */

import { loggers } from './logger.js';

/**
 * Handles all user interactions with the Circle of Fifths interface.
 * Manages mouse/touch events, keyboard shortcuts, audio controls, and UI updates.
 *
 * @class InteractionsHandler
 * @example
 * const interactions = new InteractionsHandler(renderer, audioEngine, musicTheory);
 */
class InteractionsHandler {
    /**
     * Creates a new InteractionsHandler instance.
     * Sets up references to core components and initializes UI elements.
     *
     * @constructor
     * @param {CircleRenderer} circleRenderer - The circle visualization renderer
     * @param {CircleOfFifthsApp} app - The main app instance (for lazy audio loading)
     * @param {MusicTheory} musicTheory - The music theory calculation engine
     */
    constructor(circleRenderer, app, musicTheory) {
        this.circleRenderer = circleRenderer;
        this.app = app; // Store app reference for lazy audio loading
        this.musicTheory = musicTheory;

        this.isAudioInitialized = false;

        // Initialize logger
        this.logger = loggers?.interactions || console;

        // Audio playback state tracking
        this.playbackState = {
            scale: false,
            chord: false,
            progression: false,
            percussion: true, // Default enabled
            bass: false, // Default disabled
            loop: true // Default enabled
        };

        // Track currently playing progression
        this.currentPlayingProgression = null;

        // Current difficulty level (beginner or advanced)
        this.currentDifficulty = 'beginner';

        // Current relative key index for navigation
        this.currentRelativeIndex = 0;

        // ARIA live regions for accessibility
        this.audioStatusLiveRegion = document.getElementById('audio-status-live-region');
        this.playbackLiveRegion = document.getElementById('playback-live-region');

        // Tooltip element
        this.tooltip = document.getElementById('key-tooltip');
        this.tooltipKey = this.tooltip?.querySelector('.tooltip-key');
        this.tooltipMode = this.tooltip?.querySelector('.tooltip-mode');
        this.tooltipSignature = this.tooltip?.querySelector('.tooltip-signature');

        // UI elements
        this.elements = {
            svg: document.getElementById('circle-svg'),
            majorModeBtn: document.getElementById('major-mode'),
            minorModeBtn: document.getElementById('minor-mode'),
            playScaleBtn: document.getElementById('play-scale'),
            playChordBtn: document.getElementById('play-chord'),
            playProgressionBtn: document.getElementById('play-progression'),
            stopAudioBtn: document.getElementById('stop-audio'),
            togglePercussionBtn: document.getElementById('toggle-percussion'),
            toggleBassBtn: document.getElementById('toggle-bass'),
            toggleLoopBtn: document.getElementById('toggle-loop'),
            volumeSlider: document.getElementById('volume-slider'),
            volumeDisplay: document.getElementById('volume-display'),
            infoTitle: document.getElementById('info-title'),
            keySignature: document.getElementById('key-signature'),
            scaleNotes: document.getElementById('scale-notes'),
            relatedKeys: document.getElementById('related-keys'),
            chordProgressions: document.getElementById('chord-progressions'),
            loading: document.getElementById('loading'),
            helpBtn: document.getElementById('help-btn'),
            shortcutsModal: document.getElementById('shortcuts-modal'),
            closeShortcutsBtn: document.getElementById('close-shortcuts'),
            pianoKeyboard: document.getElementById('piano-keyboard')
        };

        this.init();
        // Audio visual sync will be set up when audio engine is first loaded
    }

    /**
     * Get current key from circle renderer
     */
    get currentKey() {
        return this.circleRenderer.getState().selectedKey;
    }

    /**
     * Get current mode from circle renderer
     */
    get currentMode() {
        return this.circleRenderer.getState().currentMode;
    }

    /**
     * Get audio engine (lazy loads if not yet loaded)
     * @async
     * @returns {Promise<AudioEngine>} The audio engine instance
     */
    async getAudioEngine() {
        return await this.app.getAudioEngine();
    }

    /**
     * Get audio engine synchronously (returns null if not loaded)
     * Use this for settings access when audio engine might not be loaded yet
     * @returns {AudioEngine|null} The audio engine instance or null
     */
    get audioEngine() {
        return this.app.audioEngine;
    }

    /**
     * Setup audio-visual synchronization for note highlighting
     * Called after audio engine is loaded
     */
    async setupAudioVisualSync() {
        const audioEngine = await this.getAudioEngine();

        // Listen for note events from audio engine
        audioEngine.addNoteEventListener(event => {
            const { note, eventType } = event;

            switch (eventType) {
                case 'start':
                    // Scale note highlighting - brief flash
                    this.circleRenderer.highlightNote(note, 600, 'note');
                    // Piano keyboard highlighting
                    this.highlightPianoNote(note);
                    setTimeout(() => this.clearPianoHighlight(note), 500);
                    break;
                case 'chord-start':
                    // Chord note highlighting - longer duration
                    this.circleRenderer.highlightNote(
                        note,
                        audioEngine.settings.chordLength * 1000,
                        'chord'
                    );
                    // Piano keyboard highlighting
                    this.highlightPianoNote(note);
                    setTimeout(
                        () => this.clearPianoHighlight(note),
                        audioEngine.settings.chordLength * 900
                    );
                    break;
                case 'progression-chord':
                    // Progression chord highlighting - duration of chord in progression
                    this.circleRenderer.highlightNote(
                        note,
                        audioEngine.settings.progressionNoteLength * 1000,
                        'progression'
                    );
                    // Piano keyboard highlighting
                    this.highlightPianoNote(note);
                    setTimeout(
                        () => this.clearPianoHighlight(note),
                        audioEngine.settings.progressionNoteLength * 900
                    );
                    break;
            }
        });
    }

    /**
     * Initialize all event listeners and UI components.
     * Sets up circle interactions, mode toggles, audio controls, and keyboard navigation.
     *
     * @example
     * interactions.init(); // Set up all event handlers
     */
    init() {
        this.setupCircleInteractions();
        this.setupModeToggle();
        this.setupAudioControls();
        this.setupVolumeControl();
        this.setupAudioSettings();
        this.setupKeyboardNavigation();
        this.setupInfoPanelInteractions();
        this.setupHelpModal();
        this.updateInfoPanel();
        this.initializeDefaultToggleStates();

        // Hide loading screen after initialization
        setTimeout(() => this.hideLoading(), 500);
    }

    /**
     * Setup circle click and hover interactions
     */
    setupCircleInteractions() {
        if (!this.elements.svg) {
            return;
        }

        // Click events
        this.elements.svg.addEventListener('click', event => {
            const keySegment = event.target.closest('.key-segment');
            if (keySegment) {
                const key = keySegment.getAttribute('data-key');
                this.selectKey(key);
            }
        });

        // Hover events
        this.elements.svg.addEventListener('mouseover', event => {
            const keySegment = event.target.closest('.key-segment');
            if (keySegment) {
                const key = keySegment.getAttribute('data-key');
                this.circleRenderer.addHoverEffect(key);
                this.showKeyTooltip(key, event);
            }
        });

        this.elements.svg.addEventListener('mouseout', event => {
            const keySegment = event.target.closest('.key-segment');
            if (keySegment) {
                const key = keySegment.getAttribute('data-key');
                this.circleRenderer.removeHoverEffect(key);
                this.hideKeyTooltip();
            }
        });

        // Enhanced touch events for mobile
        this.setupTouchEvents();

        // Keyboard navigation
        this.setupKeyboardNavigation();

        // Custom events from circle renderer
        this.elements.svg.addEventListener('keySelected', _event => {
            this.updateInfoPanel();
        });

        this.elements.svg.addEventListener('modeChanged', _event => {
            this.updateInfoPanel();
        });
    }

    /**
     * Setup enhanced touch events for mobile devices
     */
    setupTouchEvents() {
        if (!this.elements.svg) {
            return;
        }

        let touchStartTime = 0;
        let touchStartElement = null;
        let touchMoved = false;

        // Touch start
        this.elements.svg.addEventListener(
            'touchstart',
            event => {
                touchStartTime = Date.now();
                touchMoved = false;

                const touch = event.touches[0];
                touchStartElement = document.elementFromPoint(touch.clientX, touch.clientY);

                // Prevent default to avoid double-tap zoom and scrolling
                if (touchStartElement?.closest('.key-segment')) {
                    event.preventDefault();
                }
            },
            { passive: false }
        );

        // Touch move - detect if user is scrolling
        this.elements.svg.addEventListener(
            'touchmove',
            _event => {
                touchMoved = true;
            },
            { passive: true }
        );

        // Touch end - handle tap
        this.elements.svg.addEventListener(
            'touchend',
            event => {
                event.preventDefault();

                const touchDuration = Date.now() - touchStartTime;

                // Only process as tap if:
                // 1. Touch was brief (< 500ms)
                // 2. User didn't move much (not scrolling)
                // 3. We have a valid start element
                if (touchDuration < 500 && !touchMoved && touchStartElement) {
                    const keySegment = touchStartElement.closest('.key-segment');
                    if (keySegment) {
                        const key = keySegment.getAttribute('data-key');
                        this.selectKey(key);

                        // Provide haptic feedback if available
                        if (navigator.vibrate) {
                            navigator.vibrate(50);
                        }
                    }
                }

                // Reset touch state
                touchStartElement = null;
                touchMoved = false;
            },
            { passive: false }
        );

        // Touch cancel
        this.elements.svg.addEventListener(
            'touchcancel',
            () => {
                touchStartElement = null;
                touchMoved = false;
            },
            { passive: true }
        );
    }

    /**
     * Setup keyboard navigation for accessibility
     */
    setupKeyboardNavigation() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', event => {
            // Skip if user is typing in an input
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            switch (event.key) {
                case 'ArrowLeft':
                case 'ArrowRight':
                    event.preventDefault();
                    this.navigateKeys(event.key === 'ArrowRight' ? 1 : -1);
                    break;
                case 'ArrowUp':
                case 'ArrowDown':
                    event.preventDefault();
                    this.navigateRelativeKeys(event.key === 'ArrowUp' ? -1 : 1);
                    break;
                case ' ':
                case 'Enter':
                    event.preventDefault();
                    this.playCurrentKey();
                    break;
                case 's':
                case 'S':
                    if (!event.ctrlKey && !event.metaKey) {
                        event.preventDefault();
                        this.playScale();
                    }
                    break;
                case 'c':
                case 'C':
                    if (!event.ctrlKey && !event.metaKey) {
                        event.preventDefault();
                        this.playChord();
                    }
                    break;
                case 'p':
                case 'P':
                    if (!event.ctrlKey && !event.metaKey) {
                        event.preventDefault();
                        this.playProgression();
                    }
                    break;
                case 'm':
                case 'M':
                    if (!event.ctrlKey && !event.metaKey) {
                        event.preventDefault();
                        this.toggleMode();
                    }
                    break;
                case 'Escape':
                    // Close shortcuts modal if open, otherwise close dropdowns and stop audio
                    if (this.elements.shortcutsModal?.getAttribute('aria-hidden') === 'false') {
                        this.closeShortcutsModal();
                    } else {
                        this.closeDropdowns();
                        this.stopAudio();
                    }
                    break;
                case '?':
                    event.preventDefault();
                    this.openShortcutsModal();
                    break;
            }
        });

        // Add focus indicators to key segments
        this.addKeyboardFocusSupport();
    }

    /**
     * Navigate through keys using keyboard
     */
    navigateKeys(direction) {
        const keys = this.musicTheory.getCircleOfFifthsKeys();
        const currentIndex = keys.indexOf(this.currentKey);
        let newIndex = (currentIndex + direction + keys.length) % keys.length;

        this.selectKey(keys[newIndex]);
        this.announceKeyChange(keys[newIndex]);
    }

    /**
     * Navigate through relative keys
     */
    navigateRelativeKeys(direction) {
        const relatedKeysObj = this.musicTheory.getRelatedKeys(this.currentKey, this.currentMode);
        if (!relatedKeysObj) {
            return;
        }

        // Convert to array for navigation
        const relatedKeys = [
            { key: relatedKeysObj.dominant.key, relationship: 'dominant' },
            { key: relatedKeysObj.subdominant.key, relationship: 'subdominant' },
            { key: relatedKeysObj.relative.key, relationship: 'relative' }
        ];

        const newIndex =
            (this.currentRelativeIndex + direction + relatedKeys.length) % relatedKeys.length;

        this.currentRelativeIndex = newIndex;
        const newKey = relatedKeys[newIndex].key;
        this.selectKey(newKey);
        this.announceKeyChange(newKey, relatedKeys[newIndex].relationship);
    }

    /**
     * Add keyboard focus support to key segments
     */
    addKeyboardFocusSupport() {
        const keySegments = this.elements.svg.querySelectorAll('.key-segment');
        keySegments.forEach((segment, index) => {
            segment.setAttribute('tabindex', index === 0 ? '0' : '-1');
            segment.setAttribute('role', 'button');

            segment.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    const key = segment.getAttribute('data-key');
                    this.selectKey(key);
                }
            });

            segment.addEventListener('focus', () => {
                const key = segment.getAttribute('data-key');
                this.announceKeyFocus(key);
            });
        });
    }

    /**
     * Announce key changes for screen readers
     */
    announceKeyChange(key, relationship = null) {
        const mode = this.currentMode;
        let announcement = `${key} ${mode}`;

        if (relationship) {
            announcement += ` - ${relationship} key`;
        }

        this.announceToScreenReader(announcement);
    }

    /**
     * Announce key focus for screen readers
     */
    announceKeyFocus(key) {
        const mode = this.currentMode;
        this.announceToScreenReader(`Focused on ${key} ${mode}. Press Enter or Space to select.`);
    }

    /**
     * Announce text to screen readers using ARIA live region
     * @param {string} text - The text to announce
     * @example
     * this.announceToScreenReader('C major selected');
     */
    announceToScreenReader(text) {
        // Create or update live region for announcements
        let liveRegion = document.getElementById('sr-live-region');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'sr-live-region';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.position = 'absolute';
            liveRegion.style.left = '-10000px';
            liveRegion.style.width = '1px';
            liveRegion.style.height = '1px';
            liveRegion.style.overflow = 'hidden';
            document.body.appendChild(liveRegion);
        }

        liveRegion.textContent = text;
    }

    /**
     * Announce playback status to screen readers
     * @param {string} status - The playback status to announce
     * @example
     * this.announcePlaybackStatus('Playing C major scale');
     */
    announcePlaybackStatus(status) {
        if (this.playbackLiveRegion) {
            this.playbackLiveRegion.textContent = status;
        }
    }

    /**
     * Announce audio status to screen readers
     * @param {string} status - The audio status to announce
     * @example
     * this.announceAudioStatus('Audio initialized');
     */
    announceAudioStatus(status) {
        if (this.audioStatusLiveRegion) {
            this.audioStatusLiveRegion.textContent = status;
        }
    }

    /**
     * Close any open dropdowns
     */
    closeDropdowns() {
        const themeDropdown = document.getElementById('theme-dropdown');
        if (themeDropdown) {
            themeDropdown.setAttribute('aria-hidden', 'true');
            const themeBtn = document.getElementById('theme-toggle-btn');
            if (themeBtn) {
                themeBtn.setAttribute('aria-expanded', 'false');
            }
        }
    }

    /**
     * Toggle between major and minor modes
     */
    toggleMode() {
        const newMode = this.currentMode === 'major' ? 'minor' : 'major';
        this.switchMode(newMode);
    }

    /**
     * Play the current key (scale, chord, or note)
     */
    playCurrentKey() {
        // Default to playing the scale
        this.playScale();
    }

    /**
     * Setup mode toggle (Major/Minor)
     */
    setupModeToggle() {
        [this.elements.majorModeBtn, this.elements.minorModeBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    const mode = btn.getAttribute('data-mode');
                    this.switchMode(mode);
                });
            }
        });
    }

    /**
     * Setup audio control buttons
     */
    setupAudioControls() {
        if (this.elements.playScaleBtn) {
            this.elements.playScaleBtn.addEventListener('click', () => {
                this.playScale();
            });
        }

        if (this.elements.playChordBtn) {
            this.elements.playChordBtn.addEventListener('click', () => {
                this.playChord();
            });
        }

        if (this.elements.playProgressionBtn) {
            this.elements.playProgressionBtn.addEventListener('click', () => {
                this.playProgression();
            });
        }

        if (this.elements.togglePercussionBtn) {
            this.elements.togglePercussionBtn.addEventListener('click', () => {
                this.togglePercussion();
            });
        }

        if (this.elements.toggleBassBtn) {
            this.elements.toggleBassBtn.addEventListener('click', () => {
                this.toggleBass();
            });
        }

        if (this.elements.toggleLoopBtn) {
            this.elements.toggleLoopBtn.addEventListener('click', () => {
                this.toggleLoop();
            });
        }

        if (this.elements.stopAudioBtn) {
            this.elements.stopAudioBtn.addEventListener('click', () => {
                this.stopAudio();
            });
        }
    }

    /**
     * Initialize default toggle button states (percussion and loop enabled by default, bass disabled)
     */
    initializeDefaultToggleStates() {
        // Audio engine settings will be applied when it's loaded
        // For now, just update button visual states
        this.updateToggleButtonState('percussion', this.playbackState.percussion);
        this.updateToggleButtonState('bass', this.playbackState.bass);
        this.updateToggleButtonState('loop', this.playbackState.loop);

        this.logger.info(
            'Toggle buttons initialized: percussion and loop enabled, bass disabled by default'
        );
    }

    /**
     * Setup volume control slider
     */
    setupVolumeControl() {
        if (this.elements.volumeSlider && this.elements.volumeDisplay) {
            // Set initial volume (default 70% if audio engine not loaded yet)
            const initialVolume = this.audioEngine
                ? Math.round(this.audioEngine.settings.masterVolume * 100)
                : 70;
            this.elements.volumeSlider.value = initialVolume;
            this.elements.volumeDisplay.textContent = `${initialVolume}%`;
            this.elements.volumeSlider.setAttribute('aria-valuenow', String(initialVolume));
            this.elements.volumeSlider.setAttribute('aria-valuetext', `${initialVolume}%`);

            // Handle volume changes with debouncing for performance
            let volumeTimeout;
            this.elements.volumeSlider.addEventListener('input', event => {
                const volume = parseInt(event.target.value, 10);
                const volumeDecimal = volume / 100;

                // Update display immediately for responsiveness
                this.elements.volumeDisplay.textContent = `${volume}%`;
                event.target.setAttribute('aria-valuenow', volume);
                event.target.setAttribute('aria-valuetext', `${volume}%`);

                // Update volume icon based on level
                this.updateVolumeIcon(volume);

                // Debounce audio engine updates to reduce CPU usage
                // Only update if audio engine is loaded
                clearTimeout(volumeTimeout);
                volumeTimeout = setTimeout(async () => {
                    if (this.isAudioInitialized && this.audioEngine) {
                        this.audioEngine.setVolume(volumeDecimal);
                    }
                }, 50);
            });

            // Initialize volume icon
            this.updateVolumeIcon(initialVolume);
        }
    }

    /**
     * Update volume icon based on volume level
     * @param {number} volume - Volume level (0-100)
     * @example
     * this.updateVolumeIcon(75); // Shows high volume icon
     */
    updateVolumeIcon(volume) {
        const volumeIcon = document.querySelector('.volume-icon');
        if (volumeIcon) {
            if (volume === 0) {
                volumeIcon.textContent = '🔇'; // Muted
            } else if (volume < 30) {
                volumeIcon.textContent = '🔈'; // Low volume
            } else if (volume < 70) {
                volumeIcon.textContent = '🔉'; // Medium volume
            } else {
                volumeIcon.textContent = '🔊'; // High volume
            }
        }
    }

    /**
     * Setup advanced audio settings panel
     */
    setupAudioSettings() {
        const toggleBtn = document.getElementById('audio-settings-toggle');
        const panel = document.getElementById('audio-settings-panel');
        const waveformSelect = document.getElementById('waveform-select');
        const reverbTypeSelect = document.getElementById('reverb-type-select');
        const stereoWidthSlider = document.getElementById('stereo-width-slider');
        const reverbLevelSlider = document.getElementById('reverb-level-slider');
        const filterEnvelopeToggle = document.getElementById('filter-envelope-toggle');
        const stereoEnhancementToggle = document.getElementById('stereo-enhancement-toggle');

        if (!toggleBtn || !panel) {
            return;
        }

        // Toggle panel visibility
        toggleBtn.addEventListener('click', () => {
            const isHidden = panel.getAttribute('aria-hidden') === 'true';
            panel.setAttribute('aria-hidden', String(!isHidden));
            toggleBtn.setAttribute('aria-expanded', String(isHidden));
        });

        // Waveform selection
        if (waveformSelect) {
            // Set default value
            waveformSelect.value = 'warm-sine';
            waveformSelect.addEventListener('change', async e => {
                const audioEngine = await this.getAudioEngine();
                audioEngine.settings.waveform = e.target.value;
                this.logger.info(`Waveform changed to: ${e.target.value}`);
            });
        }

        // Reverb type selection
        if (reverbTypeSelect) {
            // Set default value
            reverbTypeSelect.value = 'room';
            reverbTypeSelect.addEventListener('change', async e => {
                const audioEngine = await this.getAudioEngine();
                audioEngine.settings.reverbType = e.target.value;
                // Reinitialize audio engine to apply new reverb
                audioEngine.isInitialized = false;
                await this.initializeAudio();
                this.logger.info(`Reverb type changed to: ${e.target.value}`);
            });
        }

        // Stereo width slider
        if (stereoWidthSlider) {
            // Set default value
            stereoWidthSlider.value = '0.25';
            document.getElementById('stereo-width-value').textContent = '0.25';

            stereoWidthSlider.addEventListener('input', async e => {
                const value = parseFloat(e.target.value);
                document.getElementById('stereo-width-value').textContent = value.toFixed(2);
                if (this.isAudioInitialized && this.audioEngine) {
                    this.audioEngine.settings.stereoWidth = value;
                }
            });
        }

        // Reverb level slider
        if (reverbLevelSlider) {
            // Set default value
            reverbLevelSlider.value = '0.20';
            document.getElementById('reverb-level-value').textContent = '0.20';

            reverbLevelSlider.addEventListener('input', async e => {
                const value = parseFloat(e.target.value);
                document.getElementById('reverb-level-value').textContent = value.toFixed(2);
                if (this.isAudioInitialized && this.audioEngine) {
                    this.audioEngine.settings.reverbLevel = value;
                }
            });
        }

        // Filter envelope toggle
        if (filterEnvelopeToggle) {
            // Set default value
            filterEnvelopeToggle.checked = true;
            filterEnvelopeToggle.addEventListener('change', async e => {
                if (this.isAudioInitialized && this.audioEngine) {
                    this.audioEngine.settings.useFilterEnvelope = e.target.checked;
                    this.logger.info(
                        `Filter envelope: ${e.target.checked ? 'enabled' : 'disabled'}`
                    );
                }
            });
        }

        // Stereo enhancement toggle
        if (stereoEnhancementToggle) {
            // Set default value
            stereoEnhancementToggle.checked = true;
            stereoEnhancementToggle.addEventListener('change', async e => {
                if (this.isAudioInitialized && this.audioEngine) {
                    this.audioEngine.settings.useStereoEnhancement = e.target.checked;
                    this.logger.info(
                        `Stereo enhancement: ${e.target.checked ? 'enabled' : 'disabled'}`
                    );
                }
            });
        }

        // Tempo slider
        const tempoSlider = document.getElementById('tempo-slider');
        const tempoValue = document.getElementById('tempo-value');
        if (tempoSlider && tempoValue) {
            // Set default value
            tempoSlider.value = '120';
            tempoValue.textContent = '120 BPM';

            tempoSlider.addEventListener('input', async e => {
                const bpm = parseInt(e.target.value, 10);
                tempoValue.textContent = `${bpm} BPM`;

                // Convert BPM to note durations
                // At 120 BPM, a quarter note is 0.5 seconds
                // We use this as a baseline for our note lengths
                const quarterNoteDuration = 60 / bpm;

                if (this.isAudioInitialized && this.audioEngine) {
                    // Scale note lengths based on tempo
                    // Base values at 120 BPM: noteLength=0.8, chordLength=1.5, progressionNoteLength=1.0
                    const tempoRatio = 120 / bpm;
                    this.audioEngine.settings.noteLength = 0.8 * tempoRatio;
                    this.audioEngine.settings.chordLength = 1.5 * tempoRatio;
                    this.audioEngine.settings.progressionNoteLength = quarterNoteDuration * 2; // Half note
                    this.logger.info(`Tempo changed to: ${bpm} BPM`);
                }
            });
        }
    }

    /**
     * Setup info panel interactions
     */
    setupInfoPanelInteractions() {
        // Related keys click events
        if (this.elements.relatedKeys) {
            this.elements.relatedKeys.addEventListener('click', event => {
                const relatedKey = event.target.closest('.related-key');
                if (relatedKey) {
                    const keyText = relatedKey.textContent;
                    const key = keyText.split(':')[1]?.trim().split(' ')[0];
                    if (key) {
                        this.selectKey(key);
                    }
                }
            });
        }

        // Chord progression buttons
        if (this.elements.chordProgressions) {
            this.elements.chordProgressions.addEventListener('click', event => {
                const progressionBtn = event.target.closest('.progression-btn');
                if (progressionBtn) {
                    const progression = progressionBtn.getAttribute('data-progression');
                    this.playSpecificProgression(progression);
                }
            });
        }
    }

    /**
     * Setup help modal interactions
     */
    setupHelpModal() {
        const { helpBtn, shortcutsModal, closeShortcutsBtn } = this.elements;

        if (helpBtn && shortcutsModal) {
            // Open modal on help button click
            helpBtn.addEventListener('click', () => {
                this.openShortcutsModal();
            });

            // Close modal on close button click
            if (closeShortcutsBtn) {
                closeShortcutsBtn.addEventListener('click', () => {
                    this.closeShortcutsModal();
                });
            }

            // Close modal on backdrop click
            const backdrop = shortcutsModal.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.addEventListener('click', () => {
                    this.closeShortcutsModal();
                });
            }

            // Close modal on Escape key
            shortcutsModal.addEventListener('keydown', event => {
                if (event.key === 'Escape') {
                    this.closeShortcutsModal();
                }
            });
        }
    }

    /**
     * Open the keyboard shortcuts modal
     */
    openShortcutsModal() {
        const { shortcutsModal, closeShortcutsBtn } = this.elements;
        if (shortcutsModal) {
            shortcutsModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            // Focus the close button for accessibility
            closeShortcutsBtn?.focus();
        }
    }

    /**
     * Close the keyboard shortcuts modal
     */
    closeShortcutsModal() {
        const { shortcutsModal, helpBtn } = this.elements;
        if (shortcutsModal) {
            shortcutsModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            // Return focus to help button
            helpBtn?.focus();
        }
    }

    /**
     * Select a key and update all related UI
     */
    selectKey(key) {
        this.circleRenderer.selectKey(key);
        this.updateInfoPanel();

        // Play a quick note to provide audio feedback
        if (this.isAudioInitialized) {
            this.audioEngine.playNote(key, 4, 0.3);
        }
    }

    /**
     * Switch between major and minor modes
     */
    switchMode(mode) {
        // Update button states
        this.elements.majorModeBtn?.classList.toggle('active', mode === 'major');
        this.elements.minorModeBtn?.classList.toggle('active', mode === 'minor');

        this.elements.majorModeBtn?.setAttribute('aria-pressed', String(mode === 'major'));
        this.elements.minorModeBtn?.setAttribute('aria-pressed', String(mode === 'minor'));

        // Update circle renderer
        this.circleRenderer.switchMode(mode);
        this.updateInfoPanel();
    }

    /**
     * Update the information panel
     */
    updateInfoPanel() {
        const state = this.circleRenderer.getState();
        const { selectedKey, currentMode } = state;

        // Update title
        if (this.elements.infoTitle) {
            this.elements.infoTitle.textContent = `${selectedKey} ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}`;
        }

        // Update key signature
        if (this.elements.keySignature) {
            const keySignature = this.musicTheory.getKeySignature(selectedKey, currentMode);
            this.elements.keySignature.textContent = keySignature.signature;
        }

        // Update scale notes
        if (this.elements.scaleNotes) {
            const scaleNotes = this.musicTheory.getScaleNotes(selectedKey, currentMode);
            this.elements.scaleNotes.textContent = scaleNotes.join(' - ');
        }

        // Update related keys
        this.updateRelatedKeys(selectedKey, currentMode);

        // Update chord progressions (always update to reflect current mode)
        this.updateChordProgressions(selectedKey, currentMode);

        // Update piano keyboard
        this.updatePianoKeyboard(selectedKey, currentMode);
    }

    /**
     * Update related keys display in the info panel
     * @param {string} key - The key to show related keys for (e.g., 'C', 'G')
     * @param {string} mode - The mode ('major' or 'minor')
     * @example
     * this.updateRelatedKeys('C', 'major');
     * // Displays: Dominant: G, Subdominant: F, Relative: Am
     */
    updateRelatedKeys(key, mode) {
        if (!this.elements.relatedKeys) {
            return;
        }

        const relatedKeys = this.musicTheory.getRelatedKeys(key, mode);
        if (!relatedKeys) {
            return;
        }

        // Clear existing content efficiently using replaceChildren()
        this.elements.relatedKeys.replaceChildren();

        const relationships = [
            {
                key: relatedKeys.dominant.key,
                mode: relatedKeys.dominant.mode,
                type: 'dominant',
                label: 'Dominant'
            },
            {
                key: relatedKeys.subdominant.key,
                mode: relatedKeys.subdominant.mode,
                type: 'subdominant',
                label: 'Subdominant'
            },
            {
                key: relatedKeys.relative.key,
                mode: relatedKeys.relative.mode,
                type: 'relative',
                label: 'Relative'
            }
        ];

        relationships.forEach(({ key: relKey, mode: relMode, type, label }) => {
            const span = document.createElement('span');
            span.className = 'related-key';
            span.setAttribute('data-relationship', type);
            span.setAttribute('data-key', relKey);
            span.setAttribute('data-mode', relMode);
            span.textContent = `${label}: ${relKey} ${relMode}`;
            span.style.cursor = 'pointer';
            span.setAttribute('role', 'button');
            span.setAttribute('tabindex', '0');
            span.setAttribute('aria-label', `${label}: ${relKey} ${relMode}. Click to select.`);

            this.elements.relatedKeys.appendChild(span);
        });
    }

    /**
     * Update chord progressions display in the info panel
     * @param {string} key - The key to show progressions for (e.g., 'C', 'G')
     * @param {string} mode - The mode ('major' or 'minor')
     * @example
     * this.updateChordProgressions('C', 'major');
     * // Displays buttons for: I-IV-V-I, I-V-vi-IV, etc.
     */
    updateChordProgressions(key, mode) {
        if (!this.elements.chordProgressions) {
            return;
        }

        const progressions = this.musicTheory.getChordProgressions(key, mode);

        // Clear existing content efficiently using replaceChildren()
        this.elements.chordProgressions.replaceChildren();

        Object.entries(progressions).forEach(([progressionKey, progression]) => {
            const button = document.createElement('button');
            button.className = 'progression-btn';
            button.setAttribute('data-progression', progressionKey);
            button.textContent = progression.roman.join(' - ');
            button.title = progression.description;

            this.elements.chordProgressions.appendChild(button);
        });
    }

    /**
     * Update piano keyboard to show scale notes
     * @param {string} key - The root key (e.g., 'C', 'G')
     * @param {string} mode - The mode ('major' or 'minor')
     */
    updatePianoKeyboard(key, mode) {
        if (!this.elements.pianoKeyboard) {
            return;
        }

        const pianoKeys = this.elements.pianoKeyboard.querySelectorAll('.piano-key');
        const scaleNotes = this.musicTheory.getScaleNotes(key, mode);

        // Normalize note names for comparison (handle enharmonics)
        const normalizeNote = note => {
            const enharmonics = {
                Db: 'C#',
                Eb: 'D#',
                Gb: 'F#',
                Ab: 'G#',
                Bb: 'A#',
                'C#': 'C#',
                'D#': 'D#',
                'F#': 'F#',
                'G#': 'G#',
                'A#': 'A#'
            };
            return enharmonics[note] || note;
        };

        const normalizedScaleNotes = scaleNotes.map(normalizeNote);
        const rootNote = normalizeNote(key);

        pianoKeys.forEach(pianoKey => {
            const keyNote = pianoKey.getAttribute('data-note');

            // Remove all highlight classes
            pianoKey.classList.remove('in-scale', 'root-note', 'playing');

            // Check if this key is in the scale
            if (normalizedScaleNotes.includes(keyNote)) {
                pianoKey.classList.add('in-scale');
            }

            // Check if this is the root note
            if (keyNote === rootNote) {
                pianoKey.classList.add('root-note');
            }
        });
    }

    /**
     * Highlight a specific note on the piano keyboard during playback
     * @param {string} note - The note to highlight (e.g., 'C', 'F#')
     */
    highlightPianoNote(note) {
        if (!this.elements.pianoKeyboard) {
            return;
        }

        const normalizeNote = n => {
            const enharmonics = {
                Db: 'C#',
                Eb: 'D#',
                Gb: 'F#',
                Ab: 'G#',
                Bb: 'A#'
            };
            return enharmonics[n] || n;
        };

        const normalizedNote = normalizeNote(note);
        const pianoKeys = this.elements.pianoKeyboard.querySelectorAll('.piano-key');

        pianoKeys.forEach(pianoKey => {
            const keyNote = pianoKey.getAttribute('data-note');
            if (keyNote === normalizedNote) {
                pianoKey.classList.add('playing');
            }
        });
    }

    /**
     * Clear playing highlight from piano keyboard
     * @param {string} [note] - Specific note to clear, or all if not provided
     */
    clearPianoHighlight(note) {
        if (!this.elements.pianoKeyboard) {
            return;
        }

        if (note) {
            const normalizeNote = n => {
                const enharmonics = {
                    Db: 'C#',
                    Eb: 'D#',
                    Gb: 'F#',
                    Ab: 'G#',
                    Bb: 'A#'
                };
                return enharmonics[n] || n;
            };
            const normalizedNote = normalizeNote(note);
            const pianoKey = this.elements.pianoKeyboard.querySelector(
                `.piano-key[data-note="${normalizedNote}"]`
            );
            if (pianoKey) {
                pianoKey.classList.remove('playing');
            }
        } else {
            const pianoKeys = this.elements.pianoKeyboard.querySelectorAll('.piano-key.playing');
            pianoKeys.forEach(key => key.classList.remove('playing'));
        }
    }

    /**
     * Audio control methods
     */
    async initializeAudio() {
        if (!this.isAudioInitialized) {
            this.showLoading('Initializing audio...');
            this.announceAudioStatus('Initializing audio system');

            try {
                // Lazy load audio engine
                const audioEngine = await this.getAudioEngine();

                // Apply saved playback states
                audioEngine.setPercussionEnabled(this.playbackState.percussion);
                audioEngine.setBassEnabled(this.playbackState.bass);
                audioEngine.setLoopingEnabled(this.playbackState.loop);

                // Setup audio-visual sync on first load
                if (!this.audioVisualSyncSetup) {
                    await this.setupAudioVisualSync();
                    this.audioVisualSyncSetup = true;
                }

                this.isAudioInitialized = true;
                this.hideLoading();
                this.announceAudioStatus('Audio system ready');
                this.logger.info('Audio engine lazy loaded and initialized successfully');
            } catch (error) {
                this.logger.error('Failed to initialize audio:', error);
                this.isAudioInitialized = false;
                this.hideLoading();
                this.showError('Failed to initialize audio. Please check your browser settings.');
                this.announceAudioStatus('Audio initialization failed');
            }
        }
    }

    async playScale() {
        // Show loading state during audio initialization
        if (!this.isAudioInitialized && this.elements.playScaleBtn) {
            this.elements.playScaleBtn.disabled = true;
            const iconSpan = this.elements.playScaleBtn.querySelector('.btn-icon');
            const iconHTML = iconSpan ? iconSpan.outerHTML : '';
            this.elements.playScaleBtn.innerHTML = iconHTML + 'Initializing...';
        }

        await this.initializeAudio();

        // Restore button state after initialization
        if (this.elements.playScaleBtn && this.elements.playScaleBtn.disabled) {
            this.elements.playScaleBtn.disabled = false;
            this.elements.playScaleBtn.innerHTML = '<span class="btn-icon">♪</span>Scale';
        }

        if (this.isAudioInitialized) {
            const audioEngine = await this.getAudioEngine();

            // Toggle behavior: stop if currently playing, play if stopped
            if (this.playbackState.scale) {
                this.stopAudio();
                this.announcePlaybackStatus('Scale playback stopped');
                return;
            }

            // Stop any other audio and start scale
            this.stopAudio();
            this.playbackState.scale = true;
            this.updateButtonState('scale', true);
            this.updateStopButtonState(true);

            const state = this.circleRenderer.getState();

            // Announce to screen readers
            this.announcePlaybackStatus(`Playing ${state.selectedKey} ${state.currentMode} scale`);

            audioEngine.playScale(state.selectedKey, state.currentMode);

            // Calculate approximate duration for scale playback
            // 16 notes (complete octave cycle) * note duration * overlap factor
            const noteDuration = audioEngine.settings.noteLength * 0.6;
            const totalDuration = 16 * noteDuration * 0.8 * 1000; // Convert to milliseconds

            // Reset state when playback completes
            setTimeout(() => {
                this.playbackState.scale = false;
                this.updateButtonState('scale', false);
                this.announcePlaybackStatus('Scale playback complete');
            }, totalDuration);
        }
    }

    async playChord() {
        // Show loading state during audio initialization
        if (!this.isAudioInitialized && this.elements.playChordBtn) {
            this.elements.playChordBtn.disabled = true;
            const iconSpan = this.elements.playChordBtn.querySelector('.btn-icon');
            const iconHTML = iconSpan ? iconSpan.outerHTML : '';
            this.elements.playChordBtn.innerHTML = iconHTML + 'Initializing...';
        }

        await this.initializeAudio();

        // Restore button state after initialization
        if (this.elements.playChordBtn && this.elements.playChordBtn.disabled) {
            this.elements.playChordBtn.disabled = false;
            this.elements.playChordBtn.innerHTML = '<span class="btn-icon">♫</span>Chord';
        }

        if (this.isAudioInitialized) {
            // Toggle behavior: stop if currently playing, play if stopped
            if (this.playbackState.chord) {
                this.stopAudio();
                this.announcePlaybackStatus('Chord playback stopped');
                return;
            }

            // Stop any other audio and start chord
            this.stopAudio();
            this.playbackState.chord = true;
            this.updateButtonState('chord', true);
            this.updateStopButtonState(true);

            const state = this.circleRenderer.getState();
            const chordType = state.currentMode === 'major' ? 'major' : 'minor';
            const chordNotes = this.musicTheory.getChordNotes(state.selectedKey, chordType);

            // Announce to screen readers
            this.announcePlaybackStatus(`Playing ${state.selectedKey} ${chordType} chord`);

            this.audioEngine.playChord(chordNotes);

            // Reset state when chord completes
            const chordDuration = this.audioEngine.settings.chordLength * 1000; // Convert to milliseconds
            setTimeout(() => {
                this.playbackState.chord = false;
                this.updateButtonState('chord', false);
                this.updateStopButtonState(false);
                this.announcePlaybackStatus('Chord playback complete');
            }, chordDuration);
        }
    }

    async playProgression() {
        // Show loading state during audio initialization
        if (!this.isAudioInitialized && this.elements.playProgressionBtn) {
            this.elements.playProgressionBtn.disabled = true;
            const iconSpan = this.elements.playProgressionBtn.querySelector('.btn-icon');
            const iconHTML = iconSpan ? iconSpan.outerHTML : '';
            this.elements.playProgressionBtn.innerHTML = iconHTML + 'Initializing...';
        }

        await this.initializeAudio();

        // Restore button state after initialization
        if (this.elements.playProgressionBtn && this.elements.playProgressionBtn.disabled) {
            this.elements.playProgressionBtn.disabled = false;
            this.elements.playProgressionBtn.innerHTML =
                '<span class="btn-icon">♬</span>Progression';
        }

        if (this.isAudioInitialized) {
            // Toggle behavior: stop if currently playing, play if stopped
            if (this.playbackState.progression) {
                this.stopAudio();
                return;
            }

            // Stop any other audio and start progression
            this.stopAudio();
            this.playbackState.progression = true;
            this.updateButtonState('progression', true);
            this.updateStopButtonState(true);

            const state = this.circleRenderer.getState();
            // Play the first available progression
            const progressions = this.musicTheory.getChordProgressions(
                state.selectedKey,
                state.currentMode
            );
            const firstProgression = Object.keys(progressions)[0];
            if (firstProgression) {
                // Use looping if enabled
                if (this.playbackState.loop) {
                    this.audioEngine.playProgressionLoop(
                        state.selectedKey,
                        state.currentMode,
                        firstProgression
                    );
                } else {
                    this.audioEngine.playProgression(
                        state.selectedKey,
                        state.currentMode,
                        firstProgression
                    );

                    // Calculate approximate duration for progression
                    const progression = progressions[firstProgression];
                    const chordDuration = this.audioEngine.settings.progressionNoteLength;
                    const totalDuration = progression.roman.length * chordDuration * 1000; // Convert to milliseconds

                    // Reset state when progression completes (only if not looping)
                    setTimeout(() => {
                        if (!this.playbackState.loop) {
                            this.playbackState.progression = false;
                            this.updateButtonState('progression', false);
                        }
                    }, totalDuration);
                }
            }
        }
    }

    async playSpecificProgression(progressionName) {
        await this.initializeAudio();
        if (this.isAudioInitialized) {
            // Toggle behavior: stop if currently playing this progression
            if (this.currentPlayingProgression === progressionName) {
                this.stopAudio();
                return;
            }

            // Stop any other audio and start this progression
            this.stopAudio();
            this.currentPlayingProgression = progressionName;
            this.playbackState.progression = true;
            this.updateProgressionButtonStates(progressionName, true);
            this.updateStopButtonState(true);

            const state = this.circleRenderer.getState();

            // Use looping if enabled
            if (this.playbackState.loop) {
                this.audioEngine.playProgressionLoop(
                    state.selectedKey,
                    state.currentMode,
                    progressionName
                );
            } else {
                this.audioEngine.playProgression(
                    state.selectedKey,
                    state.currentMode,
                    progressionName
                );

                // Calculate duration for this specific progression
                const progressions = this.musicTheory.getChordProgressions(
                    state.selectedKey,
                    state.currentMode
                );
                const progression = progressions[progressionName];
                if (progression) {
                    const chordDuration = this.audioEngine.settings.progressionNoteLength;
                    const totalDuration = progression.roman.length * chordDuration * 1000; // Convert to milliseconds

                    // Reset state when progression completes (only if not looping)
                    setTimeout(() => {
                        if (!this.playbackState.loop) {
                            this.currentPlayingProgression = null;
                            this.playbackState.progression = false;
                            this.updateProgressionButtonStates(progressionName, false);
                        }
                    }, totalDuration);
                }
            }
        }
    }

    /**
     * Toggle percussion on/off
     */
    togglePercussion() {
        this.playbackState.percussion = !this.playbackState.percussion;

        // Only update audio engine if it's loaded
        if (this.isAudioInitialized && this.audioEngine) {
            this.audioEngine.setPercussionEnabled(this.playbackState.percussion);
        }

        this.updateToggleButtonState('percussion', this.playbackState.percussion);

        // Announce to screen readers
        const status = this.playbackState.percussion ? 'enabled' : 'disabled';
        this.announcePlaybackStatus(`Percussion ${status}`);
    }

    /**
     * Toggle bass on/off
     */
    toggleBass() {
        this.playbackState.bass = !this.playbackState.bass;

        // Only update audio engine if it's loaded
        if (this.isAudioInitialized && this.audioEngine) {
            this.audioEngine.setBassEnabled(this.playbackState.bass);
        }

        this.updateToggleButtonState('bass', this.playbackState.bass);

        // Announce to screen readers
        const status = this.playbackState.bass ? 'enabled' : 'disabled';
        this.announcePlaybackStatus(`Bass ${status}`);
    }

    /**
     * Toggle loop on/off
     */
    toggleLoop() {
        this.playbackState.loop = !this.playbackState.loop;

        // If disabling loop while playing, stop the loop
        if (!this.playbackState.loop && this.isAudioInitialized && this.audioEngine) {
            this.audioEngine.setLoopingEnabled(false);
        }

        this.updateToggleButtonState('loop', this.playbackState.loop);

        // Announce to screen readers
        const status = this.playbackState.loop ? 'enabled' : 'disabled';
        this.announcePlaybackStatus(`Loop ${status}`);
    }

    /**
     * Stop all currently playing audio
     * @example
     * this.stopAudio(); // Stops all scales, chords, and progressions
     */
    stopAudio() {
        // Only stop if audio engine is loaded
        if (this.isAudioInitialized && this.audioEngine) {
            this.audioEngine.stopAll();
        }

        // Reset all playback states
        this.playbackState.scale = false;
        this.playbackState.chord = false;
        this.playbackState.progression = false;

        // Reset progression state
        if (this.currentPlayingProgression) {
            this.updateProgressionButtonStates(this.currentPlayingProgression, false);
            this.currentPlayingProgression = null;
        }

        // Clear all note highlights
        this.circleRenderer.clearNoteHighlights();

        // Update all button states
        this.updateButtonState('scale', false);
        this.updateButtonState('chord', false);
        this.updateButtonState('progression', false);

        // Disable stop button when nothing is playing
        this.updateStopButtonState(false);
    }

    /**
     * Update the stop button state (enabled/disabled based on playback)
     * @param {boolean} isPlaying - Whether any audio is currently playing
     */
    updateStopButtonState(isPlaying) {
        if (this.elements.stopAudioBtn) {
            this.elements.stopAudioBtn.disabled = !isPlaying;
            this.elements.stopAudioBtn.classList.toggle('active', isPlaying);
        }
    }

    /**
     * Generic method to update button state with icon and text
     * @param {HTMLElement} button - The button element to update
     * @param {boolean} isActive - Whether the button should be in active state
     * @param {string} activeText - Text to display when active
     * @param {string} inactiveText - Text to display when inactive
     * @param {string} icon - Icon character to display
     * @private
     */
    _updateButtonWithIcon(button, isActive, activeText, inactiveText, icon) {
        if (!button) {
            return;
        }

        if (isActive) {
            button.classList.add('active', 'playing');
            button.innerHTML = `<span class="btn-icon">${icon}</span><span class="btn-text">${activeText}</span>`;
            button.setAttribute('aria-label', activeText);
        } else {
            button.classList.remove('active', 'playing');
            button.innerHTML = `<span class="btn-icon">${icon}</span><span class="btn-text">${inactiveText}</span>`;
            button.setAttribute('aria-label', `Play ${inactiveText}`);
        }
    }

    /**
     * Update button appearance based on playback state
     */
    updateButtonState(type, isPlaying) {
        const buttonMap = {
            scale: this.elements.playScaleBtn,
            chord: this.elements.playChordBtn,
            progression: this.elements.playProgressionBtn
        };

        const textMap = {
            scale: 'Scale',
            chord: 'Chord',
            progression: 'Progression'
        };

        const iconMap = {
            scale: '♪',
            chord: '♫',
            progression: '♬'
        };

        const button = buttonMap[type];
        const text = textMap[type];
        const icon = iconMap[type];

        this._updateButtonWithIcon(button, isPlaying, 'Stop', text, icon);
    }

    /**
     * Update toggle button appearance based on state
     */
    updateToggleButtonState(type, isEnabled) {
        const buttonMap = {
            percussion: this.elements.togglePercussionBtn,
            bass: this.elements.toggleBassBtn,
            loop: this.elements.toggleLoopBtn
        };

        const button = buttonMap[type];
        if (!button) {
            return;
        }

        // Update aria-pressed attribute for accessibility
        button.setAttribute('aria-pressed', isEnabled.toString());
    }

    /**
     * Update progression button states to show which one is playing
     * @param {string} progressionName - Name of the progression (e.g., 'I-IV-V-I')
     * @param {boolean} isPlaying - Whether the progression is currently playing
     * @example
     * this.updateProgressionButtonStates('I-IV-V-I', true);
     */
    updateProgressionButtonStates(progressionName, isPlaying) {
        if (!this.elements.chordProgressions) {
            return;
        }

        // Clear all progression button states
        const progressionButtons =
            this.elements.chordProgressions.querySelectorAll('.progression-btn');
        progressionButtons.forEach(btn => {
            btn.classList.remove('playing');
        });

        // Highlight the currently playing progression
        if (isPlaying && progressionName) {
            const playingButton = this.elements.chordProgressions.querySelector(
                `[data-progression="${progressionName}"]`
            );
            if (playingButton) {
                playingButton.classList.add('playing');
            }
        }
    }

    /**
     * Handle keyboard events on key segments
     * @param {KeyboardEvent} event - The keyboard event
     * @example
     * segment.addEventListener('keydown', (e) => this.handleKeySegmentKeydown(e));
     */
    handleKeySegmentKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const key = event.target.getAttribute('data-key');
            this.selectKey(key);
        }
    }

    /**
     * Handle global keyboard shortcuts
     * @param {KeyboardEvent} event - The keyboard event
     * @example
     * document.addEventListener('keydown', (e) => this.handleGlobalKeydown(e));
     */
    handleGlobalKeydown(event) {
        // Global keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 'm':
                    event.preventDefault();
                    this.switchMode(
                        this.circleRenderer.currentMode === 'major' ? 'minor' : 'major'
                    );
                    break;
                case 'd':
                    event.preventDefault();
                    this.switchDifficulty(
                        this.currentDifficulty === 'beginner' ? 'advanced' : 'beginner'
                    );
                    break;
            }
        }

        // Audio shortcuts
        switch (event.key) {
            case 's':
                if (!event.ctrlKey && !event.metaKey) {
                    event.preventDefault();
                    this.playScale();
                }
                break;
            case 'c':
                if (!event.ctrlKey && !event.metaKey) {
                    event.preventDefault();
                    this.playChord();
                }
                break;
            case 'p':
                if (!event.ctrlKey && !event.metaKey) {
                    event.preventDefault();
                    this.playProgression();
                }
                break;
            case 'Escape':
                this.stopAudio();
                break;
        }
    }

    /**
     * Show loading indicator with custom message
     * @param {string} [message='Loading...'] - The loading message to display
     * @example
     * this.showLoading('Initializing audio...');
     */
    showLoading(message = 'Loading...') {
        if (this.elements.loading) {
            this.elements.loading.querySelector('.loading-text').textContent = message;
            this.elements.loading.classList.remove('hidden');
            this.elements.loading.setAttribute('aria-hidden', 'false');
        }
    }

    /**
     * Hide loading indicator
     * @example
     * this.hideLoading();
     */
    hideLoading() {
        if (this.elements.loading) {
            this.elements.loading.classList.add('hidden');
            this.elements.loading.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * Show error message to user
     * @param {string} message - The error message to display
     * @example
     * this.showError('Failed to initialize audio');
     */
    showError(message) {
        // Simple error display - could be enhanced with a proper modal
        this.logger.error('User error:', message);
    }

    /**
     * Show tooltip for a key
     * @param {string} key - The key to show tooltip for
     * @param {Event} event - The event that triggered the tooltip
     * @private
     */
    showKeyTooltip(key, event) {
        if (!this.tooltip || !this.tooltipKey || !this.tooltipMode || !this.tooltipSignature) {
            return;
        }

        const state = this.circleRenderer.getState();
        const mode = state.currentMode;

        // Get key signature
        const keySignature = this.musicTheory.getKeySignature(key, mode);
        const signatureText =
            keySignature.sharps > 0
                ? `${keySignature.sharps} sharp${keySignature.sharps > 1 ? 's' : ''}`
                : keySignature.flats > 0
                  ? `${keySignature.flats} flat${keySignature.flats > 1 ? 's' : ''}`
                  : 'No sharps or flats';

        // Update tooltip content
        this.tooltipKey.textContent = `${key} ${mode}`;
        this.tooltipMode.textContent = mode === 'major' ? 'Major Key' : 'Minor Key';
        this.tooltipSignature.textContent = signatureText;

        // Position tooltip near cursor
        const x = event.clientX || event.touches?.[0]?.clientX || 0;
        const y = event.clientY || event.touches?.[0]?.clientY || 0;

        // Offset tooltip to avoid cursor overlap
        const offsetX = 15;
        const offsetY = 15;

        // Ensure tooltip stays within viewport
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let left = x + offsetX;
        let top = y + offsetY;

        // Adjust if tooltip would go off right edge
        if (left + tooltipRect.width > viewportWidth) {
            left = x - tooltipRect.width - offsetX;
        }

        // Adjust if tooltip would go off bottom edge
        if (top + tooltipRect.height > viewportHeight) {
            top = y - tooltipRect.height - offsetY;
        }

        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.top = `${top}px`;
        this.tooltip.setAttribute('aria-hidden', 'false');
    }

    /**
     * Hide key tooltip
     * @private
     */
    hideKeyTooltip() {
        if (this.tooltip) {
            this.tooltip.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * Get current state
     */
    getState() {
        return {
            currentDifficulty: this.currentDifficulty,
            isAudioInitialized: this.isAudioInitialized,
            circleState: this.circleRenderer.getState()
        };
    }

    /**
     * Switch difficulty level between beginner and advanced
     * @param {string} difficulty - The difficulty level ('beginner' or 'advanced')
     */
    switchDifficulty(difficulty) {
        if (difficulty !== 'beginner' && difficulty !== 'advanced') {
            this.logger.warn(`Invalid difficulty: ${difficulty}`);
            return;
        }

        this.currentDifficulty = difficulty;
        this.logger.info(`Difficulty switched to: ${difficulty}`);

        // Announce to screen readers
        this.announceToScreenReader(`Difficulty set to ${difficulty}`);

        // Dispatch custom event for other components
        document.dispatchEvent(
            new CustomEvent('difficultyChanged', {
                detail: { difficulty }
            })
        );
    }

    /**
     * Cleanup and destroy the interactions handler
     * Removes event listeners and cleans up resources
     */
    destroy() {
        this.logger.info('Destroying InteractionsHandler...');

        // Stop any playing audio
        this.stopAudio();

        // Clear any pending timeouts
        this.currentPlayingProgression = null;

        // Remove live regions
        const liveRegion = document.getElementById('sr-live-region');
        if (liveRegion) {
            liveRegion.remove();
        }

        this.logger.info('InteractionsHandler destroyed');
    }
}

// ES6 module export
export { InteractionsHandler };

// Set on window for debugging in console (development only)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    window.InteractionsHandler = InteractionsHandler;
}

/**
 * Interactions Handler for Circle of Fifths
 * Manages user input, events, and UI updates
 */

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
     * @param {AudioEngine} audioEngine - The audio synthesis engine
     * @param {MusicTheory} musicTheory - The music theory calculation engine
     */
    constructor(circleRenderer, audioEngine, musicTheory) {
        this.circleRenderer = circleRenderer;
        this.audioEngine = audioEngine;
        this.musicTheory = musicTheory;

        this.isAudioInitialized = false;

        // Initialize logger
        this.logger = window.loggers?.interactions || window.logger || console;

        // Audio playback state tracking
        this.playbackState = {
            scale: false,
            chord: false,
            progression: false,
            percussion: true,  // Default enabled
            bass: false,       // Default disabled
            loop: true         // Default enabled
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

        // UI elements
        this.elements = {
            svg: document.getElementById('circle-svg'),
            majorModeBtn: document.getElementById('major-mode'),
            minorModeBtn: document.getElementById('minor-mode'),
            playScaleBtn: document.getElementById('play-scale'),
            playChordBtn: document.getElementById('play-chord'),
            playProgressionBtn: document.getElementById('play-progression'),
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
            loading: document.getElementById('loading')
        };

        this.init();
        this.setupAudioVisualSync();
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
     * Setup audio-visual synchronization for note highlighting
     */
    setupAudioVisualSync() {
        // Listen for note events from audio engine
        this.audioEngine.addNoteEventListener(event => {
            const { note, eventType } = event;

            switch (eventType) {
                case 'start':
                    // Scale note highlighting - brief flash
                    this.circleRenderer.highlightNote(note, 600, 'note');
                    break;
                case 'chord-start':
                    // Chord note highlighting - longer duration
                    this.circleRenderer.highlightNote(
                        note,
                        this.audioEngine.settings.chordLength * 1000,
                        'chord'
                    );
                    break;
                case 'progression-chord':
                    // Progression chord highlighting - duration of chord in progression
                    this.circleRenderer.highlightNote(
                        note,
                        this.audioEngine.settings.progressionNoteLength * 1000,
                        'progression'
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
                    // Close any open dropdowns
                    this.closeDropdowns();
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
    }

    /**
     * Initialize default toggle button states (percussion and loop enabled by default, bass disabled)
     */
    initializeDefaultToggleStates() {
        // Set percussion enabled in audio engine
        this.audioEngine.setPercussionEnabled(this.playbackState.percussion);

        // Set bass enabled in audio engine
        this.audioEngine.setBassEnabled(this.playbackState.bass);

        // Set loop enabled in audio engine
        this.audioEngine.setLoopingEnabled(this.playbackState.loop);

        // Update button visual states to match
        this.updateToggleButtonState('percussion', this.playbackState.percussion);
        this.updateToggleButtonState('bass', this.playbackState.bass);
        this.updateToggleButtonState('loop', this.playbackState.loop);

        this.logger.info('Toggle buttons initialized: percussion and loop enabled, bass disabled by default');
    }

    /**
     * Setup volume control slider
     */
    setupVolumeControl() {
        if (this.elements.volumeSlider && this.elements.volumeDisplay) {
            // Set initial volume from audio engine settings
            const initialVolume = Math.round(this.audioEngine.settings.masterVolume * 100);
            this.elements.volumeSlider.value = initialVolume;
            this.elements.volumeDisplay.textContent = `${initialVolume}%`;
            this.elements.volumeSlider.setAttribute('aria-valuenow', initialVolume);
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
                clearTimeout(volumeTimeout);
                volumeTimeout = setTimeout(() => {
                    this.audioEngine.setVolume(volumeDecimal);
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

        if (!toggleBtn || !panel) return;

        // Toggle panel visibility
        toggleBtn.addEventListener('click', () => {
            const isHidden = panel.getAttribute('aria-hidden') === 'true';
            panel.setAttribute('aria-hidden', !isHidden);
            toggleBtn.setAttribute('aria-expanded', isHidden);
        });

        // Waveform selection
        if (waveformSelect) {
            waveformSelect.value = this.audioEngine.settings.waveform;
            waveformSelect.addEventListener('change', e => {
                this.audioEngine.settings.waveform = e.target.value;
                this.logger.info(`Waveform changed to: ${e.target.value}`);
            });
        }

        // Reverb type selection
        if (reverbTypeSelect) {
            reverbTypeSelect.value = this.audioEngine.settings.reverbType;
            reverbTypeSelect.addEventListener('change', e => {
                this.audioEngine.settings.reverbType = e.target.value;
                // Reinitialize audio engine to apply new reverb
                this.audioEngine.isInitialized = false;
                this.initializeAudio();
                this.logger.info(`Reverb type changed to: ${e.target.value}`);
            });
        }

        // Stereo width slider
        if (stereoWidthSlider) {
            stereoWidthSlider.value = this.audioEngine.settings.stereoWidth;
            document.getElementById('stereo-width-value').textContent =
                this.audioEngine.settings.stereoWidth.toFixed(2);

            stereoWidthSlider.addEventListener('input', e => {
                const value = parseFloat(e.target.value);
                this.audioEngine.settings.stereoWidth = value;
                document.getElementById('stereo-width-value').textContent = value.toFixed(2);
            });
        }

        // Reverb level slider
        if (reverbLevelSlider) {
            reverbLevelSlider.value = this.audioEngine.settings.reverbLevel;
            document.getElementById('reverb-level-value').textContent =
                this.audioEngine.settings.reverbLevel.toFixed(2);

            reverbLevelSlider.addEventListener('input', e => {
                const value = parseFloat(e.target.value);
                this.audioEngine.settings.reverbLevel = value;
                document.getElementById('reverb-level-value').textContent = value.toFixed(2);
            });
        }

        // Filter envelope toggle
        if (filterEnvelopeToggle) {
            filterEnvelopeToggle.checked = this.audioEngine.settings.useFilterEnvelope;
            filterEnvelopeToggle.addEventListener('change', e => {
                this.audioEngine.settings.useFilterEnvelope = e.target.checked;
                this.logger.info(`Filter envelope: ${e.target.checked ? 'enabled' : 'disabled'}`);
            });
        }

        // Stereo enhancement toggle
        if (stereoEnhancementToggle) {
            stereoEnhancementToggle.checked = this.audioEngine.settings.useStereoEnhancement;
            stereoEnhancementToggle.addEventListener('change', e => {
                this.audioEngine.settings.useStereoEnhancement = e.target.checked;
                this.logger.info(
                    `Stereo enhancement: ${e.target.checked ? 'enabled' : 'disabled'}`
                );
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

        this.elements.majorModeBtn?.setAttribute('aria-pressed', mode === 'major');
        this.elements.minorModeBtn?.setAttribute('aria-pressed', mode === 'minor');

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

        // Update chord progressions (advanced mode only)
        if (this.currentDifficulty === 'advanced') {
            this.updateChordProgressions(selectedKey, currentMode);
        }
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
            { key: relatedKeys.dominant.key, type: 'dominant', label: 'Dominant' },
            { key: relatedKeys.subdominant.key, type: 'subdominant', label: 'Subdominant' },
            { key: relatedKeys.relative.key, type: 'relative', label: 'Relative' }
        ];

        relationships.forEach(({ key: relKey, type, label }) => {
            const span = document.createElement('span');
            span.className = 'related-key';
            span.setAttribute('data-relationship', type);
            span.textContent = `${label}: ${relKey}`;
            span.style.cursor = 'pointer';
            span.setAttribute('role', 'button');
            span.setAttribute('tabindex', '0');

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
     * Audio control methods
     */
    async initializeAudio() {
        if (!this.isAudioInitialized) {
            this.showLoading('Initializing audio...');
            this.announceAudioStatus('Initializing audio system');

            const success = await this.audioEngine.initialize();
            this.isAudioInitialized = success;
            this.hideLoading();

            if (success) {
                this.announceAudioStatus('Audio system ready');
            } else {
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

            const state = this.circleRenderer.getState();

            // Announce to screen readers
            this.announcePlaybackStatus(`Playing ${state.selectedKey} ${state.currentMode} scale`);

            this.audioEngine.playScale(state.selectedKey, state.currentMode);

            // Calculate approximate duration for scale playback
            // 16 notes (complete octave cycle) * note duration * overlap factor
            const noteDuration = this.audioEngine.settings.noteLength * 0.6;
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
            this.elements.playProgressionBtn.innerHTML = '<span class="btn-icon">♬</span>Progression';
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

            const state = this.circleRenderer.getState();

            // Use looping if enabled
            if (this.playbackState.loop) {
                this.audioEngine.playProgressionLoop(state.selectedKey, state.currentMode, progressionName);
            } else {
                this.audioEngine.playProgression(state.selectedKey, state.currentMode, progressionName);

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
        this.audioEngine.setPercussionEnabled(this.playbackState.percussion);
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
        this.audioEngine.setBassEnabled(this.playbackState.bass);
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
        if (!this.playbackState.loop) {
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
        this.audioEngine.stopAll();

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
            button.classList.add('active');
            button.innerHTML = `<span class="btn-icon">${icon}</span>${activeText}`;
            button.setAttribute('aria-label', activeText);
        } else {
            button.classList.remove('active');
            button.innerHTML = `<span class="btn-icon">${icon}</span>${inactiveText}`;
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
     * Show tooltip for a key (placeholder for future implementation)
     * @param {string} _key - The key to show tooltip for
     * @param {Event} _event - The event that triggered the tooltip
     * @private
     */
    showKeyTooltip(_key, _event) {
        // Could implement tooltip functionality here
        // For now, we rely on the info panel updates
    }

    /**
     * Hide key tooltip (placeholder for future implementation)
     * @private
     */
    hideKeyTooltip() {
        // Tooltip cleanup if implemented
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
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractionsHandler;
} else {
    window.InteractionsHandler = InteractionsHandler;
}

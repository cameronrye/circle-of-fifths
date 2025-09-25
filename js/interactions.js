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
            progression: false
        };

        // Track currently playing progression
        this.currentPlayingProgression = null;

        // UI elements
        this.elements = {
            svg: document.getElementById('circle-svg'),
            majorModeBtn: document.getElementById('major-mode'),
            minorModeBtn: document.getElementById('minor-mode'),
            playScaleBtn: document.getElementById('play-scale'),
            playChordBtn: document.getElementById('play-chord'),
            playProgressionBtn: document.getElementById('play-progression'),
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
        this.setupKeyboardNavigation();
        this.setupInfoPanelInteractions();
        this.updateInfoPanel();

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
        const keys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
        const currentIndex = keys.indexOf(this.currentKey);
        let newIndex = (currentIndex + direction + keys.length) % keys.length;

        this.selectKey(keys[newIndex]);
        this.announceKeyChange(keys[newIndex]);
    }

    /**
     * Navigate through relative keys
     */
    navigateRelativeKeys(direction) {
        const relatedKeys = this.getRelatedKeys(this.currentKey, this.currentMode);
        if (relatedKeys.length === 0) {
            return;
        }

        const currentRelativeIndex = this.currentRelativeIndex || 0;
        const newIndex =
            (currentRelativeIndex + direction + relatedKeys.length) % relatedKeys.length;

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
     * Announce text to screen readers
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
                this.updateVolumeDisplay(volume);

                // Debounce audio engine updates to reduce CPU usage
                clearTimeout(volumeTimeout);
                volumeTimeout = setTimeout(() => {
                    this.audioEngine.setVolume(volumeDecimal);
                }, 50);

                // Update display
                this.elements.volumeDisplay.textContent = `${volume}%`;
                event.target.setAttribute('aria-valuenow', volume);
                event.target.setAttribute('aria-valuetext', `${volume}%`);

                // Update volume icon based on level
                this.updateVolumeIcon(volume);
            });

            // Initialize volume icon
            this.updateVolumeIcon(initialVolume);
        }
    }

    /**
     * Update volume icon based on volume level
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
     * Update related keys display
     */
    updateRelatedKeys(key, mode) {
        if (!this.elements.relatedKeys) {
            return;
        }

        const relatedKeys = this.musicTheory.getRelatedKeys(key, mode);
        if (!relatedKeys) {
            return;
        }

        this.elements.relatedKeys.innerHTML = '';

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
     * Update chord progressions display
     */
    updateChordProgressions(key, mode) {
        if (!this.elements.chordProgressions) {
            return;
        }

        const progressions = this.musicTheory.getChordProgressions(key, mode);
        this.elements.chordProgressions.innerHTML = '';

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
            const success = await this.audioEngine.initialize();
            this.isAudioInitialized = success;
            this.hideLoading();

            if (!success) {
                this.showError('Failed to initialize audio. Please check your browser settings.');
            }
        }
    }

    async playScale() {
        await this.initializeAudio();
        if (this.isAudioInitialized) {
            // Toggle behavior: stop if currently playing, play if stopped
            if (this.playbackState.scale) {
                this.stopAudio();
                return;
            }

            // Stop any other audio and start scale
            this.stopAudio();
            this.playbackState.scale = true;
            this.updateButtonState('scale', true);

            const state = this.circleRenderer.getState();
            this.audioEngine.playScale(state.selectedKey, state.currentMode);

            // Calculate approximate duration for scale playback
            // 16 notes (complete octave cycle) * note duration * overlap factor
            const noteDuration = this.audioEngine.settings.noteLength * 0.6;
            const totalDuration = 16 * noteDuration * 0.8 * 1000; // Convert to milliseconds

            // Reset state when playback completes
            setTimeout(() => {
                this.playbackState.scale = false;
                this.updateButtonState('scale', false);
            }, totalDuration);
        }
    }

    async playChord() {
        await this.initializeAudio();
        if (this.isAudioInitialized) {
            // Toggle behavior: stop if currently playing, play if stopped
            if (this.playbackState.chord) {
                this.stopAudio();
                return;
            }

            // Stop any other audio and start chord
            this.stopAudio();
            this.playbackState.chord = true;
            this.updateButtonState('chord', true);

            const state = this.circleRenderer.getState();
            const chordNotes = this.musicTheory.getChordNotes(
                state.selectedKey,
                state.currentMode === 'major' ? 'major' : 'minor'
            );
            this.audioEngine.playChord(chordNotes);

            // Reset state when chord completes
            const chordDuration = this.audioEngine.settings.chordLength * 1000; // Convert to milliseconds
            setTimeout(() => {
                this.playbackState.chord = false;
                this.updateButtonState('chord', false);
            }, chordDuration);
        }
    }

    async playProgression() {
        await this.initializeAudio();
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
                this.audioEngine.playProgression(
                    state.selectedKey,
                    state.currentMode,
                    firstProgression
                );

                // Calculate approximate duration for progression
                const progression = progressions[firstProgression];
                const chordDuration = this.audioEngine.settings.progressionNoteLength;
                const totalDuration = progression.roman.length * chordDuration * 1000; // Convert to milliseconds

                // Reset state when progression completes
                setTimeout(() => {
                    this.playbackState.progression = false;
                    this.updateButtonState('progression', false);
                }, totalDuration);
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

                // Reset state when progression completes
                setTimeout(() => {
                    this.currentPlayingProgression = null;
                    this.playbackState.progression = false;
                    this.updateProgressionButtonStates(progressionName, false);
                }, totalDuration);
            }
        }
    }

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
     * Update button appearance based on playback state
     */
    updateButtonState(type, isPlaying) {
        const buttonMap = {
            scale: this.elements.playScaleBtn,
            chord: this.elements.playChordBtn,
            progression: this.elements.playProgressionBtn
        };

        const button = buttonMap[type];
        if (!button) {
            return;
        }

        if (isPlaying) {
            button.classList.add('active');
            // Find the icon span and preserve it, then update the text
            const iconSpan = button.querySelector('.btn-icon');
            const iconHTML = iconSpan ? iconSpan.outerHTML : '';
            button.innerHTML = iconHTML + 'Stop';
            // Update aria-label
            button.setAttribute('aria-label', `Stop ${type}`);
        } else {
            button.classList.remove('active');
            // Restore original button content
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
            button.innerHTML = `<span class="btn-icon">${iconMap[type]}</span>${textMap[type]}`;
            // Update aria-label
            button.setAttribute('aria-label', `Play ${type}`);
        }
    }

    /**
     * Update progression button states to show which one is playing
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
     * Keyboard event handlers
     */
    handleKeySegmentKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const key = event.target.getAttribute('data-key');
            this.selectKey(key);
        }
    }

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
     * Utility methods
     */
    showLoading(message = 'Loading...') {
        if (this.elements.loading) {
            this.elements.loading.querySelector('.loading-text').textContent = message;
            this.elements.loading.classList.remove('hidden');
            this.elements.loading.setAttribute('aria-hidden', 'false');
        }
    }

    hideLoading() {
        if (this.elements.loading) {
            this.elements.loading.classList.add('hidden');
            this.elements.loading.setAttribute('aria-hidden', 'true');
        }
    }

    showError(message) {
        // Simple error display - could be enhanced with a proper modal
        this.logger.error('User error:', message);
    }

    showKeyTooltip(_key, _event) {
        // Could implement tooltip functionality here
        // For now, we rely on the info panel updates
    }

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

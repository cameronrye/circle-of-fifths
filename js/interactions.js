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

        this.currentDifficulty = 'beginner';
        this.isAudioInitialized = false;

        // UI elements
        this.elements = {
            svg: document.getElementById('circle-svg'),
            majorModeBtn: document.getElementById('major-mode'),
            minorModeBtn: document.getElementById('minor-mode'),
            beginnerLevelBtn: document.getElementById('beginner-level'),
            advancedLevelBtn: document.getElementById('advanced-level'),
            playScaleBtn: document.getElementById('play-scale'),
            playChordBtn: document.getElementById('play-chord'),
            playProgressionBtn: document.getElementById('play-progression'),
            stopAudioBtn: document.getElementById('stop-audio'),
            infoTitle: document.getElementById('info-title'),
            keySignature: document.getElementById('key-signature'),
            scaleNotes: document.getElementById('scale-notes'),
            relatedKeys: document.getElementById('related-keys'),
            chordProgressions: document.getElementById('chord-progressions'),
            loading: document.getElementById('loading')
        };

        this.init();
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
        this.setupDifficultyToggle();
        this.setupAudioControls();
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

        // Touch events for mobile
        this.elements.svg.addEventListener('touchstart', event => {
            event.preventDefault();
            const touch = event.touches[0];
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            const keySegment = element?.closest('.key-segment');

            if (keySegment) {
                const key = keySegment.getAttribute('data-key');
                this.selectKey(key);
            }
        });

        // Custom events from circle renderer
        this.elements.svg.addEventListener('keySelected', _event => {
            this.updateInfoPanel();
        });

        this.elements.svg.addEventListener('modeChanged', _event => {
            this.updateInfoPanel();
        });
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
     * Setup difficulty toggle (Beginner/Advanced)
     */
    setupDifficultyToggle() {
        [this.elements.beginnerLevelBtn, this.elements.advancedLevelBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    const level = btn.getAttribute('data-level');
                    this.switchDifficulty(level);
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

        if (this.elements.stopAudioBtn) {
            this.elements.stopAudioBtn.addEventListener('click', () => {
                this.stopAudio();
            });
        }
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', event => {
            if (event.target.closest('.key-segment')) {
                this.handleKeySegmentKeydown(event);
            } else {
                this.handleGlobalKeydown(event);
            }
        });

        // Make key segments focusable and add focus events
        this.elements.svg.querySelectorAll('.key-segment').forEach(segment => {
            segment.addEventListener('focus', () => {
                const key = segment.getAttribute('data-key');
                this.circleRenderer.addHoverEffect(key);
            });

            segment.addEventListener('blur', () => {
                const key = segment.getAttribute('data-key');
                this.circleRenderer.removeHoverEffect(key);
            });
        });
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
     * Switch between beginner and advanced difficulty
     */
    switchDifficulty(level) {
        this.currentDifficulty = level;

        // Update button states
        this.elements.beginnerLevelBtn?.classList.toggle('active', level === 'beginner');
        this.elements.advancedLevelBtn?.classList.toggle('active', level === 'advanced');

        this.elements.beginnerLevelBtn?.setAttribute('aria-pressed', level === 'beginner');
        this.elements.advancedLevelBtn?.setAttribute('aria-pressed', level === 'advanced');

        // Update body class for CSS styling
        document.body.classList.toggle('advanced', level === 'advanced');

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
            const state = this.circleRenderer.getState();
            this.audioEngine.playScale(state.selectedKey, state.currentMode);
        }
    }

    async playChord() {
        await this.initializeAudio();
        if (this.isAudioInitialized) {
            const state = this.circleRenderer.getState();
            const chordNotes = this.musicTheory.getChordNotes(
                state.selectedKey,
                state.currentMode === 'major' ? 'major' : 'minor'
            );
            this.audioEngine.playChord(chordNotes);
        }
    }

    async playProgression() {
        await this.initializeAudio();
        if (this.isAudioInitialized) {
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
            }
        }
    }

    async playSpecificProgression(progressionName) {
        await this.initializeAudio();
        if (this.isAudioInitialized) {
            const state = this.circleRenderer.getState();
            this.audioEngine.playProgression(state.selectedKey, state.currentMode, progressionName);
        }
    }

    stopAudio() {
        this.audioEngine.stopAll();
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
        console.error('User error:', message);
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

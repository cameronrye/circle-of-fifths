/**
 * Circle State Management
 * Centralized state management for the Circle of Fifths application
 * Implements a simple pub-sub pattern for state changes
 *
 * @class CircleState
 * @example
 * const state = new CircleState();
 * state.subscribe('selectedKey', (newKey, oldKey) => {
 *     console.log(`Key changed from ${oldKey} to ${newKey}`);
 * });
 * state.setState({ selectedKey: 'G' });
 */
export class CircleState {
    /**
     * Creates a new CircleState instance
     * @constructor
     * @param {Object} initialState - Initial state object
     */
    constructor(initialState = {}) {
        this.state = {
            selectedKey: 'C',
            mode: 'major',
            highlightedKeys: new Set(),
            isPlaying: false,
            audioSettings: {
                volume: 0.3,
                waveform: 'warmSine',
                percussion: true,
                bass: false,
                loop: true,
                tempo: 120,
                reverb: 0.3,
                attack: 0.01,
                release: 0.5
            },
            ...initialState
        };

        // Map of state keys to sets of listener callbacks
        this.listeners = new Map();

        // History for undo/redo functionality
        this.history = [];
        this.historyIndex = -1;
        this.maxHistorySize = 50;
    }

    /**
     * Subscribe to state changes for a specific key
     * @param {string} key - State key to watch
     * @param {Function} callback - Callback function (newValue, oldValue) => void
     * @returns {Function} Unsubscribe function
     */
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key).add(callback);

        // Return unsubscribe function
        return () => {
            const listeners = this.listeners.get(key);
            if (listeners) {
                listeners.delete(callback);
                if (listeners.size === 0) {
                    this.listeners.delete(key);
                }
            }
        };
    }

    /**
     * Update state with new values
     * @param {Object} updates - Object with state updates
     * @param {boolean} addToHistory - Whether to add this change to history
     */
    setState(updates, addToHistory = true) {
        const prevState = { ...this.state };

        // Apply updates
        Object.keys(updates).forEach(key => {
            if (
                typeof updates[key] === 'object' &&
                !Array.isArray(updates[key]) &&
                !(updates[key] instanceof Set)
            ) {
                // Deep merge for nested objects
                this.state[key] = { ...this.state[key], ...updates[key] };
            } else {
                this.state[key] = updates[key];
            }
        });

        // Add to history
        if (addToHistory) {
            this.addToHistory(prevState);
        }

        // Notify subscribers
        Object.keys(updates).forEach(key => {
            const listeners = this.listeners.get(key);
            if (listeners) {
                listeners.forEach(callback => {
                    callback(this.state[key], prevState[key]);
                });
            }
        });
    }

    /**
     * Get current state or a specific state value
     * @param {string} [key] - Optional key to get specific value
     * @returns {*} State value or entire state object
     */
    getState(key) {
        return key ? this.state[key] : { ...this.state };
    }

    /**
     * Add current state to history
     * @private
     * @param {Object} state - State to add to history
     */
    addToHistory(state) {
        // Remove any history after current index (for redo)
        this.history = this.history.slice(0, this.historyIndex + 1);

        // Add new state
        this.history.push(state);

        // Limit history size
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
    }

    /**
     * Undo last state change
     * @returns {boolean} True if undo was successful
     */
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const previousState = this.history[this.historyIndex];
            this.state = { ...previousState };

            // Notify all listeners
            Object.keys(this.state).forEach(key => {
                const listeners = this.listeners.get(key);
                if (listeners) {
                    listeners.forEach(callback => {
                        callback(this.state[key], this.state[key]);
                    });
                }
            });

            return true;
        }
        return false;
    }

    /**
     * Redo last undone state change
     * @returns {boolean} True if redo was successful
     */
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const nextState = this.history[this.historyIndex];
            this.state = { ...nextState };

            // Notify all listeners
            Object.keys(this.state).forEach(key => {
                const listeners = this.listeners.get(key);
                if (listeners) {
                    listeners.forEach(callback => {
                        callback(this.state[key], this.state[key]);
                    });
                }
            });

            return true;
        }
        return false;
    }

    /**
     * Reset state to initial values
     */
    reset() {
        this.setState(
            {
                selectedKey: 'C',
                mode: 'major',
                highlightedKeys: new Set(),
                isPlaying: false
            },
            false
        );
        this.history = [];
        this.historyIndex = -1;
    }
}

/**
 * EventBus - A simple publish-subscribe event system for loose component coupling
 *
 * This class provides a centralized event management system that allows components
 * to communicate without direct dependencies on each other.
 *
 * @example
 * const eventBus = new EventBus();
 *
 * // Subscribe to an event
 * const unsubscribe = eventBus.on('key-selected', (data) => {
 *     console.log('Key selected:', data.key);
 * });
 *
 * // Emit an event
 * eventBus.emit('key-selected', { key: 'C', mode: 'major' });
 *
 * // Unsubscribe
 * unsubscribe();
 */
class EventBus {
    /**
     * Create a new EventBus instance
     */
    constructor() {
        /**
         * Map of event names to arrays of listener functions
         * @type {Map<string, Set<Function>>}
         */
        this.events = new Map();

        /**
         * Map of event names to arrays of one-time listener functions
         * @type {Map<string, Set<Function>>}
         */
        this.onceEvents = new Map();

        /**
         * Logger instance for debugging
         */
        this.logger = window.loggers?.eventBus || window.logger || console;

        /**
         * Enable/disable debug logging
         * @type {boolean}
         */
        this.debug = false;
    }

    /**
     * Subscribe to an event
     * @param {string} eventName - The name of the event to listen for
     * @param {Function} callback - The function to call when the event is emitted
     * @returns {Function} Unsubscribe function
     * @example
     * const unsubscribe = eventBus.on('audio-playing', (data) => {
     *     console.log('Audio playing:', data);
     * });
     */
    on(eventName, callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }

        if (!this.events.has(eventName)) {
            this.events.set(eventName, new Set());
        }

        this.events.get(eventName).add(callback);

        if (this.debug) {
            this.logger.debug(`EventBus: Subscribed to '${eventName}'`);
        }

        // Return unsubscribe function
        return () => this.off(eventName, callback);
    }

    /**
     * Subscribe to an event that will only fire once
     * @param {string} eventName - The name of the event to listen for
     * @param {Function} callback - The function to call when the event is emitted
     * @returns {Function} Unsubscribe function
     * @example
     * eventBus.once('audio-initialized', () => {
     *     console.log('Audio initialized - this will only log once');
     * });
     */
    once(eventName, callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }

        if (!this.onceEvents.has(eventName)) {
            this.onceEvents.set(eventName, new Set());
        }

        this.onceEvents.get(eventName).add(callback);

        if (this.debug) {
            this.logger.debug(`EventBus: Subscribed once to '${eventName}'`);
        }

        // Return unsubscribe function
        return () => {
            const listeners = this.onceEvents.get(eventName);
            if (listeners) {
                listeners.delete(callback);
            }
        };
    }

    /**
     * Unsubscribe from an event
     * @param {string} eventName - The name of the event
     * @param {Function} callback - The callback function to remove
     * @example
     * eventBus.off('key-selected', myCallback);
     */
    off(eventName, callback) {
        const listeners = this.events.get(eventName);
        if (listeners) {
            listeners.delete(callback);
            if (listeners.size === 0) {
                this.events.delete(eventName);
            }
        }

        const onceListeners = this.onceEvents.get(eventName);
        if (onceListeners) {
            onceListeners.delete(callback);
            if (onceListeners.size === 0) {
                this.onceEvents.delete(eventName);
            }
        }

        if (this.debug) {
            this.logger.debug(`EventBus: Unsubscribed from '${eventName}'`);
        }
    }

    /**
     * Emit an event to all subscribers
     * @param {string} eventName - The name of the event to emit
     * @param {*} data - Data to pass to the event listeners
     * @example
     * eventBus.emit('mode-changed', { mode: 'minor' });
     */
    emit(eventName, data) {
        if (this.debug) {
            this.logger.debug(`EventBus: Emitting '${eventName}'`, data);
        }

        // Call regular listeners
        const listeners = this.events.get(eventName);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    this.logger.error(`EventBus: Error in listener for '${eventName}':`, error);
                }
            });
        }

        // Call and remove one-time listeners
        const onceListeners = this.onceEvents.get(eventName);
        if (onceListeners) {
            onceListeners.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    this.logger.error(
                        `EventBus: Error in once listener for '${eventName}':`,
                        error
                    );
                }
            });
            this.onceEvents.delete(eventName);
        }
    }

    /**
     * Remove all listeners for a specific event, or all events if no name provided
     * @param {string} [eventName] - Optional event name to clear. If not provided, clears all events
     * @example
     * eventBus.clear('key-selected'); // Clear specific event
     * eventBus.clear(); // Clear all events
     */
    clear(eventName) {
        if (eventName) {
            this.events.delete(eventName);
            this.onceEvents.delete(eventName);
            if (this.debug) {
                this.logger.debug(`EventBus: Cleared all listeners for '${eventName}'`);
            }
        } else {
            this.events.clear();
            this.onceEvents.clear();
            if (this.debug) {
                this.logger.debug('EventBus: Cleared all listeners');
            }
        }
    }

    /**
     * Get the number of listeners for an event
     * @param {string} eventName - The event name
     * @returns {number} Number of listeners
     * @example
     * const count = eventBus.listenerCount('key-selected');
     */
    listenerCount(eventName) {
        const regularCount = this.events.get(eventName)?.size || 0;
        const onceCount = this.onceEvents.get(eventName)?.size || 0;
        return regularCount + onceCount;
    }

    /**
     * Get all event names that have listeners
     * @returns {string[]} Array of event names
     * @example
     * const events = eventBus.eventNames();
     * console.log('Active events:', events);
     */
    eventNames() {
        const names = new Set([...this.events.keys(), ...this.onceEvents.keys()]);
        return Array.from(names);
    }

    /**
     * Enable debug logging
     * @example
     * eventBus.enableDebug();
     */
    enableDebug() {
        this.debug = true;
        this.logger.debug('EventBus: Debug logging enabled');
    }

    /**
     * Disable debug logging
     * @example
     * eventBus.disableDebug();
     */
    disableDebug() {
        this.debug = false;
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.EventBus = EventBus;
}

// Export for Node.js/testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventBus;
}

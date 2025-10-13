/**
 * Production-ready logging system for Circle of Fifths
 * Provides configurable logging levels and proper error handling
 */

/**
 * Logging levels in order of severity
 */
const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
};

/**
 * Logger class for structured logging with configurable levels
 * @class Logger
 */
class Logger {
    /**
     * Creates a new Logger instance
     * @constructor
     * @param {string} name - Logger name/category
     * @param {number} level - Minimum log level to output
     */
    constructor(name = 'App', level = LOG_LEVELS.INFO) {
        this.name = name;
        this.level = level;
        this.isDevelopment = this.detectDevelopmentMode();
    }

    /**
     * Detect if we're in development mode
     * @returns {boolean} True if in development mode
     */
    detectDevelopmentMode() {
        // Check for development indicators
        return (
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.port !== '' ||
            window.location.protocol === 'file:' ||
            (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development')
        );
    }

    /**
     * Set the logging level
     * @param {number} level - New logging level
     */
    setLevel(level) {
        this.level = level;
    }

    /**
     * Check if a log level should be output
     * @param {number} level - Log level to check
     * @returns {boolean} True if should log
     */
    shouldLog(level) {
        return level <= this.level;
    }

    /**
     * Format log message with timestamp and context
     * @param {string} level - Log level name
     * @param {string} message - Log message
     * @param {...any} args - Additional arguments
     * @returns {Array} Formatted log arguments
     */
    formatMessage(level, message, ...args) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [${this.name}] [${level}]`;
        return [prefix, message, ...args];
    }

    /**
     * Log an error message
     * @param {string} message - Error message
     * @param {...any} args - Additional arguments
     */
    error(message, ...args) {
        if (this.shouldLog(LOG_LEVELS.ERROR)) {
            console.error(...this.formatMessage('ERROR', message, ...args));
        }
    }

    /**
     * Log a warning message
     * @param {string} message - Warning message
     * @param {...any} args - Additional arguments
     */
    warn(message, ...args) {
        if (this.shouldLog(LOG_LEVELS.WARN)) {
            console.warn(...this.formatMessage('WARN', message, ...args));
        }
    }

    /**
     * Log an info message
     * @param {string} message - Info message
     * @param {...any} args - Additional arguments
     */
    info(message, ...args) {
        if (this.shouldLog(LOG_LEVELS.INFO)) {
            console.info(...this.formatMessage('INFO', message, ...args));
        }
    }

    /**
     * Log a debug message (only in development)
     * @param {string} message - Debug message
     * @param {...any} args - Additional arguments
     */
    debug(message, ...args) {
        if (this.isDevelopment && this.shouldLog(LOG_LEVELS.DEBUG)) {
            console.log(...this.formatMessage('DEBUG', message, ...args));
        }
    }

    /**
     * Log a performance metric
     * @param {string} metric - Metric name
     * @param {number} value - Metric value
     * @param {string} unit - Unit of measurement (ms, s, etc.)
     */
    performance(metric, value, unit = 'ms') {
        if (this.isDevelopment && this.shouldLog(LOG_LEVELS.INFO)) {
            const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;
            console.log(...this.formatMessage('PERF', `${metric}: ${formattedValue}${unit}`));
        }
    }

    /**
     * Start a performance timer
     * @param {string} label - Timer label
     * @returns {Function} Function to call to end the timer and log the result
     */
    startTimer(label) {
        const startTime = performance.now();
        return () => {
            const duration = performance.now() - startTime;
            this.performance(label, duration, 'ms');
            return duration;
        };
    }

    /**
     * Log application lifecycle events
     * @param {string} event - Event name
     * @param {Object} data - Event data
     */
    lifecycle(event, data = {}) {
        this.info(`Lifecycle: ${event}`, data);
    }

    /**
     * Log user interactions
     * @param {string} action - User action
     * @param {Object} context - Action context
     */
    userAction(action, context = {}) {
        this.debug(`User Action: ${action}`, context);
    }

    /**
     * Create a child logger with a specific category
     * @param {string} category - Logger category
     * @returns {Logger} Child logger instance
     */
    child(category) {
        return new Logger(`${this.name}:${category}`, this.level);
    }
}

/**
 * Default logger instance
 */
const logger = new Logger('CircleOfFifths');

/**
 * Create category-specific loggers
 */
const loggers = {
    app: logger.child('App'),
    audio: logger.child('Audio'),
    renderer: logger.child('Renderer'),
    theme: logger.child('Theme'),
    interactions: logger.child('Interactions'),
    musicTheory: logger.child('MusicTheory')
};

// ES6 module exports
export { Logger, LOG_LEVELS, logger, loggers };

// Set on window for debugging in console (development only)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    window.Logger = Logger;
    window.LOG_LEVELS = LOG_LEVELS;
    window.logger = logger;
    window.loggers = loggers;
}

/**
 * DOM and Web API Helpers for Testing
 * Provides mocks and utilities for testing browser-specific functionality
 */

class MockClassList {
    constructor() {
        this.classes = new Set();
    }

    add(...classes) {
        classes.forEach(cls => this.classes.add(cls));
    }

    remove(...classes) {
        classes.forEach(cls => this.classes.delete(cls));
    }

    toggle(className, force) {
        if (force !== undefined) {
            if (force) {
                this.classes.add(className);
            } else {
                this.classes.delete(className);
            }
            return force;
        }

        if (this.classes.has(className)) {
            this.classes.delete(className);
            return false;
        } else {
            this.classes.add(className);
            return true;
        }
    }

    contains(className) {
        return this.classes.has(className);
    }

    toString() {
        return Array.from(this.classes).join(' ');
    }
}

class MockEvent {
    constructor(type, options = {}) {
        this.type = type;
        this.bubbles = options.bubbles || false;
        this.cancelable = options.cancelable || false;
        this.target = null;
        this.currentTarget = null;
        this.defaultPrevented = false;
        this.timeStamp = Date.now();
    }

    preventDefault() {
        this.defaultPrevented = true;
    }

    stopPropagation() {
        // Mock implementation
    }

    stopImmediatePropagation() {
        // Mock implementation
    }
}

class MockCustomEvent extends MockEvent {
    constructor(type, options = {}) {
        super(type, options);
        this.detail = options.detail || null;
    }
}

class MockStorage {
    constructor() {
        this.data = {};
    }

    getItem(key) {
        return this.data[key] || null;
    }

    setItem(key, value) {
        this.data[key] = String(value);
    }

    removeItem(key) {
        delete this.data[key];
    }

    clear() {
        this.data = {};
    }

    get length() {
        return Object.keys(this.data).length;
    }

    key(index) {
        const keys = Object.keys(this.data);
        return keys[index] || null;
    }
}

class MockAudioParam {
    constructor(defaultValue = 0) {
        this.value = defaultValue;
        this.defaultValue = defaultValue;
    }

    setValueAtTime(value, _when) {
        this.value = value;
        return this;
    }

    linearRampToValueAtTime(value, _when) {
        this.value = value;
        return this;
    }

    exponentialRampToValueAtTime(value, _when) {
        this.value = value;
        return this;
    }

    setTargetAtTime(target, _startTime, _timeConstant) {
        this.value = target;
        return this;
    }

    setValueCurveAtTime(values, _startTime, _duration) {
        if (values.length > 0) {
            this.value = values[values.length - 1];
        }
        return this;
    }

    cancelScheduledValues(_startTime) {
        return this;
    }

    cancelAndHoldAtTime(_cancelTime) {
        return this;
    }
}

class MockAudioNode {
    constructor() {
        this.context = null;
        this.numberOfInputs = 1;
        this.numberOfOutputs = 1;
        this.connections = [];
        this.eventListeners = {};
    }

    connect(destination) {
        this.connections.push(destination);
        return destination;
    }

    disconnect(destination) {
        if (destination) {
            const index = this.connections.indexOf(destination);
            if (index > -1) {
                this.connections.splice(index, 1);
            }
        } else {
            this.connections = [];
        }
    }

    addEventListener(type, listener) {
        if (!this.eventListeners[type]) {
            this.eventListeners[type] = [];
        }
        this.eventListeners[type].push(listener);
    }

    removeEventListener(type, listener) {
        if (this.eventListeners[type]) {
            const index = this.eventListeners[type].indexOf(listener);
            if (index > -1) {
                this.eventListeners[type].splice(index, 1);
            }
        }
    }

    dispatchEvent(event) {
        if (this.eventListeners[event.type]) {
            this.eventListeners[event.type].forEach(listener => {
                listener(event);
            });
        }
    }
}

class MockGainNode extends MockAudioNode {
    constructor() {
        super();
        this.gain = new MockAudioParam(1);
    }
}

class MockOscillatorNode extends MockAudioNode {
    constructor() {
        super();
        this.frequency = new MockAudioParam(440);
        this.detune = new MockAudioParam(0);
        this.type = 'sine';
        this.started = false;
        this.stopped = false;
    }

    start(_when) {
        this.started = true;
    }

    stop(_when) {
        this.stopped = true;
        // Simulate the 'ended' event
        setTimeout(() => {
            this.dispatchEvent(new MockEvent('ended'));
        }, 0);
    }

    setPeriodicWave(_wave) {
        // Mock implementation
    }
}

class MockAudioContext {
    constructor() {
        this.state = 'suspended';
        this.sampleRate = 44100;
        this.currentTime = 0;
        this.destination = new MockAudioNode();
    }

    createGain() {
        return new MockGainNode();
    }

    createOscillator() {
        return new MockOscillatorNode();
    }

    async resume() {
        this.state = 'running';
    }

    async suspend() {
        this.state = 'suspended';
    }

    async close() {
        this.state = 'closed';
    }
}

class MockElement {
    constructor(tagName = 'div') {
        this.tagName = tagName.toUpperCase();
        this.nodeName = this.tagName;
        this.nodeType = 1; // ELEMENT_NODE
        this.children = [];
        this.childNodes = [];
        this.parentNode = null;
        this.attributes = {};
        this.style = {};
        this.classList = new MockClassList();
        this.dataset = {};
        this.innerHTML = '';
        this.textContent = '';
        this.id = '';
        this.className = '';
        this.eventListeners = {};
    }

    appendChild(child) {
        if (child.parentNode) {
            child.parentNode.removeChild(child);
        }
        child.parentNode = this;
        this.children.push(child);
        this.childNodes.push(child);
        return child;
    }

    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            this.childNodes.splice(index, 1);
            child.parentNode = null;
        }
        return child;
    }

    setAttribute(name, value) {
        this.attributes[name] = String(value);
        if (name === 'id') {
            this.id = String(value);
        }
        if (name === 'class') {
            this.className = String(value);
        }
    }

    getAttribute(name) {
        return this.attributes[name] || null;
    }

    removeAttribute(name) {
        delete this.attributes[name];
        if (name === 'id') {
            this.id = '';
        }
        if (name === 'class') {
            this.className = '';
        }
    }

    hasAttribute(name) {
        return name in this.attributes;
    }

    addEventListener(type, listener, options) {
        if (!this.eventListeners[type]) {
            this.eventListeners[type] = [];
        }
        this.eventListeners[type].push({ listener, options });
    }

    removeEventListener(type, listener) {
        if (this.eventListeners[type]) {
            this.eventListeners[type] = this.eventListeners[type].filter(
                item => item.listener !== listener
            );
        }
    }

    dispatchEvent(event) {
        if (this.eventListeners[event.type]) {
            this.eventListeners[event.type].forEach(({ listener }) => {
                listener(event);
            });
        }
        return true;
    }

    querySelector(selector) {
        // Simple implementation for basic selectors
        if (selector.startsWith('#')) {
            const id = selector.slice(1);
            return this.findById(id);
        }
        if (selector.startsWith('.')) {
            const className = selector.slice(1);
            return this.findByClass(className);
        }
        return this.findByTagName(selector);
    }

    querySelectorAll(selector) {
        const results = [];
        if (selector.startsWith('#')) {
            const element = this.querySelector(selector);
            if (element) {
                results.push(element);
            }
        } else if (selector.startsWith('.')) {
            const className = selector.slice(1);
            this.findAllByClass(className, results);
        } else {
            this.findAllByTagName(selector, results);
        }
        return results;
    }

    findById(id) {
        if (this.id === id) {
            return this;
        }
        for (const child of this.children) {
            const result = child.findById(id);
            if (result) {
                return result;
            }
        }
        return null;
    }

    findByClass(className) {
        if (this.classList.contains(className)) {
            return this;
        }
        for (const child of this.children) {
            const result = child.findByClass(className);
            if (result) {
                return result;
            }
        }
        return null;
    }

    findByTagName(tagName) {
        if (this.tagName === tagName.toUpperCase()) {
            return this;
        }
        for (const child of this.children) {
            const result = child.findByTagName(tagName);
            if (result) {
                return result;
            }
        }
        return null;
    }

    findAllByClass(className, results = []) {
        if (this.classList.contains(className)) {
            results.push(this);
        }
        for (const child of this.children) {
            child.findAllByClass(className, results);
        }
        return results;
    }

    findAllByTagName(tagName, results = []) {
        if (this.tagName === tagName.toUpperCase()) {
            results.push(this);
        }
        for (const child of this.children) {
            child.findAllByTagName(tagName, results);
        }
        return results;
    }

    getBoundingClientRect() {
        return {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            top: 0,
            right: 100,
            bottom: 100,
            left: 0
        };
    }

    click() {
        this.dispatchEvent(new MockEvent('click'));
    }
}

class MockDocument extends MockElement {
    constructor() {
        super('document');
        this.documentElement = new MockElement('html');
        this.body = new MockElement('body');
        this.head = new MockElement('head');
        this.documentElement.appendChild(this.head);
        this.documentElement.appendChild(this.body);
    }

    createElement(tagName) {
        return new MockElement(tagName);
    }

    createElementNS(namespace, tagName) {
        const element = new MockElement(tagName);
        element.namespaceURI = namespace;
        return element;
    }

    getElementById(id) {
        return this.documentElement.findById(id);
    }

    getElementsByClassName(className) {
        return this.documentElement.findAllByClass(className);
    }

    getElementsByTagName(tagName) {
        return this.documentElement.findAllByTagName(tagName);
    }
}

class MockWindow {
    constructor() {
        this.document = new MockDocument();
        this.localStorage = new MockStorage();
        this.sessionStorage = new MockStorage();
        this.location = {
            href: 'http://localhost:3000/',
            origin: 'http://localhost:3000',
            pathname: '/',
            search: '',
            hash: ''
        };
        this.navigator = {
            userAgent: 'MockBrowser/1.0'
        };
        this.eventListeners = {};
        this.AudioContext = MockAudioContext;
        this.webkitAudioContext = MockAudioContext;
    }

    addEventListener(type, listener, options) {
        if (!this.eventListeners[type]) {
            this.eventListeners[type] = [];
        }
        this.eventListeners[type].push({ listener, options });
    }

    removeEventListener(type, listener) {
        if (this.eventListeners[type]) {
            this.eventListeners[type] = this.eventListeners[type].filter(
                item => item.listener !== listener
            );
        }
    }

    dispatchEvent(event) {
        if (this.eventListeners[event.type]) {
            this.eventListeners[event.type].forEach(({ listener }) => {
                listener(event);
            });
        }
        return true;
    }

    matchMedia(query) {
        const mediaQuery = {
            matches: false,
            media: query,
            addEventListener: global.jest.fn(),
            removeEventListener: global.jest.fn()
        };
        return mediaQuery;
    }

    requestAnimationFrame(callback) {
        return setTimeout(callback, 16);
    }

    cancelAnimationFrame(id) {
        clearTimeout(id);
    }
}

/**
 * Setup DOM environment for testing
 */
function setupDOMEnvironment() {
    const mockWindow = new MockWindow();

    if (typeof global !== 'undefined') {
        // Node.js environment - Set up global constructors FIRST
        // This ensures instances created later will be instances of these globals
        global.Set = Set;
        global.Map = Map;
        global.CustomEvent = MockCustomEvent;
        global.Event = MockEvent;

        // Set up DOM and Web API mocks
        global.window = mockWindow;
        global.document = mockWindow.document;
        global.localStorage = mockWindow.localStorage;
        global.sessionStorage = mockWindow.sessionStorage;
        global.AudioContext = MockAudioContext;
        global.webkitAudioContext = MockAudioContext;

        // Also set AudioContext on the mock window object so modules can find it
        mockWindow.AudioContext = MockAudioContext;
        mockWindow.webkitAudioContext = MockAudioContext;
        global.requestAnimationFrame = mockWindow.requestAnimationFrame.bind(mockWindow);
        global.cancelAnimationFrame = mockWindow.cancelAnimationFrame.bind(mockWindow);

        // Load application modules into the test environment
        loadApplicationModules();
    }

    return mockWindow;
}

/**
 * Load application modules into the global scope for testing
 */
function loadApplicationModules() {
    const path = require('path');
    const fs = require('fs');

    // Define the modules to load in dependency order
    const modules = [
        'js/musicTheory.js',
        'js/audioEngine.js',
        'js/circleRenderer.js',
        'js/themeManager.js',
        'js/themeToggle.js',
        'js/interactions.js'
    ];

    // Get the project root directory
    const projectRoot = path.resolve(__dirname, '../..');

    for (const modulePath of modules) {
        const fullPath = path.join(projectRoot, modulePath);

        try {
            if (fs.existsSync(fullPath)) {
                // Read the module file
                const moduleCode = fs.readFileSync(fullPath, 'utf8');

                // Execute the module code in the global context
                // This will make the modules available as global variables
                const vm = require('vm');
                const context = {
                    ...global,
                    module: { exports: {} },
                    exports: {},
                    require: require,
                    __filename: fullPath,
                    __dirname: path.dirname(fullPath),
                    console: console,
                    // Create a proper window object with constructor functions
                    window: global.window,
                    // Ensure the same constructors are available in the VM context
                    Set: global.Set,
                    Map: global.Map,
                    CustomEvent: global.CustomEvent,
                    Event: global.Event,
                    AudioContext: global.AudioContext,
                    webkitAudioContext: global.webkitAudioContext
                };

                vm.createContext(context);
                vm.runInContext(moduleCode, context);

                // If the module exported anything, make it available globally
                if (context.module.exports) {
                    if (typeof context.module.exports === 'function') {
                        // Single function export (like AudioEngine)
                        const moduleName = path.basename(modulePath, '.js');
                        const className = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
                        global[className] = context.module.exports;
                        console.log(`  ✅ Exported function: ${className}`);
                    } else if (
                        typeof context.module.exports === 'object' &&
                        Object.keys(context.module.exports).length > 0
                    ) {
                        // Multiple exports (like MusicTheory module)
                        Object.assign(global, context.module.exports);
                        console.log(
                            `  ✅ Exported objects: ${Object.keys(context.module.exports).join(', ')}`
                        );
                    }
                }

                // Also check if the module attached anything to the window object
                if (context.window && typeof context.window === 'object') {
                    // Copy window properties to global
                    for (const prop in context.window) {
                        if (
                            Object.prototype.hasOwnProperty.call(context.window, prop) &&
                            prop !== 'window' &&
                            prop !== 'document' &&
                            prop !== 'localStorage' &&
                            prop !== 'sessionStorage' &&
                            prop !== 'AudioContext' &&
                            prop !== 'webkitAudioContext'
                        ) {
                            global[prop] = context.window[prop];
                        }
                    }
                }

                console.log(`✅ Loaded application module: ${modulePath}`);
            } else {
                console.warn(`⚠️ Module not found: ${fullPath}`);
            }
        } catch (error) {
            console.error(`❌ Failed to load module ${modulePath}:`, error.message);
        }
    }
}

/**
 * Clean up DOM environment
 */
function cleanupDOMEnvironment() {
    if (typeof global !== 'undefined') {
        delete global.window;
        delete global.document;
        delete global.localStorage;
        delete global.sessionStorage;
        delete global.AudioContext;
        delete global.webkitAudioContext;
        delete global.Event;
        delete global.requestAnimationFrame;
        delete global.cancelAnimationFrame;
    }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MockElement,
        MockDocument,
        MockWindow,
        MockEvent,
        MockStorage,
        MockAudioContext,
        MockAudioNode,
        MockGainNode,
        MockOscillatorNode,
        MockAudioParam,
        setupDOMEnvironment,
        cleanupDOMEnvironment
    };
} else if (typeof window !== 'undefined') {
    window.DOMHelpers = {
        MockElement,
        MockDocument,
        MockWindow,
        MockEvent,
        MockStorage,
        MockAudioContext,
        setupDOMEnvironment,
        cleanupDOMEnvironment
    };
}

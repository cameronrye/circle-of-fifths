/**
 * DOM and Web API Helpers for Testing
 * Provides mocks and utilities for testing browser-specific functionality
 */

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
        return {
            matches: false,
            media: query,
            addEventListener: () => {},
            removeEventListener: () => {}
        };
    }

    requestAnimationFrame(callback) {
        return setTimeout(callback, 16);
    }

    cancelAnimationFrame(id) {
        clearTimeout(id);
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

class MockAudioNode {
    constructor() {
        this.context = null;
        this.numberOfInputs = 1;
        this.numberOfOutputs = 1;
        this.connections = [];
    }

    connect(destination) {
        this.connections.push(destination);
        return destination;
    }

    disconnect() {
        this.connections = [];
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
        this.type = 'sine';
        this.started = false;
        this.stopped = false;
    }

    start(when = 0) {
        this.started = true;
    }

    stop(when = 0) {
        this.stopped = true;
    }
}

class MockAudioParam {
    constructor(defaultValue = 0) {
        this.value = defaultValue;
        this.defaultValue = defaultValue;
    }

    setValueAtTime(value, startTime) {
        this.value = value;
    }

    linearRampToValueAtTime(value, endTime) {
        this.value = value;
    }

    exponentialRampToValueAtTime(value, endTime) {
        this.value = value;
    }
}

/**
 * Setup DOM environment for testing
 */
function setupDOMEnvironment() {
    const mockWindow = new MockWindow();

    if (typeof global !== 'undefined') {
        // Node.js environment
        global.window = mockWindow;
        global.document = mockWindow.document;
        global.localStorage = mockWindow.localStorage;
        global.sessionStorage = mockWindow.sessionStorage;
        global.AudioContext = MockAudioContext;
        global.webkitAudioContext = MockAudioContext;
        global.Event = MockEvent;
        global.requestAnimationFrame = mockWindow.requestAnimationFrame.bind(mockWindow);
        global.cancelAnimationFrame = mockWindow.cancelAnimationFrame.bind(mockWindow);
    }

    return mockWindow;
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

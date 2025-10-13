## Classes

<dl>
<dt><a href="#CircleOfFifthsApp">CircleOfFifthsApp</a></dt>
<dd></dd>
<dt><a href="#CircleOfFifthsApp">CircleOfFifthsApp</a></dt>
<dd></dd>
<dt><a href="#NodePool">NodePool</a></dt>
<dd></dd>
<dt><a href="#AudioEngine">AudioEngine</a></dt>
<dd></dd>
<dt><a href="#AudioEngine">AudioEngine</a></dt>
<dd></dd>
<dt><a href="#CircleRenderer">CircleRenderer</a></dt>
<dd></dd>
<dt><a href="#CircleRenderer">CircleRenderer</a></dt>
<dd></dd>
<dt><a href="#InteractionsHandler">InteractionsHandler</a></dt>
<dd></dd>
<dt><a href="#InteractionsHandler">InteractionsHandler</a></dt>
<dd></dd>
<dt><a href="#Logger">Logger</a></dt>
<dd></dd>
<dt><a href="#Logger">Logger</a></dt>
<dd></dd>
<dt><a href="#CircleOfFifthsApp">CircleOfFifthsApp</a></dt>
<dd><p>Main application class</p>
</dd>
<dt><a href="#MusicTheory">MusicTheory</a></dt>
<dd></dd>
<dt><a href="#MusicTheory">MusicTheory</a></dt>
<dd></dd>
<dt><a href="#ThemeManager">ThemeManager</a></dt>
<dd></dd>
<dt><a href="#ThemeManager">ThemeManager</a></dt>
<dd></dd>
<dt><a href="#ThemeToggle">ThemeToggle</a></dt>
<dd></dd>
<dt><a href="#ThemeToggle">ThemeToggle</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#LOG_LEVELS">LOG_LEVELS</a></dt>
<dd><p>Logging levels in order of severity</p>
</dd>
<dt><a href="#logger">logger</a></dt>
<dd><p>Default logger instance</p>
</dd>
<dt><a href="#loggers">loggers</a></dt>
<dd><p>Create category-specific loggers</p>
</dd>
<dt><a href="#CHORD_PROGRESSIONS">CHORD_PROGRESSIONS</a></dt>
<dd><p>Chord Progressions for Major and Minor Modes</p>
<p>All progressions are defined using Roman numeral analysis:</p>
<ul>
<li>Uppercase (I, IV, V) = Major chords</li>
<li>Lowercase (ii, iii, vi) = Minor chords</li>
<li>Lowercase with ° (vii°) = Diminished chords</li>
</ul>
<p>All chords in each progression are diatonic to the key (with noted exceptions in minor mode).
When played, roman numerals are converted to actual chord roots based on the current key,
ensuring the progression stays in the same key throughout all iterations and loops.</p>
</dd>
</dl>

<a name="CircleOfFifthsApp"></a>

## CircleOfFifthsApp

**Kind**: global class

- [CircleOfFifthsApp](#CircleOfFifthsApp)
    - [new CircleOfFifthsApp()](#new_CircleOfFifthsApp_new)
    - [new CircleOfFifthsApp()](#new_CircleOfFifthsApp_new)
    - [.init()](#CircleOfFifthsApp+init) ⇒ <code>Promise.&lt;void&gt;</code>
    - [.waitForDOM()](#CircleOfFifthsApp+waitForDOM)
    - [.initializeComponents()](#CircleOfFifthsApp+initializeComponents)
    - [.setupGlobalEventListeners()](#CircleOfFifthsApp+setupGlobalEventListeners)
    - [.performInitialRender()](#CircleOfFifthsApp+performInitialRender)
    - [.setupErrorHandling()](#CircleOfFifthsApp+setupErrorHandling)
    - [.handleVisibilityChange()](#CircleOfFifthsApp+handleVisibilityChange)
    - [.updateUIState()](#CircleOfFifthsApp+updateUIState)
    - [.handleInitializationError()](#CircleOfFifthsApp+handleInitializationError)
    - [.showUserError()](#CircleOfFifthsApp+showUserError)
    - [.escapeHtml()](#CircleOfFifthsApp+escapeHtml)
    - [.handleError()](#CircleOfFifthsApp+handleError)
    - [.getUserFriendlyErrorMessage()](#CircleOfFifthsApp+getUserFriendlyErrorMessage)
    - [.isCriticalError()](#CircleOfFifthsApp+isCriticalError)
    - [.showKeyboardShortcuts()](#CircleOfFifthsApp+showKeyboardShortcuts)
    - [.getState()](#CircleOfFifthsApp+getState) ⇒ <code>Object</code> \| <code>boolean</code> \| <code>boolean</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code>
    - [.destroy()](#CircleOfFifthsApp+destroy)
    - [.restart()](#CircleOfFifthsApp+restart) ⇒ <code>Promise.&lt;void&gt;</code>
    - [.init()](#CircleOfFifthsApp+init)
    - [.setupErrorHandling()](#CircleOfFifthsApp+setupErrorHandling)
    - [.hideLoadingScreen()](#CircleOfFifthsApp+hideLoadingScreen)
    - [.handleInitializationError()](#CircleOfFifthsApp+handleInitializationError)
    - [.handleError()](#CircleOfFifthsApp+handleError)
    - [.destroy()](#CircleOfFifthsApp+destroy)

<a name="new_CircleOfFifthsApp_new"></a>

### new CircleOfFifthsApp()

Main application class for the Circle of Fifths interactive music theory tool.
Manages initialization, component coordination, and application lifecycle.

**Example**

```js
const app = new CircleOfFifthsApp();
await app.init();
```

<a name="new_CircleOfFifthsApp_new"></a>

### new CircleOfFifthsApp()

Creates a new CircleOfFifthsApp instance.
Initializes all component references and binds event handlers.

<a name="CircleOfFifthsApp+init"></a>

### circleOfFifthsApp.init() ⇒ <code>Promise.&lt;void&gt;</code>

Initialize the application asynchronously.
Sets up all components, event listeners, and performs initial render.
Can be called multiple times safely - subsequent calls return the same promise.

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promise that resolves when initialization is complete  
**Throws**:

- <code>Error</code> If initialization fails

**Example**

```js
try {
    await app.init();
    console.log('App ready!');
} catch (error) {
    console.error('Failed to initialize:', error);
}
```

<a name="CircleOfFifthsApp+waitForDOM"></a>

### circleOfFifthsApp.waitForDOM()

Wait for DOM to be ready

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+initializeComponents"></a>

### circleOfFifthsApp.initializeComponents()

Initialize core components

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+setupGlobalEventListeners"></a>

### circleOfFifthsApp.setupGlobalEventListeners()

Setup global event listeners

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+performInitialRender"></a>

### circleOfFifthsApp.performInitialRender()

Perform initial render

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+setupErrorHandling"></a>

### circleOfFifthsApp.setupErrorHandling()

Setup error handling

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+handleVisibilityChange"></a>

### circleOfFifthsApp.handleVisibilityChange()

Handle page visibility change

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+updateUIState"></a>

### circleOfFifthsApp.updateUIState()

Update UI state

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+handleInitializationError"></a>

### circleOfFifthsApp.handleInitializationError()

Handle initialization errors

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+showUserError"></a>

### circleOfFifthsApp.showUserError()

Show user-facing error message

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+escapeHtml"></a>

### circleOfFifthsApp.escapeHtml()

Escape HTML to prevent XSS

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+handleError"></a>

### circleOfFifthsApp.handleError()

Handle runtime errors

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+getUserFriendlyErrorMessage"></a>

### circleOfFifthsApp.getUserFriendlyErrorMessage()

Get user-friendly error message

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+isCriticalError"></a>

### circleOfFifthsApp.isCriticalError()

Check if error is critical

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+showKeyboardShortcuts"></a>

### circleOfFifthsApp.showKeyboardShortcuts()

Show keyboard shortcuts help

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+getState"></a>

### circleOfFifthsApp.getState() ⇒ <code>Object</code> \| <code>boolean</code> \| <code>boolean</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code>

Get the current application state.
Returns comprehensive state information for debugging and monitoring.

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
**Returns**: <code>Object</code> - Application state object<code>boolean</code> - returns.initialized - Whether the app is fully initialized<code>boolean</code> \| <code>null</code> - returns.musicTheory - Music theory engine status<code>Object</code> \| <code>null</code> - returns.audioEngine - Audio engine state<code>Object</code> \| <code>null</code> - returns.circleRenderer - Circle renderer state<code>Object</code> \| <code>null</code> - returns.interactions - Interactions handler state<code>Object</code> \| <code>null</code> - returns.theme - Theme manager state  
**Example**

```js
const state = app.getState();
console.log('App initialized:', state.initialized);
```

<a name="CircleOfFifthsApp+destroy"></a>

### circleOfFifthsApp.destroy()

Cleanup all application resources and event listeners.
Properly disposes of all components and resets the application state.
Should be called before page unload or when restarting the application.

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
**Example**

```js
// Clean shutdown
app.destroy();
```

<a name="CircleOfFifthsApp+restart"></a>

### circleOfFifthsApp.restart() ⇒ <code>Promise.&lt;void&gt;</code>

Restart the application by destroying and reinitializing.
Useful for recovering from errors or applying configuration changes.

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promise that resolves when restart is complete  
**Example**

```js
// Restart after an error
await app.restart();
```

<a name="CircleOfFifthsApp+init"></a>

### circleOfFifthsApp.init()

Initialize the application

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+setupErrorHandling"></a>

### circleOfFifthsApp.setupErrorHandling()

Setup global error handlers

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+hideLoadingScreen"></a>

### circleOfFifthsApp.hideLoadingScreen()

Hide the loading screen

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+handleInitializationError"></a>

### circleOfFifthsApp.handleInitializationError()

Handle initialization errors

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+handleError"></a>

### circleOfFifthsApp.handleError()

Handle runtime errors

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+destroy"></a>

### circleOfFifthsApp.destroy()

Cleanup and destroy the application

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp"></a>

## CircleOfFifthsApp

**Kind**: global class

- [CircleOfFifthsApp](#CircleOfFifthsApp)
    - [new CircleOfFifthsApp()](#new_CircleOfFifthsApp_new)
    - [new CircleOfFifthsApp()](#new_CircleOfFifthsApp_new)
    - [.init()](#CircleOfFifthsApp+init) ⇒ <code>Promise.&lt;void&gt;</code>
    - [.waitForDOM()](#CircleOfFifthsApp+waitForDOM)
    - [.initializeComponents()](#CircleOfFifthsApp+initializeComponents)
    - [.setupGlobalEventListeners()](#CircleOfFifthsApp+setupGlobalEventListeners)
    - [.performInitialRender()](#CircleOfFifthsApp+performInitialRender)
    - [.setupErrorHandling()](#CircleOfFifthsApp+setupErrorHandling)
    - [.handleVisibilityChange()](#CircleOfFifthsApp+handleVisibilityChange)
    - [.updateUIState()](#CircleOfFifthsApp+updateUIState)
    - [.handleInitializationError()](#CircleOfFifthsApp+handleInitializationError)
    - [.showUserError()](#CircleOfFifthsApp+showUserError)
    - [.escapeHtml()](#CircleOfFifthsApp+escapeHtml)
    - [.handleError()](#CircleOfFifthsApp+handleError)
    - [.getUserFriendlyErrorMessage()](#CircleOfFifthsApp+getUserFriendlyErrorMessage)
    - [.isCriticalError()](#CircleOfFifthsApp+isCriticalError)
    - [.showKeyboardShortcuts()](#CircleOfFifthsApp+showKeyboardShortcuts)
    - [.getState()](#CircleOfFifthsApp+getState) ⇒ <code>Object</code> \| <code>boolean</code> \| <code>boolean</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code>
    - [.destroy()](#CircleOfFifthsApp+destroy)
    - [.restart()](#CircleOfFifthsApp+restart) ⇒ <code>Promise.&lt;void&gt;</code>
    - [.init()](#CircleOfFifthsApp+init)
    - [.setupErrorHandling()](#CircleOfFifthsApp+setupErrorHandling)
    - [.hideLoadingScreen()](#CircleOfFifthsApp+hideLoadingScreen)
    - [.handleInitializationError()](#CircleOfFifthsApp+handleInitializationError)
    - [.handleError()](#CircleOfFifthsApp+handleError)
    - [.destroy()](#CircleOfFifthsApp+destroy)

<a name="new_CircleOfFifthsApp_new"></a>

### new CircleOfFifthsApp()

Main application class for the Circle of Fifths interactive music theory tool.
Manages initialization, component coordination, and application lifecycle.

**Example**

```js
const app = new CircleOfFifthsApp();
await app.init();
```

<a name="new_CircleOfFifthsApp_new"></a>

### new CircleOfFifthsApp()

Creates a new CircleOfFifthsApp instance.
Initializes all component references and binds event handlers.

<a name="CircleOfFifthsApp+init"></a>

### circleOfFifthsApp.init() ⇒ <code>Promise.&lt;void&gt;</code>

Initialize the application asynchronously.
Sets up all components, event listeners, and performs initial render.
Can be called multiple times safely - subsequent calls return the same promise.

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promise that resolves when initialization is complete  
**Throws**:

- <code>Error</code> If initialization fails

**Example**

```js
try {
    await app.init();
    console.log('App ready!');
} catch (error) {
    console.error('Failed to initialize:', error);
}
```

<a name="CircleOfFifthsApp+waitForDOM"></a>

### circleOfFifthsApp.waitForDOM()

Wait for DOM to be ready

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+initializeComponents"></a>

### circleOfFifthsApp.initializeComponents()

Initialize core components

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+setupGlobalEventListeners"></a>

### circleOfFifthsApp.setupGlobalEventListeners()

Setup global event listeners

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+performInitialRender"></a>

### circleOfFifthsApp.performInitialRender()

Perform initial render

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+setupErrorHandling"></a>

### circleOfFifthsApp.setupErrorHandling()

Setup error handling

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+handleVisibilityChange"></a>

### circleOfFifthsApp.handleVisibilityChange()

Handle page visibility change

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+updateUIState"></a>

### circleOfFifthsApp.updateUIState()

Update UI state

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+handleInitializationError"></a>

### circleOfFifthsApp.handleInitializationError()

Handle initialization errors

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+showUserError"></a>

### circleOfFifthsApp.showUserError()

Show user-facing error message

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+escapeHtml"></a>

### circleOfFifthsApp.escapeHtml()

Escape HTML to prevent XSS

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+handleError"></a>

### circleOfFifthsApp.handleError()

Handle runtime errors

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+getUserFriendlyErrorMessage"></a>

### circleOfFifthsApp.getUserFriendlyErrorMessage()

Get user-friendly error message

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+isCriticalError"></a>

### circleOfFifthsApp.isCriticalError()

Check if error is critical

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+showKeyboardShortcuts"></a>

### circleOfFifthsApp.showKeyboardShortcuts()

Show keyboard shortcuts help

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+getState"></a>

### circleOfFifthsApp.getState() ⇒ <code>Object</code> \| <code>boolean</code> \| <code>boolean</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code>

Get the current application state.
Returns comprehensive state information for debugging and monitoring.

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
**Returns**: <code>Object</code> - Application state object<code>boolean</code> - returns.initialized - Whether the app is fully initialized<code>boolean</code> \| <code>null</code> - returns.musicTheory - Music theory engine status<code>Object</code> \| <code>null</code> - returns.audioEngine - Audio engine state<code>Object</code> \| <code>null</code> - returns.circleRenderer - Circle renderer state<code>Object</code> \| <code>null</code> - returns.interactions - Interactions handler state<code>Object</code> \| <code>null</code> - returns.theme - Theme manager state  
**Example**

```js
const state = app.getState();
console.log('App initialized:', state.initialized);
```

<a name="CircleOfFifthsApp+destroy"></a>

### circleOfFifthsApp.destroy()

Cleanup all application resources and event listeners.
Properly disposes of all components and resets the application state.
Should be called before page unload or when restarting the application.

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
**Example**

```js
// Clean shutdown
app.destroy();
```

<a name="CircleOfFifthsApp+restart"></a>

### circleOfFifthsApp.restart() ⇒ <code>Promise.&lt;void&gt;</code>

Restart the application by destroying and reinitializing.
Useful for recovering from errors or applying configuration changes.

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promise that resolves when restart is complete  
**Example**

```js
// Restart after an error
await app.restart();
```

<a name="CircleOfFifthsApp+init"></a>

### circleOfFifthsApp.init()

Initialize the application

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+setupErrorHandling"></a>

### circleOfFifthsApp.setupErrorHandling()

Setup global error handlers

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+hideLoadingScreen"></a>

### circleOfFifthsApp.hideLoadingScreen()

Hide the loading screen

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+handleInitializationError"></a>

### circleOfFifthsApp.handleInitializationError()

Handle initialization errors

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+handleError"></a>

### circleOfFifthsApp.handleError()

Handle runtime errors

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+destroy"></a>

### circleOfFifthsApp.destroy()

Cleanup and destroy the application

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="NodePool"></a>

## NodePool

**Kind**: global class  
<a name="new_NodePool_new"></a>

### new NodePool()

Node pool for reusing audio nodes to improve performance

<a name="AudioEngine"></a>

## AudioEngine

**Kind**: global class

- [AudioEngine](#AudioEngine)
    - [new AudioEngine()](#new_AudioEngine_new)
    - [new AudioEngine()](#new_AudioEngine_new)
    - [.initialize()](#AudioEngine+initialize) ⇒ <code>Promise.&lt;boolean&gt;</code>
    - [.initializeNodePools()](#AudioEngine+initializeNodePools)
    - [.createCustomWaveforms()](#AudioEngine+createCustomWaveforms)
    - [.createPianoWave()](#AudioEngine+createPianoWave)
    - [.createWarmSineWave()](#AudioEngine+createWarmSineWave)
    - [.createSoftSquareWave()](#AudioEngine+createSoftSquareWave)
    - [.createOrganWave()](#AudioEngine+createOrganWave)
    - [.generateImpulseResponse(type)](#AudioEngine+generateImpulseResponse) ⇒ <code>AudioBuffer</code>
    - [.createEffectsChain()](#AudioEngine+createEffectsChain) ⇒ <code>Object</code>
    - [.createConvolutionReverb(type)](#AudioEngine+createConvolutionReverb) ⇒ <code>Object</code>
    - [.createSimpleDelayReverb()](#AudioEngine+createSimpleDelayReverb) ⇒ <code>Object</code>
    - [.createSafetyLimiter()](#AudioEngine+createSafetyLimiter) ⇒ <code>DynamicsCompressorNode</code>
    - [.createADSREnvelope(gainNode, startTime, duration)](#AudioEngine+createADSREnvelope)
    - [.createDynamicFilter(frequency, startTime, duration)](#AudioEngine+createDynamicFilter) ⇒ <code>BiquadFilterNode</code>
    - [.calculateDynamicGain(noteCount, frequency)](#AudioEngine+calculateDynamicGain) ⇒ <code>number</code>
    - [.createEnhancedOscillator(frequency, startTime, duration, waveform, \_pan)](#AudioEngine+createEnhancedOscillator)
    - [.createSimpleOscillator()](#AudioEngine+createSimpleOscillator)
    - [.createOscillator()](#AudioEngine+createOscillator)
    - [.playNote(note, [octave], [duration])](#AudioEngine+playNote) ⇒ <code>Promise.&lt;void&gt;</code>
    - [.createChordVoicing(notes, octave)](#AudioEngine+createChordVoicing) ⇒ <code>Array</code>
    - [.playChord(notes, [octave], [duration])](#AudioEngine+playChord) ⇒ <code>Promise.&lt;void&gt;</code>
    - [.playScale()](#AudioEngine+playScale)
    - [.findOptimalVoiceAssignment(voicing1, voicing2)](#AudioEngine+findOptimalVoiceAssignment) ⇒ <code>Object</code>
    - [.calculateVoiceMovement(chord1, chord2)](#AudioEngine+calculateVoiceMovement) ⇒ <code>number</code>
    - [.generateVoicingCandidates(notes, targetOctave)](#AudioEngine+generateVoicingCandidates) ⇒ <code>Array</code>
    - [.scoreVoicing(voicing, previousVoicing)](#AudioEngine+scoreVoicing) ⇒ <code>number</code>
    - [.optimizeChordVoicing(notes, previousVoicing, octave)](#AudioEngine+optimizeChordVoicing) ⇒ <code>Array</code>
    - [.playProgression(key, mode, progressionName, previousVoicing)](#AudioEngine+playProgression) ⇒ <code>Object</code>
    - [.playProgressionLoop(key, mode, progressionName)](#AudioEngine+playProgressionLoop)
    - [.getChordQuality()](#AudioEngine+getChordQuality)
    - [.createKickDrum(startTime)](#AudioEngine+createKickDrum) ⇒ <code>Object</code>
    - [.createSnareDrum(startTime)](#AudioEngine+createSnareDrum) ⇒ <code>Object</code>
    - [.createHiHat(startTime)](#AudioEngine+createHiHat) ⇒ <code>Object</code>
    - [.playPercussionPattern(startTime, duration)](#AudioEngine+playPercussionPattern)
    - [.createBassNote(note, octave, startTime, duration)](#AudioEngine+createBassNote) ⇒ <code>Object</code>
    - [.playBassPattern(chordRoot, startTime, duration)](#AudioEngine+playBassPattern)
    - [.setPercussionEnabled(enabled)](#AudioEngine+setPercussionEnabled)
    - [.setLoopingEnabled(enabled)](#AudioEngine+setLoopingEnabled)
    - [.isLooping()](#AudioEngine+isLooping) ⇒ <code>boolean</code>
    - [.isPercussionEnabled()](#AudioEngine+isPercussionEnabled) ⇒ <code>boolean</code>
    - [.setBassEnabled(enabled)](#AudioEngine+setBassEnabled)
    - [.isBassEnabled()](#AudioEngine+isBassEnabled) ⇒ <code>boolean</code>
    - [.stopAll()](#AudioEngine+stopAll)
    - [.addNoteEventListener()](#AudioEngine+addNoteEventListener)
    - [.removeNoteEventListener()](#AudioEngine+removeNoteEventListener)
    - [.emitNoteEvent()](#AudioEngine+emitNoteEvent)
    - [.setVolume()](#AudioEngine+setVolume)
    - [.setWaveform()](#AudioEngine+setWaveform)
    - [.setNoteDuration()](#AudioEngine+setNoteDuration)
    - [.setFilterCutoff()](#AudioEngine+setFilterCutoff)
    - [.getState()](#AudioEngine+getState)
    - [.playClick()](#AudioEngine+playClick)
    - [.scheduleNote(note, octave, startTime, duration)](#AudioEngine+scheduleNote)
    - [.scheduleChord(notes, octave, startTime, duration)](#AudioEngine+scheduleChord)
    - [.startScheduler(stepCallback, tempo, totalSteps)](#AudioEngine+startScheduler)
    - [.scheduleLoop()](#AudioEngine+scheduleLoop)
    - [.nextStep()](#AudioEngine+nextStep)
    - [.stopScheduler()](#AudioEngine+stopScheduler)
    - [.playSequence(sequence, startTime)](#AudioEngine+playSequence)
    - [.playProgressionWithRhythm(key, mode, progressionName, rhythm)](#AudioEngine+playProgressionWithRhythm)
    - [.dispose()](#AudioEngine+dispose)

<a name="new_AudioEngine_new"></a>

### new AudioEngine()

Audio engine for synthesizing and playing musical notes, chords, and progressions.
Uses the Web Audio API for real-time audio synthesis with configurable parameters.

**Example**

```js
const audioEngine = new AudioEngine();
await audioEngine.initialize();
await audioEngine.playNote('C', 4);
```

<a name="new_AudioEngine_new"></a>

### new AudioEngine()

Creates a new AudioEngine instance.
Initializes audio settings and prepares for Web Audio API usage.
Note: initialize() must be called after user interaction to activate audio.

<a name="AudioEngine+initialize"></a>

### audioEngine.initialize() ⇒ <code>Promise.&lt;boolean&gt;</code>

Initialize the Web Audio API context and master gain node.
Must be called after user interaction due to browser autoplay policies.
Can be called multiple times safely - subsequent calls return immediately.

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - True if initialization successful, false otherwise  
**Throws**:

- <code>Error</code> If Web Audio API is not supported

**Example**

```js
const success = await audioEngine.initialize();
if (success) {
    console.log('Audio ready!');
}
```

<a name="AudioEngine+initializeNodePools"></a>

### audioEngine.initializeNodePools()

Initialize node pools for performance optimization

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+createCustomWaveforms"></a>

### audioEngine.createCustomWaveforms()

Create custom waveforms with rich harmonic content

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+createPianoWave"></a>

### audioEngine.createPianoWave()

Piano-like tone with natural harmonic decay

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+createWarmSineWave"></a>

### audioEngine.createWarmSineWave()

Warm sine with subtle harmonics for richness

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+createSoftSquareWave"></a>

### audioEngine.createSoftSquareWave()

Soft square wave with reduced high harmonics (less harsh)

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+createOrganWave"></a>

### audioEngine.createOrganWave()

Organ-like tone with specific harmonic ratios

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+generateImpulseResponse"></a>

### audioEngine.generateImpulseResponse(type) ⇒ <code>AudioBuffer</code>

Generate impulse response buffer algorithmically for convolution reverb

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>AudioBuffer</code> - Impulse response buffer

| Param | Type                | Default                       | Description                |
| ----- | ------------------- | ----------------------------- | -------------------------- |
| type  | <code>string</code> | <code>&quot;room&quot;</code> | 'room', 'hall', or 'plate' |

<a name="AudioEngine+createEffectsChain"></a>

### audioEngine.createEffectsChain() ⇒ <code>Object</code>

Create effects chain with filtering, reverb, delay, and compression

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Object</code> - Effects chain with input and output nodes  
<a name="AudioEngine+createConvolutionReverb"></a>

### audioEngine.createConvolutionReverb(type) ⇒ <code>Object</code>

Create high-quality convolution reverb with algorithmic impulse response
Falls back to simple delay-based reverb if ConvolverNode is not available

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Object</code> - Reverb with input and output nodes

| Param | Type                | Default                       | Description                |
| ----- | ------------------- | ----------------------------- | -------------------------- |
| type  | <code>string</code> | <code>&quot;room&quot;</code> | 'room', 'hall', or 'plate' |

<a name="AudioEngine+createSimpleDelayReverb"></a>

### audioEngine.createSimpleDelayReverb() ⇒ <code>Object</code>

Create simple delay-based reverb as fallback
Used when ConvolverNode is not available (e.g., in test environments)

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Object</code> - Reverb with input and output nodes  
<a name="AudioEngine+createSafetyLimiter"></a>

### audioEngine.createSafetyLimiter() ⇒ <code>DynamicsCompressorNode</code>

Create safety limiter to prevent clipping

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>DynamicsCompressorNode</code> - Limiter node  
<a name="AudioEngine+createADSREnvelope"></a>

### audioEngine.createADSREnvelope(gainNode, startTime, duration)

Create improved ADSR envelope with anti-click protection

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param     | Type                  | Description                        |
| --------- | --------------------- | ---------------------------------- |
| gainNode  | <code>GainNode</code> | The gain node to apply envelope to |
| startTime | <code>number</code>   | When to start the envelope         |
| duration  | <code>number</code>   | Total duration of the note         |

<a name="AudioEngine+createDynamicFilter"></a>

### audioEngine.createDynamicFilter(frequency, startTime, duration) ⇒ <code>BiquadFilterNode</code>

Create filter with envelope modulation for expressive sound

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>BiquadFilterNode</code> - Configured filter

| Param     | Type                | Description    |
| --------- | ------------------- | -------------- |
| frequency | <code>number</code> | Note frequency |
| startTime | <code>number</code> | Start time     |
| duration  | <code>number</code> | Duration       |

<a name="AudioEngine+calculateDynamicGain"></a>

### audioEngine.calculateDynamicGain(noteCount, frequency) ⇒ <code>number</code>

Calculate appropriate gain based on number of notes and frequency

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>number</code> - Gain multiplier

| Param     | Type                | Description                  |
| --------- | ------------------- | ---------------------------- |
| noteCount | <code>number</code> | Number of simultaneous notes |
| frequency | <code>number</code> | Average frequency            |

<a name="AudioEngine+createEnhancedOscillator"></a>

### audioEngine.createEnhancedOscillator(frequency, startTime, duration, waveform, \_pan)

Create enhanced multi-oscillator synthesis with all improvements
Includes: custom waveforms, stereo enhancement, filter envelope, dynamic gain

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param     | Type                | Default                           | Description                                                                |
| --------- | ------------------- | --------------------------------- | -------------------------------------------------------------------------- |
| frequency | <code>number</code> |                                   | Note frequency in Hz                                                       |
| startTime | <code>number</code> |                                   | Start time in audio context time                                           |
| duration  | <code>number</code> |                                   | Duration in seconds                                                        |
| waveform  | <code>string</code> | <code>&quot;warmSine&quot;</code> | Waveform type                                                              |
| \_pan     | <code>number</code> | <code>0</code>                    | Pan position (reserved for future use, currently handled by chord voicing) |

<a name="AudioEngine+createSimpleOscillator"></a>

### audioEngine.createSimpleOscillator()

Create simple oscillator (fallback for compatibility)

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+createOscillator"></a>

### audioEngine.createOscillator()

Create oscillator (main method - uses enhanced synthesis)

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+playNote"></a>

### audioEngine.playNote(note, [octave], [duration]) ⇒ <code>Promise.&lt;void&gt;</code>

Play a single musical note using Web Audio synthesis.
Automatically initializes the audio engine if not already done.

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promise that resolves when note starts playing

| Param      | Type                                     | Default        | Description                               |
| ---------- | ---------------------------------------- | -------------- | ----------------------------------------- |
| note       | <code>string</code>                      |                | The note name (e.g., 'C', 'F#', 'Bb')     |
| [octave]   | <code>number</code>                      | <code>4</code> | The octave number (0-8)                   |
| [duration] | <code>number</code> \| <code>null</code> | <code></code>  | Duration in seconds, uses default if null |

**Example**

```js
// Play middle C for default duration
await audioEngine.playNote('C', 4);

// Play A above middle C for 2 seconds
await audioEngine.playNote('A', 4, 2.0);
```

<a name="AudioEngine+createChordVoicing"></a>

### audioEngine.createChordVoicing(notes, octave) ⇒ <code>Array</code>

Create proper chord voicing with close harmony and musical spacing
Uses close position voicing in a comfortable musical range (octaves 3-4)

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Array</code> - Array of {note, octave, pan} objects with proper voicing

| Param  | Type                | Default        | Description                                            |
| ------ | ------------------- | -------------- | ------------------------------------------------------ |
| notes  | <code>Array</code>  |                | Array of note names                                    |
| octave | <code>number</code> | <code>3</code> | Base octave for the chord (default 3 for better range) |

<a name="AudioEngine+playChord"></a>

### audioEngine.playChord(notes, [octave], [duration]) ⇒ <code>Promise.&lt;void&gt;</code>

Play a chord (multiple notes simultaneously) with proper voicing.
Uses proper chord voicing with root in bass and close harmony above.

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promise that resolves when chord starts playing

| Param      | Type                                     | Default        | Description                               |
| ---------- | ---------------------------------------- | -------------- | ----------------------------------------- |
| notes      | <code>Array.&lt;string&gt;</code>        |                | Array of note names to play together      |
| [octave]   | <code>number</code>                      | <code>4</code> | The base octave number for the chord      |
| [duration] | <code>number</code> \| <code>null</code> | <code></code>  | Duration in seconds, uses default if null |

**Example**

```js
// Play C major chord with proper voicing
await audioEngine.playChord(['C', 'E', 'G'], 4);

// Play Am chord for 3 seconds
await audioEngine.playChord(['A', 'C', 'E'], 4, 3.0);
```

<a name="AudioEngine+playScale"></a>

### audioEngine.playScale()

Play a complete scale pattern with octave cycles
Plays ascending from root to octave, then descending back to root
Example: C-D-E-F-G-A-B-C-C-B-A-G-F-E-D-C

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+findOptimalVoiceAssignment"></a>

### audioEngine.findOptimalVoiceAssignment(voicing1, voicing2) ⇒ <code>Object</code>

Find optimal voice assignment between two chords for smooth voice leading
Uses greedy algorithm: prioritize common tones, then smallest movements

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Object</code> - Assignment info with movements array and total movement

| Param    | Type               | Description                                |
| -------- | ------------------ | ------------------------------------------ |
| voicing1 | <code>Array</code> | First chord voicing [{note, octave}, ...]  |
| voicing2 | <code>Array</code> | Second chord voicing [{note, octave}, ...] |

<a name="AudioEngine+calculateVoiceMovement"></a>

### audioEngine.calculateVoiceMovement(chord1, chord2) ⇒ <code>number</code>

Calculate voice leading movement between two chords using optimal voice assignment

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>number</code> - Total semitone movement

| Param  | Type               | Description                                |
| ------ | ------------------ | ------------------------------------------ |
| chord1 | <code>Array</code> | First chord voicing [{note, octave}, ...]  |
| chord2 | <code>Array</code> | Second chord voicing [{note, octave}, ...] |

<a name="AudioEngine+generateVoicingCandidates"></a>

### audioEngine.generateVoicingCandidates(notes, targetOctave) ⇒ <code>Array</code>

Generate multiple voicing candidates for a chord
Includes root position, inversions, and different octave placements

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Array</code> - Array of voicing candidates

| Param        | Type                | Default        | Description                |
| ------------ | ------------------- | -------------- | -------------------------- |
| notes        | <code>Array</code>  |                | Chord notes                |
| targetOctave | <code>number</code> | <code>3</code> | Target octave for voicings |

<a name="AudioEngine+scoreVoicing"></a>

### audioEngine.scoreVoicing(voicing, previousVoicing) ⇒ <code>number</code>

Score a voicing based on multiple musical criteria
Lower scores are better

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>number</code> - Score (lower is better)

| Param           | Type               | Default       | Description                                |
| --------------- | ------------------ | ------------- | ------------------------------------------ |
| voicing         | <code>Array</code> |               | Chord voicing to score                     |
| previousVoicing | <code>Array</code> | <code></code> | Previous chord voicing (for voice leading) |

<a name="AudioEngine+optimizeChordVoicing"></a>

### audioEngine.optimizeChordVoicing(notes, previousVoicing, octave) ⇒ <code>Array</code>

Find the best chord voicing for smooth voice leading
Uses comprehensive search and scoring based on multiple musical criteria

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Array</code> - Optimized chord voicing

| Param           | Type                | Default        | Description                              |
| --------------- | ------------------- | -------------- | ---------------------------------------- |
| notes           | <code>Array</code>  |                | Chord notes                              |
| previousVoicing | <code>Array</code>  |                | Previous chord voicing                   |
| octave          | <code>number</code> | <code>3</code> | Base octave (default 3 for better range) |

<a name="AudioEngine+playProgression"></a>

### audioEngine.playProgression(key, mode, progressionName, previousVoicing) ⇒ <code>Object</code>

This method plays a chord progression with sophisticated voice leading optimization:

1. **Key Consistency**: All chords are derived from the specified key and mode.
   Roman numerals are converted to actual chord roots using the scale of the given key.
   Example: In C major, 'ii' → D minor, 'V' → G major, 'I' → C major

2. **Voice Leading Optimization**: Each chord is voiced to minimize voice movement
   from the previous chord, creating smooth melodic lines in all voices.
    - Common tones are retained in the same voice
    - Other voices move by the smallest possible interval
    - Top voice (melody) is prioritized for smooth stepwise motion

3. **Diatonic Integrity**: All chord notes are guaranteed to be diatonic to the key
   (except in minor mode where the V chord may use the raised leading tone)

4. **Loop Compatibility**: Returns the final voicing so it can be used as the
   previousVoicing parameter in the next iteration, ensuring smooth loop transitions

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Object</code> - Object containing finalVoicing and totalDuration

| Param           | Type                | Default       | Description                                           |
| --------------- | ------------------- | ------------- | ----------------------------------------------------- |
| key             | <code>string</code> |               | Key signature (e.g., 'C', 'G', 'F#')                  |
| mode            | <code>string</code> |               | Major or minor                                        |
| progressionName | <code>string</code> |               | Name of the progression (e.g., 'ii-V-I', 'I-V-vi-IV') |
| previousVoicing | <code>Object</code> | <code></code> | Previous voicing for voice leading (optional)         |

<a name="AudioEngine+playProgressionLoop"></a>

### audioEngine.playProgressionLoop(key, mode, progressionName)

This method ensures that:

1. The progression stays in the same key throughout all loop iterations
2. Voice leading is optimized across loop boundaries (last chord → first chord)
3. The final voicing of each iteration is used as the starting point for the next
4. No key modulation occurs - all chords remain diatonic to the original key

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param           | Type                | Description                              |
| --------------- | ------------------- | ---------------------------------------- |
| key             | <code>string</code> | Key signature (e.g., 'C', 'G', 'F#')     |
| mode            | <code>string</code> | Major or minor                           |
| progressionName | <code>string</code> | Name of the progression (e.g., 'ii-V-I') |

<a name="AudioEngine+getChordQuality"></a>

### audioEngine.getChordQuality()

Determine chord quality from roman numeral

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+createKickDrum"></a>

### audioEngine.createKickDrum(startTime) ⇒ <code>Object</code>

Create kick drum sound using oscillator with pitch envelope

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Object</code> - Audio nodes for cleanup

| Param     | Type                | Description                 |
| --------- | ------------------- | --------------------------- |
| startTime | <code>number</code> | When to start the kick drum |

<a name="AudioEngine+createSnareDrum"></a>

### audioEngine.createSnareDrum(startTime) ⇒ <code>Object</code>

Create snare drum sound using noise with bandpass filter

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Object</code> - Audio nodes for cleanup

| Param     | Type                | Description                  |
| --------- | ------------------- | ---------------------------- |
| startTime | <code>number</code> | When to start the snare drum |

<a name="AudioEngine+createHiHat"></a>

### audioEngine.createHiHat(startTime) ⇒ <code>Object</code>

Create hi-hat sound using high-frequency noise

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Object</code> - Audio nodes for cleanup

| Param     | Type                | Description              |
| --------- | ------------------- | ------------------------ |
| startTime | <code>number</code> | When to start the hi-hat |

<a name="AudioEngine+playPercussionPattern"></a>

### audioEngine.playPercussionPattern(startTime, duration)

Play percussion pattern for one chord duration

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param     | Type                | Description                            |
| --------- | ------------------- | -------------------------------------- |
| startTime | <code>number</code> | When to start the pattern              |
| duration  | <code>number</code> | Duration of the chord (pattern length) |

<a name="AudioEngine+createBassNote"></a>

### audioEngine.createBassNote(note, octave, startTime, duration) ⇒ <code>Object</code>

Create bass note sound using oscillator with envelope

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Object</code> - Audio nodes for cleanup

| Param     | Type                | Description                           |
| --------- | ------------------- | ------------------------------------- |
| note      | <code>string</code> | The note name (e.g., 'C', 'F#', 'Bb') |
| octave    | <code>number</code> | The octave for the bass note          |
| startTime | <code>number</code> | When to start the bass note           |
| duration  | <code>number</code> | Duration of the bass note             |

<a name="AudioEngine+playBassPattern"></a>

### audioEngine.playBassPattern(chordRoot, startTime, duration)

Play bass pattern for one chord duration

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param     | Type                | Description                                        |
| --------- | ------------------- | -------------------------------------------------- |
| chordRoot | <code>string</code> | The root note of the chord (e.g., 'C', 'F#', 'Bb') |
| startTime | <code>number</code> | When to start the pattern                          |
| duration  | <code>number</code> | Duration of the chord (pattern length)             |

<a name="AudioEngine+setPercussionEnabled"></a>

### audioEngine.setPercussionEnabled(enabled)

Enable or disable percussion

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param   | Type                 | Description                          |
| ------- | -------------------- | ------------------------------------ |
| enabled | <code>boolean</code> | Whether percussion should be enabled |

<a name="AudioEngine+setLoopingEnabled"></a>

### audioEngine.setLoopingEnabled(enabled)

Enable or disable looping

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param   | Type                 | Description                       |
| ------- | -------------------- | --------------------------------- |
| enabled | <code>boolean</code> | Whether looping should be enabled |

<a name="AudioEngine+isLooping"></a>

### audioEngine.isLooping() ⇒ <code>boolean</code>

Check if looping is currently enabled

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>boolean</code> - True if looping is active  
<a name="AudioEngine+isPercussionEnabled"></a>

### audioEngine.isPercussionEnabled() ⇒ <code>boolean</code>

Check if percussion is currently enabled

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>boolean</code> - True if percussion is active  
<a name="AudioEngine+setBassEnabled"></a>

### audioEngine.setBassEnabled(enabled)

Enable or disable bass

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param   | Type                 | Description                    |
| ------- | -------------------- | ------------------------------ |
| enabled | <code>boolean</code> | Whether bass should be enabled |

<a name="AudioEngine+isBassEnabled"></a>

### audioEngine.isBassEnabled() ⇒ <code>boolean</code>

Check if bass is currently enabled

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>boolean</code> - True if bass is active  
<a name="AudioEngine+stopAll"></a>

### audioEngine.stopAll()

Stop all currently playing audio

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+addNoteEventListener"></a>

### audioEngine.addNoteEventListener()

Add event listener for note events

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+removeNoteEventListener"></a>

### audioEngine.removeNoteEventListener()

Remove event listener for note events

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+emitNoteEvent"></a>

### audioEngine.emitNoteEvent()

Emit note event to all listeners

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+setVolume"></a>

### audioEngine.setVolume()

Set master volume (0-1)

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+setWaveform"></a>

### audioEngine.setWaveform()

Change waveform type

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+setNoteDuration"></a>

### audioEngine.setNoteDuration()

Set note duration

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+setFilterCutoff"></a>

### audioEngine.setFilterCutoff()

Control effects settings

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+getState"></a>

### audioEngine.getState()

Get current audio context state

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+playClick"></a>

### audioEngine.playClick()

Create a simple metronome click

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+scheduleNote"></a>

### audioEngine.scheduleNote(note, octave, startTime, duration)

Schedule a note with precise timing

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param     | Type                | Description                            |
| --------- | ------------------- | -------------------------------------- |
| note      | <code>string</code> | Note name                              |
| octave    | <code>number</code> | Octave number                          |
| startTime | <code>number</code> | Exact start time in audio context time |
| duration  | <code>number</code> | Duration in seconds                    |

<a name="AudioEngine+scheduleChord"></a>

### audioEngine.scheduleChord(notes, octave, startTime, duration)

Schedule a chord with precise timing

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param     | Type                | Description         |
| --------- | ------------------- | ------------------- |
| notes     | <code>Array</code>  | Array of note names |
| octave    | <code>number</code> | Base octave         |
| startTime | <code>number</code> | Exact start time    |
| duration  | <code>number</code> | Duration in seconds |

<a name="AudioEngine+startScheduler"></a>

### audioEngine.startScheduler(stepCallback, tempo, totalSteps)

Start lookahead scheduler for musical sequences

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param        | Type                  | Default          | Description                   |
| ------------ | --------------------- | ---------------- | ----------------------------- |
| stepCallback | <code>function</code> |                  | Function called for each step |
| tempo        | <code>number</code>   | <code>120</code> | BPM                           |
| totalSteps   | <code>number</code>   | <code>16</code>  | Total number of steps         |

<a name="AudioEngine+scheduleLoop"></a>

### audioEngine.scheduleLoop()

Internal scheduling loop using lookahead

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+nextStep"></a>

### audioEngine.nextStep()

Advance to next step

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+stopScheduler"></a>

### audioEngine.stopScheduler()

Stop the scheduler

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+playSequence"></a>

### audioEngine.playSequence(sequence, startTime)

Play a sequence with precise timing

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param     | Type                | Default       | Description                               |
| --------- | ------------------- | ------------- | ----------------------------------------- |
| sequence  | <code>Array</code>  |               | Array of {notes, duration, delay} objects |
| startTime | <code>number</code> | <code></code> | When to start the sequence                |

<a name="AudioEngine+playProgressionWithRhythm"></a>

### audioEngine.playProgressionWithRhythm(key, mode, progressionName, rhythm)

Enhanced progression with precise timing and customizable rhythm

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param           | Type                | Default       | Description                       |
| --------------- | ------------------- | ------------- | --------------------------------- |
| key             | <code>string</code> |               | Key signature                     |
| mode            | <code>string</code> |               | Major or minor                    |
| progressionName | <code>string</code> |               | Name of progression               |
| rhythm          | <code>Array</code>  | <code></code> | Array of durations for each chord |

<a name="AudioEngine+dispose"></a>

### audioEngine.dispose()

Cleanup resources

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine"></a>

## AudioEngine

**Kind**: global class

- [AudioEngine](#AudioEngine)
    - [new AudioEngine()](#new_AudioEngine_new)
    - [new AudioEngine()](#new_AudioEngine_new)
    - [.initialize()](#AudioEngine+initialize) ⇒ <code>Promise.&lt;boolean&gt;</code>
    - [.initializeNodePools()](#AudioEngine+initializeNodePools)
    - [.createCustomWaveforms()](#AudioEngine+createCustomWaveforms)
    - [.createPianoWave()](#AudioEngine+createPianoWave)
    - [.createWarmSineWave()](#AudioEngine+createWarmSineWave)
    - [.createSoftSquareWave()](#AudioEngine+createSoftSquareWave)
    - [.createOrganWave()](#AudioEngine+createOrganWave)
    - [.generateImpulseResponse(type)](#AudioEngine+generateImpulseResponse) ⇒ <code>AudioBuffer</code>
    - [.createEffectsChain()](#AudioEngine+createEffectsChain) ⇒ <code>Object</code>
    - [.createConvolutionReverb(type)](#AudioEngine+createConvolutionReverb) ⇒ <code>Object</code>
    - [.createSimpleDelayReverb()](#AudioEngine+createSimpleDelayReverb) ⇒ <code>Object</code>
    - [.createSafetyLimiter()](#AudioEngine+createSafetyLimiter) ⇒ <code>DynamicsCompressorNode</code>
    - [.createADSREnvelope(gainNode, startTime, duration)](#AudioEngine+createADSREnvelope)
    - [.createDynamicFilter(frequency, startTime, duration)](#AudioEngine+createDynamicFilter) ⇒ <code>BiquadFilterNode</code>
    - [.calculateDynamicGain(noteCount, frequency)](#AudioEngine+calculateDynamicGain) ⇒ <code>number</code>
    - [.createEnhancedOscillator(frequency, startTime, duration, waveform, \_pan)](#AudioEngine+createEnhancedOscillator)
    - [.createSimpleOscillator()](#AudioEngine+createSimpleOscillator)
    - [.createOscillator()](#AudioEngine+createOscillator)
    - [.playNote(note, [octave], [duration])](#AudioEngine+playNote) ⇒ <code>Promise.&lt;void&gt;</code>
    - [.createChordVoicing(notes, octave)](#AudioEngine+createChordVoicing) ⇒ <code>Array</code>
    - [.playChord(notes, [octave], [duration])](#AudioEngine+playChord) ⇒ <code>Promise.&lt;void&gt;</code>
    - [.playScale()](#AudioEngine+playScale)
    - [.findOptimalVoiceAssignment(voicing1, voicing2)](#AudioEngine+findOptimalVoiceAssignment) ⇒ <code>Object</code>
    - [.calculateVoiceMovement(chord1, chord2)](#AudioEngine+calculateVoiceMovement) ⇒ <code>number</code>
    - [.generateVoicingCandidates(notes, targetOctave)](#AudioEngine+generateVoicingCandidates) ⇒ <code>Array</code>
    - [.scoreVoicing(voicing, previousVoicing)](#AudioEngine+scoreVoicing) ⇒ <code>number</code>
    - [.optimizeChordVoicing(notes, previousVoicing, octave)](#AudioEngine+optimizeChordVoicing) ⇒ <code>Array</code>
    - [.playProgression(key, mode, progressionName, previousVoicing)](#AudioEngine+playProgression) ⇒ <code>Object</code>
    - [.playProgressionLoop(key, mode, progressionName)](#AudioEngine+playProgressionLoop)
    - [.getChordQuality()](#AudioEngine+getChordQuality)
    - [.createKickDrum(startTime)](#AudioEngine+createKickDrum) ⇒ <code>Object</code>
    - [.createSnareDrum(startTime)](#AudioEngine+createSnareDrum) ⇒ <code>Object</code>
    - [.createHiHat(startTime)](#AudioEngine+createHiHat) ⇒ <code>Object</code>
    - [.playPercussionPattern(startTime, duration)](#AudioEngine+playPercussionPattern)
    - [.createBassNote(note, octave, startTime, duration)](#AudioEngine+createBassNote) ⇒ <code>Object</code>
    - [.playBassPattern(chordRoot, startTime, duration)](#AudioEngine+playBassPattern)
    - [.setPercussionEnabled(enabled)](#AudioEngine+setPercussionEnabled)
    - [.setLoopingEnabled(enabled)](#AudioEngine+setLoopingEnabled)
    - [.isLooping()](#AudioEngine+isLooping) ⇒ <code>boolean</code>
    - [.isPercussionEnabled()](#AudioEngine+isPercussionEnabled) ⇒ <code>boolean</code>
    - [.setBassEnabled(enabled)](#AudioEngine+setBassEnabled)
    - [.isBassEnabled()](#AudioEngine+isBassEnabled) ⇒ <code>boolean</code>
    - [.stopAll()](#AudioEngine+stopAll)
    - [.addNoteEventListener()](#AudioEngine+addNoteEventListener)
    - [.removeNoteEventListener()](#AudioEngine+removeNoteEventListener)
    - [.emitNoteEvent()](#AudioEngine+emitNoteEvent)
    - [.setVolume()](#AudioEngine+setVolume)
    - [.setWaveform()](#AudioEngine+setWaveform)
    - [.setNoteDuration()](#AudioEngine+setNoteDuration)
    - [.setFilterCutoff()](#AudioEngine+setFilterCutoff)
    - [.getState()](#AudioEngine+getState)
    - [.playClick()](#AudioEngine+playClick)
    - [.scheduleNote(note, octave, startTime, duration)](#AudioEngine+scheduleNote)
    - [.scheduleChord(notes, octave, startTime, duration)](#AudioEngine+scheduleChord)
    - [.startScheduler(stepCallback, tempo, totalSteps)](#AudioEngine+startScheduler)
    - [.scheduleLoop()](#AudioEngine+scheduleLoop)
    - [.nextStep()](#AudioEngine+nextStep)
    - [.stopScheduler()](#AudioEngine+stopScheduler)
    - [.playSequence(sequence, startTime)](#AudioEngine+playSequence)
    - [.playProgressionWithRhythm(key, mode, progressionName, rhythm)](#AudioEngine+playProgressionWithRhythm)
    - [.dispose()](#AudioEngine+dispose)

<a name="new_AudioEngine_new"></a>

### new AudioEngine()

Audio engine for synthesizing and playing musical notes, chords, and progressions.
Uses the Web Audio API for real-time audio synthesis with configurable parameters.

**Example**

```js
const audioEngine = new AudioEngine();
await audioEngine.initialize();
await audioEngine.playNote('C', 4);
```

<a name="new_AudioEngine_new"></a>

### new AudioEngine()

Creates a new AudioEngine instance.
Initializes audio settings and prepares for Web Audio API usage.
Note: initialize() must be called after user interaction to activate audio.

<a name="AudioEngine+initialize"></a>

### audioEngine.initialize() ⇒ <code>Promise.&lt;boolean&gt;</code>

Initialize the Web Audio API context and master gain node.
Must be called after user interaction due to browser autoplay policies.
Can be called multiple times safely - subsequent calls return immediately.

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Promise.&lt;boolean&gt;</code> - True if initialization successful, false otherwise  
**Throws**:

- <code>Error</code> If Web Audio API is not supported

**Example**

```js
const success = await audioEngine.initialize();
if (success) {
    console.log('Audio ready!');
}
```

<a name="AudioEngine+initializeNodePools"></a>

### audioEngine.initializeNodePools()

Initialize node pools for performance optimization

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+createCustomWaveforms"></a>

### audioEngine.createCustomWaveforms()

Create custom waveforms with rich harmonic content

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+createPianoWave"></a>

### audioEngine.createPianoWave()

Piano-like tone with natural harmonic decay

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+createWarmSineWave"></a>

### audioEngine.createWarmSineWave()

Warm sine with subtle harmonics for richness

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+createSoftSquareWave"></a>

### audioEngine.createSoftSquareWave()

Soft square wave with reduced high harmonics (less harsh)

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+createOrganWave"></a>

### audioEngine.createOrganWave()

Organ-like tone with specific harmonic ratios

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+generateImpulseResponse"></a>

### audioEngine.generateImpulseResponse(type) ⇒ <code>AudioBuffer</code>

Generate impulse response buffer algorithmically for convolution reverb

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>AudioBuffer</code> - Impulse response buffer

| Param | Type                | Default                       | Description                |
| ----- | ------------------- | ----------------------------- | -------------------------- |
| type  | <code>string</code> | <code>&quot;room&quot;</code> | 'room', 'hall', or 'plate' |

<a name="AudioEngine+createEffectsChain"></a>

### audioEngine.createEffectsChain() ⇒ <code>Object</code>

Create effects chain with filtering, reverb, delay, and compression

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Object</code> - Effects chain with input and output nodes  
<a name="AudioEngine+createConvolutionReverb"></a>

### audioEngine.createConvolutionReverb(type) ⇒ <code>Object</code>

Create high-quality convolution reverb with algorithmic impulse response
Falls back to simple delay-based reverb if ConvolverNode is not available

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Object</code> - Reverb with input and output nodes

| Param | Type                | Default                       | Description                |
| ----- | ------------------- | ----------------------------- | -------------------------- |
| type  | <code>string</code> | <code>&quot;room&quot;</code> | 'room', 'hall', or 'plate' |

<a name="AudioEngine+createSimpleDelayReverb"></a>

### audioEngine.createSimpleDelayReverb() ⇒ <code>Object</code>

Create simple delay-based reverb as fallback
Used when ConvolverNode is not available (e.g., in test environments)

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Object</code> - Reverb with input and output nodes  
<a name="AudioEngine+createSafetyLimiter"></a>

### audioEngine.createSafetyLimiter() ⇒ <code>DynamicsCompressorNode</code>

Create safety limiter to prevent clipping

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>DynamicsCompressorNode</code> - Limiter node  
<a name="AudioEngine+createADSREnvelope"></a>

### audioEngine.createADSREnvelope(gainNode, startTime, duration)

Create improved ADSR envelope with anti-click protection

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param     | Type                  | Description                        |
| --------- | --------------------- | ---------------------------------- |
| gainNode  | <code>GainNode</code> | The gain node to apply envelope to |
| startTime | <code>number</code>   | When to start the envelope         |
| duration  | <code>number</code>   | Total duration of the note         |

<a name="AudioEngine+createDynamicFilter"></a>

### audioEngine.createDynamicFilter(frequency, startTime, duration) ⇒ <code>BiquadFilterNode</code>

Create filter with envelope modulation for expressive sound

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>BiquadFilterNode</code> - Configured filter

| Param     | Type                | Description    |
| --------- | ------------------- | -------------- |
| frequency | <code>number</code> | Note frequency |
| startTime | <code>number</code> | Start time     |
| duration  | <code>number</code> | Duration       |

<a name="AudioEngine+calculateDynamicGain"></a>

### audioEngine.calculateDynamicGain(noteCount, frequency) ⇒ <code>number</code>

Calculate appropriate gain based on number of notes and frequency

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>number</code> - Gain multiplier

| Param     | Type                | Description                  |
| --------- | ------------------- | ---------------------------- |
| noteCount | <code>number</code> | Number of simultaneous notes |
| frequency | <code>number</code> | Average frequency            |

<a name="AudioEngine+createEnhancedOscillator"></a>

### audioEngine.createEnhancedOscillator(frequency, startTime, duration, waveform, \_pan)

Create enhanced multi-oscillator synthesis with all improvements
Includes: custom waveforms, stereo enhancement, filter envelope, dynamic gain

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param     | Type                | Default                           | Description                                                                |
| --------- | ------------------- | --------------------------------- | -------------------------------------------------------------------------- |
| frequency | <code>number</code> |                                   | Note frequency in Hz                                                       |
| startTime | <code>number</code> |                                   | Start time in audio context time                                           |
| duration  | <code>number</code> |                                   | Duration in seconds                                                        |
| waveform  | <code>string</code> | <code>&quot;warmSine&quot;</code> | Waveform type                                                              |
| \_pan     | <code>number</code> | <code>0</code>                    | Pan position (reserved for future use, currently handled by chord voicing) |

<a name="AudioEngine+createSimpleOscillator"></a>

### audioEngine.createSimpleOscillator()

Create simple oscillator (fallback for compatibility)

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+createOscillator"></a>

### audioEngine.createOscillator()

Create oscillator (main method - uses enhanced synthesis)

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+playNote"></a>

### audioEngine.playNote(note, [octave], [duration]) ⇒ <code>Promise.&lt;void&gt;</code>

Play a single musical note using Web Audio synthesis.
Automatically initializes the audio engine if not already done.

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promise that resolves when note starts playing

| Param      | Type                                     | Default        | Description                               |
| ---------- | ---------------------------------------- | -------------- | ----------------------------------------- |
| note       | <code>string</code>                      |                | The note name (e.g., 'C', 'F#', 'Bb')     |
| [octave]   | <code>number</code>                      | <code>4</code> | The octave number (0-8)                   |
| [duration] | <code>number</code> \| <code>null</code> | <code></code>  | Duration in seconds, uses default if null |

**Example**

```js
// Play middle C for default duration
await audioEngine.playNote('C', 4);

// Play A above middle C for 2 seconds
await audioEngine.playNote('A', 4, 2.0);
```

<a name="AudioEngine+createChordVoicing"></a>

### audioEngine.createChordVoicing(notes, octave) ⇒ <code>Array</code>

Create proper chord voicing with close harmony and musical spacing
Uses close position voicing in a comfortable musical range (octaves 3-4)

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Array</code> - Array of {note, octave, pan} objects with proper voicing

| Param  | Type                | Default        | Description                                            |
| ------ | ------------------- | -------------- | ------------------------------------------------------ |
| notes  | <code>Array</code>  |                | Array of note names                                    |
| octave | <code>number</code> | <code>3</code> | Base octave for the chord (default 3 for better range) |

<a name="AudioEngine+playChord"></a>

### audioEngine.playChord(notes, [octave], [duration]) ⇒ <code>Promise.&lt;void&gt;</code>

Play a chord (multiple notes simultaneously) with proper voicing.
Uses proper chord voicing with root in bass and close harmony above.

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promise that resolves when chord starts playing

| Param      | Type                                     | Default        | Description                               |
| ---------- | ---------------------------------------- | -------------- | ----------------------------------------- |
| notes      | <code>Array.&lt;string&gt;</code>        |                | Array of note names to play together      |
| [octave]   | <code>number</code>                      | <code>4</code> | The base octave number for the chord      |
| [duration] | <code>number</code> \| <code>null</code> | <code></code>  | Duration in seconds, uses default if null |

**Example**

```js
// Play C major chord with proper voicing
await audioEngine.playChord(['C', 'E', 'G'], 4);

// Play Am chord for 3 seconds
await audioEngine.playChord(['A', 'C', 'E'], 4, 3.0);
```

<a name="AudioEngine+playScale"></a>

### audioEngine.playScale()

Play a complete scale pattern with octave cycles
Plays ascending from root to octave, then descending back to root
Example: C-D-E-F-G-A-B-C-C-B-A-G-F-E-D-C

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+findOptimalVoiceAssignment"></a>

### audioEngine.findOptimalVoiceAssignment(voicing1, voicing2) ⇒ <code>Object</code>

Find optimal voice assignment between two chords for smooth voice leading
Uses greedy algorithm: prioritize common tones, then smallest movements

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Object</code> - Assignment info with movements array and total movement

| Param    | Type               | Description                                |
| -------- | ------------------ | ------------------------------------------ |
| voicing1 | <code>Array</code> | First chord voicing [{note, octave}, ...]  |
| voicing2 | <code>Array</code> | Second chord voicing [{note, octave}, ...] |

<a name="AudioEngine+calculateVoiceMovement"></a>

### audioEngine.calculateVoiceMovement(chord1, chord2) ⇒ <code>number</code>

Calculate voice leading movement between two chords using optimal voice assignment

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>number</code> - Total semitone movement

| Param  | Type               | Description                                |
| ------ | ------------------ | ------------------------------------------ |
| chord1 | <code>Array</code> | First chord voicing [{note, octave}, ...]  |
| chord2 | <code>Array</code> | Second chord voicing [{note, octave}, ...] |

<a name="AudioEngine+generateVoicingCandidates"></a>

### audioEngine.generateVoicingCandidates(notes, targetOctave) ⇒ <code>Array</code>

Generate multiple voicing candidates for a chord
Includes root position, inversions, and different octave placements

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Array</code> - Array of voicing candidates

| Param        | Type                | Default        | Description                |
| ------------ | ------------------- | -------------- | -------------------------- |
| notes        | <code>Array</code>  |                | Chord notes                |
| targetOctave | <code>number</code> | <code>3</code> | Target octave for voicings |

<a name="AudioEngine+scoreVoicing"></a>

### audioEngine.scoreVoicing(voicing, previousVoicing) ⇒ <code>number</code>

Score a voicing based on multiple musical criteria
Lower scores are better

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>number</code> - Score (lower is better)

| Param           | Type               | Default       | Description                                |
| --------------- | ------------------ | ------------- | ------------------------------------------ |
| voicing         | <code>Array</code> |               | Chord voicing to score                     |
| previousVoicing | <code>Array</code> | <code></code> | Previous chord voicing (for voice leading) |

<a name="AudioEngine+optimizeChordVoicing"></a>

### audioEngine.optimizeChordVoicing(notes, previousVoicing, octave) ⇒ <code>Array</code>

Find the best chord voicing for smooth voice leading
Uses comprehensive search and scoring based on multiple musical criteria

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Array</code> - Optimized chord voicing

| Param           | Type                | Default        | Description                              |
| --------------- | ------------------- | -------------- | ---------------------------------------- |
| notes           | <code>Array</code>  |                | Chord notes                              |
| previousVoicing | <code>Array</code>  |                | Previous chord voicing                   |
| octave          | <code>number</code> | <code>3</code> | Base octave (default 3 for better range) |

<a name="AudioEngine+playProgression"></a>

### audioEngine.playProgression(key, mode, progressionName, previousVoicing) ⇒ <code>Object</code>

This method plays a chord progression with sophisticated voice leading optimization:

1. **Key Consistency**: All chords are derived from the specified key and mode.
   Roman numerals are converted to actual chord roots using the scale of the given key.
   Example: In C major, 'ii' → D minor, 'V' → G major, 'I' → C major

2. **Voice Leading Optimization**: Each chord is voiced to minimize voice movement
   from the previous chord, creating smooth melodic lines in all voices.
    - Common tones are retained in the same voice
    - Other voices move by the smallest possible interval
    - Top voice (melody) is prioritized for smooth stepwise motion

3. **Diatonic Integrity**: All chord notes are guaranteed to be diatonic to the key
   (except in minor mode where the V chord may use the raised leading tone)

4. **Loop Compatibility**: Returns the final voicing so it can be used as the
   previousVoicing parameter in the next iteration, ensuring smooth loop transitions

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Object</code> - Object containing finalVoicing and totalDuration

| Param           | Type                | Default       | Description                                           |
| --------------- | ------------------- | ------------- | ----------------------------------------------------- |
| key             | <code>string</code> |               | Key signature (e.g., 'C', 'G', 'F#')                  |
| mode            | <code>string</code> |               | Major or minor                                        |
| progressionName | <code>string</code> |               | Name of the progression (e.g., 'ii-V-I', 'I-V-vi-IV') |
| previousVoicing | <code>Object</code> | <code></code> | Previous voicing for voice leading (optional)         |

<a name="AudioEngine+playProgressionLoop"></a>

### audioEngine.playProgressionLoop(key, mode, progressionName)

This method ensures that:

1. The progression stays in the same key throughout all loop iterations
2. Voice leading is optimized across loop boundaries (last chord → first chord)
3. The final voicing of each iteration is used as the starting point for the next
4. No key modulation occurs - all chords remain diatonic to the original key

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param           | Type                | Description                              |
| --------------- | ------------------- | ---------------------------------------- |
| key             | <code>string</code> | Key signature (e.g., 'C', 'G', 'F#')     |
| mode            | <code>string</code> | Major or minor                           |
| progressionName | <code>string</code> | Name of the progression (e.g., 'ii-V-I') |

<a name="AudioEngine+getChordQuality"></a>

### audioEngine.getChordQuality()

Determine chord quality from roman numeral

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+createKickDrum"></a>

### audioEngine.createKickDrum(startTime) ⇒ <code>Object</code>

Create kick drum sound using oscillator with pitch envelope

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Object</code> - Audio nodes for cleanup

| Param     | Type                | Description                 |
| --------- | ------------------- | --------------------------- |
| startTime | <code>number</code> | When to start the kick drum |

<a name="AudioEngine+createSnareDrum"></a>

### audioEngine.createSnareDrum(startTime) ⇒ <code>Object</code>

Create snare drum sound using noise with bandpass filter

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Object</code> - Audio nodes for cleanup

| Param     | Type                | Description                  |
| --------- | ------------------- | ---------------------------- |
| startTime | <code>number</code> | When to start the snare drum |

<a name="AudioEngine+createHiHat"></a>

### audioEngine.createHiHat(startTime) ⇒ <code>Object</code>

Create hi-hat sound using high-frequency noise

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Object</code> - Audio nodes for cleanup

| Param     | Type                | Description              |
| --------- | ------------------- | ------------------------ |
| startTime | <code>number</code> | When to start the hi-hat |

<a name="AudioEngine+playPercussionPattern"></a>

### audioEngine.playPercussionPattern(startTime, duration)

Play percussion pattern for one chord duration

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param     | Type                | Description                            |
| --------- | ------------------- | -------------------------------------- |
| startTime | <code>number</code> | When to start the pattern              |
| duration  | <code>number</code> | Duration of the chord (pattern length) |

<a name="AudioEngine+createBassNote"></a>

### audioEngine.createBassNote(note, octave, startTime, duration) ⇒ <code>Object</code>

Create bass note sound using oscillator with envelope

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>Object</code> - Audio nodes for cleanup

| Param     | Type                | Description                           |
| --------- | ------------------- | ------------------------------------- |
| note      | <code>string</code> | The note name (e.g., 'C', 'F#', 'Bb') |
| octave    | <code>number</code> | The octave for the bass note          |
| startTime | <code>number</code> | When to start the bass note           |
| duration  | <code>number</code> | Duration of the bass note             |

<a name="AudioEngine+playBassPattern"></a>

### audioEngine.playBassPattern(chordRoot, startTime, duration)

Play bass pattern for one chord duration

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param     | Type                | Description                                        |
| --------- | ------------------- | -------------------------------------------------- |
| chordRoot | <code>string</code> | The root note of the chord (e.g., 'C', 'F#', 'Bb') |
| startTime | <code>number</code> | When to start the pattern                          |
| duration  | <code>number</code> | Duration of the chord (pattern length)             |

<a name="AudioEngine+setPercussionEnabled"></a>

### audioEngine.setPercussionEnabled(enabled)

Enable or disable percussion

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param   | Type                 | Description                          |
| ------- | -------------------- | ------------------------------------ |
| enabled | <code>boolean</code> | Whether percussion should be enabled |

<a name="AudioEngine+setLoopingEnabled"></a>

### audioEngine.setLoopingEnabled(enabled)

Enable or disable looping

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param   | Type                 | Description                       |
| ------- | -------------------- | --------------------------------- |
| enabled | <code>boolean</code> | Whether looping should be enabled |

<a name="AudioEngine+isLooping"></a>

### audioEngine.isLooping() ⇒ <code>boolean</code>

Check if looping is currently enabled

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>boolean</code> - True if looping is active  
<a name="AudioEngine+isPercussionEnabled"></a>

### audioEngine.isPercussionEnabled() ⇒ <code>boolean</code>

Check if percussion is currently enabled

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>boolean</code> - True if percussion is active  
<a name="AudioEngine+setBassEnabled"></a>

### audioEngine.setBassEnabled(enabled)

Enable or disable bass

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param   | Type                 | Description                    |
| ------- | -------------------- | ------------------------------ |
| enabled | <code>boolean</code> | Whether bass should be enabled |

<a name="AudioEngine+isBassEnabled"></a>

### audioEngine.isBassEnabled() ⇒ <code>boolean</code>

Check if bass is currently enabled

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
**Returns**: <code>boolean</code> - True if bass is active  
<a name="AudioEngine+stopAll"></a>

### audioEngine.stopAll()

Stop all currently playing audio

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+addNoteEventListener"></a>

### audioEngine.addNoteEventListener()

Add event listener for note events

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+removeNoteEventListener"></a>

### audioEngine.removeNoteEventListener()

Remove event listener for note events

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+emitNoteEvent"></a>

### audioEngine.emitNoteEvent()

Emit note event to all listeners

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+setVolume"></a>

### audioEngine.setVolume()

Set master volume (0-1)

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+setWaveform"></a>

### audioEngine.setWaveform()

Change waveform type

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+setNoteDuration"></a>

### audioEngine.setNoteDuration()

Set note duration

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+setFilterCutoff"></a>

### audioEngine.setFilterCutoff()

Control effects settings

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+getState"></a>

### audioEngine.getState()

Get current audio context state

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+playClick"></a>

### audioEngine.playClick()

Create a simple metronome click

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+scheduleNote"></a>

### audioEngine.scheduleNote(note, octave, startTime, duration)

Schedule a note with precise timing

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param     | Type                | Description                            |
| --------- | ------------------- | -------------------------------------- |
| note      | <code>string</code> | Note name                              |
| octave    | <code>number</code> | Octave number                          |
| startTime | <code>number</code> | Exact start time in audio context time |
| duration  | <code>number</code> | Duration in seconds                    |

<a name="AudioEngine+scheduleChord"></a>

### audioEngine.scheduleChord(notes, octave, startTime, duration)

Schedule a chord with precise timing

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param     | Type                | Description         |
| --------- | ------------------- | ------------------- |
| notes     | <code>Array</code>  | Array of note names |
| octave    | <code>number</code> | Base octave         |
| startTime | <code>number</code> | Exact start time    |
| duration  | <code>number</code> | Duration in seconds |

<a name="AudioEngine+startScheduler"></a>

### audioEngine.startScheduler(stepCallback, tempo, totalSteps)

Start lookahead scheduler for musical sequences

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param        | Type                  | Default          | Description                   |
| ------------ | --------------------- | ---------------- | ----------------------------- |
| stepCallback | <code>function</code> |                  | Function called for each step |
| tempo        | <code>number</code>   | <code>120</code> | BPM                           |
| totalSteps   | <code>number</code>   | <code>16</code>  | Total number of steps         |

<a name="AudioEngine+scheduleLoop"></a>

### audioEngine.scheduleLoop()

Internal scheduling loop using lookahead

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+nextStep"></a>

### audioEngine.nextStep()

Advance to next step

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+stopScheduler"></a>

### audioEngine.stopScheduler()

Stop the scheduler

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="AudioEngine+playSequence"></a>

### audioEngine.playSequence(sequence, startTime)

Play a sequence with precise timing

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param     | Type                | Default       | Description                               |
| --------- | ------------------- | ------------- | ----------------------------------------- |
| sequence  | <code>Array</code>  |               | Array of {notes, duration, delay} objects |
| startTime | <code>number</code> | <code></code> | When to start the sequence                |

<a name="AudioEngine+playProgressionWithRhythm"></a>

### audioEngine.playProgressionWithRhythm(key, mode, progressionName, rhythm)

Enhanced progression with precise timing and customizable rhythm

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)

| Param           | Type                | Default       | Description                       |
| --------------- | ------------------- | ------------- | --------------------------------- |
| key             | <code>string</code> |               | Key signature                     |
| mode            | <code>string</code> |               | Major or minor                    |
| progressionName | <code>string</code> |               | Name of progression               |
| rhythm          | <code>Array</code>  | <code></code> | Array of durations for each chord |

<a name="AudioEngine+dispose"></a>

### audioEngine.dispose()

Cleanup resources

**Kind**: instance method of [<code>AudioEngine</code>](#AudioEngine)  
<a name="CircleRenderer"></a>

## CircleRenderer

**Kind**: global class

- [CircleRenderer](#CircleRenderer)
    - [new CircleRenderer()](#new_CircleRenderer_new)
    - [new CircleRenderer(svgElement, musicTheory)](#new_CircleRenderer_new)
    - [.init()](#CircleRenderer+init)
    - [.clearCircle()](#CircleRenderer+clearCircle)
    - [.renderKeySegments()](#CircleRenderer+renderKeySegments)
    - [.createKeySegment()](#CircleRenderer+createKeySegment)
    - [.createSegmentPath()](#CircleRenderer+createSegmentPath)
    - [.getKeyDisplayText(key, index)](#CircleRenderer+getKeyDisplayText) ⇒ <code>string</code>
    - [.getKeyAriaLabel(key, index)](#CircleRenderer+getKeyAriaLabel) ⇒ <code>string</code>
    - [.createSegmentText()](#CircleRenderer+createSegmentText)
    - [.updateSegmentClasses()](#CircleRenderer+updateSegmentClasses)
    - [.getKeyRelationship()](#CircleRenderer+getKeyRelationship)
    - [.updateCenterInfo()](#CircleRenderer+updateCenterInfo)
    - [.selectKey(key)](#CircleRenderer+selectKey)
    - [.highlightRelatedKeys()](#CircleRenderer+highlightRelatedKeys)
    - [.clearHighlights()](#CircleRenderer+clearHighlights)
    - [.updateAllSegments([forceUpdate])](#CircleRenderer+updateAllSegments)
    - [.updateSegment(key)](#CircleRenderer+updateSegment)
    - [.updateSegmentLabels()](#CircleRenderer+updateSegmentLabels)
    - [.switchMode(mode)](#CircleRenderer+switchMode)
    - [.addHoverEffect()](#CircleRenderer+addHoverEffect)
    - [.removeHoverEffect()](#CircleRenderer+removeHoverEffect)
    - [.getKeyFromAngle(angle)](#CircleRenderer+getKeyFromAngle) ⇒ <code>string</code>
    - [.highlightNote()](#CircleRenderer+highlightNote)
    - [.clearNoteHighlights()](#CircleRenderer+clearNoteHighlights)
    - [.getKeyFromCoordinates(x, y)](#CircleRenderer+getKeyFromCoordinates) ⇒ <code>string</code> \| <code>null</code>
    - [.animateTransition(callback)](#CircleRenderer+animateTransition)
    - [.getState()](#CircleRenderer+getState)

<a name="new_CircleRenderer_new"></a>

### new CircleRenderer()

Renders and manages the interactive Circle of Fifths visualization using SVG.
Handles key selection, mode switching, highlighting, and visual feedback.

**Example**

```js
const svg = document.getElementById('circle-svg');
const musicTheory = new MusicTheory();
const renderer = new CircleRenderer(svg, musicTheory);
```

<a name="new_CircleRenderer_new"></a>

### new CircleRenderer(svgElement, musicTheory)

Creates a new CircleRenderer instance.
Initializes the SVG visualization with default settings and renders the circle.

**Throws**:

- <code>Error</code> If svgElement is not a valid SVG element

| Param       | Type                                     | Description                               |
| ----------- | ---------------------------------------- | ----------------------------------------- |
| svgElement  | <code>SVGElement</code>                  | The SVG element to render the circle into |
| musicTheory | [<code>MusicTheory</code>](#MusicTheory) | Music theory engine for key relationships |

<a name="CircleRenderer+init"></a>

### circleRenderer.init()

Initialize the circle visualization.
Clears existing elements and renders the complete circle with all key segments.

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
**Example**

```js
renderer.init(); // Re-render the entire circle
```

<a name="CircleRenderer+clearCircle"></a>

### circleRenderer.clearCircle()

Clear existing circle elements

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+renderKeySegments"></a>

### circleRenderer.renderKeySegments()

Render all key segments

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+createKeySegment"></a>

### circleRenderer.createKeySegment()

Create a single key segment

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+createSegmentPath"></a>

### circleRenderer.createSegmentPath()

Create SVG path for a segment

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+getKeyDisplayText"></a>

### circleRenderer.getKeyDisplayText(key, index) ⇒ <code>string</code>

Get display text for a key, including enharmonic equivalents where appropriate

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
**Returns**: <code>string</code> - The display text (e.g., 'F♯/G♭' for position 6)

| Param | Type                | Description                       |
| ----- | ------------------- | --------------------------------- |
| key   | <code>string</code> | The key name                      |
| index | <code>number</code> | The position in the circle (0-11) |

<a name="CircleRenderer+getKeyAriaLabel"></a>

### circleRenderer.getKeyAriaLabel(key, index) ⇒ <code>string</code>

Get aria-label text for a key, including enharmonic information

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
**Returns**: <code>string</code> - The aria-label text (e.g., 'F sharp or G flat major')

| Param | Type                | Description                       |
| ----- | ------------------- | --------------------------------- |
| key   | <code>string</code> | The key name                      |
| index | <code>number</code> | The position in the circle (0-11) |

<a name="CircleRenderer+createSegmentText"></a>

### circleRenderer.createSegmentText()

Create text label for segment

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+updateSegmentClasses"></a>

### circleRenderer.updateSegmentClasses()

Update CSS classes for a segment based on current mode and relationships

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+getKeyRelationship"></a>

### circleRenderer.getKeyRelationship()

Get relationship of a key to the selected key

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+updateCenterInfo"></a>

### circleRenderer.updateCenterInfo()

Update the center information display

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+selectKey"></a>

### circleRenderer.selectKey(key)

Select a key and update the visualization to show related keys.
Validates the key, clears previous highlights, and updates the display.

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
**Throws**:

- <code>Error</code> If the key is invalid for the current mode

| Param | Type                | Description                               |
| ----- | ------------------- | ----------------------------------------- |
| key   | <code>string</code> | The key to select (e.g., 'C', 'F#', 'Bb') |

**Example**

```js
renderer.selectKey('G'); // Select G major/minor
```

<a name="CircleRenderer+highlightRelatedKeys"></a>

### circleRenderer.highlightRelatedKeys()

Highlight related keys

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+clearHighlights"></a>

### circleRenderer.clearHighlights()

Clear all highlights

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+updateAllSegments"></a>

### circleRenderer.updateAllSegments([forceUpdate])

Update all segment colors and states

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)

| Param         | Type                 | Default            | Description                                 |
| ------------- | -------------------- | ------------------ | ------------------------------------------- |
| [forceUpdate] | <code>boolean</code> | <code>false</code> | Force update all segments even if unchanged |

<a name="CircleRenderer+updateSegment"></a>

### circleRenderer.updateSegment(key)

Update a single segment (more efficient than updateAllSegments)

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)

| Param | Type                | Description                      |
| ----- | ------------------- | -------------------------------- |
| key   | <code>string</code> | The key of the segment to update |

<a name="CircleRenderer+updateSegmentLabels"></a>

### circleRenderer.updateSegmentLabels()

Update all segment text labels to reflect current mode
Called when switching between major and minor modes

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+switchMode"></a>

### circleRenderer.switchMode(mode)

Switch between major and minor modes.
Updates the visualization to show the appropriate key relationships.

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
**Throws**:

- <code>Error</code> If mode is not 'major' or 'minor'

| Param | Type                | Description                                |
| ----- | ------------------- | ------------------------------------------ |
| mode  | <code>string</code> | The mode to switch to ('major' or 'minor') |

**Example**

```js
renderer.switchMode('minor'); // Switch to minor mode
```

<a name="CircleRenderer+addHoverEffect"></a>

### circleRenderer.addHoverEffect()

Add hover effects to a segment

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+removeHoverEffect"></a>

### circleRenderer.removeHoverEffect()

Remove hover effects from a segment

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+getKeyFromAngle"></a>

### circleRenderer.getKeyFromAngle(angle) ⇒ <code>string</code>

Get key from angle (for touch/mouse position)

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
**Returns**: <code>string</code> - The key at that angle (e.g., 'C', 'G')

| Param | Type                | Description              |
| ----- | ------------------- | ------------------------ |
| angle | <code>number</code> | Angle in degrees (0-360) |

**Example**

```js
const key = renderer.getKeyFromAngle(90); // Returns 'C'
```

<a name="CircleRenderer+highlightNote"></a>

### circleRenderer.highlightNote()

Highlight a specific note during playback

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+clearNoteHighlights"></a>

### circleRenderer.clearNoteHighlights()

Clear all note highlighting

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+getKeyFromCoordinates"></a>

### circleRenderer.getKeyFromCoordinates(x, y) ⇒ <code>string</code> \| <code>null</code>

Get key from SVG coordinates (for click/touch events)

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
**Returns**: <code>string</code> \| <code>null</code> - The key at those coordinates, or null if outside circle

| Param | Type                | Description               |
| ----- | ------------------- | ------------------------- |
| x     | <code>number</code> | X coordinate in SVG space |
| y     | <code>number</code> | Y coordinate in SVG space |

**Example**

```js
const key = renderer.getKeyFromCoordinates(400, 200);
```

<a name="CircleRenderer+animateTransition"></a>

### circleRenderer.animateTransition(callback)

Animate transition between modes or states

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)

| Param    | Type                  | Description                        |
| -------- | --------------------- | ---------------------------------- |
| callback | <code>function</code> | Function to call during transition |

**Example**

```js
renderer.animateTransition(() => {
    // Update state during transition
});
```

<a name="CircleRenderer+getState"></a>

### circleRenderer.getState()

Get current state

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer"></a>

## CircleRenderer

**Kind**: global class

- [CircleRenderer](#CircleRenderer)
    - [new CircleRenderer()](#new_CircleRenderer_new)
    - [new CircleRenderer(svgElement, musicTheory)](#new_CircleRenderer_new)
    - [.init()](#CircleRenderer+init)
    - [.clearCircle()](#CircleRenderer+clearCircle)
    - [.renderKeySegments()](#CircleRenderer+renderKeySegments)
    - [.createKeySegment()](#CircleRenderer+createKeySegment)
    - [.createSegmentPath()](#CircleRenderer+createSegmentPath)
    - [.getKeyDisplayText(key, index)](#CircleRenderer+getKeyDisplayText) ⇒ <code>string</code>
    - [.getKeyAriaLabel(key, index)](#CircleRenderer+getKeyAriaLabel) ⇒ <code>string</code>
    - [.createSegmentText()](#CircleRenderer+createSegmentText)
    - [.updateSegmentClasses()](#CircleRenderer+updateSegmentClasses)
    - [.getKeyRelationship()](#CircleRenderer+getKeyRelationship)
    - [.updateCenterInfo()](#CircleRenderer+updateCenterInfo)
    - [.selectKey(key)](#CircleRenderer+selectKey)
    - [.highlightRelatedKeys()](#CircleRenderer+highlightRelatedKeys)
    - [.clearHighlights()](#CircleRenderer+clearHighlights)
    - [.updateAllSegments([forceUpdate])](#CircleRenderer+updateAllSegments)
    - [.updateSegment(key)](#CircleRenderer+updateSegment)
    - [.updateSegmentLabels()](#CircleRenderer+updateSegmentLabels)
    - [.switchMode(mode)](#CircleRenderer+switchMode)
    - [.addHoverEffect()](#CircleRenderer+addHoverEffect)
    - [.removeHoverEffect()](#CircleRenderer+removeHoverEffect)
    - [.getKeyFromAngle(angle)](#CircleRenderer+getKeyFromAngle) ⇒ <code>string</code>
    - [.highlightNote()](#CircleRenderer+highlightNote)
    - [.clearNoteHighlights()](#CircleRenderer+clearNoteHighlights)
    - [.getKeyFromCoordinates(x, y)](#CircleRenderer+getKeyFromCoordinates) ⇒ <code>string</code> \| <code>null</code>
    - [.animateTransition(callback)](#CircleRenderer+animateTransition)
    - [.getState()](#CircleRenderer+getState)

<a name="new_CircleRenderer_new"></a>

### new CircleRenderer()

Renders and manages the interactive Circle of Fifths visualization using SVG.
Handles key selection, mode switching, highlighting, and visual feedback.

**Example**

```js
const svg = document.getElementById('circle-svg');
const musicTheory = new MusicTheory();
const renderer = new CircleRenderer(svg, musicTheory);
```

<a name="new_CircleRenderer_new"></a>

### new CircleRenderer(svgElement, musicTheory)

Creates a new CircleRenderer instance.
Initializes the SVG visualization with default settings and renders the circle.

**Throws**:

- <code>Error</code> If svgElement is not a valid SVG element

| Param       | Type                                     | Description                               |
| ----------- | ---------------------------------------- | ----------------------------------------- |
| svgElement  | <code>SVGElement</code>                  | The SVG element to render the circle into |
| musicTheory | [<code>MusicTheory</code>](#MusicTheory) | Music theory engine for key relationships |

<a name="CircleRenderer+init"></a>

### circleRenderer.init()

Initialize the circle visualization.
Clears existing elements and renders the complete circle with all key segments.

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
**Example**

```js
renderer.init(); // Re-render the entire circle
```

<a name="CircleRenderer+clearCircle"></a>

### circleRenderer.clearCircle()

Clear existing circle elements

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+renderKeySegments"></a>

### circleRenderer.renderKeySegments()

Render all key segments

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+createKeySegment"></a>

### circleRenderer.createKeySegment()

Create a single key segment

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+createSegmentPath"></a>

### circleRenderer.createSegmentPath()

Create SVG path for a segment

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+getKeyDisplayText"></a>

### circleRenderer.getKeyDisplayText(key, index) ⇒ <code>string</code>

Get display text for a key, including enharmonic equivalents where appropriate

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
**Returns**: <code>string</code> - The display text (e.g., 'F♯/G♭' for position 6)

| Param | Type                | Description                       |
| ----- | ------------------- | --------------------------------- |
| key   | <code>string</code> | The key name                      |
| index | <code>number</code> | The position in the circle (0-11) |

<a name="CircleRenderer+getKeyAriaLabel"></a>

### circleRenderer.getKeyAriaLabel(key, index) ⇒ <code>string</code>

Get aria-label text for a key, including enharmonic information

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
**Returns**: <code>string</code> - The aria-label text (e.g., 'F sharp or G flat major')

| Param | Type                | Description                       |
| ----- | ------------------- | --------------------------------- |
| key   | <code>string</code> | The key name                      |
| index | <code>number</code> | The position in the circle (0-11) |

<a name="CircleRenderer+createSegmentText"></a>

### circleRenderer.createSegmentText()

Create text label for segment

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+updateSegmentClasses"></a>

### circleRenderer.updateSegmentClasses()

Update CSS classes for a segment based on current mode and relationships

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+getKeyRelationship"></a>

### circleRenderer.getKeyRelationship()

Get relationship of a key to the selected key

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+updateCenterInfo"></a>

### circleRenderer.updateCenterInfo()

Update the center information display

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+selectKey"></a>

### circleRenderer.selectKey(key)

Select a key and update the visualization to show related keys.
Validates the key, clears previous highlights, and updates the display.

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
**Throws**:

- <code>Error</code> If the key is invalid for the current mode

| Param | Type                | Description                               |
| ----- | ------------------- | ----------------------------------------- |
| key   | <code>string</code> | The key to select (e.g., 'C', 'F#', 'Bb') |

**Example**

```js
renderer.selectKey('G'); // Select G major/minor
```

<a name="CircleRenderer+highlightRelatedKeys"></a>

### circleRenderer.highlightRelatedKeys()

Highlight related keys

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+clearHighlights"></a>

### circleRenderer.clearHighlights()

Clear all highlights

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+updateAllSegments"></a>

### circleRenderer.updateAllSegments([forceUpdate])

Update all segment colors and states

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)

| Param         | Type                 | Default            | Description                                 |
| ------------- | -------------------- | ------------------ | ------------------------------------------- |
| [forceUpdate] | <code>boolean</code> | <code>false</code> | Force update all segments even if unchanged |

<a name="CircleRenderer+updateSegment"></a>

### circleRenderer.updateSegment(key)

Update a single segment (more efficient than updateAllSegments)

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)

| Param | Type                | Description                      |
| ----- | ------------------- | -------------------------------- |
| key   | <code>string</code> | The key of the segment to update |

<a name="CircleRenderer+updateSegmentLabels"></a>

### circleRenderer.updateSegmentLabels()

Update all segment text labels to reflect current mode
Called when switching between major and minor modes

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+switchMode"></a>

### circleRenderer.switchMode(mode)

Switch between major and minor modes.
Updates the visualization to show the appropriate key relationships.

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
**Throws**:

- <code>Error</code> If mode is not 'major' or 'minor'

| Param | Type                | Description                                |
| ----- | ------------------- | ------------------------------------------ |
| mode  | <code>string</code> | The mode to switch to ('major' or 'minor') |

**Example**

```js
renderer.switchMode('minor'); // Switch to minor mode
```

<a name="CircleRenderer+addHoverEffect"></a>

### circleRenderer.addHoverEffect()

Add hover effects to a segment

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+removeHoverEffect"></a>

### circleRenderer.removeHoverEffect()

Remove hover effects from a segment

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+getKeyFromAngle"></a>

### circleRenderer.getKeyFromAngle(angle) ⇒ <code>string</code>

Get key from angle (for touch/mouse position)

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
**Returns**: <code>string</code> - The key at that angle (e.g., 'C', 'G')

| Param | Type                | Description              |
| ----- | ------------------- | ------------------------ |
| angle | <code>number</code> | Angle in degrees (0-360) |

**Example**

```js
const key = renderer.getKeyFromAngle(90); // Returns 'C'
```

<a name="CircleRenderer+highlightNote"></a>

### circleRenderer.highlightNote()

Highlight a specific note during playback

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+clearNoteHighlights"></a>

### circleRenderer.clearNoteHighlights()

Clear all note highlighting

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="CircleRenderer+getKeyFromCoordinates"></a>

### circleRenderer.getKeyFromCoordinates(x, y) ⇒ <code>string</code> \| <code>null</code>

Get key from SVG coordinates (for click/touch events)

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
**Returns**: <code>string</code> \| <code>null</code> - The key at those coordinates, or null if outside circle

| Param | Type                | Description               |
| ----- | ------------------- | ------------------------- |
| x     | <code>number</code> | X coordinate in SVG space |
| y     | <code>number</code> | Y coordinate in SVG space |

**Example**

```js
const key = renderer.getKeyFromCoordinates(400, 200);
```

<a name="CircleRenderer+animateTransition"></a>

### circleRenderer.animateTransition(callback)

Animate transition between modes or states

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)

| Param    | Type                  | Description                        |
| -------- | --------------------- | ---------------------------------- |
| callback | <code>function</code> | Function to call during transition |

**Example**

```js
renderer.animateTransition(() => {
    // Update state during transition
});
```

<a name="CircleRenderer+getState"></a>

### circleRenderer.getState()

Get current state

**Kind**: instance method of [<code>CircleRenderer</code>](#CircleRenderer)  
<a name="InteractionsHandler"></a>

## InteractionsHandler

**Kind**: global class

- [InteractionsHandler](#InteractionsHandler)
    - [new InteractionsHandler()](#new_InteractionsHandler_new)
    - [new InteractionsHandler(circleRenderer, audioEngine, musicTheory)](#new_InteractionsHandler_new)
    - [.currentKey](#InteractionsHandler+currentKey)
    - [.currentMode](#InteractionsHandler+currentMode)
    - [.setupAudioVisualSync()](#InteractionsHandler+setupAudioVisualSync)
    - [.init()](#InteractionsHandler+init)
    - [.setupCircleInteractions()](#InteractionsHandler+setupCircleInteractions)
    - [.setupTouchEvents()](#InteractionsHandler+setupTouchEvents)
    - [.setupKeyboardNavigation()](#InteractionsHandler+setupKeyboardNavigation)
    - [.navigateKeys()](#InteractionsHandler+navigateKeys)
    - [.navigateRelativeKeys()](#InteractionsHandler+navigateRelativeKeys)
    - [.addKeyboardFocusSupport()](#InteractionsHandler+addKeyboardFocusSupport)
    - [.announceKeyChange()](#InteractionsHandler+announceKeyChange)
    - [.announceKeyFocus()](#InteractionsHandler+announceKeyFocus)
    - [.announceToScreenReader(text)](#InteractionsHandler+announceToScreenReader)
    - [.announcePlaybackStatus(status)](#InteractionsHandler+announcePlaybackStatus)
    - [.announceAudioStatus(status)](#InteractionsHandler+announceAudioStatus)
    - [.closeDropdowns()](#InteractionsHandler+closeDropdowns)
    - [.toggleMode()](#InteractionsHandler+toggleMode)
    - [.playCurrentKey()](#InteractionsHandler+playCurrentKey)
    - [.setupModeToggle()](#InteractionsHandler+setupModeToggle)
    - [.setupAudioControls()](#InteractionsHandler+setupAudioControls)
    - [.initializeDefaultToggleStates()](#InteractionsHandler+initializeDefaultToggleStates)
    - [.setupVolumeControl()](#InteractionsHandler+setupVolumeControl)
    - [.updateVolumeIcon(volume)](#InteractionsHandler+updateVolumeIcon)
    - [.setupAudioSettings()](#InteractionsHandler+setupAudioSettings)
    - [.setupInfoPanelInteractions()](#InteractionsHandler+setupInfoPanelInteractions)
    - [.selectKey()](#InteractionsHandler+selectKey)
    - [.switchMode()](#InteractionsHandler+switchMode)
    - [.updateInfoPanel()](#InteractionsHandler+updateInfoPanel)
    - [.updateRelatedKeys(key, mode)](#InteractionsHandler+updateRelatedKeys)
    - [.updateChordProgressions(key, mode)](#InteractionsHandler+updateChordProgressions)
    - [.initializeAudio()](#InteractionsHandler+initializeAudio)
    - [.togglePercussion()](#InteractionsHandler+togglePercussion)
    - [.toggleBass()](#InteractionsHandler+toggleBass)
    - [.toggleLoop()](#InteractionsHandler+toggleLoop)
    - [.stopAudio()](#InteractionsHandler+stopAudio)
    - [.updateButtonState()](#InteractionsHandler+updateButtonState)
    - [.updateToggleButtonState()](#InteractionsHandler+updateToggleButtonState)
    - [.updateProgressionButtonStates(progressionName, isPlaying)](#InteractionsHandler+updateProgressionButtonStates)
    - [.handleKeySegmentKeydown(event)](#InteractionsHandler+handleKeySegmentKeydown)
    - [.handleGlobalKeydown(event)](#InteractionsHandler+handleGlobalKeydown)
    - [.showLoading([message])](#InteractionsHandler+showLoading)
    - [.hideLoading()](#InteractionsHandler+hideLoading)
    - [.showError(message)](#InteractionsHandler+showError)
    - [.getState()](#InteractionsHandler+getState)

<a name="new_InteractionsHandler_new"></a>

### new InteractionsHandler()

Handles all user interactions with the Circle of Fifths interface.
Manages mouse/touch events, keyboard shortcuts, audio controls, and UI updates.

**Example**

```js
const interactions = new InteractionsHandler(renderer, audioEngine, musicTheory);
```

<a name="new_InteractionsHandler_new"></a>

### new InteractionsHandler(circleRenderer, audioEngine, musicTheory)

Creates a new InteractionsHandler instance.
Sets up references to core components and initializes UI elements.

| Param          | Type                                           | Description                         |
| -------------- | ---------------------------------------------- | ----------------------------------- |
| circleRenderer | [<code>CircleRenderer</code>](#CircleRenderer) | The circle visualization renderer   |
| audioEngine    | [<code>AudioEngine</code>](#AudioEngine)       | The audio synthesis engine          |
| musicTheory    | [<code>MusicTheory</code>](#MusicTheory)       | The music theory calculation engine |

<a name="InteractionsHandler+currentKey"></a>

### interactionsHandler.currentKey

Get current key from circle renderer

**Kind**: instance property of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+currentMode"></a>

### interactionsHandler.currentMode

Get current mode from circle renderer

**Kind**: instance property of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+setupAudioVisualSync"></a>

### interactionsHandler.setupAudioVisualSync()

Setup audio-visual synchronization for note highlighting

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+init"></a>

### interactionsHandler.init()

Initialize all event listeners and UI components.
Sets up circle interactions, mode toggles, audio controls, and keyboard navigation.

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
**Example**

```js
interactions.init(); // Set up all event handlers
```

<a name="InteractionsHandler+setupCircleInteractions"></a>

### interactionsHandler.setupCircleInteractions()

Setup circle click and hover interactions

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+setupTouchEvents"></a>

### interactionsHandler.setupTouchEvents()

Setup enhanced touch events for mobile devices

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+setupKeyboardNavigation"></a>

### interactionsHandler.setupKeyboardNavigation()

Setup keyboard navigation for accessibility

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+navigateKeys"></a>

### interactionsHandler.navigateKeys()

Navigate through keys using keyboard

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+navigateRelativeKeys"></a>

### interactionsHandler.navigateRelativeKeys()

Navigate through relative keys

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+addKeyboardFocusSupport"></a>

### interactionsHandler.addKeyboardFocusSupport()

Add keyboard focus support to key segments

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+announceKeyChange"></a>

### interactionsHandler.announceKeyChange()

Announce key changes for screen readers

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+announceKeyFocus"></a>

### interactionsHandler.announceKeyFocus()

Announce key focus for screen readers

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+announceToScreenReader"></a>

### interactionsHandler.announceToScreenReader(text)

Announce text to screen readers using ARIA live region

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param | Type                | Description          |
| ----- | ------------------- | -------------------- |
| text  | <code>string</code> | The text to announce |

**Example**

```js
this.announceToScreenReader('C major selected');
```

<a name="InteractionsHandler+announcePlaybackStatus"></a>

### interactionsHandler.announcePlaybackStatus(status)

Announce playback status to screen readers

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param  | Type                | Description                     |
| ------ | ------------------- | ------------------------------- |
| status | <code>string</code> | The playback status to announce |

**Example**

```js
this.announcePlaybackStatus('Playing C major scale');
```

<a name="InteractionsHandler+announceAudioStatus"></a>

### interactionsHandler.announceAudioStatus(status)

Announce audio status to screen readers

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param  | Type                | Description                  |
| ------ | ------------------- | ---------------------------- |
| status | <code>string</code> | The audio status to announce |

**Example**

```js
this.announceAudioStatus('Audio initialized');
```

<a name="InteractionsHandler+closeDropdowns"></a>

### interactionsHandler.closeDropdowns()

Close any open dropdowns

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+toggleMode"></a>

### interactionsHandler.toggleMode()

Toggle between major and minor modes

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+playCurrentKey"></a>

### interactionsHandler.playCurrentKey()

Play the current key (scale, chord, or note)

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+setupModeToggle"></a>

### interactionsHandler.setupModeToggle()

Setup mode toggle (Major/Minor)

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+setupAudioControls"></a>

### interactionsHandler.setupAudioControls()

Setup audio control buttons

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+initializeDefaultToggleStates"></a>

### interactionsHandler.initializeDefaultToggleStates()

Initialize default toggle button states (percussion and loop enabled by default, bass disabled)

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+setupVolumeControl"></a>

### interactionsHandler.setupVolumeControl()

Setup volume control slider

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+updateVolumeIcon"></a>

### interactionsHandler.updateVolumeIcon(volume)

Update volume icon based on volume level

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param  | Type                | Description          |
| ------ | ------------------- | -------------------- |
| volume | <code>number</code> | Volume level (0-100) |

**Example**

```js
this.updateVolumeIcon(75); // Shows high volume icon
```

<a name="InteractionsHandler+setupAudioSettings"></a>

### interactionsHandler.setupAudioSettings()

Setup advanced audio settings panel

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+setupInfoPanelInteractions"></a>

### interactionsHandler.setupInfoPanelInteractions()

Setup info panel interactions

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+selectKey"></a>

### interactionsHandler.selectKey()

Select a key and update all related UI

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+switchMode"></a>

### interactionsHandler.switchMode()

Switch between major and minor modes

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+updateInfoPanel"></a>

### interactionsHandler.updateInfoPanel()

Update the information panel

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+updateRelatedKeys"></a>

### interactionsHandler.updateRelatedKeys(key, mode)

Update related keys display in the info panel

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param | Type                | Description                                       |
| ----- | ------------------- | ------------------------------------------------- |
| key   | <code>string</code> | The key to show related keys for (e.g., 'C', 'G') |
| mode  | <code>string</code> | The mode ('major' or 'minor')                     |

**Example**

```js
this.updateRelatedKeys('C', 'major');
// Displays: Dominant: G, Subdominant: F, Relative: Am
```

<a name="InteractionsHandler+updateChordProgressions"></a>

### interactionsHandler.updateChordProgressions(key, mode)

Update chord progressions display in the info panel

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param | Type                | Description                                       |
| ----- | ------------------- | ------------------------------------------------- |
| key   | <code>string</code> | The key to show progressions for (e.g., 'C', 'G') |
| mode  | <code>string</code> | The mode ('major' or 'minor')                     |

**Example**

```js
this.updateChordProgressions('C', 'major');
// Displays buttons for: I-IV-V-I, I-V-vi-IV, etc.
```

<a name="InteractionsHandler+initializeAudio"></a>

### interactionsHandler.initializeAudio()

Audio control methods

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+togglePercussion"></a>

### interactionsHandler.togglePercussion()

Toggle percussion on/off

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+toggleBass"></a>

### interactionsHandler.toggleBass()

Toggle bass on/off

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+toggleLoop"></a>

### interactionsHandler.toggleLoop()

Toggle loop on/off

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+stopAudio"></a>

### interactionsHandler.stopAudio()

Stop all currently playing audio

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
**Example**

```js
this.stopAudio(); // Stops all scales, chords, and progressions
```

<a name="InteractionsHandler+updateButtonState"></a>

### interactionsHandler.updateButtonState()

Update button appearance based on playback state

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+updateToggleButtonState"></a>

### interactionsHandler.updateToggleButtonState()

Update toggle button appearance based on state

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+updateProgressionButtonStates"></a>

### interactionsHandler.updateProgressionButtonStates(progressionName, isPlaying)

Update progression button states to show which one is playing

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param           | Type                 | Description                                  |
| --------------- | -------------------- | -------------------------------------------- |
| progressionName | <code>string</code>  | Name of the progression (e.g., 'I-IV-V-I')   |
| isPlaying       | <code>boolean</code> | Whether the progression is currently playing |

**Example**

```js
this.updateProgressionButtonStates('I-IV-V-I', true);
```

<a name="InteractionsHandler+handleKeySegmentKeydown"></a>

### interactionsHandler.handleKeySegmentKeydown(event)

Handle keyboard events on key segments

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param | Type                       | Description        |
| ----- | -------------------------- | ------------------ |
| event | <code>KeyboardEvent</code> | The keyboard event |

**Example**

```js
segment.addEventListener('keydown', e => this.handleKeySegmentKeydown(e));
```

<a name="InteractionsHandler+handleGlobalKeydown"></a>

### interactionsHandler.handleGlobalKeydown(event)

Handle global keyboard shortcuts

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param | Type                       | Description        |
| ----- | -------------------------- | ------------------ |
| event | <code>KeyboardEvent</code> | The keyboard event |

**Example**

```js
document.addEventListener('keydown', e => this.handleGlobalKeydown(e));
```

<a name="InteractionsHandler+showLoading"></a>

### interactionsHandler.showLoading([message])

Show loading indicator with custom message

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param     | Type                | Default                                         | Description                    |
| --------- | ------------------- | ----------------------------------------------- | ------------------------------ |
| [message] | <code>string</code> | <code>&quot;&#x27;Loading...&#x27;&quot;</code> | The loading message to display |

**Example**

```js
this.showLoading('Initializing audio...');
```

<a name="InteractionsHandler+hideLoading"></a>

### interactionsHandler.hideLoading()

Hide loading indicator

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
**Example**

```js
this.hideLoading();
```

<a name="InteractionsHandler+showError"></a>

### interactionsHandler.showError(message)

Show error message to user

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param   | Type                | Description                  |
| ------- | ------------------- | ---------------------------- |
| message | <code>string</code> | The error message to display |

**Example**

```js
this.showError('Failed to initialize audio');
```

<a name="InteractionsHandler+getState"></a>

### interactionsHandler.getState()

Get current state

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler"></a>

## InteractionsHandler

**Kind**: global class

- [InteractionsHandler](#InteractionsHandler)
    - [new InteractionsHandler()](#new_InteractionsHandler_new)
    - [new InteractionsHandler(circleRenderer, audioEngine, musicTheory)](#new_InteractionsHandler_new)
    - [.currentKey](#InteractionsHandler+currentKey)
    - [.currentMode](#InteractionsHandler+currentMode)
    - [.setupAudioVisualSync()](#InteractionsHandler+setupAudioVisualSync)
    - [.init()](#InteractionsHandler+init)
    - [.setupCircleInteractions()](#InteractionsHandler+setupCircleInteractions)
    - [.setupTouchEvents()](#InteractionsHandler+setupTouchEvents)
    - [.setupKeyboardNavigation()](#InteractionsHandler+setupKeyboardNavigation)
    - [.navigateKeys()](#InteractionsHandler+navigateKeys)
    - [.navigateRelativeKeys()](#InteractionsHandler+navigateRelativeKeys)
    - [.addKeyboardFocusSupport()](#InteractionsHandler+addKeyboardFocusSupport)
    - [.announceKeyChange()](#InteractionsHandler+announceKeyChange)
    - [.announceKeyFocus()](#InteractionsHandler+announceKeyFocus)
    - [.announceToScreenReader(text)](#InteractionsHandler+announceToScreenReader)
    - [.announcePlaybackStatus(status)](#InteractionsHandler+announcePlaybackStatus)
    - [.announceAudioStatus(status)](#InteractionsHandler+announceAudioStatus)
    - [.closeDropdowns()](#InteractionsHandler+closeDropdowns)
    - [.toggleMode()](#InteractionsHandler+toggleMode)
    - [.playCurrentKey()](#InteractionsHandler+playCurrentKey)
    - [.setupModeToggle()](#InteractionsHandler+setupModeToggle)
    - [.setupAudioControls()](#InteractionsHandler+setupAudioControls)
    - [.initializeDefaultToggleStates()](#InteractionsHandler+initializeDefaultToggleStates)
    - [.setupVolumeControl()](#InteractionsHandler+setupVolumeControl)
    - [.updateVolumeIcon(volume)](#InteractionsHandler+updateVolumeIcon)
    - [.setupAudioSettings()](#InteractionsHandler+setupAudioSettings)
    - [.setupInfoPanelInteractions()](#InteractionsHandler+setupInfoPanelInteractions)
    - [.selectKey()](#InteractionsHandler+selectKey)
    - [.switchMode()](#InteractionsHandler+switchMode)
    - [.updateInfoPanel()](#InteractionsHandler+updateInfoPanel)
    - [.updateRelatedKeys(key, mode)](#InteractionsHandler+updateRelatedKeys)
    - [.updateChordProgressions(key, mode)](#InteractionsHandler+updateChordProgressions)
    - [.initializeAudio()](#InteractionsHandler+initializeAudio)
    - [.togglePercussion()](#InteractionsHandler+togglePercussion)
    - [.toggleBass()](#InteractionsHandler+toggleBass)
    - [.toggleLoop()](#InteractionsHandler+toggleLoop)
    - [.stopAudio()](#InteractionsHandler+stopAudio)
    - [.updateButtonState()](#InteractionsHandler+updateButtonState)
    - [.updateToggleButtonState()](#InteractionsHandler+updateToggleButtonState)
    - [.updateProgressionButtonStates(progressionName, isPlaying)](#InteractionsHandler+updateProgressionButtonStates)
    - [.handleKeySegmentKeydown(event)](#InteractionsHandler+handleKeySegmentKeydown)
    - [.handleGlobalKeydown(event)](#InteractionsHandler+handleGlobalKeydown)
    - [.showLoading([message])](#InteractionsHandler+showLoading)
    - [.hideLoading()](#InteractionsHandler+hideLoading)
    - [.showError(message)](#InteractionsHandler+showError)
    - [.getState()](#InteractionsHandler+getState)

<a name="new_InteractionsHandler_new"></a>

### new InteractionsHandler()

Handles all user interactions with the Circle of Fifths interface.
Manages mouse/touch events, keyboard shortcuts, audio controls, and UI updates.

**Example**

```js
const interactions = new InteractionsHandler(renderer, audioEngine, musicTheory);
```

<a name="new_InteractionsHandler_new"></a>

### new InteractionsHandler(circleRenderer, audioEngine, musicTheory)

Creates a new InteractionsHandler instance.
Sets up references to core components and initializes UI elements.

| Param          | Type                                           | Description                         |
| -------------- | ---------------------------------------------- | ----------------------------------- |
| circleRenderer | [<code>CircleRenderer</code>](#CircleRenderer) | The circle visualization renderer   |
| audioEngine    | [<code>AudioEngine</code>](#AudioEngine)       | The audio synthesis engine          |
| musicTheory    | [<code>MusicTheory</code>](#MusicTheory)       | The music theory calculation engine |

<a name="InteractionsHandler+currentKey"></a>

### interactionsHandler.currentKey

Get current key from circle renderer

**Kind**: instance property of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+currentMode"></a>

### interactionsHandler.currentMode

Get current mode from circle renderer

**Kind**: instance property of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+setupAudioVisualSync"></a>

### interactionsHandler.setupAudioVisualSync()

Setup audio-visual synchronization for note highlighting

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+init"></a>

### interactionsHandler.init()

Initialize all event listeners and UI components.
Sets up circle interactions, mode toggles, audio controls, and keyboard navigation.

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
**Example**

```js
interactions.init(); // Set up all event handlers
```

<a name="InteractionsHandler+setupCircleInteractions"></a>

### interactionsHandler.setupCircleInteractions()

Setup circle click and hover interactions

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+setupTouchEvents"></a>

### interactionsHandler.setupTouchEvents()

Setup enhanced touch events for mobile devices

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+setupKeyboardNavigation"></a>

### interactionsHandler.setupKeyboardNavigation()

Setup keyboard navigation for accessibility

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+navigateKeys"></a>

### interactionsHandler.navigateKeys()

Navigate through keys using keyboard

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+navigateRelativeKeys"></a>

### interactionsHandler.navigateRelativeKeys()

Navigate through relative keys

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+addKeyboardFocusSupport"></a>

### interactionsHandler.addKeyboardFocusSupport()

Add keyboard focus support to key segments

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+announceKeyChange"></a>

### interactionsHandler.announceKeyChange()

Announce key changes for screen readers

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+announceKeyFocus"></a>

### interactionsHandler.announceKeyFocus()

Announce key focus for screen readers

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+announceToScreenReader"></a>

### interactionsHandler.announceToScreenReader(text)

Announce text to screen readers using ARIA live region

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param | Type                | Description          |
| ----- | ------------------- | -------------------- |
| text  | <code>string</code> | The text to announce |

**Example**

```js
this.announceToScreenReader('C major selected');
```

<a name="InteractionsHandler+announcePlaybackStatus"></a>

### interactionsHandler.announcePlaybackStatus(status)

Announce playback status to screen readers

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param  | Type                | Description                     |
| ------ | ------------------- | ------------------------------- |
| status | <code>string</code> | The playback status to announce |

**Example**

```js
this.announcePlaybackStatus('Playing C major scale');
```

<a name="InteractionsHandler+announceAudioStatus"></a>

### interactionsHandler.announceAudioStatus(status)

Announce audio status to screen readers

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param  | Type                | Description                  |
| ------ | ------------------- | ---------------------------- |
| status | <code>string</code> | The audio status to announce |

**Example**

```js
this.announceAudioStatus('Audio initialized');
```

<a name="InteractionsHandler+closeDropdowns"></a>

### interactionsHandler.closeDropdowns()

Close any open dropdowns

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+toggleMode"></a>

### interactionsHandler.toggleMode()

Toggle between major and minor modes

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+playCurrentKey"></a>

### interactionsHandler.playCurrentKey()

Play the current key (scale, chord, or note)

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+setupModeToggle"></a>

### interactionsHandler.setupModeToggle()

Setup mode toggle (Major/Minor)

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+setupAudioControls"></a>

### interactionsHandler.setupAudioControls()

Setup audio control buttons

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+initializeDefaultToggleStates"></a>

### interactionsHandler.initializeDefaultToggleStates()

Initialize default toggle button states (percussion and loop enabled by default, bass disabled)

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+setupVolumeControl"></a>

### interactionsHandler.setupVolumeControl()

Setup volume control slider

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+updateVolumeIcon"></a>

### interactionsHandler.updateVolumeIcon(volume)

Update volume icon based on volume level

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param  | Type                | Description          |
| ------ | ------------------- | -------------------- |
| volume | <code>number</code> | Volume level (0-100) |

**Example**

```js
this.updateVolumeIcon(75); // Shows high volume icon
```

<a name="InteractionsHandler+setupAudioSettings"></a>

### interactionsHandler.setupAudioSettings()

Setup advanced audio settings panel

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+setupInfoPanelInteractions"></a>

### interactionsHandler.setupInfoPanelInteractions()

Setup info panel interactions

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+selectKey"></a>

### interactionsHandler.selectKey()

Select a key and update all related UI

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+switchMode"></a>

### interactionsHandler.switchMode()

Switch between major and minor modes

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+updateInfoPanel"></a>

### interactionsHandler.updateInfoPanel()

Update the information panel

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+updateRelatedKeys"></a>

### interactionsHandler.updateRelatedKeys(key, mode)

Update related keys display in the info panel

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param | Type                | Description                                       |
| ----- | ------------------- | ------------------------------------------------- |
| key   | <code>string</code> | The key to show related keys for (e.g., 'C', 'G') |
| mode  | <code>string</code> | The mode ('major' or 'minor')                     |

**Example**

```js
this.updateRelatedKeys('C', 'major');
// Displays: Dominant: G, Subdominant: F, Relative: Am
```

<a name="InteractionsHandler+updateChordProgressions"></a>

### interactionsHandler.updateChordProgressions(key, mode)

Update chord progressions display in the info panel

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param | Type                | Description                                       |
| ----- | ------------------- | ------------------------------------------------- |
| key   | <code>string</code> | The key to show progressions for (e.g., 'C', 'G') |
| mode  | <code>string</code> | The mode ('major' or 'minor')                     |

**Example**

```js
this.updateChordProgressions('C', 'major');
// Displays buttons for: I-IV-V-I, I-V-vi-IV, etc.
```

<a name="InteractionsHandler+initializeAudio"></a>

### interactionsHandler.initializeAudio()

Audio control methods

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+togglePercussion"></a>

### interactionsHandler.togglePercussion()

Toggle percussion on/off

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+toggleBass"></a>

### interactionsHandler.toggleBass()

Toggle bass on/off

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+toggleLoop"></a>

### interactionsHandler.toggleLoop()

Toggle loop on/off

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+stopAudio"></a>

### interactionsHandler.stopAudio()

Stop all currently playing audio

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
**Example**

```js
this.stopAudio(); // Stops all scales, chords, and progressions
```

<a name="InteractionsHandler+updateButtonState"></a>

### interactionsHandler.updateButtonState()

Update button appearance based on playback state

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+updateToggleButtonState"></a>

### interactionsHandler.updateToggleButtonState()

Update toggle button appearance based on state

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="InteractionsHandler+updateProgressionButtonStates"></a>

### interactionsHandler.updateProgressionButtonStates(progressionName, isPlaying)

Update progression button states to show which one is playing

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param           | Type                 | Description                                  |
| --------------- | -------------------- | -------------------------------------------- |
| progressionName | <code>string</code>  | Name of the progression (e.g., 'I-IV-V-I')   |
| isPlaying       | <code>boolean</code> | Whether the progression is currently playing |

**Example**

```js
this.updateProgressionButtonStates('I-IV-V-I', true);
```

<a name="InteractionsHandler+handleKeySegmentKeydown"></a>

### interactionsHandler.handleKeySegmentKeydown(event)

Handle keyboard events on key segments

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param | Type                       | Description        |
| ----- | -------------------------- | ------------------ |
| event | <code>KeyboardEvent</code> | The keyboard event |

**Example**

```js
segment.addEventListener('keydown', e => this.handleKeySegmentKeydown(e));
```

<a name="InteractionsHandler+handleGlobalKeydown"></a>

### interactionsHandler.handleGlobalKeydown(event)

Handle global keyboard shortcuts

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param | Type                       | Description        |
| ----- | -------------------------- | ------------------ |
| event | <code>KeyboardEvent</code> | The keyboard event |

**Example**

```js
document.addEventListener('keydown', e => this.handleGlobalKeydown(e));
```

<a name="InteractionsHandler+showLoading"></a>

### interactionsHandler.showLoading([message])

Show loading indicator with custom message

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param     | Type                | Default                                         | Description                    |
| --------- | ------------------- | ----------------------------------------------- | ------------------------------ |
| [message] | <code>string</code> | <code>&quot;&#x27;Loading...&#x27;&quot;</code> | The loading message to display |

**Example**

```js
this.showLoading('Initializing audio...');
```

<a name="InteractionsHandler+hideLoading"></a>

### interactionsHandler.hideLoading()

Hide loading indicator

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
**Example**

```js
this.hideLoading();
```

<a name="InteractionsHandler+showError"></a>

### interactionsHandler.showError(message)

Show error message to user

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)

| Param   | Type                | Description                  |
| ------- | ------------------- | ---------------------------- |
| message | <code>string</code> | The error message to display |

**Example**

```js
this.showError('Failed to initialize audio');
```

<a name="InteractionsHandler+getState"></a>

### interactionsHandler.getState()

Get current state

**Kind**: instance method of [<code>InteractionsHandler</code>](#InteractionsHandler)  
<a name="Logger"></a>

## Logger

**Kind**: global class

- [Logger](#Logger)
    - [new Logger()](#new_Logger_new)
    - [new Logger(name, level)](#new_Logger_new)
    - [.detectDevelopmentMode()](#Logger+detectDevelopmentMode) ⇒ <code>boolean</code>
    - [.setLevel(level)](#Logger+setLevel)
    - [.shouldLog(level)](#Logger+shouldLog) ⇒ <code>boolean</code>
    - [.formatMessage(level, message, ...args)](#Logger+formatMessage) ⇒ <code>Array</code>
    - [.error(message, ...args)](#Logger+error)
    - [.warn(message, ...args)](#Logger+warn)
    - [.info(message, ...args)](#Logger+info)
    - [.debug(message, ...args)](#Logger+debug)
    - [.lifecycle(event, data)](#Logger+lifecycle)
    - [.performance(metric, value, unit)](#Logger+performance)
    - [.userAction(action, context)](#Logger+userAction)
    - [.child(category)](#Logger+child) ⇒ [<code>Logger</code>](#Logger)

<a name="new_Logger_new"></a>

### new Logger()

Logger class for structured logging with configurable levels

<a name="new_Logger_new"></a>

### new Logger(name, level)

Creates a new Logger instance

| Param | Type                | Default                      | Description                 |
| ----- | ------------------- | ---------------------------- | --------------------------- |
| name  | <code>string</code> | <code>&quot;App&quot;</code> | Logger name/category        |
| level | <code>number</code> |                              | Minimum log level to output |

<a name="Logger+detectDevelopmentMode"></a>

### logger.detectDevelopmentMode() ⇒ <code>boolean</code>

Detect if we're in development mode

**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Returns**: <code>boolean</code> - True if in development mode  
<a name="Logger+setLevel"></a>

### logger.setLevel(level)

Set the logging level

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param | Type                | Description       |
| ----- | ------------------- | ----------------- |
| level | <code>number</code> | New logging level |

<a name="Logger+shouldLog"></a>

### logger.shouldLog(level) ⇒ <code>boolean</code>

Check if a log level should be output

**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Returns**: <code>boolean</code> - True if should log

| Param | Type                | Description        |
| ----- | ------------------- | ------------------ |
| level | <code>number</code> | Log level to check |

<a name="Logger+formatMessage"></a>

### logger.formatMessage(level, message, ...args) ⇒ <code>Array</code>

Format log message with timestamp and context

**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Returns**: <code>Array</code> - Formatted log arguments

| Param   | Type                | Description          |
| ------- | ------------------- | -------------------- |
| level   | <code>string</code> | Log level name       |
| message | <code>string</code> | Log message          |
| ...args | <code>any</code>    | Additional arguments |

<a name="Logger+error"></a>

### logger.error(message, ...args)

Log an error message

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param   | Type                | Description          |
| ------- | ------------------- | -------------------- |
| message | <code>string</code> | Error message        |
| ...args | <code>any</code>    | Additional arguments |

<a name="Logger+warn"></a>

### logger.warn(message, ...args)

Log a warning message

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param   | Type                | Description          |
| ------- | ------------------- | -------------------- |
| message | <code>string</code> | Warning message      |
| ...args | <code>any</code>    | Additional arguments |

<a name="Logger+info"></a>

### logger.info(message, ...args)

Log an info message

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param   | Type                | Description          |
| ------- | ------------------- | -------------------- |
| message | <code>string</code> | Info message         |
| ...args | <code>any</code>    | Additional arguments |

<a name="Logger+debug"></a>

### logger.debug(message, ...args)

Log a debug message (only in development)

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param   | Type                | Description          |
| ------- | ------------------- | -------------------- |
| message | <code>string</code> | Debug message        |
| ...args | <code>any</code>    | Additional arguments |

<a name="Logger+lifecycle"></a>

### logger.lifecycle(event, data)

Log application lifecycle events

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param | Type                | Description |
| ----- | ------------------- | ----------- |
| event | <code>string</code> | Event name  |
| data  | <code>Object</code> | Event data  |

<a name="Logger+performance"></a>

### logger.performance(metric, value, unit)

Log performance metrics

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param  | Type                | Default                     | Description  |
| ------ | ------------------- | --------------------------- | ------------ |
| metric | <code>string</code> |                             | Metric name  |
| value  | <code>number</code> |                             | Metric value |
| unit   | <code>string</code> | <code>&quot;ms&quot;</code> | Metric unit  |

<a name="Logger+userAction"></a>

### logger.userAction(action, context)

Log user interactions

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param   | Type                | Description    |
| ------- | ------------------- | -------------- |
| action  | <code>string</code> | User action    |
| context | <code>Object</code> | Action context |

<a name="Logger+child"></a>

### logger.child(category) ⇒ [<code>Logger</code>](#Logger)

Create a child logger with a specific category

**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Returns**: [<code>Logger</code>](#Logger) - Child logger instance

| Param    | Type                | Description     |
| -------- | ------------------- | --------------- |
| category | <code>string</code> | Logger category |

<a name="Logger"></a>

## Logger

**Kind**: global class

- [Logger](#Logger)
    - [new Logger()](#new_Logger_new)
    - [new Logger(name, level)](#new_Logger_new)
    - [.detectDevelopmentMode()](#Logger+detectDevelopmentMode) ⇒ <code>boolean</code>
    - [.setLevel(level)](#Logger+setLevel)
    - [.shouldLog(level)](#Logger+shouldLog) ⇒ <code>boolean</code>
    - [.formatMessage(level, message, ...args)](#Logger+formatMessage) ⇒ <code>Array</code>
    - [.error(message, ...args)](#Logger+error)
    - [.warn(message, ...args)](#Logger+warn)
    - [.info(message, ...args)](#Logger+info)
    - [.debug(message, ...args)](#Logger+debug)
    - [.lifecycle(event, data)](#Logger+lifecycle)
    - [.performance(metric, value, unit)](#Logger+performance)
    - [.userAction(action, context)](#Logger+userAction)
    - [.child(category)](#Logger+child) ⇒ [<code>Logger</code>](#Logger)

<a name="new_Logger_new"></a>

### new Logger()

Logger class for structured logging with configurable levels

<a name="new_Logger_new"></a>

### new Logger(name, level)

Creates a new Logger instance

| Param | Type                | Default                      | Description                 |
| ----- | ------------------- | ---------------------------- | --------------------------- |
| name  | <code>string</code> | <code>&quot;App&quot;</code> | Logger name/category        |
| level | <code>number</code> |                              | Minimum log level to output |

<a name="Logger+detectDevelopmentMode"></a>

### logger.detectDevelopmentMode() ⇒ <code>boolean</code>

Detect if we're in development mode

**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Returns**: <code>boolean</code> - True if in development mode  
<a name="Logger+setLevel"></a>

### logger.setLevel(level)

Set the logging level

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param | Type                | Description       |
| ----- | ------------------- | ----------------- |
| level | <code>number</code> | New logging level |

<a name="Logger+shouldLog"></a>

### logger.shouldLog(level) ⇒ <code>boolean</code>

Check if a log level should be output

**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Returns**: <code>boolean</code> - True if should log

| Param | Type                | Description        |
| ----- | ------------------- | ------------------ |
| level | <code>number</code> | Log level to check |

<a name="Logger+formatMessage"></a>

### logger.formatMessage(level, message, ...args) ⇒ <code>Array</code>

Format log message with timestamp and context

**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Returns**: <code>Array</code> - Formatted log arguments

| Param   | Type                | Description          |
| ------- | ------------------- | -------------------- |
| level   | <code>string</code> | Log level name       |
| message | <code>string</code> | Log message          |
| ...args | <code>any</code>    | Additional arguments |

<a name="Logger+error"></a>

### logger.error(message, ...args)

Log an error message

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param   | Type                | Description          |
| ------- | ------------------- | -------------------- |
| message | <code>string</code> | Error message        |
| ...args | <code>any</code>    | Additional arguments |

<a name="Logger+warn"></a>

### logger.warn(message, ...args)

Log a warning message

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param   | Type                | Description          |
| ------- | ------------------- | -------------------- |
| message | <code>string</code> | Warning message      |
| ...args | <code>any</code>    | Additional arguments |

<a name="Logger+info"></a>

### logger.info(message, ...args)

Log an info message

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param   | Type                | Description          |
| ------- | ------------------- | -------------------- |
| message | <code>string</code> | Info message         |
| ...args | <code>any</code>    | Additional arguments |

<a name="Logger+debug"></a>

### logger.debug(message, ...args)

Log a debug message (only in development)

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param   | Type                | Description          |
| ------- | ------------------- | -------------------- |
| message | <code>string</code> | Debug message        |
| ...args | <code>any</code>    | Additional arguments |

<a name="Logger+lifecycle"></a>

### logger.lifecycle(event, data)

Log application lifecycle events

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param | Type                | Description |
| ----- | ------------------- | ----------- |
| event | <code>string</code> | Event name  |
| data  | <code>Object</code> | Event data  |

<a name="Logger+performance"></a>

### logger.performance(metric, value, unit)

Log performance metrics

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param  | Type                | Default                     | Description  |
| ------ | ------------------- | --------------------------- | ------------ |
| metric | <code>string</code> |                             | Metric name  |
| value  | <code>number</code> |                             | Metric value |
| unit   | <code>string</code> | <code>&quot;ms&quot;</code> | Metric unit  |

<a name="Logger+userAction"></a>

### logger.userAction(action, context)

Log user interactions

**Kind**: instance method of [<code>Logger</code>](#Logger)

| Param   | Type                | Description    |
| ------- | ------------------- | -------------- |
| action  | <code>string</code> | User action    |
| context | <code>Object</code> | Action context |

<a name="Logger+child"></a>

### logger.child(category) ⇒ [<code>Logger</code>](#Logger)

Create a child logger with a specific category

**Kind**: instance method of [<code>Logger</code>](#Logger)  
**Returns**: [<code>Logger</code>](#Logger) - Child logger instance

| Param    | Type                | Description     |
| -------- | ------------------- | --------------- |
| category | <code>string</code> | Logger category |

<a name="CircleOfFifthsApp"></a>

## CircleOfFifthsApp

Main application class

**Kind**: global class

- [CircleOfFifthsApp](#CircleOfFifthsApp)
    - [new CircleOfFifthsApp()](#new_CircleOfFifthsApp_new)
    - [new CircleOfFifthsApp()](#new_CircleOfFifthsApp_new)
    - [.init()](#CircleOfFifthsApp+init) ⇒ <code>Promise.&lt;void&gt;</code>
    - [.waitForDOM()](#CircleOfFifthsApp+waitForDOM)
    - [.initializeComponents()](#CircleOfFifthsApp+initializeComponents)
    - [.setupGlobalEventListeners()](#CircleOfFifthsApp+setupGlobalEventListeners)
    - [.performInitialRender()](#CircleOfFifthsApp+performInitialRender)
    - [.setupErrorHandling()](#CircleOfFifthsApp+setupErrorHandling)
    - [.handleVisibilityChange()](#CircleOfFifthsApp+handleVisibilityChange)
    - [.updateUIState()](#CircleOfFifthsApp+updateUIState)
    - [.handleInitializationError()](#CircleOfFifthsApp+handleInitializationError)
    - [.showUserError()](#CircleOfFifthsApp+showUserError)
    - [.escapeHtml()](#CircleOfFifthsApp+escapeHtml)
    - [.handleError()](#CircleOfFifthsApp+handleError)
    - [.getUserFriendlyErrorMessage()](#CircleOfFifthsApp+getUserFriendlyErrorMessage)
    - [.isCriticalError()](#CircleOfFifthsApp+isCriticalError)
    - [.showKeyboardShortcuts()](#CircleOfFifthsApp+showKeyboardShortcuts)
    - [.getState()](#CircleOfFifthsApp+getState) ⇒ <code>Object</code> \| <code>boolean</code> \| <code>boolean</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code>
    - [.destroy()](#CircleOfFifthsApp+destroy)
    - [.restart()](#CircleOfFifthsApp+restart) ⇒ <code>Promise.&lt;void&gt;</code>
    - [.init()](#CircleOfFifthsApp+init)
    - [.setupErrorHandling()](#CircleOfFifthsApp+setupErrorHandling)
    - [.hideLoadingScreen()](#CircleOfFifthsApp+hideLoadingScreen)
    - [.handleInitializationError()](#CircleOfFifthsApp+handleInitializationError)
    - [.handleError()](#CircleOfFifthsApp+handleError)
    - [.destroy()](#CircleOfFifthsApp+destroy)

<a name="new_CircleOfFifthsApp_new"></a>

### new CircleOfFifthsApp()

Main application class for the Circle of Fifths interactive music theory tool.
Manages initialization, component coordination, and application lifecycle.

**Example**

```js
const app = new CircleOfFifthsApp();
await app.init();
```

<a name="new_CircleOfFifthsApp_new"></a>

### new CircleOfFifthsApp()

Creates a new CircleOfFifthsApp instance.
Initializes all component references and binds event handlers.

<a name="CircleOfFifthsApp+init"></a>

### circleOfFifthsApp.init() ⇒ <code>Promise.&lt;void&gt;</code>

Initialize the application asynchronously.
Sets up all components, event listeners, and performs initial render.
Can be called multiple times safely - subsequent calls return the same promise.

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promise that resolves when initialization is complete  
**Throws**:

- <code>Error</code> If initialization fails

**Example**

```js
try {
    await app.init();
    console.log('App ready!');
} catch (error) {
    console.error('Failed to initialize:', error);
}
```

<a name="CircleOfFifthsApp+waitForDOM"></a>

### circleOfFifthsApp.waitForDOM()

Wait for DOM to be ready

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+initializeComponents"></a>

### circleOfFifthsApp.initializeComponents()

Initialize core components

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+setupGlobalEventListeners"></a>

### circleOfFifthsApp.setupGlobalEventListeners()

Setup global event listeners

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+performInitialRender"></a>

### circleOfFifthsApp.performInitialRender()

Perform initial render

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+setupErrorHandling"></a>

### circleOfFifthsApp.setupErrorHandling()

Setup error handling

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+handleVisibilityChange"></a>

### circleOfFifthsApp.handleVisibilityChange()

Handle page visibility change

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+updateUIState"></a>

### circleOfFifthsApp.updateUIState()

Update UI state

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+handleInitializationError"></a>

### circleOfFifthsApp.handleInitializationError()

Handle initialization errors

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+showUserError"></a>

### circleOfFifthsApp.showUserError()

Show user-facing error message

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+escapeHtml"></a>

### circleOfFifthsApp.escapeHtml()

Escape HTML to prevent XSS

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+handleError"></a>

### circleOfFifthsApp.handleError()

Handle runtime errors

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+getUserFriendlyErrorMessage"></a>

### circleOfFifthsApp.getUserFriendlyErrorMessage()

Get user-friendly error message

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+isCriticalError"></a>

### circleOfFifthsApp.isCriticalError()

Check if error is critical

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+showKeyboardShortcuts"></a>

### circleOfFifthsApp.showKeyboardShortcuts()

Show keyboard shortcuts help

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+getState"></a>

### circleOfFifthsApp.getState() ⇒ <code>Object</code> \| <code>boolean</code> \| <code>boolean</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>null</code>

Get the current application state.
Returns comprehensive state information for debugging and monitoring.

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
**Returns**: <code>Object</code> - Application state object<code>boolean</code> - returns.initialized - Whether the app is fully initialized<code>boolean</code> \| <code>null</code> - returns.musicTheory - Music theory engine status<code>Object</code> \| <code>null</code> - returns.audioEngine - Audio engine state<code>Object</code> \| <code>null</code> - returns.circleRenderer - Circle renderer state<code>Object</code> \| <code>null</code> - returns.interactions - Interactions handler state<code>Object</code> \| <code>null</code> - returns.theme - Theme manager state  
**Example**

```js
const state = app.getState();
console.log('App initialized:', state.initialized);
```

<a name="CircleOfFifthsApp+destroy"></a>

### circleOfFifthsApp.destroy()

Cleanup all application resources and event listeners.
Properly disposes of all components and resets the application state.
Should be called before page unload or when restarting the application.

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
**Example**

```js
// Clean shutdown
app.destroy();
```

<a name="CircleOfFifthsApp+restart"></a>

### circleOfFifthsApp.restart() ⇒ <code>Promise.&lt;void&gt;</code>

Restart the application by destroying and reinitializing.
Useful for recovering from errors or applying configuration changes.

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
**Returns**: <code>Promise.&lt;void&gt;</code> - Promise that resolves when restart is complete  
**Example**

```js
// Restart after an error
await app.restart();
```

<a name="CircleOfFifthsApp+init"></a>

### circleOfFifthsApp.init()

Initialize the application

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+setupErrorHandling"></a>

### circleOfFifthsApp.setupErrorHandling()

Setup global error handlers

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+hideLoadingScreen"></a>

### circleOfFifthsApp.hideLoadingScreen()

Hide the loading screen

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+handleInitializationError"></a>

### circleOfFifthsApp.handleInitializationError()

Handle initialization errors

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+handleError"></a>

### circleOfFifthsApp.handleError()

Handle runtime errors

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="CircleOfFifthsApp+destroy"></a>

### circleOfFifthsApp.destroy()

Cleanup and destroy the application

**Kind**: instance method of [<code>CircleOfFifthsApp</code>](#CircleOfFifthsApp)  
<a name="MusicTheory"></a>

## MusicTheory

**Kind**: global class

- [MusicTheory](#MusicTheory)
    - [new MusicTheory()](#new_MusicTheory_new)
    - [new MusicTheory()](#new_MusicTheory_new)
    - [.getNoteIndex()](#MusicTheory+getNoteIndex)
    - [.getScaleNotes(key, [mode])](#MusicTheory+getScaleNotes) ⇒ <code>Array.&lt;string&gt;</code>
    - [.getProperNoteName()](#MusicTheory+getProperNoteName)
    - [.getKeySignature()](#MusicTheory+getKeySignature)
    - [.getRelatedKeys(key, [mode])](#MusicTheory+getRelatedKeys) ⇒ <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>Object</code> \| <code>Object</code>
    - [.getChordProgressions()](#MusicTheory+getChordProgressions)
    - [.romanToChord(roman, key, mode)](#MusicTheory+romanToChord) ⇒ <code>string</code>
    - [.getChordNotes(root, [quality])](#MusicTheory+getChordNotes) ⇒ <code>Array.&lt;string&gt;</code>
    - [.getNoteFrequency()](#MusicTheory+getNoteFrequency)
    - [.isValidKey()](#MusicTheory+isValidKey)
    - [.getEnharmonic()](#MusicTheory+getEnharmonic)
    - [.getCircleOfFifthsKeys()](#MusicTheory+getCircleOfFifthsKeys)
    - [.getKeyPosition()](#MusicTheory+getKeyPosition)

<a name="new_MusicTheory_new"></a>

### new MusicTheory()

Music Theory Utility Class
Provides comprehensive music theory calculations and data for the Circle of Fifths.
Handles key signatures, scales, chords, and their relationships.

**Example**

```js
const theory = new MusicTheory();
const scale = theory.getScaleNotes('G', 'major');
const chord = theory.getChordNotes('Am', 'minor');
```

<a name="new_MusicTheory_new"></a>

### new MusicTheory()

Creates a new MusicTheory instance.
Initializes with C major as the default key and mode.

<a name="MusicTheory+getNoteIndex"></a>

### musicTheory.getNoteIndex()

Get note index in chromatic scale

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
<a name="MusicTheory+getScaleNotes"></a>

### musicTheory.getScaleNotes(key, [mode]) ⇒ <code>Array.&lt;string&gt;</code>

Generate scale notes for a given key and mode.
Returns the seven notes of the scale in order.

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
**Returns**: <code>Array.&lt;string&gt;</code> - Array of note names in the scale

| Param  | Type                | Default                                    | Description                          |
| ------ | ------------------- | ------------------------------------------ | ------------------------------------ |
| key    | <code>string</code> |                                            | The root key (e.g., 'C', 'F#', 'Bb') |
| [mode] | <code>string</code> | <code>&quot;&#x27;major&#x27;&quot;</code> | The mode ('major' or 'minor')        |

**Example**

```js
theory.getScaleNotes('G', 'major'); // ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
theory.getScaleNotes('A', 'minor'); // ['A', 'B', 'C', 'D', 'E', 'F', 'G']
```

<a name="MusicTheory+getProperNoteName"></a>

### musicTheory.getProperNoteName()

Get the proper note name based on key signature context

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
<a name="MusicTheory+getKeySignature"></a>

### musicTheory.getKeySignature()

Get key signature information

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
<a name="MusicTheory+getRelatedKeys"></a>

### musicTheory.getRelatedKeys(key, [mode]) ⇒ <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>Object</code> \| <code>Object</code>

Get related keys (dominant, subdominant, relative) for a given key and mode.
Returns an object with the three most important related keys.

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
**Returns**: <code>Object</code> \| <code>null</code> - Object with dominant, subdominant, and relative keys<code>Object</code> - returns.dominant - Dominant key information<code>Object</code> - returns.subdominant - Subdominant key information<code>Object</code> - returns.relative - Relative key information

| Param  | Type                | Default                                    | Description                          |
| ------ | ------------------- | ------------------------------------------ | ------------------------------------ |
| key    | <code>string</code> |                                            | The root key (e.g., 'C', 'F#', 'Bb') |
| [mode] | <code>string</code> | <code>&quot;&#x27;major&#x27;&quot;</code> | The mode ('major' or 'minor')        |

**Example**

```js
theory.getRelatedKeys('C', 'major');
// Returns: { dominant: {key: 'G', mode: 'major'}, subdominant: {key: 'F', mode: 'major'}, relative: {key: 'A', mode: 'minor'} }
```

<a name="MusicTheory+getChordProgressions"></a>

### musicTheory.getChordProgressions()

Get chord progressions for a key

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
<a name="MusicTheory+romanToChord"></a>

### musicTheory.romanToChord(roman, key, mode) ⇒ <code>string</code>

This method ensures that all chords in a progression are diatonic to the key:

1. Gets the scale notes for the specified key and mode
2. Maps the roman numeral to a scale degree (I=1st, ii=2nd, iii=3rd, etc.)
3. Returns the corresponding note from the scale

This guarantees that progressions never modulate or change keys unless
explicitly requested by changing the key parameter.

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
**Returns**: <code>string</code> - The chord root note in the specified key

| Param | Type                | Default                        | Description                           |
| ----- | ------------------- | ------------------------------ | ------------------------------------- |
| roman | <code>string</code> |                                | Roman numeral (e.g., 'ii', 'V', 'I')  |
| key   | <code>string</code> |                                | The key to use (e.g., 'C', 'G', 'F#') |
| mode  | <code>string</code> | <code>&quot;major&quot;</code> | 'major' or 'minor'                    |

**Example**

```js
// In C major:
romanToChord('ii', 'C', 'major'); // Returns 'D' (D minor)
romanToChord('V', 'C', 'major'); // Returns 'G' (G major)
romanToChord('I', 'C', 'major'); // Returns 'C' (C major)

// In G major:
romanToChord('ii', 'G', 'major'); // Returns 'A' (A minor)
romanToChord('V', 'G', 'major'); // Returns 'D' (D major)
romanToChord('I', 'G', 'major'); // Returns 'G' (G major)
```

<a name="MusicTheory+getChordNotes"></a>

### musicTheory.getChordNotes(root, [quality]) ⇒ <code>Array.&lt;string&gt;</code>

Get chord notes for a given root and quality.
Returns the notes that make up the specified chord.

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
**Returns**: <code>Array.&lt;string&gt;</code> - Array of note names in the chord

| Param     | Type                | Default                                    | Description                                                     |
| --------- | ------------------- | ------------------------------------------ | --------------------------------------------------------------- |
| root      | <code>string</code> |                                            | The root note of the chord (e.g., 'C', 'F#', 'Bb')              |
| [quality] | <code>string</code> | <code>&quot;&#x27;major&#x27;&quot;</code> | The chord quality ('major', 'minor', 'diminished', 'augmented') |

**Example**

```js
theory.getChordNotes('C', 'major'); // ['C', 'E', 'G']
theory.getChordNotes('A', 'minor'); // ['A', 'C', 'E']
theory.getChordNotes('B', 'diminished'); // ['B', 'D', 'F']
```

<a name="MusicTheory+getNoteFrequency"></a>

### musicTheory.getNoteFrequency()

Get frequency for a note (A4 = 440Hz)

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
<a name="MusicTheory+isValidKey"></a>

### musicTheory.isValidKey()

Validate if a key exists in our system

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
<a name="MusicTheory+getEnharmonic"></a>

### musicTheory.getEnharmonic()

Get enharmonic equivalent of a note

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
<a name="MusicTheory+getCircleOfFifthsKeys"></a>

### musicTheory.getCircleOfFifthsKeys()

Get all keys in circle of fifths order

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
<a name="MusicTheory+getKeyPosition"></a>

### musicTheory.getKeyPosition()

Get position of key in circle (0-11, where C=0)

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
<a name="MusicTheory"></a>

## MusicTheory

**Kind**: global class

- [MusicTheory](#MusicTheory)
    - [new MusicTheory()](#new_MusicTheory_new)
    - [new MusicTheory()](#new_MusicTheory_new)
    - [.getNoteIndex()](#MusicTheory+getNoteIndex)
    - [.getScaleNotes(key, [mode])](#MusicTheory+getScaleNotes) ⇒ <code>Array.&lt;string&gt;</code>
    - [.getProperNoteName()](#MusicTheory+getProperNoteName)
    - [.getKeySignature()](#MusicTheory+getKeySignature)
    - [.getRelatedKeys(key, [mode])](#MusicTheory+getRelatedKeys) ⇒ <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>Object</code> \| <code>Object</code>
    - [.getChordProgressions()](#MusicTheory+getChordProgressions)
    - [.romanToChord(roman, key, mode)](#MusicTheory+romanToChord) ⇒ <code>string</code>
    - [.getChordNotes(root, [quality])](#MusicTheory+getChordNotes) ⇒ <code>Array.&lt;string&gt;</code>
    - [.getNoteFrequency()](#MusicTheory+getNoteFrequency)
    - [.isValidKey()](#MusicTheory+isValidKey)
    - [.getEnharmonic()](#MusicTheory+getEnharmonic)
    - [.getCircleOfFifthsKeys()](#MusicTheory+getCircleOfFifthsKeys)
    - [.getKeyPosition()](#MusicTheory+getKeyPosition)

<a name="new_MusicTheory_new"></a>

### new MusicTheory()

Music Theory Utility Class
Provides comprehensive music theory calculations and data for the Circle of Fifths.
Handles key signatures, scales, chords, and their relationships.

**Example**

```js
const theory = new MusicTheory();
const scale = theory.getScaleNotes('G', 'major');
const chord = theory.getChordNotes('Am', 'minor');
```

<a name="new_MusicTheory_new"></a>

### new MusicTheory()

Creates a new MusicTheory instance.
Initializes with C major as the default key and mode.

<a name="MusicTheory+getNoteIndex"></a>

### musicTheory.getNoteIndex()

Get note index in chromatic scale

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
<a name="MusicTheory+getScaleNotes"></a>

### musicTheory.getScaleNotes(key, [mode]) ⇒ <code>Array.&lt;string&gt;</code>

Generate scale notes for a given key and mode.
Returns the seven notes of the scale in order.

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
**Returns**: <code>Array.&lt;string&gt;</code> - Array of note names in the scale

| Param  | Type                | Default                                    | Description                          |
| ------ | ------------------- | ------------------------------------------ | ------------------------------------ |
| key    | <code>string</code> |                                            | The root key (e.g., 'C', 'F#', 'Bb') |
| [mode] | <code>string</code> | <code>&quot;&#x27;major&#x27;&quot;</code> | The mode ('major' or 'minor')        |

**Example**

```js
theory.getScaleNotes('G', 'major'); // ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
theory.getScaleNotes('A', 'minor'); // ['A', 'B', 'C', 'D', 'E', 'F', 'G']
```

<a name="MusicTheory+getProperNoteName"></a>

### musicTheory.getProperNoteName()

Get the proper note name based on key signature context

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
<a name="MusicTheory+getKeySignature"></a>

### musicTheory.getKeySignature()

Get key signature information

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
<a name="MusicTheory+getRelatedKeys"></a>

### musicTheory.getRelatedKeys(key, [mode]) ⇒ <code>Object</code> \| <code>null</code> \| <code>Object</code> \| <code>Object</code> \| <code>Object</code>

Get related keys (dominant, subdominant, relative) for a given key and mode.
Returns an object with the three most important related keys.

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
**Returns**: <code>Object</code> \| <code>null</code> - Object with dominant, subdominant, and relative keys<code>Object</code> - returns.dominant - Dominant key information<code>Object</code> - returns.subdominant - Subdominant key information<code>Object</code> - returns.relative - Relative key information

| Param  | Type                | Default                                    | Description                          |
| ------ | ------------------- | ------------------------------------------ | ------------------------------------ |
| key    | <code>string</code> |                                            | The root key (e.g., 'C', 'F#', 'Bb') |
| [mode] | <code>string</code> | <code>&quot;&#x27;major&#x27;&quot;</code> | The mode ('major' or 'minor')        |

**Example**

```js
theory.getRelatedKeys('C', 'major');
// Returns: { dominant: {key: 'G', mode: 'major'}, subdominant: {key: 'F', mode: 'major'}, relative: {key: 'A', mode: 'minor'} }
```

<a name="MusicTheory+getChordProgressions"></a>

### musicTheory.getChordProgressions()

Get chord progressions for a key

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
<a name="MusicTheory+romanToChord"></a>

### musicTheory.romanToChord(roman, key, mode) ⇒ <code>string</code>

This method ensures that all chords in a progression are diatonic to the key:

1. Gets the scale notes for the specified key and mode
2. Maps the roman numeral to a scale degree (I=1st, ii=2nd, iii=3rd, etc.)
3. Returns the corresponding note from the scale

This guarantees that progressions never modulate or change keys unless
explicitly requested by changing the key parameter.

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
**Returns**: <code>string</code> - The chord root note in the specified key

| Param | Type                | Default                        | Description                           |
| ----- | ------------------- | ------------------------------ | ------------------------------------- |
| roman | <code>string</code> |                                | Roman numeral (e.g., 'ii', 'V', 'I')  |
| key   | <code>string</code> |                                | The key to use (e.g., 'C', 'G', 'F#') |
| mode  | <code>string</code> | <code>&quot;major&quot;</code> | 'major' or 'minor'                    |

**Example**

```js
// In C major:
romanToChord('ii', 'C', 'major'); // Returns 'D' (D minor)
romanToChord('V', 'C', 'major'); // Returns 'G' (G major)
romanToChord('I', 'C', 'major'); // Returns 'C' (C major)

// In G major:
romanToChord('ii', 'G', 'major'); // Returns 'A' (A minor)
romanToChord('V', 'G', 'major'); // Returns 'D' (D major)
romanToChord('I', 'G', 'major'); // Returns 'G' (G major)
```

<a name="MusicTheory+getChordNotes"></a>

### musicTheory.getChordNotes(root, [quality]) ⇒ <code>Array.&lt;string&gt;</code>

Get chord notes for a given root and quality.
Returns the notes that make up the specified chord.

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
**Returns**: <code>Array.&lt;string&gt;</code> - Array of note names in the chord

| Param     | Type                | Default                                    | Description                                                     |
| --------- | ------------------- | ------------------------------------------ | --------------------------------------------------------------- |
| root      | <code>string</code> |                                            | The root note of the chord (e.g., 'C', 'F#', 'Bb')              |
| [quality] | <code>string</code> | <code>&quot;&#x27;major&#x27;&quot;</code> | The chord quality ('major', 'minor', 'diminished', 'augmented') |

**Example**

```js
theory.getChordNotes('C', 'major'); // ['C', 'E', 'G']
theory.getChordNotes('A', 'minor'); // ['A', 'C', 'E']
theory.getChordNotes('B', 'diminished'); // ['B', 'D', 'F']
```

<a name="MusicTheory+getNoteFrequency"></a>

### musicTheory.getNoteFrequency()

Get frequency for a note (A4 = 440Hz)

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
<a name="MusicTheory+isValidKey"></a>

### musicTheory.isValidKey()

Validate if a key exists in our system

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
<a name="MusicTheory+getEnharmonic"></a>

### musicTheory.getEnharmonic()

Get enharmonic equivalent of a note

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
<a name="MusicTheory+getCircleOfFifthsKeys"></a>

### musicTheory.getCircleOfFifthsKeys()

Get all keys in circle of fifths order

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
<a name="MusicTheory+getKeyPosition"></a>

### musicTheory.getKeyPosition()

Get position of key in circle (0-11, where C=0)

**Kind**: instance method of [<code>MusicTheory</code>](#MusicTheory)  
<a name="ThemeManager"></a>

## ThemeManager

**Kind**: global class

- [ThemeManager](#ThemeManager)
    - [new ThemeManager()](#new_ThemeManager_new)
    - [new ThemeManager()](#new_ThemeManager_new)
    - [.init()](#ThemeManager+init)
    - [.loadThemePreference()](#ThemeManager+loadThemePreference)
    - [.saveThemePreference()](#ThemeManager+saveThemePreference)
    - [.setupSystemThemeListener()](#ThemeManager+setupSystemThemeListener)
    - [.setupStorageListener()](#ThemeManager+setupStorageListener)
    - [.handleSystemThemeChange()](#ThemeManager+handleSystemThemeChange)
    - [.handleStorageChange()](#ThemeManager+handleStorageChange)
    - [.setTheme()](#ThemeManager+setTheme)
    - [.applyTheme()](#ThemeManager+applyTheme)
    - [.updateMetaThemeColor()](#ThemeManager+updateMetaThemeColor)
    - [.getSystemTheme()](#ThemeManager+getSystemTheme)
    - [.getCurrentTheme()](#ThemeManager+getCurrentTheme)
    - [.getEffectiveTheme()](#ThemeManager+getEffectiveTheme)
    - [.getAvailableThemes()](#ThemeManager+getAvailableThemes)
    - [.toggleTheme()](#ThemeManager+toggleTheme)
    - [.notifyThemeChange()](#ThemeManager+notifyThemeChange)
    - [.getThemeDisplayName()](#ThemeManager+getThemeDisplayName)
    - [.getThemeIcon()](#ThemeManager+getThemeIcon)
    - [.getThemeColor()](#ThemeManager+getThemeColor)
    - [.destroy()](#ThemeManager+destroy)

<a name="new_ThemeManager_new"></a>

### new ThemeManager()

Manages application themes including light, dark, and system preference modes.
Handles theme persistence, system preference detection, and cross-tab synchronization.

**Example**

```js
const themeManager = new ThemeManager();
themeManager.setTheme('dark');
```

<a name="new_ThemeManager_new"></a>

### new ThemeManager()

Creates a new ThemeManager instance.
Initializes theme preferences and sets up system preference monitoring.

<a name="ThemeManager+init"></a>

### themeManager.init()

Initialize the theme manager

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+loadThemePreference"></a>

### themeManager.loadThemePreference()

Load theme preference from localStorage

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+saveThemePreference"></a>

### themeManager.saveThemePreference()

Save theme preference to localStorage

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+setupSystemThemeListener"></a>

### themeManager.setupSystemThemeListener()

Setup system theme change listener

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+setupStorageListener"></a>

### themeManager.setupStorageListener()

Setup storage change listener for cross-tab synchronization

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+handleSystemThemeChange"></a>

### themeManager.handleSystemThemeChange()

Handle system theme preference change

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+handleStorageChange"></a>

### themeManager.handleStorageChange()

Handle storage change for cross-tab synchronization

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+setTheme"></a>

### themeManager.setTheme()

Set theme

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+applyTheme"></a>

### themeManager.applyTheme()

Apply theme to the document

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+updateMetaThemeColor"></a>

### themeManager.updateMetaThemeColor()

Update meta theme-color for mobile browsers

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+getSystemTheme"></a>

### themeManager.getSystemTheme()

Get current system theme preference

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+getCurrentTheme"></a>

### themeManager.getCurrentTheme()

Get current theme

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+getEffectiveTheme"></a>

### themeManager.getEffectiveTheme()

Get effective theme (resolves 'system' to actual theme)

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+getAvailableThemes"></a>

### themeManager.getAvailableThemes()

Get available themes

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+toggleTheme"></a>

### themeManager.toggleTheme()

Toggle between themes

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+notifyThemeChange"></a>

### themeManager.notifyThemeChange()

Notify theme change to other components

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+getThemeDisplayName"></a>

### themeManager.getThemeDisplayName()

Get theme display name

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+getThemeIcon"></a>

### themeManager.getThemeIcon()

Get theme icon

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+getThemeColor"></a>

### themeManager.getThemeColor()

Get theme color

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+destroy"></a>

### themeManager.destroy()

Cleanup resources

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager"></a>

## ThemeManager

**Kind**: global class

- [ThemeManager](#ThemeManager)
    - [new ThemeManager()](#new_ThemeManager_new)
    - [new ThemeManager()](#new_ThemeManager_new)
    - [.init()](#ThemeManager+init)
    - [.loadThemePreference()](#ThemeManager+loadThemePreference)
    - [.saveThemePreference()](#ThemeManager+saveThemePreference)
    - [.setupSystemThemeListener()](#ThemeManager+setupSystemThemeListener)
    - [.setupStorageListener()](#ThemeManager+setupStorageListener)
    - [.handleSystemThemeChange()](#ThemeManager+handleSystemThemeChange)
    - [.handleStorageChange()](#ThemeManager+handleStorageChange)
    - [.setTheme()](#ThemeManager+setTheme)
    - [.applyTheme()](#ThemeManager+applyTheme)
    - [.updateMetaThemeColor()](#ThemeManager+updateMetaThemeColor)
    - [.getSystemTheme()](#ThemeManager+getSystemTheme)
    - [.getCurrentTheme()](#ThemeManager+getCurrentTheme)
    - [.getEffectiveTheme()](#ThemeManager+getEffectiveTheme)
    - [.getAvailableThemes()](#ThemeManager+getAvailableThemes)
    - [.toggleTheme()](#ThemeManager+toggleTheme)
    - [.notifyThemeChange()](#ThemeManager+notifyThemeChange)
    - [.getThemeDisplayName()](#ThemeManager+getThemeDisplayName)
    - [.getThemeIcon()](#ThemeManager+getThemeIcon)
    - [.getThemeColor()](#ThemeManager+getThemeColor)
    - [.destroy()](#ThemeManager+destroy)

<a name="new_ThemeManager_new"></a>

### new ThemeManager()

Manages application themes including light, dark, and system preference modes.
Handles theme persistence, system preference detection, and cross-tab synchronization.

**Example**

```js
const themeManager = new ThemeManager();
themeManager.setTheme('dark');
```

<a name="new_ThemeManager_new"></a>

### new ThemeManager()

Creates a new ThemeManager instance.
Initializes theme preferences and sets up system preference monitoring.

<a name="ThemeManager+init"></a>

### themeManager.init()

Initialize the theme manager

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+loadThemePreference"></a>

### themeManager.loadThemePreference()

Load theme preference from localStorage

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+saveThemePreference"></a>

### themeManager.saveThemePreference()

Save theme preference to localStorage

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+setupSystemThemeListener"></a>

### themeManager.setupSystemThemeListener()

Setup system theme change listener

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+setupStorageListener"></a>

### themeManager.setupStorageListener()

Setup storage change listener for cross-tab synchronization

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+handleSystemThemeChange"></a>

### themeManager.handleSystemThemeChange()

Handle system theme preference change

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+handleStorageChange"></a>

### themeManager.handleStorageChange()

Handle storage change for cross-tab synchronization

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+setTheme"></a>

### themeManager.setTheme()

Set theme

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+applyTheme"></a>

### themeManager.applyTheme()

Apply theme to the document

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+updateMetaThemeColor"></a>

### themeManager.updateMetaThemeColor()

Update meta theme-color for mobile browsers

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+getSystemTheme"></a>

### themeManager.getSystemTheme()

Get current system theme preference

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+getCurrentTheme"></a>

### themeManager.getCurrentTheme()

Get current theme

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+getEffectiveTheme"></a>

### themeManager.getEffectiveTheme()

Get effective theme (resolves 'system' to actual theme)

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+getAvailableThemes"></a>

### themeManager.getAvailableThemes()

Get available themes

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+toggleTheme"></a>

### themeManager.toggleTheme()

Toggle between themes

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+notifyThemeChange"></a>

### themeManager.notifyThemeChange()

Notify theme change to other components

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+getThemeDisplayName"></a>

### themeManager.getThemeDisplayName()

Get theme display name

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+getThemeIcon"></a>

### themeManager.getThemeIcon()

Get theme icon

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+getThemeColor"></a>

### themeManager.getThemeColor()

Get theme color

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeManager+destroy"></a>

### themeManager.destroy()

Cleanup resources

**Kind**: instance method of [<code>ThemeManager</code>](#ThemeManager)  
<a name="ThemeToggle"></a>

## ThemeToggle

**Kind**: global class

- [ThemeToggle](#ThemeToggle)
    - [new ThemeToggle()](#new_ThemeToggle_new)
    - [new ThemeToggle(themeManager)](#new_ThemeToggle_new)
    - [.init()](#ThemeToggle+init)
    - [.setupEventListeners()](#ThemeToggle+setupEventListeners)
    - [.handleToggleClick()](#ThemeToggle+handleToggleClick)
    - [.handleOptionClick()](#ThemeToggle+handleOptionClick)
    - [.handleDocumentClick()](#ThemeToggle+handleDocumentClick)
    - [.handleKeyDown()](#ThemeToggle+handleKeyDown)
    - [.handleThemeChange()](#ThemeToggle+handleThemeChange)
    - [.toggleDropdown()](#ThemeToggle+toggleDropdown)
    - [.openDropdown()](#ThemeToggle+openDropdown)
    - [.closeDropdown()](#ThemeToggle+closeDropdown)
    - [.focusFirstOption()](#ThemeToggle+focusFirstOption)
    - [.focusLastOption()](#ThemeToggle+focusLastOption)
    - [.focusNextOption()](#ThemeToggle+focusNextOption)
    - [.focusPreviousOption()](#ThemeToggle+focusPreviousOption)
    - [.updateToggleButton()](#ThemeToggle+updateToggleButton)
    - [.updateActiveOption()](#ThemeToggle+updateActiveOption)
    - [.destroy()](#ThemeToggle+destroy)

<a name="new_ThemeToggle_new"></a>

### new ThemeToggle()

UI component for theme selection with dropdown interface.
Provides user interface for switching between light, dark, and system themes.

**Example**

```js
const themeToggle = new ThemeToggle(themeManager);
```

<a name="new_ThemeToggle_new"></a>

### new ThemeToggle(themeManager)

Creates a new ThemeToggle instance.
Sets up the theme selection UI and connects it to the theme manager.

| Param        | Type                                       | Description                           |
| ------------ | ------------------------------------------ | ------------------------------------- |
| themeManager | [<code>ThemeManager</code>](#ThemeManager) | The theme manager instance to control |

<a name="ThemeToggle+init"></a>

### themeToggle.init()

Initialize the theme toggle component

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+setupEventListeners"></a>

### themeToggle.setupEventListeners()

Setup event listeners

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+handleToggleClick"></a>

### themeToggle.handleToggleClick()

Handle toggle button click

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+handleOptionClick"></a>

### themeToggle.handleOptionClick()

Handle option click

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+handleDocumentClick"></a>

### themeToggle.handleDocumentClick()

Handle document click (for closing dropdown)

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+handleKeyDown"></a>

### themeToggle.handleKeyDown()

Handle keyboard navigation

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+handleThemeChange"></a>

### themeToggle.handleThemeChange()

Handle theme change events

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+toggleDropdown"></a>

### themeToggle.toggleDropdown()

Toggle dropdown open/closed

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+openDropdown"></a>

### themeToggle.openDropdown()

Open dropdown

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+closeDropdown"></a>

### themeToggle.closeDropdown()

Close dropdown

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+focusFirstOption"></a>

### themeToggle.focusFirstOption()

Focus first option

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+focusLastOption"></a>

### themeToggle.focusLastOption()

Focus last option

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+focusNextOption"></a>

### themeToggle.focusNextOption()

Focus next option

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+focusPreviousOption"></a>

### themeToggle.focusPreviousOption()

Focus previous option

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+updateToggleButton"></a>

### themeToggle.updateToggleButton()

Update toggle button display

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+updateActiveOption"></a>

### themeToggle.updateActiveOption()

Update active option in dropdown

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+destroy"></a>

### themeToggle.destroy()

Cleanup resources

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle"></a>

## ThemeToggle

**Kind**: global class

- [ThemeToggle](#ThemeToggle)
    - [new ThemeToggle()](#new_ThemeToggle_new)
    - [new ThemeToggle(themeManager)](#new_ThemeToggle_new)
    - [.init()](#ThemeToggle+init)
    - [.setupEventListeners()](#ThemeToggle+setupEventListeners)
    - [.handleToggleClick()](#ThemeToggle+handleToggleClick)
    - [.handleOptionClick()](#ThemeToggle+handleOptionClick)
    - [.handleDocumentClick()](#ThemeToggle+handleDocumentClick)
    - [.handleKeyDown()](#ThemeToggle+handleKeyDown)
    - [.handleThemeChange()](#ThemeToggle+handleThemeChange)
    - [.toggleDropdown()](#ThemeToggle+toggleDropdown)
    - [.openDropdown()](#ThemeToggle+openDropdown)
    - [.closeDropdown()](#ThemeToggle+closeDropdown)
    - [.focusFirstOption()](#ThemeToggle+focusFirstOption)
    - [.focusLastOption()](#ThemeToggle+focusLastOption)
    - [.focusNextOption()](#ThemeToggle+focusNextOption)
    - [.focusPreviousOption()](#ThemeToggle+focusPreviousOption)
    - [.updateToggleButton()](#ThemeToggle+updateToggleButton)
    - [.updateActiveOption()](#ThemeToggle+updateActiveOption)
    - [.destroy()](#ThemeToggle+destroy)

<a name="new_ThemeToggle_new"></a>

### new ThemeToggle()

UI component for theme selection with dropdown interface.
Provides user interface for switching between light, dark, and system themes.

**Example**

```js
const themeToggle = new ThemeToggle(themeManager);
```

<a name="new_ThemeToggle_new"></a>

### new ThemeToggle(themeManager)

Creates a new ThemeToggle instance.
Sets up the theme selection UI and connects it to the theme manager.

| Param        | Type                                       | Description                           |
| ------------ | ------------------------------------------ | ------------------------------------- |
| themeManager | [<code>ThemeManager</code>](#ThemeManager) | The theme manager instance to control |

<a name="ThemeToggle+init"></a>

### themeToggle.init()

Initialize the theme toggle component

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+setupEventListeners"></a>

### themeToggle.setupEventListeners()

Setup event listeners

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+handleToggleClick"></a>

### themeToggle.handleToggleClick()

Handle toggle button click

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+handleOptionClick"></a>

### themeToggle.handleOptionClick()

Handle option click

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+handleDocumentClick"></a>

### themeToggle.handleDocumentClick()

Handle document click (for closing dropdown)

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+handleKeyDown"></a>

### themeToggle.handleKeyDown()

Handle keyboard navigation

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+handleThemeChange"></a>

### themeToggle.handleThemeChange()

Handle theme change events

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+toggleDropdown"></a>

### themeToggle.toggleDropdown()

Toggle dropdown open/closed

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+openDropdown"></a>

### themeToggle.openDropdown()

Open dropdown

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+closeDropdown"></a>

### themeToggle.closeDropdown()

Close dropdown

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+focusFirstOption"></a>

### themeToggle.focusFirstOption()

Focus first option

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+focusLastOption"></a>

### themeToggle.focusLastOption()

Focus last option

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+focusNextOption"></a>

### themeToggle.focusNextOption()

Focus next option

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+focusPreviousOption"></a>

### themeToggle.focusPreviousOption()

Focus previous option

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+updateToggleButton"></a>

### themeToggle.updateToggleButton()

Update toggle button display

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+updateActiveOption"></a>

### themeToggle.updateActiveOption()

Update active option in dropdown

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="ThemeToggle+destroy"></a>

### themeToggle.destroy()

Cleanup resources

**Kind**: instance method of [<code>ThemeToggle</code>](#ThemeToggle)  
<a name="LOG_LEVELS"></a>

## LOG_LEVELS

Logging levels in order of severity

**Kind**: global constant  
<a name="logger"></a>

## logger

Default logger instance

**Kind**: global constant  
<a name="loggers"></a>

## loggers

Create category-specific loggers

**Kind**: global constant  
<a name="CHORD_PROGRESSIONS"></a>

## CHORD_PROGRESSIONS

Chord Progressions for Major and Minor Modes

All progressions are defined using Roman numeral analysis:

- Uppercase (I, IV, V) = Major chords
- Lowercase (ii, iii, vi) = Minor chords
- Lowercase with ° (vii°) = Diminished chords

All chords in each progression are diatonic to the key (with noted exceptions in minor mode).
When played, roman numerals are converted to actual chord roots based on the current key,
ensuring the progression stays in the same key throughout all iterations and loops.

**Kind**: global constant

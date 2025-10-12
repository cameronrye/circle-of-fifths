# Percussion and Looping Features Documentation

## Overview

The Circle of Fifths application includes percussion/drum track and continuous looping features that enhance the musical experience by providing rhythmic accompaniment and extended practice sessions.

## Features

### 1. Percussion Track System

A rhythmic percussion pattern system that plays synchronized with chord progressions.

#### Sound Generation

- **Kick Drum**: Low-frequency oscillator with pitch envelope (150Hz → 40Hz)
  - Deep, punchy sound on beat 1
  - Uses oscillator with frequency sweep for realistic kick
- **Snare Drum**: White noise with bandpass filter (1000Hz center frequency)
  - Crisp, snappy sound on beat 3
  - Uses noise buffer with tight envelope
- **Hi-Hat**: High-frequency noise with highpass filter (7000Hz cutoff)
  - Bright, short sound 4 times per chord
  - Uses noise buffer with very short decay

#### Rhythm Pattern

For each chord (1.0 second duration):
- **Kick**: Plays on beat 1 (start of chord)
- **Hi-Hat**: Plays 4 times per chord (every 0.25 seconds)
- **Snare**: Plays on beat 3 (halfway through chord at 0.5 seconds)

This creates a basic "boom-chick-boom-chick" pattern that provides a steady rhythmic foundation.

#### Volume Control

- Default percussion volume: 0.4
- Configurable via settings
- Balanced with chords and bass

### 2. Percussion Toggle Control

#### UI Element

- **Button Label**: "Percussion"
- **Icon**: 🥁 (drum emoji)
- **Location**: Audio controls section
- **Default State**: Enabled (can be changed to disabled)
- **Visual Feedback**: Button highlights when active (aria-pressed attribute)

#### Functionality

- **When enabled**: Percussion starts immediately if a progression is playing, or starts with the next progression
- **When disabled**: Percussion stops immediately without interrupting chord playback
- **State persistence**: Percussion setting persists across progression plays
- **Toggle during playback**: Can be enabled/disabled while music is playing

### 3. Continuous Looping Feature

Chord progressions can loop continuously for extended practice sessions.

#### Looping Behavior

- When enabled, progressions automatically restart after completion
- Seamless transition from last chord back to first chord
- Maintains smooth voice leading across loop boundaries
- Percussion continues seamlessly through loop transitions
- No gaps or interruptions at loop point

#### Implementation

- Uses recursive scheduling approach with setTimeout
- Schedules next iteration ~100ms before current iteration ends
- Maintains previousVoicing state across iterations for smooth voice leading
- Loop timeout is stored and can be cancelled when stopping
- Clean cancellation when stopped

### 4. Loop Toggle Control

#### UI Element

- **Button Label**: "Loop"
- **Icon**: 🔁 (loop emoji)
- **Location**: Audio controls section
- **Default State**: Enabled (can be changed to disabled)
- **Visual Feedback**: Button highlights when active (aria-pressed attribute)

#### Functionality

- **When enabled**: Progressions automatically restart after completion
- **When disabled**: Progressions play once and stop
- **Toggle during playback**: Can be enabled/disabled while music is playing
- **Clean stopping**: Loop can be stopped cleanly between iterations

## User Interface

### Toggle Button States

Both percussion and loop buttons use consistent toggle button styling:

- **Active (aria-pressed="true")**: Green background (success color), white text, elevated shadow
- **Inactive (aria-pressed="false")**: Default button styling
- **Hover**: Appropriate hover effect for both states

### Default States

Current configuration:
- **Percussion**: Enabled by default
- **Loop**: Enabled by default

Both buttons display with green highlighting to indicate active state on page load.

## Integration & User Experience

### Combined Functionality

- Percussion and loop features work together seamlessly
- Both can be enabled/disabled independently
- Settings persist during playback
- No conflicts between features

### Stop Button Behavior

- Stops both chord progression AND percussion simultaneously
- Cancels any scheduled loop iterations
- Resets all playback state
- Clean audio cleanup

### Visual Feedback

- Toggle buttons use aria-pressed attribute for accessibility
- Active state shown with success color (green)
- Clear visual distinction between enabled/disabled states
- Consistent with overall UI design

## Technical Implementation

### Files Modified

#### 1. js/audioEngine.js

**Settings Added:**
```javascript
// Percussion settings
percussionEnabled: false,
percussionVolume: 0.4

// Looping state
loopState: {
    isLooping: false,
    currentKey: null,
    currentMode: null,
    currentProgression: null,
    previousVoicing: null,
    loopTimeout: null
}
```

**New Methods:**
- `createKickDrum(startTime)` - Creates kick drum sound
- `createSnareDrum(startTime)` - Creates snare drum sound
- `createHiHat(startTime)` - Creates hi-hat sound
- `playPercussionPattern(startTime, duration)` - Plays percussion pattern for one chord
- `playProgressionLoop(key, mode, progression, previousVoicing)` - Handles continuous looping
- `setPercussionEnabled(enabled)` - Enable/disable percussion
- `setLoopingEnabled(enabled)` - Enable/disable looping
- `isPercussionEnabled()` - Check percussion state
- `isLoopingEnabled()` - Check looping state

**Modified Methods:**
- `playProgression()` - Now supports looping and returns voicing data
- `stopAll()` - Clears loop timeouts

#### 2. index.html

**UI Buttons Added:**
```html
<!-- Percussion Toggle Button -->
<button id="toggle-percussion" class="audio-btn toggle-btn" 
        aria-label="Toggle percussion" aria-pressed="true">
    <span class="btn-icon">🥁</span>
    Percussion
</button>

<!-- Loop Toggle Button -->
<button id="toggle-loop" class="audio-btn toggle-btn" 
        aria-label="Toggle loop" aria-pressed="true">
    <span class="btn-icon">🔁</span>
    Loop
</button>
```

#### 3. js/interactions.js

**State Tracking:**
```javascript
this.playbackState = {
    scale: false,
    chord: false,
    progression: false,
    percussion: true,  // Default enabled
    loop: true         // Default enabled
};
```

**New Methods:**
- `togglePercussion()` - Toggle percussion on/off
- `toggleLoop()` - Toggle loop on/off
- `updateToggleButtonState(type, isActive)` - Update button visual state
- `initializeDefaultToggleStates()` - Initialize default states on load

**Event Handlers:**
- Percussion button click handler
- Loop button click handler

#### 4. css/styles.css

**Toggle Button Styling:**
```css
.audio-btn.toggle-btn[aria-pressed='true'] {
    background: var(--success-color);
    color: white;
    border-color: var(--success-color);
    box-shadow: var(--shadow-md);
}
```

## Testing

### Quick Start

1. Start the development server: `npm run dev`
2. Open http://127.0.0.1:8000
3. Click any key in the circle
4. Percussion and Loop should be enabled by default
5. Play a chord progression

### Test Scenarios

#### Percussion Tests

1. **Basic Percussion Toggle** - Verify percussion can be enabled/disabled
2. **Percussion Toggle During Playback** - Toggle while music is playing
3. **Percussion with Different Progressions** - Test all progressions
4. **Percussion Timing** - Verify synchronization with chords
5. **Percussion Volume** - Check balance with chords and bass

#### Looping Tests

1. **Basic Looping** - Verify progressions loop continuously
2. **Stopping a Loop** - Clean stop behavior
3. **Disabling Loop During Playback** - Current iteration finishes, then stops
4. **Loop Voice Leading** - Smooth transitions at loop boundary
5. **Long-Running Loop** - No audio drift or memory leaks

#### Combined Tests

1. **Percussion + Loop Together** - Both features work seamlessly
2. **Stop All with Both Features** - Clean stop of all audio
3. **Different Keys and Modes** - Consistent behavior across all keys
4. **Multiple Progressions** - Switching progressions while looping
5. **Volume Control** - Both features respond to master volume

### Expected Results

#### Percussion
- ✅ Kick drum: Deep, punchy sound on beat 1
- ✅ Snare drum: Crisp, snappy sound on beat 3
- ✅ Hi-hat: Bright, short sound 4 times per chord
- ✅ Perfect synchronization with chords
- ✅ Clean start/stop behavior

#### Looping
- ✅ Seamless loop transitions
- ✅ Smooth voice leading across loop boundary
- ✅ No gaps or clicks at loop point
- ✅ Clean cancellation when stopped
- ✅ Works with all progressions

#### UI/UX
- ✅ Clear visual feedback for all states
- ✅ Intuitive button behavior
- ✅ Responsive to user input
- ✅ No lag or delays
- ✅ Accessible to all users

## Troubleshooting

### No Sound
- Check browser audio permissions
- Check volume slider is not at 0
- Check system volume
- Try clicking on the page first (browser autoplay policy)

### Percussion Not Playing
- Verify percussion button is highlighted (active)
- Check that a progression is playing
- Try toggling percussion off and on again

### Loop Not Working
- Verify loop button is highlighted (active)
- Check that progression completes at least once
- Try disabling and re-enabling loop

### Console Errors
- Open browser DevTools (F12)
- Check Console tab for errors
- Report any errors found

## Performance

- Uses existing node pool system for efficient resource management
- Proper cleanup of audio nodes after playback
- Minimal CPU overhead
- No memory leaks (proper event listener cleanup)
- Smooth performance on all tested systems

## Accessibility

- ARIA labels on toggle buttons
- Screen reader announcements when toggled
- Keyboard accessible (can be toggled with Enter/Space)
- Visual feedback for enabled/disabled states
- Proper toggle button semantics with aria-pressed

## Browser Compatibility

Test in multiple browsers:
- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Success Criteria

All features should:
- ✅ Work reliably and consistently
- ✅ Provide clear visual feedback
- ✅ Be accessible via keyboard and screen readers
- ✅ Perform well without lag or glitches
- ✅ Integrate seamlessly with existing features
- ✅ Handle edge cases gracefully


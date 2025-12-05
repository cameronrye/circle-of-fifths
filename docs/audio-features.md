# Audio Features Documentation

## Overview

The Circle of Fifths application includes percussion, bass track, and continuous looping features that enhance the musical experience by providing rhythmic accompaniment and extended practice sessions.

## Percussion System

### Sound Generation

- **Kick Drum**: Low-frequency oscillator with pitch envelope (150Hz to 40Hz)
    - Deep, punchy sound on beat 1
    - Uses oscillator with frequency sweep for realistic kick
- **Snare Drum**: White noise with bandpass filter (1000Hz center frequency)
    - Crisp, snappy sound on beat 3
    - Uses noise buffer with tight envelope
- **Hi-Hat**: High-frequency noise with highpass filter (7000Hz cutoff)
    - Bright, short sound 4 times per chord
    - Uses noise buffer with very short decay

### Rhythm Pattern

For each chord (1.0 second duration):

- **Kick**: Plays on beat 1 (start of chord)
- **Hi-Hat**: Plays 4 times per chord (every 0.25 seconds)
- **Snare**: Plays on beat 3 (halfway through chord at 0.5 seconds)

This creates a basic "boom-chick-boom-chick" pattern that provides a steady rhythmic foundation.

## Bass Track System

### Sound Generation

- **Dual Oscillator System**: Combines sine and triangle waves for warmth and presence
    - Main Oscillator (70%): Sine wave for warm, round bass tone
    - Harmonic Oscillator (30%): Triangle wave for definition and audibility
- **Frequency Range**: Octave 2 (65-130 Hz) for optimal audibility on most speakers
- **Filtering**: Low-pass filter at 1500Hz with resonance (Q=1.5) for character
- **ADSR Envelope**: Punchy attack with sustained tone
    - Attack: 5ms (fast, punchy)
    - Decay: 80ms (quick)
    - Sustain: 85% of bass volume
    - Release: 150ms (tight)

### Musical Pattern

- **Rhythm**: Root note on beats 1 and 3 for walking bass feel
- **Note Duration**: 70% of chord duration (sustained but articulated)
- **Root Note Extraction**: Automatically follows chord roots
- **Diatonic Integrity**: Bass notes stay within the key

## Continuous Looping

### Looping Behavior

- When enabled, progressions automatically restart after completion
- Seamless transition from last chord back to first chord
- Maintains smooth voice leading across loop boundaries
- Percussion and bass continue seamlessly through loop transitions
- No gaps or interruptions at loop point

### Implementation

- Uses recursive scheduling approach with setTimeout
- Schedules next iteration ~100ms before current iteration ends
- Maintains previousVoicing state across iterations for smooth voice leading
- Loop timeout is stored and can be cancelled when stopping

## User Interface

### Toggle Buttons

All audio feature buttons use consistent toggle button styling:

| Feature    | Icon        | Default State |
| ---------- | ----------- | ------------- |
| Percussion | Drum        | Enabled       |
| Loop       | Loop symbol | Enabled       |
| Bass       | Guitar      | Disabled      |

**Button States:**

- **Active (aria-pressed="true")**: Green background (success color), white text, elevated shadow
- **Inactive (aria-pressed="false")**: Default button styling

### Usage

1. Click any toggle button to enable/disable the feature
2. Features work independently and can be combined
3. Can be toggled on/off during playback
4. Stop button stops all audio and cancels scheduled loops

## Technical Implementation

### Audio Engine Settings

```javascript
// Percussion settings
percussionEnabled: true,
percussionVolume: 0.4

// Bass settings
bassEnabled: false,
bassVolume: 1.2,
bassOctave: 2

// Looping state
loopState: {
    isLooping: true,
    currentKey: null,
    currentMode: null,
    currentProgression: null,
    previousVoicing: null,
    loopTimeout: null
}
```

### Key Methods

**Percussion:**

- `createKickDrum(startTime)` - Creates kick drum sound
- `createSnareDrum(startTime)` - Creates snare drum sound
- `createHiHat(startTime)` - Creates hi-hat sound
- `playPercussionPattern(startTime, duration)` - Plays percussion pattern for one chord

**Bass:**

- `createBassNote(note, octave, startTime, duration)` - Creates bass oscillator with envelope
- `playBassPattern(chordRoot, startTime, duration)` - Plays bass line for one chord
- `setBassEnabled(enabled)` - Enable/disable bass track

**Looping:**

- `playProgressionLoop(key, mode, progression)` - Handles continuous looping
- `setLoopingEnabled(enabled)` - Enable/disable looping

### Files

- **js/audioEngine.js** - Sound generation and pattern playback
- **index.html** - Toggle button UI elements
- **js/interactions.js** - Toggle control and state management
- **css/styles.css** - Toggle button styling

## Testing

### Test Scenarios

1. **Basic Toggle** - Verify each feature can be enabled/disabled
2. **Toggle During Playback** - Toggle while music is playing
3. **Combined Features** - Test all features working together
4. **Different Keys/Modes** - Test in all 12 keys, major and minor
5. **Loop Transitions** - Verify seamless looping with voice leading
6. **Volume Balance** - Check appropriate mix levels between features

## Troubleshooting

### No Sound

- Check browser audio permissions
- Check volume slider is not at 0
- Try clicking on the page first (browser autoplay policy)

### Feature Not Working

- Verify the toggle button is highlighted (active)
- Try toggling off and on again
- Refresh the page

## Performance

- Uses existing node pool system for efficient resource management
- Proper cleanup of audio nodes after playback
- Minimal CPU overhead
- No memory leaks (proper event listener cleanup)

## Accessibility

- ARIA labels on toggle buttons
- Screen reader announcements when toggled
- Keyboard accessible (Enter/Space to toggle)
- Visual feedback for enabled/disabled states

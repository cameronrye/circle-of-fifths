# Bass Track Feature Documentation

## Overview

The Circle of Fifths application includes a bass track feature that plays alongside chord progressions, providing a solid rhythmic and harmonic foundation. The bass track has been optimized for audibility and musical quality across all playback systems.

## Features

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
  - Peak volume: 120% of bass volume for extra punch

### Musical Pattern

- **Rhythm**: Root note on beats 1 and 3 for walking bass feel
- **Note Duration**: 70% of chord duration (sustained but articulated)
- **Root Note Extraction**: Automatically follows chord roots
- **Diatonic Integrity**: Bass notes stay within the key
- **Voice Leading**: Complements chord voicing

### Volume and Mix

- **Default Volume**: 1.2 (120% of standard)
- **Peak Attack**: 1.44 (120% × 1.2)
- **Sustain Level**: 1.02 (85% × 1.2)
- **Mix Balance**: Designed to complement chords and percussion without overpowering

## User Interface

### Bass Toggle Button

- **Icon**: 🎸 (guitar emoji)
- **Location**: Audio controls section
- **Default State**: Disabled (user must enable)
- **Visual Feedback**: Highlights when active
- **Accessibility**: Full ARIA support with screen reader announcements

### Usage

1. Click the "Bass" button (🎸) to enable/disable
2. Bass plays automatically when enabled during chord progressions
3. Works independently of percussion and loop settings
4. Can be toggled on/off during playback

## Technical Implementation

### Audio Signal Chain

```
Main Oscillator (Sine, 70%) ──┐
                               ├──> Low-Pass Filter (1500Hz, Q=1.5) ──> Master Gain ──> Output
Harmonic Oscillator (Triangle, 30%) ──┘
```

### Settings (audioEngine.js)

```javascript
bassEnabled: false,
bassVolume: 1.2,  // Increased for audibility
bassOctave: 2     // Optimal frequency range
```

### Key Methods

- `createBassNote(note, octave, startTime, duration)` - Creates bass oscillator with envelope and filtering
- `playBassPattern(chordRoot, startTime, duration)` - Plays bass line for one chord
- `setBassEnabled(enabled)` - Enable/disable bass track
- `isBassEnabled()` - Check bass state

### Files Modified

1. **js/audioEngine.js** - Bass sound generation and pattern playback
2. **index.html** - Bass toggle button UI
3. **js/interactions.js** - Bass toggle control and state management

## Improvements Made

### Version History

**Initial Implementation:**
- Volume: 0.5
- Octave: 1 (32-65 Hz)
- Single sine oscillator
- Filter: 800Hz low-pass
- Note duration: 40% of chord
- **Result**: Too quiet, hard to hear on most systems

**Current Implementation:**
- Volume: 1.2 (+140%)
- Octave: 2 (65-130 Hz, +1 octave)
- Dual oscillator (sine + triangle)
- Filter: 1500Hz low-pass with resonance
- Note duration: 70% of chord (+75%)
- **Result**: Clear, punchy, audible on all systems ✅

### Key Improvements

1. **Increased Bass Volume** - 140% increase for better presence
2. **Raised Bass Octave** - One octave higher for better audibility on typical speakers
3. **Added Harmonic Oscillator** - Triangle wave adds harmonics for definition
4. **Improved Filter Settings** - Higher cutoff frequency with resonance for brightness
5. **Enhanced Envelope** - Faster attack, higher sustain for punch and presence
6. **Longer Note Duration** - 75% longer notes for better low-end fill

## Testing

### Quick Test

1. Start the dev server: `npm run dev`
2. Open http://127.0.0.1:8000
3. Click any key in the circle
4. Enable the **Bass** button (🎸)
5. Play a chord progression
6. Bass should be clearly audible!

### Comprehensive Testing

#### Volume Test
- Bass should be clearly audible at normal listening levels
- Should not overpower the chords
- Should be balanced with percussion

#### Frequency Test
- Test on laptop speakers (should be audible)
- Test on headphones (should be clear and punchy)
- Test on phone speakers (should be present)

#### Musical Test
- Bass should sound warm and musical
- Should have good definition (not muddy)
- Should have punch on the attack
- Should sustain nicely through the chord

#### Integration Test
- Enable bass + percussion
- Bass and kick should complement each other
- Overall mix should sound full and balanced
- No frequency masking or conflicts

### Test Scenarios

1. **Basic Bass Toggle** - Verify bass can be enabled and disabled
2. **Bass Toggle During Playback** - Toggle while music is playing
3. **Bass with Different Progressions** - Test all chord progressions
4. **Bass with Different Keys** - Test in all 12 keys
5. **Bass with Major and Minor Modes** - Verify both modes work
6. **Bass with Percussion** - Test synchronization
7. **Bass with Loop** - Test seamless looping
8. **Bass Volume Balance** - Verify appropriate mix levels

### Expected Results

- ✅ Warm, round tone from sine wave
- ✅ Definition and presence from triangle wave harmonics
- ✅ Good attack and punch
- ✅ Sustained notes fill out the low end
- ✅ Rhythmic pattern (beats 1 and 3) is clear
- ✅ Bass complements chords without masking them
- ✅ Bass and kick drum work well together
- ✅ Overall mix sounds fuller and more professional

## Troubleshooting

### No Bass Sound
- Check Bass button is highlighted (active)
- Check master volume is not at 0
- Check system volume
- Try toggling bass off and on
- Check browser audio permissions

### Bass Too Quiet
- Increase master volume slider
- Check system volume
- Try headphones instead of laptop speakers
- Ensure bass button is highlighted (enabled)

### Bass Too Loud
- Decrease master volume slider
- Bass volume can be adjusted in settings if needed

### Bass Out of Sync
- Refresh the page
- Try disabling and re-enabling bass
- Check browser performance
- Close other tabs/applications

## Performance

- Minimal additional CPU usage (one extra oscillator per bass note)
- No memory leaks (proper cleanup maintained)
- No timing issues
- Smooth performance on all tested systems

## Accessibility

- ARIA labels on bass toggle button
- Screen reader announcements when bass is toggled
- Keyboard accessible (can be toggled with Enter/Space)
- Visual feedback for enabled/disabled states

## Compatibility

- Works with all existing features (percussion, loop, progressions)
- Compatible with all audio settings (waveform, reverb, etc.)
- No conflicts with existing audio engine functionality
- Follows same patterns as percussion for consistency

## Future Enhancements (Optional)

If further improvements are needed:

1. Add bass volume slider in advanced settings
2. Add bass octave selector (octave 1/2/3)
3. Add bass tone control (more/less harmonics)
4. Add different bass patterns (walking bass, syncopated, etc.)
5. Add compression to bass for more consistent volume
6. Add fifth note on beat 3 for more complex walking bass
7. Add bass pattern variations based on chord quality

## Developer Reference

### For Developers

```javascript
// Enable bass
audioEngine.setBassEnabled(true);

// Check if bass is enabled
const isEnabled = audioEngine.isBassEnabled();

// Bass plays automatically in playProgression()
audioEngine.playProgression('C', 'major', 'I-V-vi-IV');
```

### Code Location

- **Implementation**: `js/audioEngine.js` (lines 145-153, 1728-1826)
- **UI**: `index.html` (lines 209-217)
- **Controls**: `js/interactions.js` (lines 39, 66, 555-559, 1108-1118)


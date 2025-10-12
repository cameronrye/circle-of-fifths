# Chord Progressions Documentation

## Overview

The Circle of Fifths application includes a comprehensive set of chord progressions for both major and minor modes. All progressions follow sound music theory principles and feature optimized voice leading for smooth melodic movement.

## Music Theory Validation

### Key Consistency

All chord progressions maintain the same key throughout all loop iterations. The code architecture ensures this through:

```javascript
// In playProgressionLoop (audioEngine.js):
this.loopState.currentKey = key; // Locked for all iterations
this.loopState.currentMode = mode; // Locked for all iterations

// Each iteration uses the same key:
this.playProgression(
    this.loopState.currentKey, // Never changes
    this.loopState.currentMode, // Never changes
    this.loopState.currentProgression,
    this.loopState.previousVoicing
);
```

### Roman Numeral Analysis

- **Uppercase** (I, IV, V) = Major chords
- **Lowercase** (ii, iii, vi) = Minor chords
- **Lowercase with °** (vii°) = Diminished chords

All progressions use correct Roman numeral notation based on scale degrees.

## Major Mode Progressions

### 1. I-V-vi-IV (Pop Progression)

**Example in C Major:** C - G - Am - F

**Characteristics:**
- Most popular progression in modern pop music
- Strong harmonic motion with circle of fifths elements
- Smooth voice leading with multiple common tones
- Works well for upbeat, positive songs

**Music Theory:**
- I (C): Tonic - home, stable
- V (G): Dominant - tension, wants to resolve
- vi (Am): Submediant - relative minor, adds color
- IV (F): Subdominant - pre-dominant function

**Loop Transition:** F → C (smooth, common tone C)

**Voice Leading:**
- C → G: Common tone G
- G → Am: Common tone G, smooth movement
- Am → F: Common tone C
- F → C: Common tone C (perfect loop)

### 2. ii-V-I (Jazz Progression)

**Example in C Major:** Dm - G - C

**Characteristics:**
- Classic jazz cadence
- Strong functional harmony
- Excellent voice leading
- Foundation of jazz improvisation

**Music Theory:**
- ii (Dm): Supertonic - pre-dominant function
- V (G): Dominant - creates tension
- I (C): Tonic - resolution

**Loop Transition:** C → Dm (smooth, 5 semitone movement)

**Voice Leading:**
- Dm → G: Common tone D, total movement ~4 semitones
- G → C: Common tone G, total movement ~4 semitones
- C → Dm (loop): No common tones, total movement ~5 semitones

**Verified in Multiple Keys:**
- C major: Dm - G - C ✓
- G major: Am - D - G ✓
- D major: Em - A - D ✓
- F major: Gm - C - F ✓
- Bb major: Cm - F - Bb ✓
- Eb major: Fm - Bb - Eb ✓

### 3. vi-IV-I-V (Circle Progression)

**Example in C Major:** Am - F - C - G

**Characteristics:**
- Follows circle of fifths backwards
- Strong harmonic motion
- Popular in rock and pop
- Smooth voice leading

**Music Theory:**
- vi (Am): Relative minor
- IV (F): Subdominant
- I (C): Tonic
- V (G): Dominant

**Loop Transition:** G → Am (smooth, 2 semitone movement)

### 4. I-vi-ii-V (Doo-Wop Progression)

**Example in C Major:** C - Am - Dm - G

**Characteristics:**
- Classic 1950s progression
- Smooth stepwise motion
- Excellent voice leading
- Nostalgic, vintage sound

**Music Theory:**
- I (C): Tonic
- vi (Am): Relative minor
- ii (Dm): Supertonic
- V (G): Dominant

**Loop Transition:** G → C (perfect, common tone G)

### 5. I-IV-V-I (Basic Cadence)

**Example in C Major:** C - F - G - C

**Characteristics:**
- Fundamental progression
- Perfect cadence (V-I)
- Simple and effective
- Foundation of Western harmony

**Music Theory:**
- I (C): Tonic
- IV (F): Subdominant
- V (G): Dominant
- I (C): Tonic (resolution)

**Loop Transition:** C → C (identical, perfect loop)

## Minor Mode Progressions

### 1. i-VII-VI-VII (Minor Pop)

**Example in A Minor:** Am - G - F - G

**Characteristics:**
- Popular in modern music
- Uses natural minor scale
- Smooth voice leading
- Melancholic but accessible

**Music Theory:**
- i (Am): Tonic minor
- VII (G): Subtonic (natural minor)
- VI (F): Submediant
- VII (G): Subtonic (creates motion)

**Loop Transition:** G → Am (smooth, 2 semitone movement)

### 2. i-iv-V-i (Minor Cadence)

**Example in A Minor:** Am - Dm - E - Am

**Characteristics:**
- Classic minor cadence
- Uses harmonic minor for V chord
- Strong resolution
- Traditional sound

**Music Theory:**
- i (Am): Tonic minor
- iv (Dm): Subdominant minor
- V (E): Dominant major (uses G# from harmonic minor)
- i (Am): Tonic minor (resolution)

**Note:** The V chord (E major) uses G# from the harmonic minor scale. This is correct music theory - the raised leading tone is standard practice for dominant chords in minor keys.

**Loop Transition:** Am → Am (identical, perfect loop)

### 3. i-VI-III-VII (Andalusian Cadence)

**Example in A Minor:** Am - F - C - G

**Characteristics:**
- Spanish/Flamenco character
- Descending bass line
- Exotic, dramatic sound
- Popular in rock and metal

**Music Theory:**
- i (Am): Tonic minor
- VI (F): Submediant
- III (C): Mediant
- VII (G): Subtonic

**Loop Transition:** G → Am (smooth, 2 semitone movement)

### 4. i-v-iv-i (Natural Minor)

**Example in A Minor:** Am - Em - Dm - Am

**Characteristics:**
- Pure natural minor sound
- All natural minor chords
- Smooth voice leading
- Dark, modal character

**Music Theory:**
- i (Am): Tonic minor
- v (Em): Dominant minor (natural minor)
- iv (Dm): Subdominant minor
- i (Am): Tonic minor

**Loop Transition:** Am → Am (identical, perfect loop)

## Voice Leading Optimization

The application uses sophisticated voice leading optimization to create smooth, singable progressions.

### Algorithm Features

1. **Multiple Voicing Candidates**: Generates inversions and octave placements
2. **Scoring System**: Evaluates based on:
   - Total voice movement (40% weight)
   - Top voice smoothness (40% weight)
   - Maximum leap penalty (20% weight)
   - Range preference (comfortable vocal range)
   - Spacing optimization
3. **Loop Continuity**: Preserves final voicing and uses it for the next iteration

### Voice Leading Principles Applied

✅ Minimal voice movement
✅ Common tone retention
✅ Stepwise motion preferred
✅ Smooth top voice (melody)
✅ Comfortable range (C3-C5)
✅ Proper spacing in upper voices

## Implementation Details

### Code Location

**Progression Definitions:** `js/musicTheory.js`

```javascript
CHORD_PROGRESSIONS: {
    major: {
        'I-V-vi-IV': ['I', 'V', 'vi', 'IV'],
        'ii-V-I': ['ii', 'V', 'I'],
        'vi-IV-I-V': ['vi', 'IV', 'I', 'V'],
        'I-vi-ii-V': ['I', 'vi', 'ii', 'V'],
        'I-IV-V-I': ['I', 'IV', 'V', 'I']
    },
    minor: {
        'i-VII-VI-VII': ['i', 'VII', 'VI', 'VII'],
        'i-iv-V-i': ['i', 'iv', 'V', 'i'],
        'i-VI-III-VII': ['i', 'VI', 'III', 'VII'],
        'i-v-iv-i': ['i', 'v', 'iv', 'i']
    }
}
```

**Key Methods:**

- `romanToChord(romanNumeral, key, mode)` - Converts roman numerals to chord roots
- `getChordNotes(root, quality)` - Generates chord notes
- `optimizeChordVoicing(notes, previousVoicing, numVoices)` - Optimizes voice leading
- `playProgression(key, mode, progression)` - Plays chord progression

## Testing and Validation

### Validation Results

✅ All chord progressions are musically valid
✅ Roman numeral analysis is correct
✅ Voice leading optimization is sophisticated and effective
✅ Loop transitions are handled with voice leading continuity
✅ Progressions do NOT change keys when looping

### Diatonic Integrity

All progressions use notes from the appropriate scale:
- Major progressions: Major scale
- Minor progressions: Natural minor scale (with harmonic minor for V chords where appropriate)

### Cross-Key Verification

All progressions have been verified to work correctly in all 12 keys, maintaining proper:
- Key signatures
- Chord qualities
- Voice leading
- Loop transitions

## Common Questions

### Does the ii-V-I progression change keys when looping?

**No.** The progression maintains the same key throughout all loop iterations. The perceived "key change" some users experience is due to:

1. **Perceptual factors**: The progression ends on I (tonic) and restarts on ii (supertonic), which can sound like a shift even though it's in the same key
2. **Voice leading choices**: Specific inversions might emphasize different chord tones
3. **Octave displacement**: Voice leading optimization might place chords in different octaves

The code explicitly locks the key and mode for all iterations, and all chords remain diatonic to the original key.

### Why does the i-iv-V-i progression use a major V chord?

This is correct music theory. In minor keys, the V chord is typically major (using the raised 7th from harmonic minor) to create a stronger resolution to the tonic. This is standard practice in classical, jazz, and popular music.

## Future Enhancements

Potential improvements:
1. Add more progressions (blues, modal, extended jazz)
2. Add chord extensions (7ths, 9ths, etc.)
3. Add progression variations and substitutions
4. Add visual/audio feedback to reinforce key center
5. Add user controls for voicing preferences
6. Add educational mode with roman numeral display during playback


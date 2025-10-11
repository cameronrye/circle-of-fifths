# Music Theory Guide for Large Language Models

## Table of Contents
1. [Foundational Concepts](#foundational-concepts)
2. [Mathematical Foundations](#mathematical-foundations)
3. [Scale Theory](#scale-theory)
4. [Key Signatures and Circle of Fifths](#key-signatures-and-circle-of-fifths)
5. [Chord Theory](#chord-theory)
6. [Harmonic Analysis](#harmonic-analysis)
7. [Data Structures](#data-structures)
8. [Algorithms](#algorithms)
9. [Practical Applications](#practical-applications)
10. [Reference Tables](#reference-tables)

---

## Foundational Concepts

### The Chromatic Scale
The chromatic scale contains 12 unique pitch classes, repeating every octave:
```javascript
const CHROMATIC_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const CHROMATIC_SCALE_FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
```

### Enharmonic Equivalents
Notes that sound the same but are spelled differently:
```javascript
const ENHARMONIC_EQUIVALENTS = {
  'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb',
  'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
};

function getEnharmonic(note) {
  return ENHARMONIC_EQUIVALENTS[note] || note;
}
```

### Intervals
Intervals are the distance between two notes, measured in semitones:
```javascript
const INTERVALS = {
  'unison': 0, 'minor2nd': 1, 'major2nd': 2, 'minor3rd': 3,
  'major3rd': 4, 'perfect4th': 5, 'tritone': 6, 'perfect5th': 7,
  'minor6th': 8, 'major6th': 9, 'minor7th': 10, 'major7th': 11, 'octave': 12
};

function calculateInterval(note1, note2) {
  const index1 = CHROMATIC_SCALE.indexOf(note1);
  const index2 = CHROMATIC_SCALE.indexOf(note2);
  return (index2 - index1 + 12) % 12;
}
```

---

## Mathematical Foundations

### Frequency Calculations
The relationship between notes and frequencies follows the equal temperament system:
```javascript
// A4 = 440 Hz is the standard reference
const A4_FREQUENCY = 440;
const A4_MIDI_NUMBER = 69;

function midiToFrequency(midiNumber) {
  return A4_FREQUENCY * Math.pow(2, (midiNumber - A4_MIDI_NUMBER) / 12);
}

function frequencyToMidi(frequency) {
  return Math.round(A4_MIDI_NUMBER + 12 * Math.log2(frequency / A4_FREQUENCY));
}

function noteToMidi(note, octave) {
  const noteIndex = CHROMATIC_SCALE.indexOf(note);
  if (noteIndex === -1) throw new Error(`Invalid note: ${note}`);
  return (octave + 1) * 12 + noteIndex;
}
```

### Cent Calculations
Cents provide precise pitch measurements (100 cents = 1 semitone):
```javascript
function frequencyToCents(freq1, freq2) {
  return 1200 * Math.log2(freq2 / freq1);
}

function centsToFrequencyRatio(cents) {
  return Math.pow(2, cents / 1200);
}
```

---

## Scale Theory

### Scale Construction Patterns
Scales are built using specific interval patterns:
```javascript
const SCALE_PATTERNS = {
  major: [2, 2, 1, 2, 2, 2, 1],           // W-W-H-W-W-W-H
  naturalMinor: [2, 1, 2, 2, 1, 2, 2],    // W-H-W-W-H-W-W
  harmonicMinor: [2, 1, 2, 2, 1, 3, 1],   // W-H-W-W-H-W+H-H
  melodicMinor: [2, 1, 2, 2, 2, 2, 1],    // W-H-W-W-W-W-H
  dorian: [2, 1, 2, 2, 2, 1, 2],          // W-H-W-W-W-H-W
  phrygian: [1, 2, 2, 2, 1, 2, 2],        // H-W-W-W-H-W-W
  lydian: [2, 2, 2, 1, 2, 2, 1],          // W-W-W-H-W-W-H
  mixolydian: [2, 2, 1, 2, 2, 1, 2],      // W-W-H-W-W-H-W
  locrian: [1, 2, 2, 1, 2, 2, 2]          // H-W-W-H-W-W-W
};

function buildScale(rootNote, scaleType) {
  const pattern = SCALE_PATTERNS[scaleType];
  if (!pattern) throw new Error(`Unknown scale type: ${scaleType}`);
  
  const rootIndex = CHROMATIC_SCALE.indexOf(rootNote);
  if (rootIndex === -1) throw new Error(`Invalid root note: ${rootNote}`);
  
  const scale = [rootNote];
  let currentIndex = rootIndex;
  
  for (const interval of pattern.slice(0, -1)) {
    currentIndex = (currentIndex + interval) % 12;
    scale.push(CHROMATIC_SCALE[currentIndex]);
  }
  
  return scale;
}
```

### Scale Degree Functions
```javascript
const SCALE_DEGREES = {
  1: 'tonic', 2: 'supertonic', 3: 'mediant', 4: 'subdominant',
  5: 'dominant', 6: 'submediant', 7: 'leading tone'
};

function getScaleDegree(note, scale) {
  const index = scale.indexOf(note);
  return index === -1 ? null : index + 1;
}
```

---

## Key Signatures and Circle of Fifths

### Circle of Fifths Implementation

**Standard Music Theory Notation:**
The Circle of Fifths uses **sharps on the right** (clockwise) and **flats on the left** (counter-clockwise). This is the standard convention taught in music theory.

```javascript
// Standard Circle of Fifths notation (sharps on right, flats on left)
const CIRCLE_OF_FIFTHS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
//                         ↑ Start at top, go clockwise →
//                         Sharps: F# (position 6)
//                         Flats: Db, Ab, Eb, Bb (positions 7-10)

const CIRCLE_OF_FOURTHS = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb', 'Bbb', 'Ebb', 'Abb'];

function getRelativeMinor(majorKey) {
  const majorIndex = CHROMATIC_SCALE.indexOf(majorKey);
  const minorIndex = (majorIndex + 9) % 12; // Down a minor third
  return CHROMATIC_SCALE[minorIndex];
}

function getRelativeMajor(minorKey) {
  const minorIndex = CHROMATIC_SCALE.indexOf(minorKey);
  const majorIndex = (minorIndex + 3) % 12; // Up a minor third
  return CHROMATIC_SCALE[majorIndex];
}
```

### Enharmonic Normalization for Circle of Fifths

When working with the Circle of Fifths, you need to handle enharmonic equivalents (e.g., C# vs Db, F# vs Gb). Here's how to normalize user input:

```javascript
// Map enharmonic equivalents to the notation used in CIRCLE_OF_FIFTHS
const ENHARMONIC_NORMALIZATION = {
  'C#': 'Db',  // C# → Db (standard for position 7)
  'Db': 'Db',  // Db stays Db
  'D#': 'Eb',  // D# → Eb (standard for position 9)
  'Eb': 'Eb',  // Eb stays Eb
  'F#': 'F#',  // F# stays F# (standard for position 6)
  'Gb': 'F#',  // Gb → F# (enharmonic equivalent)
  'G#': 'Ab',  // G# → Ab (standard for position 8)
  'Ab': 'Ab',  // Ab stays Ab
  'A#': 'Bb',  // A# → Bb (standard for position 10)
  'Bb': 'Bb'   // Bb stays Bb
};

function normalizeKeyForCircle(key) {
  return ENHARMONIC_NORMALIZATION[key] || key;
}

// Example usage:
function getRelatedKeys(key, mode = 'major') {
  // Normalize the key to match CIRCLE_OF_FIFTHS notation
  const normalizedKey = normalizeKeyForCircle(key);
  const keyIndex = CIRCLE_OF_FIFTHS.indexOf(normalizedKey);

  if (keyIndex === -1) {
    return null; // Invalid key
  }

  // Get dominant (one step clockwise)
  const dominant = CIRCLE_OF_FIFTHS[(keyIndex + 1) % 12];

  // Get subdominant (one step counter-clockwise)
  const subdominant = CIRCLE_OF_FIFTHS[(keyIndex - 1 + 12) % 12];

  // Get relative minor/major
  const relative = mode === 'major'
    ? getRelativeMinor(normalizedKey)
    : getRelativeMajor(normalizedKey);

  return { dominant, subdominant, relative };
}

// Both C# and Db will work correctly:
getRelatedKeys('C#', 'major'); // Returns same as getRelatedKeys('Db', 'major')
getRelatedKeys('Db', 'major'); // { dominant: 'Ab', subdominant: 'Gb', relative: 'Bb' }
```

### Why This Notation Matters

1. **Educational Accuracy**: Students learn that moving clockwise adds sharps, moving counter-clockwise adds flats
2. **Key Signature Consistency**: Db major has 5 flats (standard), not C# major with 7 sharps (rare)
3. **Visual Clarity**: The circle visually represents the relationship between sharp and flat keys
4. **Music Theory Convention**: This is the standard notation used in music theory textbooks and education

### Key Signature Calculation
```javascript
const SHARP_ORDER = ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'];
const FLAT_ORDER = ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb'];

function getKeySignature(key, mode = 'major') {
  let keyIndex;
  
  if (mode === 'minor') {
    key = getRelativeMajor(key);
  }
  
  keyIndex = CIRCLE_OF_FIFTHS.indexOf(key);
  
  if (keyIndex === -1) {
    // Check for flat keys
    keyIndex = CIRCLE_OF_FOURTHS.indexOf(key);
    if (keyIndex === -1) throw new Error(`Invalid key: ${key}`);
    
    const numFlats = keyIndex;
    return {
      accidentals: FLAT_ORDER.slice(0, numFlats),
      type: 'flats',
      count: numFlats
    };
  }
  
  const numSharps = keyIndex;
  return {
    accidentals: SHARP_ORDER.slice(0, numSharps),
    type: 'sharps',
    count: numSharps
  };
}
```

---

## Chord Theory

### Chord Construction
```javascript
const CHORD_INTERVALS = {
  major: [0, 4, 7],                    // 1-3-5
  minor: [0, 3, 7],                    // 1-b3-5
  diminished: [0, 3, 6],               // 1-b3-b5
  augmented: [0, 4, 8],                // 1-3-#5
  major7: [0, 4, 7, 11],               // 1-3-5-7
  minor7: [0, 3, 7, 10],               // 1-b3-5-b7
  dominant7: [0, 4, 7, 10],            // 1-3-5-b7
  diminished7: [0, 3, 6, 9],           // 1-b3-b5-bb7
  halfDiminished7: [0, 3, 6, 10],      // 1-b3-b5-b7
  major9: [0, 4, 7, 11, 14],           // 1-3-5-7-9
  minor9: [0, 3, 7, 10, 14],           // 1-b3-5-b7-9
  sus2: [0, 2, 7],                     // 1-2-5
  sus4: [0, 5, 7]                      // 1-4-5
};

function buildChord(rootNote, chordType) {
  const intervals = CHORD_INTERVALS[chordType];
  if (!intervals) throw new Error(`Unknown chord type: ${chordType}`);

  const rootIndex = CHROMATIC_SCALE.indexOf(rootNote);
  if (rootIndex === -1) throw new Error(`Invalid root note: ${rootNote}`);

  return intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return CHROMATIC_SCALE[noteIndex];
  });
}
```

### Chord Inversions
```javascript
function getChordInversions(chord) {
  const inversions = [chord]; // Root position

  for (let i = 1; i < chord.length; i++) {
    const inversion = [...chord.slice(i), ...chord.slice(0, i)];
    inversions.push(inversion);
  }

  return {
    root: inversions[0],
    first: inversions[1],
    second: inversions[2],
    third: inversions[3] // Only for 7th chords and beyond
  };
}
```

### Chord Quality Detection
```javascript
function analyzeChord(notes) {
  if (notes.length < 3) throw new Error('Chord must have at least 3 notes');

  // Convert to intervals from root
  const root = notes[0];
  const rootIndex = CHROMATIC_SCALE.indexOf(root);
  const intervals = notes.map(note => {
    const noteIndex = CHROMATIC_SCALE.indexOf(note);
    return (noteIndex - rootIndex + 12) % 12;
  }).sort((a, b) => a - b);

  // Find matching chord type
  for (const [chordType, chordIntervals] of Object.entries(CHORD_INTERVALS)) {
    if (intervals.length === chordIntervals.length &&
        intervals.every((interval, i) => interval === chordIntervals[i])) {
      return { root, quality: chordType, intervals };
    }
  }

  return { root, quality: 'unknown', intervals };
}
```

---

## Harmonic Analysis

### Roman Numeral Analysis
```javascript
const ROMAN_NUMERALS = {
  major: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
  minor: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']
};

function getRomanNumeral(chordRoot, key, mode = 'major') {
  const scale = buildScale(key, mode === 'major' ? 'major' : 'naturalMinor');
  const degree = getScaleDegree(chordRoot, scale);

  if (!degree) throw new Error(`${chordRoot} is not in the key of ${key} ${mode}`);

  return ROMAN_NUMERALS[mode][degree - 1];
}

function analyzeProgression(chords, key, mode = 'major') {
  return chords.map(chord => {
    const root = typeof chord === 'string' ? chord : chord.root;
    return getRomanNumeral(root, key, mode);
  });
}
```

### Common Chord Progressions
```javascript
const COMMON_PROGRESSIONS = {
  // Pop/Rock progressions
  'I-V-vi-IV': [1, 5, 6, 4],           // C-G-Am-F
  'vi-IV-I-V': [6, 4, 1, 5],           // Am-F-C-G
  'I-vi-IV-V': [1, 6, 4, 5],           // C-Am-F-G (50s progression)

  // Jazz progressions
  'ii-V-I': [2, 5, 1],                 // Dm7-G7-Cmaj7
  'I-vi-ii-V': [1, 6, 2, 5],           // Circle progression
  'iii-vi-ii-V-I': [3, 6, 2, 5, 1],    // Extended circle

  // Classical progressions
  'I-IV-V-I': [1, 4, 5, 1],            // Authentic cadence
  'I-ii-V-I': [1, 2, 5, 1],            // Plagal variation
  'vi-ii-V-I': [6, 2, 5, 1]            // Deceptive resolution
};

function generateProgression(progressionName, key, mode = 'major') {
  const degrees = COMMON_PROGRESSIONS[progressionName];
  if (!degrees) throw new Error(`Unknown progression: ${progressionName}`);

  const scale = buildScale(key, mode === 'major' ? 'major' : 'naturalMinor');

  return degrees.map(degree => {
    const chordRoot = scale[degree - 1];
    const romanNumeral = ROMAN_NUMERALS[mode][degree - 1];

    // Determine chord quality based on roman numeral
    let chordType = 'major';
    if (romanNumeral.includes('°')) chordType = 'diminished';
    else if (romanNumeral === romanNumeral.toLowerCase()) chordType = 'minor';

    return {
      root: chordRoot,
      type: chordType,
      roman: romanNumeral,
      degree: degree
    };
  });
}
```

### Voice Leading
```javascript
function calculateVoiceLeading(chord1, chord2) {
  const movements = [];

  for (let i = 0; i < Math.max(chord1.length, chord2.length); i++) {
    const note1 = chord1[i];
    const note2 = chord2[i];

    if (note1 && note2) {
      const interval = calculateInterval(note1, note2);
      movements.push({
        from: note1,
        to: note2,
        interval: interval,
        movement: interval <= 6 ? interval : interval - 12 // Prefer smaller intervals
      });
    }
  }

  return movements;
}

function optimizeVoiceLeading(progression) {
  const optimized = [progression[0]]; // Keep first chord as is

  for (let i = 1; i < progression.length; i++) {
    const currentChord = progression[i];
    const previousChord = optimized[i - 1];

    // Find the inversion with smoothest voice leading
    const inversions = getChordInversions(currentChord);
    let bestInversion = inversions.root;
    let smallestMovement = Infinity;

    Object.values(inversions).forEach(inversion => {
      if (!inversion) return;

      const movements = calculateVoiceLeading(previousChord, inversion);
      const totalMovement = movements.reduce((sum, m) => sum + Math.abs(m.movement), 0);

      if (totalMovement < smallestMovement) {
        smallestMovement = totalMovement;
        bestInversion = inversion;
      }
    });

    optimized.push(bestInversion);
  }

  return optimized;
}
```

---

## Data Structures

### Note Class
```javascript
class Note {
  constructor(name, octave = 4) {
    this.name = name;
    this.octave = octave;
    this.midiNumber = noteToMidi(name, octave);
    this.frequency = midiToFrequency(this.midiNumber);
  }

  transpose(semitones) {
    const newMidiNumber = this.midiNumber + semitones;
    const newOctave = Math.floor(newMidiNumber / 12) - 1;
    const newNoteIndex = newMidiNumber % 12;
    const newNoteName = CHROMATIC_SCALE[newNoteIndex];

    return new Note(newNoteName, newOctave);
  }

  intervalTo(otherNote) {
    return otherNote.midiNumber - this.midiNumber;
  }

  toString() {
    return `${this.name}${this.octave}`;
  }
}
```

### Scale Class
```javascript
class Scale {
  constructor(root, type) {
    this.root = root;
    this.type = type;
    this.notes = buildScale(root, type);
    this.intervals = SCALE_PATTERNS[type];
  }

  getNote(degree) {
    if (degree < 1 || degree > this.notes.length) {
      throw new Error(`Invalid scale degree: ${degree}`);
    }
    return this.notes[degree - 1];
  }

  contains(note) {
    return this.notes.includes(note);
  }

  getChord(degree, chordType = 'triad') {
    const root = this.getNote(degree);

    if (chordType === 'triad') {
      // Build triad using scale degrees 1, 3, 5
      const third = this.getNote(((degree + 1) % 7) + 1);
      const fifth = this.getNote(((degree + 3) % 7) + 1);
      return [root, third, fifth];
    }

    // For other chord types, use the chord construction algorithm
    return buildChord(root, chordType);
  }

  getMode(degree) {
    const modeTypes = ['major', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'naturalMinor', 'locrian'];
    const modeRoot = this.getNote(degree);
    const modeType = modeTypes[degree - 1];

    return new Scale(modeRoot, modeType);
  }
}
```

### Chord Class
```javascript
class Chord {
  constructor(root, type) {
    this.root = root;
    this.type = type;
    this.notes = buildChord(root, type);
    this.intervals = CHORD_INTERVALS[type];
  }

  invert(inversion = 1) {
    const inversions = getChordInversions(this.notes);
    const inversionNames = ['root', 'first', 'second', 'third'];
    const inversionName = inversionNames[inversion];

    if (!inversions[inversionName]) {
      throw new Error(`Invalid inversion: ${inversion}`);
    }

    return inversions[inversionName];
  }

  contains(note) {
    return this.notes.includes(note);
  }

  getFunction(key, mode = 'major') {
    try {
      const roman = getRomanNumeral(this.root, key, mode);
      const functions = {
        'I': 'tonic', 'i': 'tonic',
        'ii': 'subdominant', 'ii°': 'subdominant',
        'iii': 'tonic', 'III': 'tonic',
        'IV': 'subdominant', 'iv': 'subdominant',
        'V': 'dominant', 'v': 'dominant',
        'vi': 'tonic', 'VI': 'subdominant',
        'vii°': 'dominant', 'VII': 'subtonic'
      };

      return {
        roman: roman,
        function: functions[roman] || 'unknown'
      };
    } catch (error) {
      return { roman: null, function: 'chromatic' };
    }
  }

  toString() {
    return `${this.root}${this.type}`;
  }
}
```

---

## Algorithms

### Scale Generation Algorithm
```javascript
function generateAllScales() {
  const scales = {};

  CHROMATIC_SCALE.forEach(root => {
    scales[root] = {};
    Object.keys(SCALE_PATTERNS).forEach(scaleType => {
      try {
        scales[root][scaleType] = buildScale(root, scaleType);
      } catch (error) {
        console.warn(`Could not build ${scaleType} scale for ${root}: ${error.message}`);
      }
    });
  });

  return scales;
}
```

### Chord Progression Generator
```javascript
function generateChordProgression(key, mode = 'major', length = 4, style = 'pop') {
  const scale = new Scale(key, mode === 'major' ? 'major' : 'naturalMinor');
  const progression = [];

  // Define probability weights for different styles
  const styleWeights = {
    pop: [0.3, 0.1, 0.15, 0.25, 0.3, 0.2, 0.05], // I, ii, iii, IV, V, vi, vii°
    jazz: [0.2, 0.25, 0.15, 0.2, 0.3, 0.2, 0.1],
    classical: [0.35, 0.2, 0.1, 0.25, 0.35, 0.15, 0.1]
  };

  const weights = styleWeights[style] || styleWeights.pop;

  for (let i = 0; i < length; i++) {
    // Weighted random selection
    const random = Math.random();
    let cumulative = 0;
    let selectedDegree = 1;

    for (let degree = 1; degree <= 7; degree++) {
      cumulative += weights[degree - 1];
      if (random <= cumulative) {
        selectedDegree = degree;
        break;
      }
    }

    const chordRoot = scale.getNote(selectedDegree);
    const romanNumeral = ROMAN_NUMERALS[mode][selectedDegree - 1];

    // Determine chord quality
    let chordType = 'major';
    if (romanNumeral.includes('°')) chordType = 'diminished';
    else if (romanNumeral === romanNumeral.toLowerCase()) chordType = 'minor';

    progression.push(new Chord(chordRoot, chordType));
  }

  return progression;
}
```

### Key Detection Algorithm
```javascript
function detectKey(notes) {
  const noteCounts = {};

  // Count note occurrences
  notes.forEach(note => {
    const normalizedNote = note.replace(/[0-9]/g, ''); // Remove octave numbers
    noteCounts[normalizedNote] = (noteCounts[normalizedNote] || 0) + 1;
  });

  const keyScores = {};

  // Test each possible key
  CHROMATIC_SCALE.forEach(root => {
    ['major', 'naturalMinor'].forEach(mode => {
      const scale = buildScale(root, mode);
      let score = 0;

      // Calculate score based on how well notes fit the scale
      Object.entries(noteCounts).forEach(([note, count]) => {
        if (scale.includes(note)) {
          score += count * 2; // Notes in scale get double weight
        } else {
          score -= count; // Notes outside scale reduce score
        }
      });

      const keyName = mode === 'major' ? root : `${root}m`;
      keyScores[keyName] = score;
    });
  });

  // Return the key with the highest score
  const bestKey = Object.entries(keyScores).reduce((a, b) =>
    keyScores[a[0]] > keyScores[b[0]] ? a : b
  )[0];

  return {
    key: bestKey,
    confidence: keyScores[bestKey] / notes.length,
    allScores: keyScores
  };
}
```

### Modulation Detection
```javascript
function detectModulation(chordProgression, originalKey) {
  const modulationPoints = [];
  let currentKey = originalKey;

  for (let i = 1; i < chordProgression.length; i++) {
    const chord = chordProgression[i];
    const previousChords = chordProgression.slice(Math.max(0, i - 3), i);

    // Check if current chord fits in current key
    try {
      getRomanNumeral(chord.root, currentKey);
    } catch (error) {
      // Chord doesn't fit - possible modulation
      const possibleKeys = findPossibleKeys([...previousChords, chord]);

      if (possibleKeys.length > 0 && possibleKeys[0] !== currentKey) {
        modulationPoints.push({
          position: i,
          fromKey: currentKey,
          toKey: possibleKeys[0],
          chord: chord
        });
        currentKey = possibleKeys[0];
      }
    }
  }

  return modulationPoints;
}

function findPossibleKeys(chords) {
  const keyScores = {};

  CHROMATIC_SCALE.forEach(root => {
    ['major', 'naturalMinor'].forEach(mode => {
      let score = 0;

      chords.forEach(chord => {
        try {
          getRomanNumeral(chord.root, root, mode);
          score += 1;
        } catch (error) {
          score -= 0.5;
        }
      });

      const keyName = mode === 'major' ? root : `${root}m`;
      keyScores[keyName] = score;
    });
  });

  return Object.entries(keyScores)
    .sort((a, b) => b[1] - a[1])
    .filter(([key, score]) => score > 0)
    .map(([key, score]) => key);
}
```

---

## Practical Applications

### Web Audio API Integration
```javascript
class MusicTheoryAudioContext {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.oscillators = new Map();
  }

  playNote(note, octave = 4, duration = 1000) {
    const frequency = midiToFrequency(noteToMidi(note, octave));

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = 'sine';

    // Envelope
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration / 1000);

    return oscillator;
  }

  playChord(chord, octave = 4, duration = 2000) {
    const oscillators = chord.map((note, index) => {
      return this.playNote(note, octave + Math.floor(index / 3), duration);
    });

    return oscillators;
  }

  playScale(scale, octave = 4, noteLength = 500) {
    scale.forEach((note, index) => {
      setTimeout(() => {
        this.playNote(note, octave, noteLength);
      }, index * noteLength);
    });
  }
}
```

### MIDI Integration
```javascript
class MIDIHandler {
  constructor() {
    this.midiAccess = null;
    this.activeNotes = new Set();
    this.chordBuffer = [];
    this.chordTimeout = null;
  }

  async initialize() {
    try {
      this.midiAccess = await navigator.requestMIDIAccess();
      this.setupInputs();
    } catch (error) {
      console.error('MIDI access failed:', error);
    }
  }

  setupInputs() {
    for (const input of this.midiAccess.inputs.values()) {
      input.onmidimessage = this.handleMIDIMessage.bind(this);
    }
  }

  handleMIDIMessage(message) {
    const [command, note, velocity] = message.data;
    const noteOn = (command & 0xf0) === 0x90 && velocity > 0;
    const noteOff = (command & 0xf0) === 0x80 || ((command & 0xf0) === 0x90 && velocity === 0);

    if (noteOn) {
      this.activeNotes.add(note);
      this.chordBuffer.push(note);

      // Clear existing timeout
      if (this.chordTimeout) {
        clearTimeout(this.chordTimeout);
      }

      // Set new timeout to analyze chord
      this.chordTimeout = setTimeout(() => {
        this.analyzeChordBuffer();
      }, 100);

    } else if (noteOff) {
      this.activeNotes.delete(note);
    }
  }

  analyzeChordBuffer() {
    if (this.chordBuffer.length >= 3) {
      const noteNames = this.chordBuffer.map(midiNote => {
        const noteIndex = midiNote % 12;
        return CHROMATIC_SCALE[noteIndex];
      });

      const uniqueNotes = [...new Set(noteNames)];

      if (uniqueNotes.length >= 3) {
        const chordAnalysis = analyzeChord(uniqueNotes);
        console.log('Detected chord:', chordAnalysis);

        // Trigger chord analysis event
        this.onChordDetected?.(chordAnalysis);
      }
    }

    this.chordBuffer = [];
  }

  onChordDetected(chordAnalysis) {
    // Override this method to handle chord detection
  }
}
```

### Music Theory Validation
```javascript
class MusicTheoryValidator {
  static validateNote(note) {
    const errors = [];

    if (!CHROMATIC_SCALE.includes(note) && !CHROMATIC_SCALE_FLATS.includes(note)) {
      errors.push(`Invalid note name: ${note}`);
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  static validateScale(notes, expectedScaleType) {
    const errors = [];

    if (notes.length !== 7) {
      errors.push(`Scale must have 7 notes, got ${notes.length}`);
    }

    // Check intervals
    const intervals = [];
    for (let i = 0; i < notes.length - 1; i++) {
      const interval = calculateInterval(notes[i], notes[i + 1]);
      intervals.push(interval);
    }

    const expectedPattern = SCALE_PATTERNS[expectedScaleType];
    if (expectedPattern && !this.arraysEqual(intervals, expectedPattern.slice(0, -1))) {
      errors.push(`Interval pattern doesn't match ${expectedScaleType} scale`);
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      intervals: intervals
    };
  }

  static validateChord(notes, expectedChordType) {
    const errors = [];

    if (notes.length < 3) {
      errors.push('Chord must have at least 3 notes');
    }

    const analysis = analyzeChord(notes);
    if (expectedChordType && analysis.quality !== expectedChordType) {
      errors.push(`Expected ${expectedChordType} chord, got ${analysis.quality}`);
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      analysis: analysis
    };
  }

  static validateProgression(chords, key, mode = 'major') {
    const errors = [];
    const analysis = [];

    chords.forEach((chord, index) => {
      try {
        const roman = getRomanNumeral(chord.root, key, mode);
        analysis.push({
          chord: chord,
          roman: roman,
          isValid: true
        });
      } catch (error) {
        analysis.push({
          chord: chord,
          roman: null,
          isValid: false,
          error: error.message
        });
        errors.push(`Chord ${index + 1} (${chord.root}${chord.type}) doesn't fit in ${key} ${mode}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors: errors,
      analysis: analysis
    };
  }

  static arraysEqual(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }
}
```

---

## Reference Tables

### Complete Interval Reference
```javascript
const INTERVAL_REFERENCE = {
  0: { name: 'unison', quality: 'perfect', semitones: 0 },
  1: { name: 'minor second', quality: 'minor', semitones: 1 },
  2: { name: 'major second', quality: 'major', semitones: 2 },
  3: { name: 'minor third', quality: 'minor', semitones: 3 },
  4: { name: 'major third', quality: 'major', semitones: 4 },
  5: { name: 'perfect fourth', quality: 'perfect', semitones: 5 },
  6: { name: 'tritone', quality: 'diminished/augmented', semitones: 6 },
  7: { name: 'perfect fifth', quality: 'perfect', semitones: 7 },
  8: { name: 'minor sixth', quality: 'minor', semitones: 8 },
  9: { name: 'major sixth', quality: 'major', semitones: 9 },
  10: { name: 'minor seventh', quality: 'minor', semitones: 10 },
  11: { name: 'major seventh', quality: 'major', semitones: 11 },
  12: { name: 'octave', quality: 'perfect', semitones: 12 }
};
```

### Key Signature Reference
```javascript
const KEY_SIGNATURE_REFERENCE = {
  'C': { sharps: 0, flats: 0, accidentals: [] },
  'G': { sharps: 1, flats: 0, accidentals: ['F#'] },
  'D': { sharps: 2, flats: 0, accidentals: ['F#', 'C#'] },
  'A': { sharps: 3, flats: 0, accidentals: ['F#', 'C#', 'G#'] },
  'E': { sharps: 4, flats: 0, accidentals: ['F#', 'C#', 'G#', 'D#'] },
  'B': { sharps: 5, flats: 0, accidentals: ['F#', 'C#', 'G#', 'D#', 'A#'] },
  'F#': { sharps: 6, flats: 0, accidentals: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#'] },
  'C#': { sharps: 7, flats: 0, accidentals: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'] },

  'F': { sharps: 0, flats: 1, accidentals: ['Bb'] },
  'Bb': { sharps: 0, flats: 2, accidentals: ['Bb', 'Eb'] },
  'Eb': { sharps: 0, flats: 3, accidentals: ['Bb', 'Eb', 'Ab'] },
  'Ab': { sharps: 0, flats: 4, accidentals: ['Bb', 'Eb', 'Ab', 'Db'] },
  'Db': { sharps: 0, flats: 5, accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb'] },
  'Gb': { sharps: 0, flats: 6, accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'] },
  'Cb': { sharps: 0, flats: 7, accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb'] }
};
```

### Chord Symbol Reference
```javascript
const CHORD_SYMBOL_REFERENCE = {
  // Triads
  '': 'major',
  'maj': 'major',
  'M': 'major',
  'm': 'minor',
  'min': 'minor',
  '°': 'diminished',
  'dim': 'diminished',
  '+': 'augmented',
  'aug': 'augmented',

  // Seventh chords
  '7': 'dominant7',
  'maj7': 'major7',
  'M7': 'major7',
  'm7': 'minor7',
  'min7': 'minor7',
  '°7': 'diminished7',
  'dim7': 'diminished7',
  'ø7': 'halfDiminished7',
  'm7b5': 'halfDiminished7',

  // Extended chords
  '9': 'dominant9',
  'maj9': 'major9',
  'M9': 'major9',
  'm9': 'minor9',
  'min9': 'minor9',

  // Suspended chords
  'sus2': 'sus2',
  'sus4': 'sus4',
  'sus': 'sus4'
};
```

### Mode Reference
```javascript
const MODE_REFERENCE = {
  ionian: { pattern: [2, 2, 1, 2, 2, 2, 1], brightness: 7, characteristic: 'major' },
  dorian: { pattern: [2, 1, 2, 2, 2, 1, 2], brightness: 6, characteristic: 'minor with raised 6th' },
  phrygian: { pattern: [1, 2, 2, 2, 1, 2, 2], brightness: 5, characteristic: 'minor with lowered 2nd' },
  lydian: { pattern: [2, 2, 2, 1, 2, 2, 1], brightness: 4, characteristic: 'major with raised 4th' },
  mixolydian: { pattern: [2, 2, 1, 2, 2, 1, 2], brightness: 3, characteristic: 'major with lowered 7th' },
  aeolian: { pattern: [2, 1, 2, 2, 1, 2, 2], brightness: 2, characteristic: 'natural minor' },
  locrian: { pattern: [1, 2, 2, 1, 2, 2, 2], brightness: 1, characteristic: 'diminished' }
};
```

---

## Error Handling and Edge Cases

### Common Error Patterns
```javascript
class MusicTheoryError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'MusicTheoryError';
    this.code = code;
  }
}

function safeNoteOperation(operation, ...args) {
  try {
    return {
      success: true,
      result: operation(...args),
      error: null
    };
  } catch (error) {
    return {
      success: false,
      result: null,
      error: {
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR'
      }
    };
  }
}

// Example usage:
const result = safeNoteOperation(buildScale, 'X', 'major');
if (!result.success) {
  console.error('Scale construction failed:', result.error.message);
}
```

### Input Sanitization
```javascript
function sanitizeNote(input) {
  if (typeof input !== 'string') {
    throw new MusicTheoryError('Note must be a string', 'INVALID_TYPE');
  }

  const cleaned = input.trim().replace(/\s+/g, '');

  // Handle various sharp/flat notations
  const normalized = cleaned
    .replace(/♯/g, '#')
    .replace(/♭/g, 'b')
    .replace(/sharp/gi, '#')
    .replace(/flat/gi, 'b');

  // Validate format
  if (!/^[A-G][#b]?$/.test(normalized)) {
    throw new MusicTheoryError(`Invalid note format: ${input}`, 'INVALID_FORMAT');
  }

  return normalized;
}

function sanitizeChordSymbol(input) {
  if (typeof input !== 'string') {
    throw new MusicTheoryError('Chord symbol must be a string', 'INVALID_TYPE');
  }

  const cleaned = input.trim();

  // Extract root note and chord quality
  const match = cleaned.match(/^([A-G][#b]?)(.*)$/);
  if (!match) {
    throw new MusicTheoryError(`Invalid chord symbol: ${input}`, 'INVALID_FORMAT');
  }

  const [, root, quality] = match;
  const sanitizedRoot = sanitizeNote(root);
  const sanitizedQuality = quality.trim();

  return {
    root: sanitizedRoot,
    quality: sanitizedQuality,
    fullSymbol: sanitizedRoot + sanitizedQuality
  };
}
```

---

## Performance Optimization

### Memoization for Expensive Operations
```javascript
const scaleCache = new Map();
const chordCache = new Map();

function memoizedBuildScale(root, type) {
  const key = `${root}-${type}`;

  if (scaleCache.has(key)) {
    return scaleCache.get(key);
  }

  const scale = buildScale(root, type);
  scaleCache.set(key, scale);

  return scale;
}

function memoizedBuildChord(root, type) {
  const key = `${root}-${type}`;

  if (chordCache.has(key)) {
    return chordCache.get(key);
  }

  const chord = buildChord(root, type);
  chordCache.set(key, chord);

  return chord;
}

// Clear caches when needed
function clearMusicTheoryCache() {
  scaleCache.clear();
  chordCache.clear();
}
```

### Batch Operations
```javascript
function batchAnalyzeChords(chords) {
  return chords.map(chord => {
    try {
      return {
        input: chord,
        analysis: analyzeChord(chord),
        isValid: true,
        error: null
      };
    } catch (error) {
      return {
        input: chord,
        analysis: null,
        isValid: false,
        error: error.message
      };
    }
  });
}

function batchGenerateScales(roots, scaleTypes) {
  const results = {};

  roots.forEach(root => {
    results[root] = {};
    scaleTypes.forEach(type => {
      try {
        results[root][type] = memoizedBuildScale(root, type);
      } catch (error) {
        results[root][type] = { error: error.message };
      }
    });
  });

  return results;
}
```

---

## Integration Examples

### React Component Integration
```javascript
import React, { useState, useEffect } from 'react';

function ChordAnalyzer() {
  const [inputChord, setInputChord] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (inputChord.length >= 3) {
      try {
        const sanitized = sanitizeChordSymbol(inputChord);
        const chord = buildChord(sanitized.root, sanitized.quality || 'major');
        const chordAnalysis = analyzeChord(chord);

        setAnalysis(chordAnalysis);
        setError(null);
      } catch (err) {
        setError(err.message);
        setAnalysis(null);
      }
    }
  }, [inputChord]);

  return (
    <div>
      <input
        type="text"
        value={inputChord}
        onChange={(e) => setInputChord(e.target.value)}
        placeholder="Enter chord (e.g., Cmaj7)"
      />

      {analysis && (
        <div>
          <h3>Chord Analysis</h3>
          <p>Root: {analysis.root}</p>
          <p>Quality: {analysis.quality}</p>
          <p>Notes: {analysis.intervals.join(', ')}</p>
        </div>
      )}

      {error && (
        <div style={{ color: 'red' }}>
          Error: {error}
        </div>
      )}
    </div>
  );
}
```

This comprehensive guide provides LLMs with the theoretical foundation, practical implementation patterns, and code examples needed to understand and apply music theory concepts in programming contexts. The guide emphasizes mathematical relationships, algorithmic approaches, and real-world integration patterns that are essential for building music applications.
```

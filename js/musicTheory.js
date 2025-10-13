/**
 * Music Theory Data Model
 * Comprehensive data structures for keys, scales, chords, and their relationships
 */

// Note names and their enharmonic equivalents
const NOTES = {
    chromatic: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    enharmonic: {
        'C#': 'Db',
        'D#': 'Eb',
        'F#': 'Gb',
        'G#': 'Ab',
        'A#': 'Bb'
    }
};

// Circle of Fifths order (clockwise from C)
// Uses standard music theory notation: sharps on right (F#), flats on left (Db, Ab, Eb, Bb)
const CIRCLE_OF_FIFTHS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];

// Major key signatures
const MAJOR_KEYS = {
    C: { sharps: 0, flats: 0, signature: 'No sharps or flats', accidentals: [] },
    G: { sharps: 1, flats: 0, signature: '1 sharp (F#)', accidentals: ['F#'] },
    D: { sharps: 2, flats: 0, signature: '2 sharps (F#, C#)', accidentals: ['F#', 'C#'] },
    A: { sharps: 3, flats: 0, signature: '3 sharps (F#, C#, G#)', accidentals: ['F#', 'C#', 'G#'] },
    E: {
        sharps: 4,
        flats: 0,
        signature: '4 sharps (F#, C#, G#, D#)',
        accidentals: ['F#', 'C#', 'G#', 'D#']
    },
    B: {
        sharps: 5,
        flats: 0,
        signature: '5 sharps (F#, C#, G#, D#, A#)',
        accidentals: ['F#', 'C#', 'G#', 'D#', 'A#']
    },
    'F#': {
        sharps: 6,
        flats: 0,
        signature: '6 sharps (F#, C#, G#, D#, A#, E#)',
        accidentals: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#']
    },
    // THEORETICAL KEYS (rarely used in practice):
    // C# major (7 sharps) - enharmonic equivalent of Db major (5 flats) is preferred
    // A# major (10 sharps with double sharps!) - enharmonic equivalent Bb major (2 flats) is standard
    // These keys are included for theoretical completeness but are not in the CIRCLE_OF_FIFTHS
    // array and cannot be selected in the UI. In practice, musicians use the flat equivalents.
    'C#': {
        sharps: 7,
        flats: 0,
        signature: '7 sharps (F#, C#, G#, D#, A#, E#, B#)',
        accidentals: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#']
    },
    'A#': {
        sharps: 10,
        flats: 0,
        signature: '10 sharps (F#, C#, G#, D#, A#, E#, B#, F##, C##, G##)',
        accidentals: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#', 'F##', 'C##', 'G##']
    },
    F: { sharps: 0, flats: 1, signature: '1 flat (Bb)', accidentals: ['Bb'] },
    Bb: { sharps: 0, flats: 2, signature: '2 flats (Bb, Eb)', accidentals: ['Bb', 'Eb'] },
    Eb: { sharps: 0, flats: 3, signature: '3 flats (Bb, Eb, Ab)', accidentals: ['Bb', 'Eb', 'Ab'] },
    Ab: {
        sharps: 0,
        flats: 4,
        signature: '4 flats (Bb, Eb, Ab, Db)',
        accidentals: ['Bb', 'Eb', 'Ab', 'Db']
    },
    Db: {
        sharps: 0,
        flats: 5,
        signature: '5 flats (Bb, Eb, Ab, Db, Gb)',
        accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb']
    },
    Gb: {
        sharps: 0,
        flats: 6,
        signature: '6 flats (Bb, Eb, Ab, Db, Gb, Cb)',
        accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb']
    },
    Cb: {
        sharps: 0,
        flats: 7,
        signature: '7 flats (Bb, Eb, Ab, Db, Gb, Cb, Fb)',
        accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb']
    }
};

// Minor key signatures (relative to major)
const MINOR_KEYS = {
    A: { relative: 'C', sharps: 0, flats: 0, signature: 'No sharps or flats', accidentals: [] },
    E: { relative: 'G', sharps: 1, flats: 0, signature: '1 sharp (F#)', accidentals: ['F#'] },
    B: {
        relative: 'D',
        sharps: 2,
        flats: 0,
        signature: '2 sharps (F#, C#)',
        accidentals: ['F#', 'C#']
    },
    'F#': {
        relative: 'A',
        sharps: 3,
        flats: 0,
        signature: '3 sharps (F#, C#, G#)',
        accidentals: ['F#', 'C#', 'G#']
    },
    'C#': {
        relative: 'E',
        sharps: 4,
        flats: 0,
        signature: '4 sharps (F#, C#, G#, D#)',
        accidentals: ['F#', 'C#', 'G#', 'D#']
    },
    'G#': {
        relative: 'B',
        sharps: 5,
        flats: 0,
        signature: '5 sharps (F#, C#, G#, D#, A#)',
        accidentals: ['F#', 'C#', 'G#', 'D#', 'A#']
    },
    'D#': {
        relative: 'F#',
        sharps: 6,
        flats: 0,
        signature: '6 sharps (F#, C#, G#, D#, A#, E#)',
        accidentals: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#']
    },
    'A#': {
        relative: 'C#',
        sharps: 7,
        flats: 0,
        signature: '7 sharps (F#, C#, G#, D#, A#, E#, B#)',
        accidentals: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#']
    },
    D: { relative: 'F', sharps: 0, flats: 1, signature: '1 flat (Bb)', accidentals: ['Bb'] },
    G: {
        relative: 'Bb',
        sharps: 0,
        flats: 2,
        signature: '2 flats (Bb, Eb)',
        accidentals: ['Bb', 'Eb']
    },
    C: {
        relative: 'Eb',
        sharps: 0,
        flats: 3,
        signature: '3 flats (Bb, Eb, Ab)',
        accidentals: ['Bb', 'Eb', 'Ab']
    },
    F: {
        relative: 'Ab',
        sharps: 0,
        flats: 4,
        signature: '4 flats (Bb, Eb, Ab, Db)',
        accidentals: ['Bb', 'Eb', 'Ab', 'Db']
    },
    Bb: {
        relative: 'Db',
        sharps: 0,
        flats: 5,
        signature: '5 flats (Bb, Eb, Ab, Db, Gb)',
        accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb']
    },
    Eb: {
        relative: 'Gb',
        sharps: 0,
        flats: 6,
        signature: '6 flats (Bb, Eb, Ab, Db, Gb, Cb)',
        accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb']
    },
    Ab: {
        relative: 'Cb',
        sharps: 0,
        flats: 7,
        signature: '7 flats (Bb, Eb, Ab, Db, Gb, Cb, Fb)',
        accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb']
    }
};

// Scale patterns (intervals in semitones)
const SCALE_PATTERNS = {
    major: [2, 2, 1, 2, 2, 2, 1], // W-W-H-W-W-W-H
    minor: [2, 1, 2, 2, 1, 2, 2], // W-H-W-W-H-W-W
    harmonicMinor: [2, 1, 2, 2, 1, 3, 1], // W-H-W-W-H-W+H-H
    melodicMinor: [2, 1, 2, 2, 2, 2, 1] // W-H-W-W-W-W-H (ascending)
};

/**
 * Chord Progressions for Major and Minor Modes
 *
 * All progressions are defined using Roman numeral analysis:
 * - Uppercase (I, IV, V) = Major chords
 * - Lowercase (ii, iii, vi) = Minor chords
 * - Lowercase with ° (vii°) = Diminished chords
 *
 * All chords in each progression are diatonic to the key (with noted exceptions in minor mode).
 * When played, roman numerals are converted to actual chord roots based on the current key,
 * ensuring the progression stays in the same key throughout all iterations and loops.
 */
const CHORD_PROGRESSIONS = {
    major: {
        'I-V-vi-IV': {
            name: 'Pop Progression',
            roman: ['I', 'V', 'vi', 'IV'],
            description: 'Most popular progression in modern music'
            // Example in C major: C - G - Am - F
            // Function: Tonic - Dominant - Submediant - Subdominant
            // Voice leading: Excellent (multiple common tones between chords)
        },
        'ii-V-I': {
            name: 'Jazz Progression',
            roman: ['ii', 'V', 'I'],
            description: 'Essential jazz cadence'
            // Example in C major: Dm - G - C
            // Function: Supertonic - Dominant - Tonic (classic cadential progression)
            // Voice leading: Excellent (D is common between ii and V, G is common between V and I)
            // Loop transition: C → Dm (smooth, 5 semitone total movement)
            // Note: This progression DOES NOT change keys when looping - all chords remain
            // diatonic to the original key. The loop transition from I back to ii is optimized
            // for smooth voice leading.
        },
        'vi-IV-I-V': {
            name: 'Circle Progression',
            roman: ['vi', 'IV', 'I', 'V'],
            description: 'Follows circle of fifths backwards'
            // Example in C major: Am - F - C - G
            // Function: Follows descending fifths pattern
            // Voice leading: Very smooth (follows natural voice leading patterns)
        },
        'I-vi-ii-V': {
            name: 'Doo-Wop Progression',
            roman: ['I', 'vi', 'ii', 'V'],
            description: 'Classic 1950s progression'
            // Example in C major: C - Am - Dm - G
            // Function: Tonic - Submediant - Supertonic - Dominant
            // Voice leading: Excellent stepwise motion in all voices
        },
        'I-IV-V-I': {
            name: 'Basic Cadence',
            roman: ['I', 'IV', 'V', 'I'],
            description: 'Fundamental tonic-subdominant-dominant-tonic'
            // Example in C major: C - F - G - C
            // Function: Classic functional harmony progression
            // Voice leading: Perfect loop (ends on same chord it starts with)
        }
    },
    minor: {
        'i-VII-VI-VII': {
            name: 'Minor Pop',
            roman: ['i', 'VII', 'VI', 'VII'],
            description: 'Popular minor progression'
            // Example in A minor: Am - G - F - G
            // Function: Uses natural minor scale (no raised leading tone)
            // Voice leading: Smooth descending and ascending motion
            // All chords are diatonic to natural minor
        },
        'i-iv-V-i': {
            name: 'Minor Cadence',
            roman: ['i', 'iv', 'V', 'i'],
            description: 'Basic minor cadence'
            // Example in A minor: Am - Dm - E - Am
            // Function: Classic minor cadence with dominant resolution
            // Note: V chord (E major) uses raised leading tone (G#) from harmonic minor
            // This is standard practice in minor keys for stronger dominant function
            // Voice leading: Perfect loop (ends on same chord it starts with)
        },
        'i-VI-III-VII': {
            name: 'Andalusian',
            roman: ['i', 'VI', 'III', 'VII'],
            description: 'Spanish/Flamenco progression'
            // Example in A minor: Am - F - C - G
            // Function: Descending bass line (A - F - C - G)
            // Voice leading: Characteristic Spanish/Flamenco sound
            // All chords are diatonic to natural minor
        },
        'i-v-iv-i': {
            name: 'Natural Minor',
            roman: ['i', 'v', 'iv', 'i'],
            description: 'All natural minor chords'
            // Example in A minor: Am - Em - Dm - Am
            // Function: Pure natural minor (no raised leading tone)
            // Voice leading: Very smooth, all voices move by step or stay
            // Perfect loop (ends on same chord it starts with)
        }
    }
};

/**
 * Music Theory Utility Class
 * Provides comprehensive music theory calculations and data for the Circle of Fifths.
 * Handles key signatures, scales, chords, and their relationships.
 *
 * @class MusicTheory
 * @example
 * const theory = new MusicTheory();
 * const scale = theory.getScaleNotes('G', 'major');
 * const chord = theory.getChordNotes('Am', 'minor');
 */
class MusicTheory {
    /**
     * Creates a new MusicTheory instance.
     * Initializes with C major as the default key and mode.
     *
     * @constructor
     */
    constructor() {
        this.currentKey = 'C';
        this.currentMode = 'major';
    }

    /**
     * Get note index in chromatic scale
     */
    getNoteIndex(note) {
        if (!note || typeof note !== 'string') {
            return 0;
        }

        // Handle case insensitivity
        note = note.charAt(0).toUpperCase() + note.slice(1);

        // Handle special enharmonic cases
        const enharmonicMap = {
            'B#': 'C',
            Cb: 'B',
            'E#': 'F',
            Fb: 'E'
        };

        if (enharmonicMap[note]) {
            note = enharmonicMap[note];
        }

        // Direct lookup in chromatic scale
        const directIndex = NOTES.chromatic.indexOf(note);
        if (directIndex !== -1) {
            return directIndex;
        }

        // Handle flat notes by converting to sharp equivalents
        const flatToSharp = {
            Db: 'C#',
            Eb: 'D#',
            Gb: 'F#',
            Ab: 'G#',
            Bb: 'A#'
        };

        if (flatToSharp[note]) {
            return NOTES.chromatic.indexOf(flatToSharp[note]);
        }

        // Fallback: parse note manually
        const cleanNote = note.replace(/[#b]/g, '');
        const accidental = note.includes('#') ? 1 : note.includes('b') ? -1 : 0;
        const naturalNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const naturalIndices = [0, 2, 4, 5, 7, 9, 11];

        const naturalIndex = naturalNotes.indexOf(cleanNote);
        if (naturalIndex !== -1) {
            return (naturalIndices[naturalIndex] + accidental + 12) % 12;
        }

        // Warn about invalid note and default to C
        console.warn(`Invalid note: "${note}", defaulting to C (index 0)`);
        return 0; // Default to C if note not found
    }

    /**
     * Generate scale notes for a given key and mode.
     * Returns the seven notes of the scale in order.
     *
     * @param {string} key - The root key (e.g., 'C', 'F#', 'Bb')
     * @param {string} [mode='major'] - The mode ('major' or 'minor')
     * @returns {string[]} Array of note names in the scale
     * @example
     * theory.getScaleNotes('G', 'major'); // ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
     * theory.getScaleNotes('A', 'minor'); // ['A', 'B', 'C', 'D', 'E', 'F', 'G']
     */
    getScaleNotes(key, mode = 'major') {
        if (!key || typeof key !== 'string') {
            return [];
        }

        // Handle case insensitivity
        key = key.charAt(0).toUpperCase() + key.slice(1);

        // Normalize mode names to match SCALE_PATTERNS keys
        const modeMap = {
            major: 'major',
            minor: 'minor',
            harmonicminor: 'harmonicMinor',
            melodicminor: 'melodicMinor'
        };

        const normalizedMode = modeMap[mode.toLowerCase()] || mode.toLowerCase();
        const pattern = SCALE_PATTERNS[normalizedMode];
        if (!pattern) {
            return [];
        }

        const startIndex = this.getNoteIndex(key);
        const notes = [];
        let currentIndex = startIndex;

        // Get the key signature to determine proper accidentals
        // For harmonic and melodic minor, use the natural minor key signature as base
        const baseMode =
            normalizedMode === 'harmonicMinor' || normalizedMode === 'melodicMinor'
                ? 'minor'
                : normalizedMode;
        const keySignature = this.getKeySignature(key, baseMode === 'minor' ? 'minor' : 'major');
        const useFlats = keySignature.flats > 0;

        // Add the root note
        notes.push(this.getProperNoteName(currentIndex, key, useFlats));

        // Generate the rest of the scale
        for (let i = 0; i < pattern.length - 1; i++) {
            currentIndex = (currentIndex + pattern[i]) % 12;
            const noteName = this.getProperNoteName(currentIndex, null, useFlats);
            notes.push(noteName);
        }

        return notes;
    }

    /**
     * Get the proper note name based on key signature context
     */
    getProperNoteName(noteIndex, _rootNote = null, useFlats = false) {
        const chromaticNote = NOTES.chromatic[noteIndex];

        // If it's a natural note, return as-is
        if (!chromaticNote.includes('#')) {
            return chromaticNote;
        }

        // For accidentals, choose sharp or flat based on key signature
        if (useFlats && NOTES.enharmonic[chromaticNote]) {
            return NOTES.enharmonic[chromaticNote];
        }

        return chromaticNote;
    }

    /**
     * Get key signature information
     */
    getKeySignature(key, mode = 'major') {
        if (!key || typeof key !== 'string') {
            return { sharps: 0, flats: 0, signature: 'Unknown key', accidentals: [] };
        }

        // Handle case insensitivity
        key = key.charAt(0).toUpperCase() + key.slice(1);
        mode = mode.toLowerCase();

        const keyData = mode === 'major' ? MAJOR_KEYS[key] : MINOR_KEYS[key];
        return keyData || { sharps: 0, flats: 0, signature: 'Unknown key', accidentals: [] };
    }

    /**
     * Get related keys (dominant, subdominant, relative) for a given key and mode.
     * Returns an object with the three most important related keys.
     *
     * @param {string} key - The root key (e.g., 'C', 'F#', 'Bb')
     * @param {string} [mode='major'] - The mode ('major' or 'minor')
     * @returns {Object|null} Object with properties:
     *   - dominant {Object} - Dominant key information
     *   - subdominant {Object} - Subdominant key information
     *   - relative {Object} - Relative key information
     * @example
     * theory.getRelatedKeys('C', 'major');
     * // Returns: { dominant: {key: 'G', mode: 'major'}, subdominant: {key: 'F', mode: 'major'}, relative: {key: 'A', mode: 'minor'} }
     */
    getRelatedKeys(key, mode = 'major') {
        if (!key || typeof key !== 'string') {
            return null;
        }

        // Handle case insensitivity
        key = key.charAt(0).toUpperCase() + key.slice(1);
        mode = mode.toLowerCase();

        // Enharmonic normalization map - converts both sharps and flats to the notation used in CIRCLE_OF_FIFTHS
        // This allows the method to work with both C# and Db, F# and Gb, etc.
        //
        // DESIGN DECISION: Normalize to the notation that matches CIRCLE_OF_FIFTHS array
        // - Sharp keys (right side of circle): F# is preferred over Gb (more common in practice)
        // - Flat keys (left side of circle): Db, Ab, Eb, Bb are preferred over their sharp equivalents
        //
        // Musical rationale:
        // - F# major (6 sharps) is more commonly used than Gb major (6 flats)
        // - Db major (5 flats) is more commonly used than C# major (7 sharps)
        // - This matches standard music notation conventions and the circle of fifths layout
        const enharmonicMap = {
            'C#': 'Db', // Normalize to flat (Db major is more common than C# major)
            Db: 'Db',
            'D#': 'Eb', // Normalize to flat (Eb major is standard)
            Eb: 'Eb',
            'F#': 'F#', // Keep as sharp (F# major is more common than Gb major)
            Gb: 'F#', // Normalize to sharp
            'G#': 'Ab', // Normalize to flat (Ab major is standard)
            Ab: 'Ab',
            'A#': 'Bb', // Normalize to flat (Bb major is standard)
            Bb: 'Bb'
        };

        // Normalize the key to match CIRCLE_OF_FIFTHS notation
        const normalizedKey = enharmonicMap[key] || key;

        const keyIndex = CIRCLE_OF_FIFTHS.indexOf(normalizedKey);
        if (keyIndex === -1) {
            return null;
        }

        // Determine if we should use flat notation based on the normalized key
        const useFlats =
            normalizedKey.includes('b') ||
            ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'].includes(normalizedKey);

        const dominantRaw = CIRCLE_OF_FIFTHS[(keyIndex + 1) % 12];
        const subdominantRaw = CIRCLE_OF_FIFTHS[(keyIndex - 1 + 12) % 12];

        // Convert to proper enharmonic equivalents if needed
        const dominant =
            useFlats && NOTES.enharmonic[dominantRaw] ? NOTES.enharmonic[dominantRaw] : dominantRaw;
        const subdominant =
            useFlats && NOTES.enharmonic[subdominantRaw]
                ? NOTES.enharmonic[subdominantRaw]
                : subdominantRaw;

        let relative;
        if (mode === 'major') {
            // Relative minor is a minor third down
            const relativeIndex = (this.getNoteIndex(key) - 3 + 12) % 12;
            relative = this.getProperNoteName(relativeIndex, null, useFlats);
        } else {
            // Relative major is a minor third up
            const relativeIndex = (this.getNoteIndex(key) + 3) % 12;
            relative = this.getProperNoteName(relativeIndex, null, useFlats);
        }

        return {
            dominant: { key: dominant, mode },
            subdominant: { key: subdominant, mode },
            relative: { key: relative, mode: mode === 'major' ? 'minor' : 'major' }
        };
    }

    /**
     * Get chord progressions for a key
     */
    getChordProgressions(key, mode = 'major') {
        return CHORD_PROGRESSIONS[mode] || {};
    }

    /**
     * Convert roman numeral to actual chord root note
     *
     * This is the KEY method that ensures progressions stay in the same key.
     * It maps roman numerals to scale degrees in the specified key.
     *
     * @param {string} roman - Roman numeral (e.g., 'ii', 'V', 'I')
     * @param {string} key - The key to use (e.g., 'C', 'G', 'F#')
     * @param {string} mode - 'major' or 'minor'
     * @returns {string} The chord root note in the specified key
     *
     * @example
     * // In C major:
     * romanToChord('ii', 'C', 'major')  // Returns 'D' (D minor)
     * romanToChord('V', 'C', 'major')   // Returns 'G' (G major)
     * romanToChord('I', 'C', 'major')   // Returns 'C' (C major)
     *
     * // In G major:
     * romanToChord('ii', 'G', 'major')  // Returns 'A' (A minor)
     * romanToChord('V', 'G', 'major')   // Returns 'D' (D major)
     * romanToChord('I', 'G', 'major')   // Returns 'G' (G major)
     *
     * @description
     * This method ensures that all chords in a progression are diatonic to the key:
     * 1. Gets the scale notes for the specified key and mode
     * 2. Maps the roman numeral to a scale degree (I=1st, ii=2nd, iii=3rd, etc.)
     * 3. Returns the corresponding note from the scale
     *
     * This guarantees that progressions never modulate or change keys unless
     * explicitly requested by changing the key parameter.
     */
    romanToChord(roman, key, mode = 'major') {
        if (!roman || !key) {
            return roman;
        }

        // Handle case insensitivity
        key = key.charAt(0).toUpperCase() + key.slice(1);
        mode = mode.toLowerCase();

        // Get the scale notes for this key - this is what keeps us in the same key
        const scaleNotes = this.getScaleNotes(key, mode);
        if (scaleNotes.length === 0) {
            return roman;
        }

        // Define the roman numerals for each scale degree
        // Major: I ii iii IV V vi vii°
        // Minor: i ii° III iv v VI VII
        const romanNumerals =
            mode === 'major'
                ? ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']
                : ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

        // Find which scale degree this roman numeral represents
        const index = romanNumerals.findIndex(r => r.toLowerCase() === roman.toLowerCase());

        // Return the corresponding note from the scale
        // This ensures the chord is diatonic to the key
        if (index !== -1 && scaleNotes[index]) {
            return scaleNotes[index];
        }
        return roman; // Return as-is if not found
    }

    /**
     * Get chord notes for a given root and quality.
     * Returns the notes that make up the specified chord.
     *
     * @param {string} root - The root note of the chord (e.g., 'C', 'F#', 'Bb')
     * @param {string} [quality='major'] - The chord quality ('major', 'minor', 'diminished', 'augmented')
     * @returns {string[]} Array of note names in the chord
     * @example
     * theory.getChordNotes('C', 'major'); // ['C', 'E', 'G']
     * theory.getChordNotes('A', 'minor'); // ['A', 'C', 'E']
     * theory.getChordNotes('B', 'diminished'); // ['B', 'D', 'F']
     */
    getChordNotes(root, quality = 'major') {
        if (!root) {
            return [];
        }

        // Handle case insensitivity
        root = root.charAt(0).toUpperCase() + root.slice(1);

        const rootIndex = this.getNoteIndex(root);
        const intervals = {
            major: [0, 4, 7],
            minor: [0, 3, 7],
            diminished: [0, 3, 6],
            augmented: [0, 4, 8],
            dominant7: [0, 4, 7, 10],
            major7: [0, 4, 7, 11],
            minor7: [0, 3, 7, 10]
        };

        const chordIntervals = intervals[quality] || intervals.major;

        // Determine if we should use flats based on the root note and chord context
        const useFlats = root.includes('b') || ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'].includes(root);

        return chordIntervals.map(interval => {
            const noteIndex = (rootIndex + interval) % 12;
            const chromaticNote = NOTES.chromatic[noteIndex];

            // For specific chord contexts, override the general flat/sharp preference
            if (quality === 'dominant7' && interval === 10) {
                // Dominant 7th should use flat notation (e.g., Bb not A#)
                return NOTES.enharmonic[chromaticNote] || chromaticNote;
            }

            // For augmented chords, prefer sharp notation for consistency
            if (quality === 'augmented') {
                return chromaticNote; // Use the sharp version from chromatic scale
            }

            return this.getProperNoteName(noteIndex, null, useFlats);
        });
    }

    /**
     * Get frequency for a note (A4 = 440Hz)
     */
    getNoteFrequency(note, octave = 4) {
        const noteIndex = this.getNoteIndex(note);
        const A4_INDEX = 9; // A is at index 9 in chromatic scale
        const semitoneOffset = noteIndex - A4_INDEX + (octave - 4) * 12;
        return 440 * Math.pow(2, semitoneOffset / 12);
    }

    /**
     * Validate if a key exists in our system
     */
    isValidKey(key, mode = 'major') {
        if (!key || typeof key !== 'string') {
            return false;
        }

        // Handle case insensitivity
        key = key.charAt(0).toUpperCase() + key.slice(1);
        mode = mode.toLowerCase();

        const keyData = mode === 'major' ? MAJOR_KEYS : MINOR_KEYS;
        return key in keyData;
    }

    /**
     * Get enharmonic equivalent of a note
     */
    getEnharmonic(note) {
        return NOTES.enharmonic[note] || note;
    }

    /**
     * Get all keys in circle of fifths order
     */
    getCircleOfFifthsKeys() {
        return [...CIRCLE_OF_FIFTHS];
    }

    /**
     * Get position of key in circle (0-11, where C=0)
     */
    getKeyPosition(key) {
        return CIRCLE_OF_FIFTHS.indexOf(key);
    }
}

// ES6 module exports
export {
    MusicTheory,
    CIRCLE_OF_FIFTHS,
    MAJOR_KEYS,
    MINOR_KEYS,
    CHORD_PROGRESSIONS,
    NOTES,
    SCALE_PATTERNS
};

// Set on window for debugging in console (development only)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    window.MusicTheory = MusicTheory;
    window.CIRCLE_OF_FIFTHS = CIRCLE_OF_FIFTHS;
    window.MAJOR_KEYS = MAJOR_KEYS;
    window.MINOR_KEYS = MINOR_KEYS;
    window.CHORD_PROGRESSIONS = CHORD_PROGRESSIONS;
}

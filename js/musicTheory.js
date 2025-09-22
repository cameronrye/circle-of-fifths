/**
 * Music Theory Data Model
 * Comprehensive data structures for keys, scales, chords, and their relationships
 */

// Note names and their enharmonic equivalents
const NOTES = {
    chromatic: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    enharmonic: {
        'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'
    }
};

// Circle of Fifths order (clockwise from C)
const CIRCLE_OF_FIFTHS = [
    'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'
];

// Major key signatures
const MAJOR_KEYS = {
    'C': { sharps: 0, flats: 0, signature: 'No sharps or flats', accidentals: [] },
    'G': { sharps: 1, flats: 0, signature: '1 sharp (F#)', accidentals: ['F#'] },
    'D': { sharps: 2, flats: 0, signature: '2 sharps (F#, C#)', accidentals: ['F#', 'C#'] },
    'A': { sharps: 3, flats: 0, signature: '3 sharps (F#, C#, G#)', accidentals: ['F#', 'C#', 'G#'] },
    'E': { sharps: 4, flats: 0, signature: '4 sharps (F#, C#, G#, D#)', accidentals: ['F#', 'C#', 'G#', 'D#'] },
    'B': { sharps: 5, flats: 0, signature: '5 sharps (F#, C#, G#, D#, A#)', accidentals: ['F#', 'C#', 'G#', 'D#', 'A#'] },
    'F#': { sharps: 6, flats: 0, signature: '6 sharps (F#, C#, G#, D#, A#, E#)', accidentals: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#'] },
    'C#': { sharps: 7, flats: 0, signature: '7 sharps (F#, C#, G#, D#, A#, E#, B#)', accidentals: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'] },
    'F': { sharps: 0, flats: 1, signature: '1 flat (Bb)', accidentals: ['Bb'] },
    'Bb': { sharps: 0, flats: 2, signature: '2 flats (Bb, Eb)', accidentals: ['Bb', 'Eb'] },
    'Eb': { sharps: 0, flats: 3, signature: '3 flats (Bb, Eb, Ab)', accidentals: ['Bb', 'Eb', 'Ab'] },
    'Ab': { sharps: 0, flats: 4, signature: '4 flats (Bb, Eb, Ab, Db)', accidentals: ['Bb', 'Eb', 'Ab', 'Db'] },
    'Db': { sharps: 0, flats: 5, signature: '5 flats (Bb, Eb, Ab, Db, Gb)', accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb'] },
    'Gb': { sharps: 0, flats: 6, signature: '6 flats (Bb, Eb, Ab, Db, Gb, Cb)', accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'] },
    'Cb': { sharps: 0, flats: 7, signature: '7 flats (Bb, Eb, Ab, Db, Gb, Cb, Fb)', accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb'] }
};

// Minor key signatures (relative to major)
const MINOR_KEYS = {
    'A': { relative: 'C', sharps: 0, flats: 0, signature: 'No sharps or flats', accidentals: [] },
    'E': { relative: 'G', sharps: 1, flats: 0, signature: '1 sharp (F#)', accidentals: ['F#'] },
    'B': { relative: 'D', sharps: 2, flats: 0, signature: '2 sharps (F#, C#)', accidentals: ['F#', 'C#'] },
    'F#': { relative: 'A', sharps: 3, flats: 0, signature: '3 sharps (F#, C#, G#)', accidentals: ['F#', 'C#', 'G#'] },
    'C#': { relative: 'E', sharps: 4, flats: 0, signature: '4 sharps (F#, C#, G#, D#)', accidentals: ['F#', 'C#', 'G#', 'D#'] },
    'G#': { relative: 'B', sharps: 5, flats: 0, signature: '5 sharps (F#, C#, G#, D#, A#)', accidentals: ['F#', 'C#', 'G#', 'D#', 'A#'] },
    'D#': { relative: 'F#', sharps: 6, flats: 0, signature: '6 sharps (F#, C#, G#, D#, A#, E#)', accidentals: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#'] },
    'A#': { relative: 'C#', sharps: 7, flats: 0, signature: '7 sharps (F#, C#, G#, D#, A#, E#, B#)', accidentals: ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#'] },
    'D': { relative: 'F', sharps: 0, flats: 1, signature: '1 flat (Bb)', accidentals: ['Bb'] },
    'G': { relative: 'Bb', sharps: 0, flats: 2, signature: '2 flats (Bb, Eb)', accidentals: ['Bb', 'Eb'] },
    'C': { relative: 'Eb', sharps: 0, flats: 3, signature: '3 flats (Bb, Eb, Ab)', accidentals: ['Bb', 'Eb', 'Ab'] },
    'F': { relative: 'Ab', sharps: 0, flats: 4, signature: '4 flats (Bb, Eb, Ab, Db)', accidentals: ['Bb', 'Eb', 'Ab', 'Db'] },
    'Bb': { relative: 'Db', sharps: 0, flats: 5, signature: '5 flats (Bb, Eb, Ab, Db, Gb)', accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb'] },
    'Eb': { relative: 'Gb', sharps: 0, flats: 6, signature: '6 flats (Bb, Eb, Ab, Db, Gb, Cb)', accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'] },
    'Ab': { relative: 'Cb', sharps: 0, flats: 7, signature: '7 flats (Bb, Eb, Ab, Db, Gb, Cb, Fb)', accidentals: ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb'] }
};

// Scale patterns (intervals in semitones)
const SCALE_PATTERNS = {
    major: [2, 2, 1, 2, 2, 2, 1], // W-W-H-W-W-W-H
    minor: [2, 1, 2, 2, 1, 2, 2], // W-H-W-W-H-W-W
    harmonicMinor: [2, 1, 2, 2, 1, 3, 1], // W-H-W-W-H-W+H-H
    melodicMinor: [2, 1, 2, 2, 2, 2, 1] // W-H-W-W-W-W-H (ascending)
};

// Chord progressions for each key
const CHORD_PROGRESSIONS = {
    major: {
        'I-V-vi-IV': { name: 'Pop Progression', roman: ['I', 'V', 'vi', 'IV'], description: 'Most popular progression in modern music' },
        'ii-V-I': { name: 'Jazz Progression', roman: ['ii', 'V', 'I'], description: 'Essential jazz cadence' },
        'vi-IV-I-V': { name: 'Circle Progression', roman: ['vi', 'IV', 'I', 'V'], description: 'Follows circle of fifths backwards' },
        'I-vi-ii-V': { name: 'Doo-Wop Progression', roman: ['I', 'vi', 'ii', 'V'], description: 'Classic 1950s progression' },
        'I-IV-V-I': { name: 'Basic Cadence', roman: ['I', 'IV', 'V', 'I'], description: 'Fundamental tonic-subdominant-dominant-tonic' }
    },
    minor: {
        'i-VII-VI-VII': { name: 'Minor Pop', roman: ['i', 'VII', 'VI', 'VII'], description: 'Popular minor progression' },
        'i-iv-V-i': { name: 'Minor Cadence', roman: ['i', 'iv', 'V', 'i'], description: 'Basic minor cadence' },
        'i-VI-III-VII': { name: 'Andalusian', roman: ['i', 'VI', 'III', 'VII'], description: 'Spanish/Flamenco progression' },
        'i-v-iv-i': { name: 'Natural Minor', roman: ['i', 'v', 'iv', 'i'], description: 'All natural minor chords' }
    }
};

/**
 * Music Theory Utility Class
 */
class MusicTheory {
    constructor() {
        this.currentKey = 'C';
        this.currentMode = 'major';
    }

    /**
     * Get note index in chromatic scale
     */
    getNoteIndex(note) {
        const cleanNote = note.replace(/[#b]/g, '');
        const accidental = note.includes('#') ? 1 : note.includes('b') ? -1 : 0;
        const baseIndex = NOTES.chromatic.indexOf(cleanNote);
        return (baseIndex + accidental + 12) % 12;
    }

    /**
     * Generate scale notes for a given key and mode
     */
    getScaleNotes(key, mode = 'major') {
        const pattern = SCALE_PATTERNS[mode];
        const startIndex = this.getNoteIndex(key);
        const notes = [];
        let currentIndex = startIndex;

        notes.push(NOTES.chromatic[currentIndex]);
        
        for (let i = 0; i < pattern.length - 1; i++) {
            currentIndex = (currentIndex + pattern[i]) % 12;
            notes.push(NOTES.chromatic[currentIndex]);
        }

        return notes;
    }

    /**
     * Get key signature information
     */
    getKeySignature(key, mode = 'major') {
        const keyData = mode === 'major' ? MAJOR_KEYS[key] : MINOR_KEYS[key];
        return keyData || { sharps: 0, flats: 0, signature: 'Unknown key', accidentals: [] };
    }

    /**
     * Get related keys (dominant, subdominant, relative)
     */
    getRelatedKeys(key, mode = 'major') {
        const keyIndex = CIRCLE_OF_FIFTHS.indexOf(key);
        if (keyIndex === -1) return null;

        const dominant = CIRCLE_OF_FIFTHS[(keyIndex + 1) % 12];
        const subdominant = CIRCLE_OF_FIFTHS[(keyIndex - 1 + 12) % 12];
        
        let relative;
        if (mode === 'major') {
            // Relative minor is a minor third down
            const relativeIndex = (this.getNoteIndex(key) - 3 + 12) % 12;
            relative = NOTES.chromatic[relativeIndex];
        } else {
            // Relative major is a minor third up
            const relativeIndex = (this.getNoteIndex(key) + 3) % 12;
            relative = NOTES.chromatic[relativeIndex];
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
     * Convert roman numeral to actual chord name
     */
    romanToChord(roman, key, mode = 'major') {
        const scaleNotes = this.getScaleNotes(key, mode);
        const romanNumerals = mode === 'major' 
            ? ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']
            : ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];
        
        const index = romanNumerals.findIndex(r => r.toLowerCase() === roman.toLowerCase());
        if (index !== -1 && scaleNotes[index]) {
            return scaleNotes[index];
        }
        return roman; // Return as-is if not found
    }

    /**
     * Get chord notes for a given root and quality
     */
    getChordNotes(root, quality = 'major') {
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
        return chordIntervals.map(interval => 
            NOTES.chromatic[(rootIndex + interval) % 12]
        );
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

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MusicTheory, CIRCLE_OF_FIFTHS, MAJOR_KEYS, MINOR_KEYS, CHORD_PROGRESSIONS };
} else {
    window.MusicTheory = MusicTheory;
    window.CIRCLE_OF_FIFTHS = CIRCLE_OF_FIFTHS;
    window.MAJOR_KEYS = MAJOR_KEYS;
    window.MINOR_KEYS = MINOR_KEYS;
    window.CHORD_PROGRESSIONS = CHORD_PROGRESSIONS;
}

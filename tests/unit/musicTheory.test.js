/**
 * Unit Tests for MusicTheory Module
 * Comprehensive tests covering all music theory calculations and functionality
 */

// Load the module under test
const {
    MusicTheory,
    CIRCLE_OF_FIFTHS,
    MAJOR_KEYS,
    MINOR_KEYS,
    CHORD_PROGRESSIONS
} = require('../../js/musicTheory.js');

describe('MusicTheory Module', () => {
    let musicTheory;

    beforeEach(() => {
        musicTheory = new MusicTheory();
    });

    describe('Constructor and Initial State', () => {
        test('should initialize with default key and mode', () => {
            expect(musicTheory.currentKey).toBe('C');
            expect(musicTheory.currentMode).toBe('major');
        });

        test('should be an instance of MusicTheory', () => {
            expect(musicTheory).toBeInstanceOf(MusicTheory);
        });
    });

    describe('getNoteIndex()', () => {
        test('should return correct index for natural notes', () => {
            expect(musicTheory.getNoteIndex('C')).toBe(0);
            expect(musicTheory.getNoteIndex('D')).toBe(2);
            expect(musicTheory.getNoteIndex('E')).toBe(4);
            expect(musicTheory.getNoteIndex('F')).toBe(5);
            expect(musicTheory.getNoteIndex('G')).toBe(7);
            expect(musicTheory.getNoteIndex('A')).toBe(9);
            expect(musicTheory.getNoteIndex('B')).toBe(11);
        });

        test('should return correct index for sharp notes', () => {
            expect(musicTheory.getNoteIndex('C#')).toBe(1);
            expect(musicTheory.getNoteIndex('D#')).toBe(3);
            expect(musicTheory.getNoteIndex('F#')).toBe(6);
            expect(musicTheory.getNoteIndex('G#')).toBe(8);
            expect(musicTheory.getNoteIndex('A#')).toBe(10);
        });

        test('should return correct index for flat notes', () => {
            expect(musicTheory.getNoteIndex('Db')).toBe(1);
            expect(musicTheory.getNoteIndex('Eb')).toBe(3);
            expect(musicTheory.getNoteIndex('Gb')).toBe(6);
            expect(musicTheory.getNoteIndex('Ab')).toBe(8);
            expect(musicTheory.getNoteIndex('Bb')).toBe(10);
        });

        test('should handle edge cases', () => {
            expect(musicTheory.getNoteIndex('B#')).toBe(0); // B# = C
            expect(musicTheory.getNoteIndex('Cb')).toBe(11); // Cb = B
            expect(musicTheory.getNoteIndex('E#')).toBe(5); // E# = F
            expect(musicTheory.getNoteIndex('Fb')).toBe(4); // Fb = E
        });
    });

    describe('getScaleNotes()', () => {
        test('should return correct major scale notes', () => {
            expect(musicTheory.getScaleNotes('C', 'major')).toEqual([
                'C',
                'D',
                'E',
                'F',
                'G',
                'A',
                'B'
            ]);
            expect(musicTheory.getScaleNotes('G', 'major')).toEqual([
                'G',
                'A',
                'B',
                'C',
                'D',
                'E',
                'F#'
            ]);
            expect(musicTheory.getScaleNotes('F', 'major')).toEqual([
                'F',
                'G',
                'A',
                'Bb',
                'C',
                'D',
                'E'
            ]);
        });

        test('should return correct minor scale notes', () => {
            expect(musicTheory.getScaleNotes('A', 'minor')).toEqual([
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G'
            ]);
            expect(musicTheory.getScaleNotes('E', 'minor')).toEqual([
                'E',
                'F#',
                'G',
                'A',
                'B',
                'C',
                'D'
            ]);
            expect(musicTheory.getScaleNotes('D', 'minor')).toEqual([
                'D',
                'E',
                'F',
                'G',
                'A',
                'Bb',
                'C'
            ]);
        });

        test('should return correct harmonic minor scale notes', () => {
            expect(musicTheory.getScaleNotes('A', 'harmonicMinor')).toEqual([
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G#'
            ]);
            expect(musicTheory.getScaleNotes('E', 'harmonicMinor')).toEqual([
                'E',
                'F#',
                'G',
                'A',
                'B',
                'C',
                'D#'
            ]);
        });

        test('should return correct melodic minor scale notes', () => {
            expect(musicTheory.getScaleNotes('A', 'melodicMinor')).toEqual([
                'A',
                'B',
                'C',
                'D',
                'E',
                'F#',
                'G#'
            ]);
            expect(musicTheory.getScaleNotes('C', 'melodicMinor')).toEqual([
                'C',
                'D',
                'Eb',
                'F',
                'G',
                'A',
                'B'
            ]);
        });

        test('should default to major scale when mode not specified', () => {
            expect(musicTheory.getScaleNotes('C')).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
        });

        test('should handle all 12 chromatic keys', () => {
            const allKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            allKeys.forEach(key => {
                const scale = musicTheory.getScaleNotes(key, 'major');
                expect(scale).toHaveLength(7);
                expect(scale[0]).toBe(key);
            });
        });
    });

    describe('getKeySignature()', () => {
        test('should return correct major key signatures', () => {
            expect(musicTheory.getKeySignature('C', 'major')).toEqual({
                sharps: 0,
                flats: 0,
                signature: 'No sharps or flats',
                accidentals: []
            });
            expect(musicTheory.getKeySignature('G', 'major')).toEqual({
                sharps: 1,
                flats: 0,
                signature: '1 sharp (F#)',
                accidentals: ['F#']
            });
            expect(musicTheory.getKeySignature('F', 'major')).toEqual({
                sharps: 0,
                flats: 1,
                signature: '1 flat (Bb)',
                accidentals: ['Bb']
            });
        });

        test('should return correct minor key signatures', () => {
            expect(musicTheory.getKeySignature('A', 'minor')).toEqual({
                relative: 'C',
                sharps: 0,
                flats: 0,
                signature: 'No sharps or flats',
                accidentals: []
            });
            expect(musicTheory.getKeySignature('E', 'minor')).toEqual({
                relative: 'G',
                sharps: 1,
                flats: 0,
                signature: '1 sharp (F#)',
                accidentals: ['F#']
            });
            expect(musicTheory.getKeySignature('D', 'minor')).toEqual({
                relative: 'F',
                sharps: 0,
                flats: 1,
                signature: '1 flat (Bb)',
                accidentals: ['Bb']
            });
        });

        test('should return default for unknown keys', () => {
            expect(musicTheory.getKeySignature('X', 'major')).toEqual({
                sharps: 0,
                flats: 0,
                signature: 'Unknown key',
                accidentals: []
            });
        });

        test('should default to major mode when not specified', () => {
            const result = musicTheory.getKeySignature('G');
            expect(result.sharps).toBe(1);
            expect(result.signature).toBe('1 sharp (F#)');
        });
    });

    describe('getRelatedKeys()', () => {
        test('should return correct related keys for major keys', () => {
            const related = musicTheory.getRelatedKeys('C', 'major');
            expect(related).toEqual({
                dominant: { key: 'G', mode: 'major' },
                subdominant: { key: 'F', mode: 'major' },
                relative: { key: 'A', mode: 'minor' }
            });
        });

        test('should return correct related keys for minor keys', () => {
            const related = musicTheory.getRelatedKeys('A', 'minor');
            expect(related).toEqual({
                dominant: { key: 'E', mode: 'minor' },
                subdominant: { key: 'D', mode: 'minor' },
                relative: { key: 'C', mode: 'major' }
            });
        });

        test('should handle edge cases in circle of fifths', () => {
            const relatedF = musicTheory.getRelatedKeys('F', 'major');
            expect(relatedF.dominant.key).toBe('C');
            expect(relatedF.subdominant.key).toBe('Bb');

            const relatedB = musicTheory.getRelatedKeys('B', 'major');
            expect(relatedB.dominant.key).toBe('F#');
            expect(relatedB.subdominant.key).toBe('E');
        });

        test('should return null for invalid keys', () => {
            expect(musicTheory.getRelatedKeys('X', 'major')).toBeNull();
        });

        test('should default to major mode when not specified', () => {
            const related = musicTheory.getRelatedKeys('G');
            expect(related.dominant.mode).toBe('major');
            expect(related.subdominant.mode).toBe('major');
            expect(related.relative.mode).toBe('minor');
        });
    });

    describe('getChordProgressions()', () => {
        test('should return major chord progressions', () => {
            const progressions = musicTheory.getChordProgressions('C', 'major');
            expect(progressions).toHaveProperty('I-V-vi-IV');
            expect(progressions).toHaveProperty('ii-V-I');
            expect(progressions['I-V-vi-IV'].name).toBe('Pop Progression');
            expect(progressions['ii-V-I'].name).toBe('Jazz Progression');
        });

        test('should return minor chord progressions', () => {
            const progressions = musicTheory.getChordProgressions('A', 'minor');
            expect(progressions).toHaveProperty('i-VII-VI-VII');
            expect(progressions).toHaveProperty('i-iv-V-i');
            expect(progressions['i-VII-VI-VII'].name).toBe('Minor Pop');
            expect(progressions['i-iv-V-i'].name).toBe('Minor Cadence');
        });

        test('should return empty object for invalid mode', () => {
            expect(musicTheory.getChordProgressions('C', 'invalid')).toEqual({});
        });

        test('should default to major mode when not specified', () => {
            const progressions = musicTheory.getChordProgressions('C');
            expect(progressions).toHaveProperty('I-V-vi-IV');
        });
    });

    describe('romanToChord()', () => {
        test('should convert major roman numerals to chord names', () => {
            expect(musicTheory.romanToChord('I', 'C', 'major')).toBe('C');
            expect(musicTheory.romanToChord('ii', 'C', 'major')).toBe('D');
            expect(musicTheory.romanToChord('V', 'C', 'major')).toBe('G');
            expect(musicTheory.romanToChord('vi', 'C', 'major')).toBe('A');
        });

        test('should convert minor roman numerals to chord names', () => {
            expect(musicTheory.romanToChord('i', 'A', 'minor')).toBe('A');
            expect(musicTheory.romanToChord('III', 'A', 'minor')).toBe('C');
            expect(musicTheory.romanToChord('v', 'A', 'minor')).toBe('E');
            expect(musicTheory.romanToChord('VI', 'A', 'minor')).toBe('F');
        });

        test('should be case insensitive', () => {
            expect(musicTheory.romanToChord('i', 'C', 'major')).toBe('C');
            expect(musicTheory.romanToChord('I', 'A', 'minor')).toBe('A');
        });

        test('should return original roman numeral if not found', () => {
            expect(musicTheory.romanToChord('VIII', 'C', 'major')).toBe('VIII');
            expect(musicTheory.romanToChord('invalid', 'C', 'major')).toBe('invalid');
        });

        test('should default to major mode when not specified', () => {
            expect(musicTheory.romanToChord('I', 'C')).toBe('C');
        });
    });

    describe('getChordNotes()', () => {
        test('should return correct major chord notes', () => {
            expect(musicTheory.getChordNotes('C', 'major')).toEqual(['C', 'E', 'G']);
            expect(musicTheory.getChordNotes('G', 'major')).toEqual(['G', 'B', 'D']);
            expect(musicTheory.getChordNotes('F', 'major')).toEqual(['F', 'A', 'C']);
        });

        test('should return correct minor chord notes', () => {
            expect(musicTheory.getChordNotes('A', 'minor')).toEqual(['A', 'C', 'E']);
            expect(musicTheory.getChordNotes('E', 'minor')).toEqual(['E', 'G', 'B']);
            expect(musicTheory.getChordNotes('D', 'minor')).toEqual(['D', 'F', 'A']);
        });

        test('should return correct diminished chord notes', () => {
            expect(musicTheory.getChordNotes('B', 'diminished')).toEqual(['B', 'D', 'F']);
            expect(musicTheory.getChordNotes('F#', 'diminished')).toEqual(['F#', 'A', 'C']);
        });

        test('should return correct augmented chord notes', () => {
            expect(musicTheory.getChordNotes('C', 'augmented')).toEqual(['C', 'E', 'G#']);
            expect(musicTheory.getChordNotes('F', 'augmented')).toEqual(['F', 'A', 'C#']);
        });

        test('should return correct seventh chord notes', () => {
            expect(musicTheory.getChordNotes('C', 'dominant7')).toEqual(['C', 'E', 'G', 'Bb']);
            expect(musicTheory.getChordNotes('C', 'major7')).toEqual(['C', 'E', 'G', 'B']);
            expect(musicTheory.getChordNotes('A', 'minor7')).toEqual(['A', 'C', 'E', 'G']);
        });

        test('should default to major chord when quality not specified', () => {
            expect(musicTheory.getChordNotes('C')).toEqual(['C', 'E', 'G']);
        });

        test('should handle unknown chord qualities by defaulting to major', () => {
            expect(musicTheory.getChordNotes('C', 'unknown')).toEqual(['C', 'E', 'G']);
        });
    });

    describe('getNoteFrequency()', () => {
        test('should return correct frequency for A4', () => {
            expect(musicTheory.getNoteFrequency('A', 4)).toBeCloseTo(440, 2);
        });

        test('should return correct frequencies for other notes in octave 4', () => {
            expect(musicTheory.getNoteFrequency('C', 4)).toBeCloseTo(261.63, 2);
            expect(musicTheory.getNoteFrequency('E', 4)).toBeCloseTo(329.63, 2);
            expect(musicTheory.getNoteFrequency('G', 4)).toBeCloseTo(392.0, 2);
        });

        test('should handle different octaves', () => {
            expect(musicTheory.getNoteFrequency('A', 3)).toBeCloseTo(220, 2);
            expect(musicTheory.getNoteFrequency('A', 5)).toBeCloseTo(880, 2);
            expect(musicTheory.getNoteFrequency('C', 5)).toBeCloseTo(523.25, 2);
        });

        test('should handle sharp and flat notes', () => {
            expect(musicTheory.getNoteFrequency('A#', 4)).toBeCloseTo(466.16, 2);
            expect(musicTheory.getNoteFrequency('Bb', 4)).toBeCloseTo(466.16, 2);
            expect(musicTheory.getNoteFrequency('F#', 4)).toBeCloseTo(369.99, 2);
        });

        test('should default to octave 4 when not specified', () => {
            expect(musicTheory.getNoteFrequency('A')).toBeCloseTo(440, 2);
        });
    });

    describe('isValidKey()', () => {
        test('should return true for valid major keys', () => {
            expect(musicTheory.isValidKey('C', 'major')).toBe(true);
            expect(musicTheory.isValidKey('G', 'major')).toBe(true);
            expect(musicTheory.isValidKey('F#', 'major')).toBe(true);
            expect(musicTheory.isValidKey('Bb', 'major')).toBe(true);
        });

        test('should return true for valid minor keys', () => {
            expect(musicTheory.isValidKey('A', 'minor')).toBe(true);
            expect(musicTheory.isValidKey('E', 'minor')).toBe(true);
            expect(musicTheory.isValidKey('F#', 'minor')).toBe(true);
            expect(musicTheory.isValidKey('C', 'minor')).toBe(true);
        });

        test('should return false for invalid keys', () => {
            expect(musicTheory.isValidKey('X', 'major')).toBe(false);
            expect(musicTheory.isValidKey('H', 'minor')).toBe(false);
            expect(musicTheory.isValidKey('', 'major')).toBe(false);
        });

        test('should default to major mode when not specified', () => {
            expect(musicTheory.isValidKey('C')).toBe(true);
            expect(musicTheory.isValidKey('X')).toBe(false);
        });
    });

    describe('getEnharmonic()', () => {
        test('should return enharmonic equivalents for sharp notes', () => {
            expect(musicTheory.getEnharmonic('C#')).toBe('Db');
            expect(musicTheory.getEnharmonic('D#')).toBe('Eb');
            expect(musicTheory.getEnharmonic('F#')).toBe('Gb');
            expect(musicTheory.getEnharmonic('G#')).toBe('Ab');
            expect(musicTheory.getEnharmonic('A#')).toBe('Bb');
        });

        test('should return original note if no enharmonic equivalent exists', () => {
            expect(musicTheory.getEnharmonic('C')).toBe('C');
            expect(musicTheory.getEnharmonic('D')).toBe('D');
            expect(musicTheory.getEnharmonic('E')).toBe('E');
            expect(musicTheory.getEnharmonic('Db')).toBe('Db');
        });
    });

    describe('getCircleOfFifthsKeys()', () => {
        test('should return all keys in circle of fifths order', () => {
            const keys = musicTheory.getCircleOfFifthsKeys();
            expect(keys).toEqual(['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F']);
            expect(keys).toHaveLength(12);
        });

        test('should return a copy of the array', () => {
            const keys1 = musicTheory.getCircleOfFifthsKeys();
            const keys2 = musicTheory.getCircleOfFifthsKeys();
            expect(keys1).not.toBe(keys2); // Different array instances
            expect(keys1).toEqual(keys2); // Same content
        });
    });

    describe('getKeyPosition()', () => {
        test('should return correct positions for all keys', () => {
            expect(musicTheory.getKeyPosition('C')).toBe(0);
            expect(musicTheory.getKeyPosition('G')).toBe(1);
            expect(musicTheory.getKeyPosition('D')).toBe(2);
            expect(musicTheory.getKeyPosition('F')).toBe(11);
        });

        test('should return -1 for invalid keys', () => {
            expect(musicTheory.getKeyPosition('X')).toBe(-1);
            expect(musicTheory.getKeyPosition('')).toBe(-1);
        });
    });

    describe('Constants and Data Structures', () => {
        test('CIRCLE_OF_FIFTHS should contain all 12 keys', () => {
            expect(CIRCLE_OF_FIFTHS).toHaveLength(12);
            expect(CIRCLE_OF_FIFTHS[0]).toBe('C');
            expect(CIRCLE_OF_FIFTHS[11]).toBe('F');
        });

        test('MAJOR_KEYS should contain all major key signatures', () => {
            expect(Object.keys(MAJOR_KEYS)).toHaveLength(15); // Including enharmonic equivalents
            expect(MAJOR_KEYS['C']).toBeDefined();
            expect(MAJOR_KEYS['F#']).toBeDefined();
            expect(MAJOR_KEYS['Gb']).toBeDefined();
        });

        test('MINOR_KEYS should contain all minor key signatures', () => {
            expect(Object.keys(MINOR_KEYS)).toHaveLength(15); // Including enharmonic equivalents
            expect(MINOR_KEYS['A']).toBeDefined();
            expect(MINOR_KEYS['F#']).toBeDefined();
            expect(MINOR_KEYS['Gb']).toBeDefined();
        });

        test('CHORD_PROGRESSIONS should contain major and minor progressions', () => {
            expect(CHORD_PROGRESSIONS.major).toBeDefined();
            expect(CHORD_PROGRESSIONS.minor).toBeDefined();
            expect(Object.keys(CHORD_PROGRESSIONS.major).length).toBeGreaterThan(0);
            expect(Object.keys(CHORD_PROGRESSIONS.minor).length).toBeGreaterThan(0);
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle empty strings gracefully', () => {
            expect(() => musicTheory.getNoteIndex('')).not.toThrow();
            expect(() => musicTheory.getScaleNotes('')).not.toThrow();
        });

        test('should handle null and undefined inputs', () => {
            expect(() => musicTheory.getKeySignature(null)).not.toThrow();
            expect(() => musicTheory.getRelatedKeys(undefined)).not.toThrow();
        });

        test('should handle case sensitivity', () => {
            expect(musicTheory.getScaleNotes('c', 'major')).toEqual([
                'C',
                'D',
                'E',
                'F',
                'G',
                'A',
                'B'
            ]);
            expect(musicTheory.romanToChord('i', 'C', 'MAJOR')).toBe('C');
        });
    });
});

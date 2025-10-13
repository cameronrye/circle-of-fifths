/**
 * Simple MusicTheory Tests
 */

// MusicTheory is loaded globally by the test runner

describe('MusicTheory Simple Tests', () => {
    test('should create MusicTheory instance', () => {
        const musicTheory = new MusicTheory();
        expect(musicTheory).toBeDefined();
        expect(musicTheory.currentKey).toBe('C');
        expect(musicTheory.currentMode).toBe('major');
    });

    test('should get note index correctly', () => {
        const musicTheory = new MusicTheory();
        expect(musicTheory.getNoteIndex('C')).toBe(0);
        expect(musicTheory.getNoteIndex('D')).toBe(2);
        expect(musicTheory.getNoteIndex('E')).toBe(4);
    });

    test('should get scale notes correctly', () => {
        const musicTheory = new MusicTheory();
        const scale = musicTheory.getScaleNotes('C', 'major');
        expect(scale).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    });

    test('should get chord notes correctly', () => {
        const musicTheory = new MusicTheory();
        const chord = musicTheory.getChordNotes('C', 'major');
        expect(chord).toEqual(['C', 'E', 'G']);
    });
});

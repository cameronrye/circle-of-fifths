/**
 * Voice Leading Tests
 * Tests for improved chord voicing and voice leading algorithms
 */

const AudioEngine = require('../../js/audioEngine.js');
const { MusicTheory } = require('../../js/musicTheory.js');

describe('Voice Leading', () => {
    let audioEngine;
    let musicTheory;

    beforeEach(() => {
        audioEngine = new AudioEngine();
        musicTheory = new MusicTheory();
    });

    afterEach(() => {
        if (audioEngine) {
            audioEngine.dispose();
        }
    });

    describe('createChordVoicing()', () => {
        test('should create voicing in comfortable range (octave 3-4)', () => {
            const notes = ['C', 'E', 'G'];
            const voicing = audioEngine.createChordVoicing(notes, 3);

            expect(voicing).toHaveLength(3);
            
            // Check that all notes are in reasonable range (octave 3-4)
            voicing.forEach(voice => {
                expect(voice.octave).toBeGreaterThanOrEqual(3);
                expect(voice.octave).toBeLessThanOrEqual(4);
            });
        });

        test('should create close position voicing', () => {
            const notes = ['C', 'E', 'G'];
            const voicing = audioEngine.createChordVoicing(notes, 3);

            // Calculate MIDI numbers
            const getMidi = (voice) => musicTheory.getNoteIndex(voice.note) + voice.octave * 12;
            const midiNumbers = voicing.map(getMidi);

            // Check that voicing spans less than 2 octaves
            const span = midiNumbers[midiNumbers.length - 1] - midiNumbers[0];
            expect(span).toBeLessThanOrEqual(19); // Octave + perfect 5th
        });

        test('should maintain ascending order of notes', () => {
            const notes = ['C', 'E', 'G'];
            const voicing = audioEngine.createChordVoicing(notes, 3);

            const getMidi = (voice) => musicTheory.getNoteIndex(voice.note) + voice.octave * 12;
            const midiNumbers = voicing.map(getMidi);

            // Each note should be higher than or equal to the previous
            for (let i = 1; i < midiNumbers.length; i++) {
                expect(midiNumbers[i]).toBeGreaterThanOrEqual(midiNumbers[i - 1]);
            }
        });

        test('should add pan positions for stereo spread', () => {
            const notes = ['C', 'E', 'G'];
            const voicing = audioEngine.createChordVoicing(notes, 3);

            voicing.forEach(voice => {
                expect(voice).toHaveProperty('pan');
                expect(voice.pan).toBeGreaterThanOrEqual(-0.5);
                expect(voice.pan).toBeLessThanOrEqual(0.5);
            });
        });
    });

    describe('findOptimalVoiceAssignment()', () => {
        test('should preserve common tones', () => {
            // C major to G major - G is common tone
            const cMajor = audioEngine.createChordVoicing(['C', 'E', 'G'], 3);
            const gMajor = audioEngine.createChordVoicing(['G', 'B', 'D'], 3);

            const assignment = audioEngine.findOptimalVoiceAssignment(cMajor, gMajor);

            // Find the movement for the G note (common tone)
            const gMovement = assignment.movements.find(m => m.from.note === 'G');
            expect(gMovement).toBeDefined();
            expect(gMovement.to.note).toBe('G');
            // Common tone should stay in same octave or move minimally
            expect(gMovement.distance).toBeLessThanOrEqual(12); // At most one octave
        });

        test('should minimize total voice movement', () => {
            const cMajor = audioEngine.createChordVoicing(['C', 'E', 'G'], 3);
            const gMajor = audioEngine.createChordVoicing(['G', 'B', 'D'], 3);

            const assignment = audioEngine.findOptimalVoiceAssignment(cMajor, gMajor);

            // Total movement should be reasonable (mostly stepwise motion)
            // With optimal voice leading, this should be around 15-25 semitones for 3 voices
            expect(assignment.totalMovement).toBeLessThan(25); // Reasonable total movement
        });

        test('should return movement metrics', () => {
            const cMajor = audioEngine.createChordVoicing(['C', 'E', 'G'], 3);
            const gMajor = audioEngine.createChordVoicing(['G', 'B', 'D'], 3);

            const assignment = audioEngine.findOptimalVoiceAssignment(cMajor, gMajor);

            expect(assignment).toHaveProperty('movements');
            expect(assignment).toHaveProperty('totalMovement');
            expect(assignment).toHaveProperty('maxLeap');
            expect(assignment).toHaveProperty('topVoiceMovement');
        });

        test('should handle empty voicings gracefully', () => {
            const assignment = audioEngine.findOptimalVoiceAssignment([], []);
            
            expect(assignment.totalMovement).toBe(0);
            expect(assignment.movements).toHaveLength(0);
        });
    });

    describe('generateVoicingCandidates()', () => {
        test('should generate multiple voicing options', () => {
            const notes = ['C', 'E', 'G'];
            const candidates = audioEngine.generateVoicingCandidates(notes, 3);

            // Should generate inversions × octaves = 3 × 3 = 9 candidates
            expect(candidates.length).toBeGreaterThan(5);
        });

        test('should include different inversions', () => {
            const notes = ['C', 'E', 'G'];
            const candidates = audioEngine.generateVoicingCandidates(notes, 3);

            // Check that we have different bass notes (different inversions)
            const bassNotes = new Set(candidates.map(v => v[0].note));
            expect(bassNotes.size).toBeGreaterThan(1);
        });
    });

    describe('scoreVoicing()', () => {
        test('should score voicings (lower is better)', () => {
            const cMajor = audioEngine.createChordVoicing(['C', 'E', 'G'], 3);
            const score = audioEngine.scoreVoicing(cMajor);

            expect(typeof score).toBe('number');
            expect(score).toBeGreaterThanOrEqual(0);
        });

        test('should prefer smooth voice leading', () => {
            const cMajor = audioEngine.createChordVoicing(['C', 'E', 'G'], 3);
            
            // Create two F major voicings - one smooth, one with large leaps
            const fMajorSmooth = audioEngine.createChordVoicing(['F', 'A', 'C'], 3);
            const fMajorWide = audioEngine.createChordVoicing(['F', 'A', 'C'], 5);

            const scoreSmooth = audioEngine.scoreVoicing(fMajorSmooth, cMajor);
            const scoreWide = audioEngine.scoreVoicing(fMajorWide, cMajor);

            // Smooth voicing should have lower (better) score
            expect(scoreSmooth).toBeLessThan(scoreWide);
        });
    });

    describe('optimizeChordVoicing()', () => {
        test('should return a voicing when no previous voicing exists', () => {
            const notes = ['C', 'E', 'G'];
            const voicing = audioEngine.optimizeChordVoicing(notes, null, 3);

            expect(voicing).toBeDefined();
            expect(voicing.length).toBe(3);
        });

        test('should optimize voice leading between chords', () => {
            const cMajor = audioEngine.createChordVoicing(['C', 'E', 'G'], 3);
            const fMajorOptimized = audioEngine.optimizeChordVoicing(['F', 'A', 'C'], cMajor, 3);

            const assignment = audioEngine.findOptimalVoiceAssignment(cMajor, fMajorOptimized);

            // Should have smooth voice leading
            expect(assignment.totalMovement).toBeLessThan(10);
        });

        test('should preserve common tones in progressions', () => {
            // C major to G major - G is common tone
            const cMajor = audioEngine.createChordVoicing(['C', 'E', 'G'], 3);
            const gMajorOptimized = audioEngine.optimizeChordVoicing(['G', 'B', 'D'], cMajor, 3);

            const assignment = audioEngine.findOptimalVoiceAssignment(cMajor, gMajorOptimized);

            // Find the G note movement
            const gMovement = assignment.movements.find(m => m.from.note === 'G');
            expect(gMovement).toBeDefined();
            expect(gMovement.to.note).toBe('G');
            expect(gMovement.distance).toBeLessThanOrEqual(12); // Should stay close or same octave
        });

        test('should create smooth top voice melody', () => {
            // Test a common progression: I-IV-V-I in C major
            const chords = [
                ['C', 'E', 'G'],  // I
                ['F', 'A', 'C'],  // IV
                ['G', 'B', 'D'],  // V
                ['C', 'E', 'G']   // I
            ];

            let previousVoicing = null;
            const topVoiceMovements = [];

            chords.forEach(chordNotes => {
                const voicing = audioEngine.optimizeChordVoicing(chordNotes, previousVoicing, 3);
                
                if (previousVoicing) {
                    const assignment = audioEngine.findOptimalVoiceAssignment(previousVoicing, voicing);
                    topVoiceMovements.push(assignment.topVoiceMovement);
                }
                
                previousVoicing = voicing;
            });

            // Top voice should move smoothly (mostly steps and small skips)
            topVoiceMovements.forEach(movement => {
                expect(movement).toBeLessThanOrEqual(5); // No more than a perfect 4th
            });
        });
    });

    describe('Integration: Chord Progressions', () => {
        test('should create smooth I-IV-V-I progression', () => {
            const chords = [
                ['C', 'E', 'G'],  // I
                ['F', 'A', 'C'],  // IV
                ['G', 'B', 'D'],  // V
                ['C', 'E', 'G']   // I
            ];

            let previousVoicing = null;
            let totalMovement = 0;

            chords.forEach(chordNotes => {
                const voicing = audioEngine.optimizeChordVoicing(chordNotes, previousVoicing, 3);
                
                if (previousVoicing) {
                    const assignment = audioEngine.findOptimalVoiceAssignment(previousVoicing, voicing);
                    totalMovement += assignment.totalMovement;
                }
                
                previousVoicing = voicing;
            });

            // Total movement for entire progression should be minimal
            expect(totalMovement).toBeLessThan(20); // Very smooth voice leading
        });

        test('should create smooth ii-V-I jazz progression', () => {
            const chords = [
                ['D', 'F', 'A'],  // ii (Dm)
                ['G', 'B', 'D'],  // V (G)
                ['C', 'E', 'G']   // I (C)
            ];

            let previousVoicing = null;
            const movements = [];

            chords.forEach(chordNotes => {
                const voicing = audioEngine.optimizeChordVoicing(chordNotes, previousVoicing, 3);
                
                if (previousVoicing) {
                    const assignment = audioEngine.findOptimalVoiceAssignment(previousVoicing, voicing);
                    movements.push(assignment.totalMovement);
                }
                
                previousVoicing = voicing;
            });

            // Each chord change should be smooth
            movements.forEach(movement => {
                expect(movement).toBeLessThan(8);
            });
        });
    });
});


/**
 * Unit Tests for ii-V-I Chord Progression
 * Tests to verify the ii-V-I progression stays in key when looping
 */

describe('ii-V-I Progression Tests', () => {
    let musicTheory;
    let audioEngine;

    beforeEach(() => {
        musicTheory = new MusicTheory();
        audioEngine = new AudioEngine(musicTheory);
    });

    describe('Progression Definition', () => {
        test('should have correct ii-V-I progression definition', () => {
            const progressions = musicTheory.getChordProgressions('C', 'major');
            expect(progressions).toHaveProperty('ii-V-I');
            expect(progressions['ii-V-I'].roman).toEqual(['ii', 'V', 'I']);
            expect(progressions['ii-V-I'].name).toBe('Jazz Progression');
        });

        test('should map roman numerals to correct chords in C major', () => {
            const key = 'C';
            const mode = 'major';
            
            const ii = musicTheory.romanToChord('ii', key, mode);
            const V = musicTheory.romanToChord('V', key, mode);
            const I = musicTheory.romanToChord('I', key, mode);
            
            expect(ii).toBe('D'); // ii chord in C major is D minor
            expect(V).toBe('G');  // V chord in C major is G major
            expect(I).toBe('C');  // I chord in C major is C major
        });

        test('should have correct chord qualities', () => {
            const mode = 'major';
            
            const iiQuality = audioEngine.getChordQuality('ii', mode);
            const VQuality = audioEngine.getChordQuality('V', mode);
            const IQuality = audioEngine.getChordQuality('I', mode);
            
            expect(iiQuality).toBe('minor');     // ii is minor
            expect(VQuality).toBe('major');      // V is major (dominant)
            expect(IQuality).toBe('major');      // I is major (tonic)
        });

        test('should generate correct chord notes in C major', () => {
            const key = 'C';
            const mode = 'major';
            
            const iiRoot = musicTheory.romanToChord('ii', key, mode);
            const VRoot = musicTheory.romanToChord('V', key, mode);
            const IRoot = musicTheory.romanToChord('I', key, mode);
            
            const iiQuality = audioEngine.getChordQuality('ii', mode);
            const VQuality = audioEngine.getChordQuality('V', mode);
            const IQuality = audioEngine.getChordQuality('I', mode);
            
            const iiNotes = musicTheory.getChordNotes(iiRoot, iiQuality);
            const VNotes = musicTheory.getChordNotes(VRoot, VQuality);
            const INotes = musicTheory.getChordNotes(IRoot, IQuality);
            
            expect(iiNotes).toEqual(['D', 'F', 'A']);   // D minor
            expect(VNotes).toEqual(['G', 'B', 'D']);    // G major
            expect(INotes).toEqual(['C', 'E', 'G']);    // C major
        });
    });

    describe('Diatonic Verification', () => {
        test('all chord notes should be diatonic to C major', () => {
            const key = 'C';
            const mode = 'major';
            const scaleNotes = musicTheory.getScaleNotes(key, mode);
            
            // Get all chord notes
            const progression = musicTheory.getChordProgressions(key, mode)['ii-V-I'];
            
            progression.roman.forEach(romanNumeral => {
                const chordRoot = musicTheory.romanToChord(romanNumeral, key, mode);
                const chordQuality = audioEngine.getChordQuality(romanNumeral, mode);
                const chordNotes = musicTheory.getChordNotes(chordRoot, chordQuality);
                
                // All chord notes should be in the scale
                chordNotes.forEach(note => {
                    expect(scaleNotes).toContain(note);
                });
            });
        });

        test('all chord notes should be diatonic to G major', () => {
            const key = 'G';
            const mode = 'major';
            const scaleNotes = musicTheory.getScaleNotes(key, mode);
            
            const progression = musicTheory.getChordProgressions(key, mode)['ii-V-I'];
            
            progression.roman.forEach(romanNumeral => {
                const chordRoot = musicTheory.romanToChord(romanNumeral, key, mode);
                const chordQuality = audioEngine.getChordQuality(romanNumeral, mode);
                const chordNotes = musicTheory.getChordNotes(chordRoot, chordQuality);
                
                chordNotes.forEach(note => {
                    expect(scaleNotes).toContain(note);
                });
            });
        });
    });

    describe('Loop Consistency', () => {
        test('should maintain same key across multiple loop iterations', () => {
            const key = 'C';
            const mode = 'major';
            const progressionName = 'ii-V-I';
            const scaleNotes = musicTheory.getScaleNotes(key, mode);
            
            // Simulate 3 loop iterations
            for (let iteration = 0; iteration < 3; iteration++) {
                const progression = musicTheory.getChordProgressions(key, mode)[progressionName];
                
                progression.roman.forEach(romanNumeral => {
                    const chordRoot = musicTheory.romanToChord(romanNumeral, key, mode);
                    const chordQuality = audioEngine.getChordQuality(romanNumeral, mode);
                    const chordNotes = musicTheory.getChordNotes(chordRoot, chordQuality);
                    
                    // Verify all notes are in the original key
                    chordNotes.forEach(note => {
                        expect(scaleNotes).toContain(note);
                    });
                });
            }
        });

        test('should maintain correct chord roots across loops', () => {
            const key = 'C';
            const mode = 'major';
            const progressionName = 'ii-V-I';
            
            const expectedRoots = ['D', 'G', 'C']; // ii, V, I in C major
            
            // Test 3 iterations
            for (let iteration = 0; iteration < 3; iteration++) {
                const progression = musicTheory.getChordProgressions(key, mode)[progressionName];
                
                progression.roman.forEach((romanNumeral, index) => {
                    const chordRoot = musicTheory.romanToChord(romanNumeral, key, mode);
                    expect(chordRoot).toBe(expectedRoots[index]);
                });
            }
        });
    });

    describe('Voice Leading', () => {
        test('should have smooth voice leading within progression', () => {
            const key = 'C';
            const mode = 'major';
            const progression = musicTheory.getChordProgressions(key, mode)['ii-V-I'];
            
            let previousVoicing = null;
            const movements = [];
            
            progression.roman.forEach(romanNumeral => {
                const chordRoot = musicTheory.romanToChord(romanNumeral, key, mode);
                const chordQuality = audioEngine.getChordQuality(romanNumeral, mode);
                const chordNotes = musicTheory.getChordNotes(chordRoot, chordQuality);
                
                const voicing = audioEngine.optimizeChordVoicing(chordNotes, previousVoicing, 3);
                
                if (previousVoicing) {
                    const assignment = audioEngine.findOptimalVoiceAssignment(previousVoicing, voicing);
                    movements.push(assignment.totalMovement);
                }
                
                previousVoicing = voicing;
            });
            
            // Each transition should be smooth
            movements.forEach(movement => {
                expect(movement).toBeLessThan(10);
            });
        });

        test('should have smooth voice leading from I back to ii (loop transition)', () => {
            const key = 'C';
            const mode = 'major';
            const progression = musicTheory.getChordProgressions(key, mode)['ii-V-I'];
            
            // Get voicing for I chord (end of progression)
            const IRoot = musicTheory.romanToChord('I', key, mode);
            const IQuality = audioEngine.getChordQuality('I', mode);
            const INotes = musicTheory.getChordNotes(IRoot, IQuality);
            const IVoicing = audioEngine.createChordVoicing(INotes, 3);
            
            // Get voicing for ii chord (start of progression) using I as previous
            const iiRoot = musicTheory.romanToChord('ii', key, mode);
            const iiQuality = audioEngine.getChordQuality('ii', mode);
            const iiNotes = musicTheory.getChordNotes(iiRoot, iiQuality);
            const iiVoicing = audioEngine.optimizeChordVoicing(iiNotes, IVoicing, 3);
            
            // Check voice leading from I to ii
            const assignment = audioEngine.findOptimalVoiceAssignment(IVoicing, iiVoicing);
            
            // Should be smooth transition
            expect(assignment.totalMovement).toBeLessThan(10);
            expect(assignment.maxLeap).toBeLessThan(12); // Less than an octave
        });

        test('should maintain smooth voice leading across multiple loop cycles', () => {
            const key = 'C';
            const mode = 'major';
            const progression = musicTheory.getChordProgressions(key, mode)['ii-V-I'];
            
            let previousVoicing = null;
            const allMovements = [];
            
            // Simulate 3 complete loop cycles
            for (let cycle = 0; cycle < 3; cycle++) {
                progression.roman.forEach(romanNumeral => {
                    const chordRoot = musicTheory.romanToChord(romanNumeral, key, mode);
                    const chordQuality = audioEngine.getChordQuality(romanNumeral, mode);
                    const chordNotes = musicTheory.getChordNotes(chordRoot, chordQuality);
                    
                    const voicing = audioEngine.optimizeChordVoicing(chordNotes, previousVoicing, 3);
                    
                    if (previousVoicing) {
                        const assignment = audioEngine.findOptimalVoiceAssignment(previousVoicing, voicing);
                        allMovements.push(assignment.totalMovement);
                    }
                    
                    previousVoicing = voicing;
                });
            }
            
            // All transitions should be smooth, including loop boundaries
            allMovements.forEach(movement => {
                expect(movement).toBeLessThan(10);
            });
            
            // Average movement should be very small
            const avgMovement = allMovements.reduce((sum, m) => sum + m, 0) / allMovements.length;
            expect(avgMovement).toBeLessThan(6);
        });
    });

    describe('Other Keys', () => {
        test('should work correctly in all major keys', () => {
            const majorKeys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'F', 'Bb', 'Eb', 'Ab', 'Db'];
            
            majorKeys.forEach(key => {
                const mode = 'major';
                const scaleNotes = musicTheory.getScaleNotes(key, mode);
                const progression = musicTheory.getChordProgressions(key, mode)['ii-V-I'];
                
                progression.roman.forEach(romanNumeral => {
                    const chordRoot = musicTheory.romanToChord(romanNumeral, key, mode);
                    const chordQuality = audioEngine.getChordQuality(romanNumeral, mode);
                    const chordNotes = musicTheory.getChordNotes(chordRoot, chordQuality);
                    
                    // All notes should be diatonic
                    chordNotes.forEach(note => {
                        expect(scaleNotes).toContain(note);
                    });
                });
            });
        });
    });
});


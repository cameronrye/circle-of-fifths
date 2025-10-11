#!/usr/bin/env node

/**
 * Direct Test for ii-V-I Progression
 * Verifies the progression stays in key when looping
 */

const path = require('path');
const fs = require('fs');

// Load the music theory module
const musicTheoryPath = path.join(__dirname, '..', 'js', 'musicTheory.js');
const musicTheoryCode = fs.readFileSync(musicTheoryPath, 'utf8');

// Create a minimal environment
global.window = {};
global.module = { exports: {} };

// Execute the code
eval(musicTheoryCode);

const { MusicTheory } = global.module.exports || window;

// Colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

function log(msg, color = RESET) {
    console.log(`${color}${msg}${RESET}`);
}

function testIIVI() {
    const theory = new MusicTheory();
    
    log('\n' + '='.repeat(70), BOLD);
    log('  ii-V-I PROGRESSION TEST', BOLD);
    log('='.repeat(70) + '\n', BOLD);
    
    const testKeys = ['C', 'G', 'D', 'F', 'Bb', 'Eb'];
    let allPassed = true;
    
    testKeys.forEach(key => {
        log(`\nTesting ${key} major:`, CYAN);
        log('-'.repeat(50), CYAN);
        
        const scaleNotes = theory.getScaleNotes(key, 'major');
        log(`  Scale: ${scaleNotes.join(', ')}`, RESET);
        
        const progression = ['ii', 'V', 'I'];
        const chords = [];
        
        // Test 3 loop iterations
        for (let iteration = 1; iteration <= 3; iteration++) {
            log(`\n  Iteration ${iteration}:`, YELLOW);
            
            progression.forEach((roman, index) => {
                const chordRoot = theory.romanToChord(roman, key, 'major');
                
                // Determine quality
                const quality = roman === roman.toUpperCase() ? 'major' : 'minor';
                const chordNotes = theory.getChordNotes(chordRoot, quality);
                
                // Check if all notes are in the scale
                const allDiatonic = chordNotes.every(note => scaleNotes.includes(note));
                
                const status = allDiatonic ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
                const qualityStr = quality === 'minor' ? 'm' : '';
                
                log(`    ${status} ${roman} = ${chordRoot}${qualityStr} [${chordNotes.join(', ')}]`, RESET);
                
                if (!allDiatonic) {
                    const nonDiatonic = chordNotes.filter(n => !scaleNotes.includes(n));
                    log(`      ${RED}ERROR: Non-diatonic notes: ${nonDiatonic.join(', ')}${RESET}`, RED);
                    allPassed = false;
                }
                
                chords.push({ roman, root: chordRoot, quality, notes: chordNotes });
            });
        }
        
        // Analyze voice leading
        log(`\n  Voice Leading Analysis:`, CYAN);
        for (let i = 0; i < 2; i++) {
            const current = chords[i];
            const next = chords[i + 1];
            
            const commonTones = current.notes.filter(n => next.notes.includes(n));
            
            let totalMovement = 0;
            for (let j = 0; j < Math.min(current.notes.length, next.notes.length); j++) {
                const currentIndex = theory.getNoteIndex(current.notes[j]);
                const nextIndex = theory.getNoteIndex(next.notes[j]);
                const distance = Math.min(
                    Math.abs(nextIndex - currentIndex),
                    12 - Math.abs(nextIndex - currentIndex)
                );
                totalMovement += distance;
            }
            
            log(`    ${current.roman} → ${next.roman}: ${commonTones.length} common tone(s), ${totalMovement} semitones movement`, RESET);
        }
        
        // Test loop transition (I → ii)
        const lastChord = chords[2]; // I
        const firstChord = chords[0]; // ii
        
        const loopCommonTones = lastChord.notes.filter(n => firstChord.notes.includes(n));
        let loopMovement = 0;
        for (let j = 0; j < Math.min(lastChord.notes.length, firstChord.notes.length); j++) {
            const lastIndex = theory.getNoteIndex(lastChord.notes[j]);
            const firstIndex = theory.getNoteIndex(firstChord.notes[j]);
            const distance = Math.min(
                Math.abs(firstIndex - lastIndex),
                12 - Math.abs(firstIndex - lastIndex)
            );
            loopMovement += distance;
        }
        
        log(`    ${lastChord.roman} → ${firstChord.roman} (loop): ${loopCommonTones.length} common tone(s), ${loopMovement} semitones movement`, YELLOW);
        
        if (loopMovement > 10) {
            log(`      ${YELLOW}Warning: Loop transition has significant movement${RESET}`, YELLOW);
        }
    });
    
    log('\n' + '='.repeat(70), BOLD);
    if (allPassed) {
        log(`  ${GREEN}✓ ALL TESTS PASSED${RESET}`, GREEN);
        log(`  ${GREEN}The ii-V-I progression stays in key across all iterations${RESET}`, GREEN);
    } else {
        log(`  ${RED}✗ SOME TESTS FAILED${RESET}`, RED);
    }
    log('='.repeat(70) + '\n', BOLD);
    
    return allPassed;
}

// Run the test
const passed = testIIVI();
process.exit(passed ? 0 : 1);


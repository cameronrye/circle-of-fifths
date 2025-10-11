#!/usr/bin/env node

/**
 * Chord Progression Validation Script
 * Validates all chord progressions follow proper music theory principles
 */

const path = require('path');
const fs = require('fs');

// Load the music theory module
const musicTheoryPath = path.join(__dirname, '..', 'js', 'musicTheory.js');
const musicTheoryCode = fs.readFileSync(musicTheoryPath, 'utf8');

// Create a minimal environment for the module
global.window = {};
global.module = { exports: {} };

// Execute the music theory code
eval(musicTheoryCode);

const { MusicTheory, CHORD_PROGRESSIONS } = global.module.exports || window;

// Colors for output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateProgression(key, mode, progressionName, progression) {
    const theory = new MusicTheory();
    const scaleNotes = theory.getScaleNotes(key, mode);
    const issues = [];
    const info = [];
    
    log(`\n  ${progressionName} (${progression.name})`, 'cyan');
    log(`  Roman numerals: ${progression.roman.join(' - ')}`, 'reset');
    
    // Validate each chord
    progression.roman.forEach((romanNumeral, index) => {
        const chordRoot = theory.romanToChord(romanNumeral, key, mode);
        
        // Determine expected quality from roman numeral
        let expectedQuality;
        if (romanNumeral.includes('°')) {
            expectedQuality = 'diminished';
        } else if (romanNumeral.includes('+')) {
            expectedQuality = 'augmented';
        } else if (mode === 'major') {
            expectedQuality = romanNumeral === romanNumeral.toUpperCase() ? 'major' : 'minor';
        } else {
            expectedQuality = ['III', 'VI', 'VII'].includes(romanNumeral) ? 'major' : 'minor';
        }
        
        const chordNotes = theory.getChordNotes(chordRoot, expectedQuality);
        
        // Check if all notes are diatonic
        const nonDiatonicNotes = chordNotes.filter(note => !scaleNotes.includes(note));
        
        if (nonDiatonicNotes.length > 0) {
            issues.push(`  ⚠️  ${romanNumeral} (${chordRoot} ${expectedQuality}): Non-diatonic notes: ${nonDiatonicNotes.join(', ')}`);
        } else {
            info.push(`  ✓ ${romanNumeral} = ${chordRoot} ${expectedQuality} [${chordNotes.join(', ')}]`);
        }
    });
    
    // Display results
    if (issues.length > 0) {
        log('  Issues found:', 'red');
        issues.forEach(issue => log(issue, 'red'));
    } else {
        log('  ✓ All chords are diatonic', 'green');
    }
    
    info.forEach(i => log(i, 'reset'));
    
    return issues.length === 0;
}

function analyzeVoiceLeading(key, mode, progressionName, progression) {
    const theory = new MusicTheory();
    log(`\n  Voice Leading Analysis for ${progressionName}:`, 'cyan');
    
    const chords = progression.roman.map(romanNumeral => {
        const chordRoot = theory.romanToChord(romanNumeral, key, mode);
        let quality;
        if (romanNumeral.includes('°')) {
            quality = 'diminished';
        } else if (mode === 'major') {
            quality = romanNumeral === romanNumeral.toUpperCase() ? 'major' : 'minor';
        } else {
            quality = ['III', 'VI', 'VII'].includes(romanNumeral) ? 'major' : 'minor';
        }
        return {
            roman: romanNumeral,
            root: chordRoot,
            quality: quality,
            notes: theory.getChordNotes(chordRoot, quality)
        };
    });
    
    // Analyze voice leading between consecutive chords
    for (let i = 0; i < chords.length - 1; i++) {
        const current = chords[i];
        const next = chords[i + 1];
        
        // Find common tones
        const commonTones = current.notes.filter(note => next.notes.includes(note));
        
        // Calculate minimal voice movement
        let minMovement = 0;
        const currentNotes = [...current.notes];
        const nextNotes = [...next.notes];
        
        // Simple voice leading calculation
        for (let j = 0; j < Math.min(currentNotes.length, nextNotes.length); j++) {
            const currentIndex = theory.getNoteIndex(currentNotes[j]);
            const nextIndex = theory.getNoteIndex(nextNotes[j]);
            const distance = Math.min(
                Math.abs(nextIndex - currentIndex),
                12 - Math.abs(nextIndex - currentIndex)
            );
            minMovement += distance;
        }
        
        log(`    ${current.roman} → ${next.roman}: Common tones: ${commonTones.length}, Min movement: ${minMovement} semitones`, 'reset');
    }
    
    // Analyze loop transition (last chord back to first)
    if (chords.length > 0) {
        const last = chords[chords.length - 1];
        const first = chords[0];
        const commonTones = last.notes.filter(note => first.notes.includes(note));
        
        let minMovement = 0;
        for (let j = 0; j < Math.min(last.notes.length, first.notes.length); j++) {
            const lastIndex = theory.getNoteIndex(last.notes[j]);
            const firstIndex = theory.getNoteIndex(first.notes[j]);
            const distance = Math.min(
                Math.abs(firstIndex - lastIndex),
                12 - Math.abs(firstIndex - lastIndex)
            );
            minMovement += distance;
        }
        
        log(`    ${last.roman} → ${first.roman} (loop): Common tones: ${commonTones.length}, Min movement: ${minMovement} semitones`, 'yellow');
    }
}

function main() {
    log('\n╔════════════════════════════════════════════════════════════╗', 'bold');
    log('║  Chord Progression Validation & Analysis                  ║', 'bold');
    log('╚════════════════════════════════════════════════════════════╝', 'bold');
    
    const testKey = 'C';
    let allValid = true;
    
    // Validate major progressions
    log('\n━━━ MAJOR MODE PROGRESSIONS ━━━', 'bold');
    const majorProgressions = CHORD_PROGRESSIONS.major;
    
    for (const [name, progression] of Object.entries(majorProgressions)) {
        const isValid = validateProgression(testKey, 'major', name, progression);
        analyzeVoiceLeading(testKey, 'major', name, progression);
        allValid = allValid && isValid;
    }
    
    // Validate minor progressions
    log('\n━━━ MINOR MODE PROGRESSIONS ━━━', 'bold');
    const minorProgressions = CHORD_PROGRESSIONS.minor;
    
    for (const [name, progression] of Object.entries(minorProgressions)) {
        const isValid = validateProgression('A', 'minor', name, progression);
        analyzeVoiceLeading('A', 'minor', name, progression);
        allValid = allValid && isValid;
    }
    
    // Special focus on ii-V-I
    log('\n━━━ DETAILED ii-V-I ANALYSIS ━━━', 'bold');
    log('\nTesting ii-V-I in multiple keys:', 'cyan');
    
    const majorKeys = ['C', 'G', 'D', 'F', 'Bb', 'Eb'];
    const theory = new MusicTheory();
    
    majorKeys.forEach(key => {
        const progression = CHORD_PROGRESSIONS.major['ii-V-I'];
        log(`\n  ${key} major:`, 'yellow');
        
        progression.roman.forEach(romanNumeral => {
            const chordRoot = theory.romanToChord(romanNumeral, key, 'major');
            const quality = romanNumeral === romanNumeral.toUpperCase() ? 'major' : 'minor';
            const notes = theory.getChordNotes(chordRoot, quality);
            log(`    ${romanNumeral} = ${chordRoot}${quality === 'minor' ? 'm' : ''} [${notes.join(', ')}]`, 'reset');
        });
    });
    
    // Summary
    log('\n━━━ SUMMARY ━━━', 'bold');
    if (allValid) {
        log('✓ All progressions are valid and diatonic!', 'green');
    } else {
        log('⚠️  Some progressions have issues that need attention', 'red');
    }
    
    log('\n');
}

main();


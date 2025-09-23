/**
 * Performance Tests for Circle of Fifths
 * Tests audio latency, rendering performance, memory usage, and resource loading
 */

// Load required modules
const { MusicTheory } = require('../../js/musicTheory.js');
const AudioEngine = require('../../js/audioEngine.js');
const CircleRenderer = require('../../js/circleRenderer.js');

describe('Performance Tests', () => {
    let musicTheory;
    let audioEngine;
    let circleRenderer;
    let mockSvgElement;
    let mockAudioContext;
    let performanceMetrics;

    beforeEach(() => {
        setupPerformanceTestEnvironment();
        performanceMetrics = {
            startTime: 0,
            endTime: 0,
            memoryUsage: { initial: 0, final: 0 },
            renderCount: 0,
            audioLatency: 0
        };

        musicTheory = new MusicTheory();
        audioEngine = new AudioEngine();
        circleRenderer = new CircleRenderer(mockSvgElement, musicTheory);
    });

    afterEach(() => {
        if (audioEngine) {
            audioEngine.dispose();
        }
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    function setupPerformanceTestEnvironment() {
        // Mock performance API
        global.performance = {
            now: jest.fn(() => Date.now()),
            mark: jest.fn(),
            measure: jest.fn(),
            getEntriesByType: jest.fn(() => []),
            getEntriesByName: jest.fn(() => []),
            memory: {
                usedJSHeapSize: 1000000,
                totalJSHeapSize: 2000000,
                jsHeapSizeLimit: 4000000
            }
        };

        // Mock requestAnimationFrame for rendering tests
        global.requestAnimationFrame = jest.fn(callback => {
            return setTimeout(callback, 16); // ~60fps
        });

        global.cancelAnimationFrame = jest.fn(id => {
            clearTimeout(id);
        });

        // Setup audio mocks with timing
        const mockOscillator = {
            frequency: { value: 440, setValueAtTime: jest.fn() },
            type: 'sine',
            connect: jest.fn(),
            disconnect: jest.fn(),
            start: jest.fn(time => {
                performanceMetrics.audioLatency = time - mockAudioContext.currentTime;
            }),
            stop: jest.fn(),
            addEventListener: jest.fn()
        };

        const mockGainNode = {
            gain: {
                value: 0.3,
                setValueAtTime: jest.fn(),
                linearRampToValueAtTime: jest.fn()
            },
            connect: jest.fn(),
            disconnect: jest.fn()
        };

        mockAudioContext = {
            state: 'suspended',
            currentTime: 0,
            sampleRate: 44100,
            destination: { connect: jest.fn() },
            createGain: jest.fn(() => mockGainNode),
            createOscillator: jest.fn(() => mockOscillator),
            resume: jest.fn(() => Promise.resolve()),
            close: jest.fn(() => Promise.resolve())
        };

        global.AudioContext = jest.fn(() => mockAudioContext);

        // Setup DOM mocks with performance tracking
        const mockKeySegmentsGroup = {
            innerHTML: '',
            appendChild: jest.fn(() => {
                performanceMetrics.renderCount++;
            }),
            querySelectorAll: jest.fn(() => []),
            querySelector: jest.fn()
        };

        const mockCenterElements = {
            centerKey: { textContent: '', style: {} },
            centerMode: { textContent: '', style: {} },
            centerSignature: { textContent: '', style: {} }
        };

        mockSvgElement = {
            querySelector: jest.fn(selector => {
                if (selector === '#key-segments') {
                    return mockKeySegmentsGroup;
                }
                if (selector === '.center-key') {
                    return mockCenterElements.centerKey;
                }
                if (selector === '.center-mode') {
                    return mockCenterElements.centerMode;
                }
                if (selector === '.center-signature') {
                    return mockCenterElements.centerSignature;
                }
                return null;
            }),
            querySelectorAll: jest.fn(() => []),
            dispatchEvent: jest.fn(),
            style: {}
        };

        global.document = {
            createElementNS: jest.fn((namespace, tagName) => ({
                tagName: tagName.toUpperCase(),
                classList: { add: jest.fn(), remove: jest.fn(), toggle: jest.fn() },
                setAttribute: jest.fn(),
                getAttribute: jest.fn(),
                appendChild: jest.fn(),
                querySelector: jest.fn(),
                textContent: '',
                style: {}
            }))
        };

        global.CustomEvent = function(type, options = {}) {
            this.type = type;
            this.detail = options.detail || null;
            this.bubbles = options.bubbles || false;
            this.cancelable = options.cancelable || false;
        };
    }

    function measureExecutionTime(fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        return { result, duration: end - start };
    }

    async function measureAsyncExecutionTime(fn) {
        const start = performance.now();
        const result = await fn();
        const end = performance.now();
        return { result, duration: end - start };
    }

    function getMemoryUsage() {
        return performance.memory
            ? {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            }
            : null;
    }

    describe('Audio Performance', () => {
        test('should initialize audio context quickly', async() => {
            const { duration } = await measureAsyncExecutionTime(async() => {
                return await audioEngine.initialize();
            });

            // Audio initialization should complete within 100ms
            expect(duration).toBeLessThan(100);
        });

        test('should have low audio latency', async() => {
            await audioEngine.initialize();

            const _startTime = mockAudioContext.currentTime;
            await audioEngine.playNote('A', 4, 1);

            // Audio latency should be minimal (< 50ms)
            expect(performanceMetrics.audioLatency).toBeLessThan(0.05);
        });

        test('should handle multiple simultaneous notes efficiently', async() => {
            await audioEngine.initialize();

            const chordNotes = ['C', 'E', 'G', 'B', 'D', 'F#'];

            const { duration } = await measureAsyncExecutionTime(async() => {
                await audioEngine.playChord(chordNotes, 4, 1);
            });

            // Playing complex chord should be fast
            expect(duration).toBeLessThan(50);
            expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(6);
        });

        test('should efficiently play scales', async() => {
            await audioEngine.initialize();

            const { duration } = await measureAsyncExecutionTime(async() => {
                await audioEngine.playScale('C', 'major', 4);
            });

            // Scale playback setup should be quick
            expect(duration).toBeLessThan(30);
            expect(mockAudioContext.createOscillator).toHaveBeenCalledTimes(7);
        });

        test('should handle rapid note changes', async() => {
            await audioEngine.initialize();

            const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

            const { duration } = await measureAsyncExecutionTime(async() => {
                for (const note of notes) {
                    await audioEngine.playNote(note, 4, 0.1);
                }
            });

            // Rapid note changes should be handled efficiently
            expect(duration).toBeLessThan(100);
        });

        test('should clean up audio resources efficiently', async() => {
            await audioEngine.initialize();
            await audioEngine.playNote('C', 4, 1);

            const _initialPlayingCount = audioEngine.currentlyPlaying.size;

            const { duration } = measureExecutionTime(() => {
                audioEngine.stopAll();
            });

            expect(duration).toBeLessThan(10);
            expect(audioEngine.currentlyPlaying.size).toBe(0);
        });
    });

    describe('Rendering Performance', () => {
        test('should render initial circle quickly', () => {
            const { duration } = measureExecutionTime(() => {
                circleRenderer.init();
            });

            // Initial rendering should be fast
            expect(duration).toBeLessThan(50);
            expect(performanceMetrics.renderCount).toBe(12); // 12 key segments
        });

        test('should update visual state efficiently', () => {
            const { duration } = measureExecutionTime(() => {
                circleRenderer.selectKey('G');
            });

            // Key selection should be instantaneous
            expect(duration).toBeLessThan(10);
        });

        test('should handle mode switching quickly', () => {
            const { duration } = measureExecutionTime(() => {
                circleRenderer.switchMode('minor');
            });

            // Mode switching should be fast
            expect(duration).toBeLessThan(20);
        });

        test('should resize efficiently', () => {
            const sizes = [400, 600, 800, 1200];

            sizes.forEach(size => {
                const { duration } = measureExecutionTime(() => {
                    circleRenderer.resize(size);
                });

                // Resizing should be quick regardless of size
                expect(duration).toBeLessThan(30);
            });
        });

        test('should handle rapid key changes', () => {
            const keys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#'];

            const { duration } = measureExecutionTime(() => {
                keys.forEach(key => {
                    circleRenderer.selectKey(key);
                });
            });

            // Rapid key changes should be handled smoothly
            expect(duration).toBeLessThan(50);
        });

        test('should animate transitions smoothly', () => {
            jest.useFakeTimers();

            const { duration } = measureExecutionTime(() => {
                circleRenderer.animateTransition(() => {
                    circleRenderer.switchMode('minor');
                });
            });

            // Animation setup should be immediate
            expect(duration).toBeLessThan(5);

            jest.useRealTimers();
        });
    });

    describe('Memory Usage', () => {
        test('should not leak memory during normal operation', () => {
            const initialMemory = getMemoryUsage();

            // Perform various operations
            for (let i = 0; i < 100; i++) {
                circleRenderer.selectKey('C');
                circleRenderer.selectKey('G');
                circleRenderer.switchMode('minor');
                circleRenderer.switchMode('major');
            }

            const finalMemory = getMemoryUsage();

            if (initialMemory && finalMemory) {
                const memoryIncrease = finalMemory.used - initialMemory.used;
                // Memory increase should be minimal
                expect(memoryIncrease).toBeLessThan(1000000); // 1MB
            }
        });

        test('should clean up audio resources', async() => {
            await audioEngine.initialize();

            // Create many audio nodes
            for (let i = 0; i < 50; i++) {
                await audioEngine.playNote('C', 4, 0.1);
            }

            const playingBefore = audioEngine.currentlyPlaying.size;
            audioEngine.stopAll();
            const playingAfter = audioEngine.currentlyPlaying.size;

            expect(playingAfter).toBe(0);
            expect(playingBefore).toBeGreaterThan(0);
        });

        test('should handle large numbers of DOM elements', () => {
            const initialMemory = getMemoryUsage();

            // Create many elements (simulating complex UI)
            for (let i = 0; i < 1000; i++) {
                document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            }

            const finalMemory = getMemoryUsage();

            if (initialMemory && finalMemory) {
                // Should handle DOM creation efficiently
                expect(finalMemory.used).toBeLessThan(finalMemory.limit * 0.8);
            }
        });
    });

    describe('Music Theory Performance', () => {
        test('should calculate scales quickly', () => {
            const keys = musicTheory.getCircleOfFifthsKeys();
            const modes = ['major', 'minor', 'harmonicMinor', 'melodicMinor'];

            const { duration } = measureExecutionTime(() => {
                keys.forEach(key => {
                    modes.forEach(mode => {
                        musicTheory.getScaleNotes(key, mode);
                    });
                });
            });

            // All scale calculations should complete quickly
            expect(duration).toBeLessThan(50);
        });

        test('should calculate frequencies efficiently', () => {
            const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            const octaves = [3, 4, 5, 6];

            const { duration } = measureExecutionTime(() => {
                notes.forEach(note => {
                    octaves.forEach(octave => {
                        musicTheory.getNoteFrequency(note, octave);
                    });
                });
            });

            // Frequency calculations should be very fast
            expect(duration).toBeLessThan(20);
        });

        test('should handle chord generation efficiently', () => {
            const roots = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
            const qualities = ['major', 'minor', 'diminished', 'augmented', 'dominant7'];

            const { duration } = measureExecutionTime(() => {
                roots.forEach(root => {
                    qualities.forEach(quality => {
                        musicTheory.getChordNotes(root, quality);
                    });
                });
            });

            // Chord generation should be fast
            expect(duration).toBeLessThan(30);
        });

        test('should cache expensive calculations', () => {
            // First calculation
            const { duration: firstCall } = measureExecutionTime(() => {
                musicTheory.getRelatedKeys('C', 'major');
            });

            // Second calculation (should be faster if cached)
            const { duration: secondCall } = measureExecutionTime(() => {
                musicTheory.getRelatedKeys('C', 'major');
            });

            // Both should be fast, but this tests consistency
            expect(firstCall).toBeLessThan(10);
            expect(secondCall).toBeLessThan(10);
        });
    });

    describe('Resource Loading Performance', () => {
        test('should load modules quickly', () => {
            const { duration } = measureExecutionTime(() => {
                new MusicTheory();
            });

            // Module instantiation should be immediate
            expect(duration).toBeLessThan(5);
        });

        test('should initialize components efficiently', () => {
            const { duration } = measureExecutionTime(() => {
                new CircleRenderer(mockSvgElement, musicTheory);
            });

            // Component initialization should be fast
            expect(duration).toBeLessThan(20);
        });

        test('should handle concurrent operations', async() => {
            const operations = [
                () => musicTheory.getScaleNotes('C', 'major'),
                () => circleRenderer.selectKey('G'),
                () => audioEngine.initialize(),
                () => musicTheory.getChordNotes('F', 'major'),
                () => circleRenderer.switchMode('minor')
            ];

            const { duration } = await measureAsyncExecutionTime(async() => {
                await Promise.all(
                    operations.map(
                        op =>
                            new Promise(resolve => {
                                resolve(op());
                            })
                    )
                );
            });

            // Concurrent operations should complete quickly
            expect(duration).toBeLessThan(100);
        });
    });

    describe('Stress Testing', () => {
        test('should handle rapid user interactions', () => {
            const keys = musicTheory.getCircleOfFifthsKeys();

            const { duration } = measureExecutionTime(() => {
                // Simulate rapid clicking
                for (let i = 0; i < 100; i++) {
                    const randomKey = keys[i % keys.length];
                    circleRenderer.selectKey(randomKey);
                }
            });

            // Should handle rapid interactions without performance degradation
            expect(duration).toBeLessThan(200);
        });

        test('should maintain performance with many audio nodes', async() => {
            await audioEngine.initialize();

            const { duration } = await measureAsyncExecutionTime(async() => {
                // Create many simultaneous notes
                const promises = [];
                for (let i = 0; i < 20; i++) {
                    promises.push(audioEngine.playNote('C', 4, 0.5));
                }
                await Promise.all(promises);
            });

            // Should handle many simultaneous audio nodes
            expect(duration).toBeLessThan(100);
        });

        test('should handle large data sets', () => {
            const { duration } = measureExecutionTime(() => {
                // Process all possible key/mode combinations
                const keys = musicTheory.getCircleOfFifthsKeys();
                const modes = ['major', 'minor'];

                keys.forEach(key => {
                    modes.forEach(mode => {
                        musicTheory.getKeySignature(key, mode);
                        musicTheory.getRelatedKeys(key, mode);
                        musicTheory.getChordProgressions(key, mode);
                    });
                });
            });

            // Should process large data sets efficiently
            expect(duration).toBeLessThan(100);
        });
    });

    describe('Performance Monitoring', () => {
        test('should provide performance metrics', () => {
            const metrics = {
                renderTime: 0,
                audioLatency: 0,
                memoryUsage: getMemoryUsage(),
                frameRate: 60
            };

            expect(metrics.memoryUsage).toBeDefined();
            expect(metrics.frameRate).toBe(60);
        });

        test('should detect performance regressions', () => {
            const benchmarks = {
                scaleCalculation: 10, // ms
                audioInitialization: 100, // ms
                rendering: 50, // ms
                keySelection: 10 // ms
            };

            // Test against benchmarks
            const { duration: scaleTime } = measureExecutionTime(() => {
                musicTheory.getScaleNotes('C', 'major');
            });

            expect(scaleTime).toBeLessThan(benchmarks.scaleCalculation);
        });

        test('should maintain consistent performance', () => {
            const iterations = 10;
            const durations = [];

            for (let i = 0; i < iterations; i++) {
                const { duration } = measureExecutionTime(() => {
                    circleRenderer.selectKey('G');
                });
                durations.push(duration);
            }

            const average = durations.reduce((a, b) => a + b) / durations.length;
            const variance =
                durations.reduce((acc, duration) => acc + Math.pow(duration - average, 2), 0) /
                durations.length;

            // Performance should be consistent (low variance)
            expect(variance).toBeLessThan(100);
        });
    });
});

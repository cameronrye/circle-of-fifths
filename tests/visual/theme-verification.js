/**
 * Theme Verification Test
 * Verifies that all visual elements properly respond to theme changes
 */

class ThemeVerificationTest {
    constructor() {
        this.results = [];
        this.themes = ['light', 'dark', 'system'];
    }

    async runAllTests() {
        console.log('🎨 Starting Theme Verification Tests...');
        
        for (const theme of this.themes) {
            console.log(`\n📋 Testing ${theme} theme...`);
            await this.testTheme(theme);
        }
        
        this.generateReport();
    }

    async testTheme(themeName) {
        // Apply theme
        if (window.themeManager) {
            window.themeManager.setTheme(themeName);
            await this.wait(300); // Allow more time for theme to apply and elements to render
        }

        // Ensure circle renderer is initialized if available
        if (window.circleRenderer && typeof window.circleRenderer.init === 'function') {
            window.circleRenderer.init();
            await this.wait(200); // Allow time for circle to render
        }

        const tests = [
            () => this.testCSSCustomProperties(themeName),
            () => this.testSVGElements(themeName),
            () => this.testRelatedKeys(themeName),
            () => this.testAudioControls(themeName),
            () => this.testInfoPanel(themeName),
            () => this.testThemeToggle(themeName),
            () => this.testLoadingSpinner(themeName)
        ];

        for (const test of tests) {
            try {
                test();
            } catch (error) {
                this.addResult(themeName, 'ERROR', error.message);
            }
        }
    }

    testCSSCustomProperties(theme) {
        const root = document.documentElement;
        const computedStyle = getComputedStyle(root);
        
        const requiredProperties = [
            '--primary-color',
            '--secondary-color',
            '--background-color',
            '--surface-color',
            '--text-primary',
            '--text-secondary',
            '--major-color',
            '--minor-color',
            '--dominant-color',
            '--subdominant-color',
            '--relative-color',
            '--dominant-bg',
            '--dominant-border',
            '--subdominant-bg',
            '--subdominant-border',
            '--relative-bg',
            '--relative-border'
        ];

        for (const prop of requiredProperties) {
            const value = computedStyle.getPropertyValue(prop).trim();
            if (!value || value === '') {
                this.addResult(theme, 'FAIL', `CSS property ${prop} is not defined`);
            } else {
                this.addResult(theme, 'PASS', `CSS property ${prop} has value: ${value}`);
            }
        }
    }

    testSVGElements(theme) {
        const svg = document.getElementById('circle-svg');
        if (!svg) {
            this.addResult(theme, 'FAIL', 'SVG element not found');
            return;
        }

        // Test background circle
        const backgroundCircle = svg.querySelector('.background-circle');
        if (backgroundCircle) {
            const fill = getComputedStyle(backgroundCircle).fill;
            this.addResult(theme, fill !== 'none' && fill !== '' ? 'PASS' : 'FAIL',
                `Background circle fill: ${fill}`);
        } else {
            this.addResult(theme, 'FAIL', 'Background circle element not found');
        }

        // Test center circle
        const centerCircle = svg.querySelector('.center-circle');
        if (centerCircle) {
            const fill = getComputedStyle(centerCircle).fill;
            const stroke = getComputedStyle(centerCircle).stroke;
            this.addResult(theme, fill !== 'none' && fill !== '' ? 'PASS' : 'FAIL',
                `Center circle fill: ${fill}, stroke: ${stroke}`);
        } else {
            this.addResult(theme, 'FAIL', 'Center circle element not found');
        }

        // Test center text elements
        const centerKey = svg.querySelector('.center-key');
        const centerMode = svg.querySelector('.center-mode');
        const centerSignature = svg.querySelector('.center-signature');

        const centerElements = [
            { element: centerKey, name: 'center-key' },
            { element: centerMode, name: 'center-mode' },
            { element: centerSignature, name: 'center-signature' }
        ];

        centerElements.forEach(({ element, name }) => {
            if (element) {
                const fill = getComputedStyle(element).fill;
                this.addResult(theme, fill !== 'none' && fill !== '' ? 'PASS' : 'FAIL',
                    `${name} fill: ${fill}`);
            } else {
                this.addResult(theme, 'FAIL', `${name} element not found`);
            }
        });

        // Test segment paths (if any exist)
        const segmentPaths = svg.querySelectorAll('.segment-path');
        if (segmentPaths.length > 0) {
            segmentPaths.forEach((path, index) => {
                const fill = getComputedStyle(path).fill;
                const stroke = getComputedStyle(path).stroke;
                this.addResult(theme, fill !== 'none' && fill !== '' ? 'PASS' : 'FAIL',
                    `Segment path ${index} fill: ${fill}, stroke: ${stroke}`);
            });
        } else {
            this.addResult(theme, 'FAIL', 'No segment paths found - circle may not be rendered');
        }

        // Test key text elements
        const keyTexts = svg.querySelectorAll('.key-text');
        if (keyTexts.length > 0) {
            keyTexts.forEach((text, index) => {
                const fill = getComputedStyle(text).fill;
                this.addResult(theme, fill !== 'none' && fill !== '' ? 'PASS' : 'FAIL',
                    `Key text ${index} fill: ${fill}`);
            });
        } else {
            this.addResult(theme, 'FAIL', 'No key text elements found');
        }
    }

    testRelatedKeys(theme) {
        const relatedKeys = document.querySelectorAll('.related-key');
        
        relatedKeys.forEach((key, index) => {
            const relationship = key.getAttribute('data-relationship');
            const computedStyle = getComputedStyle(key);
            const backgroundColor = computedStyle.backgroundColor;
            const color = computedStyle.color;
            const borderColor = computedStyle.borderColor;
            
            this.addResult(theme, 
                backgroundColor !== 'rgba(0, 0, 0, 0)' ? 'PASS' : 'FAIL',
                `Related key ${relationship} - bg: ${backgroundColor}, color: ${color}, border: ${borderColor}`
            );
        });
    }

    testAudioControls(theme) {
        const audioButtons = document.querySelectorAll('.audio-btn');
        
        audioButtons.forEach((button, index) => {
            const computedStyle = getComputedStyle(button);
            const backgroundColor = computedStyle.backgroundColor;
            const color = computedStyle.color;
            const borderColor = computedStyle.borderColor;
            
            this.addResult(theme, 
                backgroundColor !== 'rgba(0, 0, 0, 0)' ? 'PASS' : 'FAIL',
                `Audio button ${index} - bg: ${backgroundColor}, color: ${color}, border: ${borderColor}`
            );
        });
    }

    testInfoPanel(theme) {
        const infoPanel = document.querySelector('.info-panel');
        if (infoPanel) {
            const computedStyle = getComputedStyle(infoPanel);
            const backgroundColor = computedStyle.backgroundColor;
            const boxShadow = computedStyle.boxShadow;
            
            this.addResult(theme, 
                backgroundColor !== 'rgba(0, 0, 0, 0)' ? 'PASS' : 'FAIL',
                `Info panel - bg: ${backgroundColor}, shadow: ${boxShadow}`
            );
        }

        const infoTitle = document.querySelector('.info-title');
        if (infoTitle) {
            const color = getComputedStyle(infoTitle).color;
            this.addResult(theme, color !== 'rgba(0, 0, 0, 0)' ? 'PASS' : 'FAIL',
                `Info title color: ${color}`);
        }
    }

    testThemeToggle(theme) {
        const themeBtn = document.querySelector('.theme-btn');
        if (themeBtn) {
            const computedStyle = getComputedStyle(themeBtn);
            const color = computedStyle.color;
            
            this.addResult(theme, color !== 'rgba(0, 0, 0, 0)' ? 'PASS' : 'FAIL',
                `Theme button color: ${color}`);
        }

        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach((option, index) => {
            const computedStyle = getComputedStyle(option);
            const color = computedStyle.color;
            
            this.addResult(theme, color !== 'rgba(0, 0, 0, 0)' ? 'PASS' : 'FAIL',
                `Theme option ${index} color: ${color}`);
        });
    }

    testLoadingSpinner(theme) {
        const loadingSpinner = document.querySelector('.loading-spinner');
        if (loadingSpinner) {
            const computedStyle = getComputedStyle(loadingSpinner);
            const borderColor = computedStyle.borderColor;
            const borderTopColor = computedStyle.borderTopColor;
            
            this.addResult(theme, 
                borderColor !== 'rgba(0, 0, 0, 0)' ? 'PASS' : 'FAIL',
                `Loading spinner - border: ${borderColor}, top: ${borderTopColor}`
            );
        }
    }

    addResult(theme, status, message) {
        this.results.push({ theme, status, message });
        const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
        console.log(`${emoji} [${theme}] ${message}`);
    }

    generateReport() {
        console.log('\n📊 Theme Verification Report');
        console.log('=' .repeat(50));

        const summary = this.results.reduce((acc, result) => {
            if (!acc[result.theme]) {
                acc[result.theme] = { PASS: 0, FAIL: 0, ERROR: 0, failures: [] };
            }
            acc[result.theme][result.status]++;
            if (result.status === 'FAIL') {
                acc[result.theme].failures.push(result.message);
            }
            return acc;
        }, {});

        for (const [theme, counts] of Object.entries(summary)) {
            const total = counts.PASS + counts.FAIL + counts.ERROR;
            const passRate = ((counts.PASS / total) * 100).toFixed(1);
            console.log(`${theme.toUpperCase()}: ${counts.PASS}/${total} passed (${passRate}%)`);
            if (counts.FAIL > 0) {
                console.log(`  ❌ ${counts.FAIL} failures:`);
                counts.failures.forEach(failure => {
                    console.log(`    • ${failure}`);
                });
            }
            if (counts.ERROR > 0) console.log(`  ⚠️ ${counts.ERROR} errors`);
        }

        const overallPass = this.results.filter(r => r.status === 'PASS').length;
        const overallTotal = this.results.length;
        const overallRate = ((overallPass / overallTotal) * 100).toFixed(1);

        console.log(`\nOVERALL: ${overallPass}/${overallTotal} passed (${overallRate}%)`);

        // Show common failure patterns
        const allFailures = this.results.filter(r => r.status === 'FAIL');
        const failurePatterns = {};
        allFailures.forEach(failure => {
            const pattern = failure.message.split(' - ')[0]; // Get the part before the dash
            failurePatterns[pattern] = (failurePatterns[pattern] || 0) + 1;
        });

        if (Object.keys(failurePatterns).length > 0) {
            console.log('\n🔍 Common Failure Patterns:');
            Object.entries(failurePatterns).forEach(([pattern, count]) => {
                console.log(`  • ${pattern}: ${count} occurrences`);
            });
        }

        if (overallRate >= 90) {
            console.log('🎉 Theme system is working excellently!');
        } else if (overallRate >= 75) {
            console.log('👍 Theme system is working well with minor issues.');
        } else {
            console.log('⚠️ Theme system needs attention.');
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for use in browser console or test runner
if (typeof window !== 'undefined') {
    window.ThemeVerificationTest = ThemeVerificationTest;
}

// Auto-run if this script is loaded directly
if (typeof window !== 'undefined' && window.location.pathname.includes('test')) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const test = new ThemeVerificationTest();
            test.runAllTests();
        }, 2000); // Give more time for all components to initialize
    });
}

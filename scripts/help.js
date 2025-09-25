#!/usr/bin/env node

/**
 * NPM Help Script - Cross-platform help formatter for npm scripts
 * Similar to `make help` but for npm scripts
 * 
 * Usage: npm run help
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for cross-platform terminal colors
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

// Check if we should disable colors (for CI/non-TTY environments)
const shouldUseColors = process.stdout.isTTY && !process.env.NO_COLOR;
const c = shouldUseColors ? colors : Object.fromEntries(Object.keys(colors).map(k => [k, '']));

// Script descriptions - organized by category
const scriptDescriptions = {
    // Development scripts
    'serve': 'Start local development server on port 8000',
    'dev': 'Alias for serve - start development server',
    
    // Testing scripts
    'test': 'Run all tests (default test runner)',
    'test:unit': 'Run unit tests only',
    'test:integration': 'Run integration tests only', 
    'test:all': 'Run all tests (unit + integration)',
    'test:ci': 'Run all tests with bail on first failure (for CI)',
    'test:verbose': 'Run all tests with verbose output',
    'test:coverage': 'Run all tests with coverage reporting',
    'test:watch': 'Run tests in watch mode (re-run on file changes)',
    'test:bail': 'Run all tests, stop on first failure',
    'test:unit:basic': 'Run basic unit tests only',
    'test:accessibility': 'Run accessibility tests',
    'test:performance': 'Run performance tests',
    
    // Component-specific tests
    'test:music-theory': 'Run MusicTheory component tests',
    'test:audio-engine': 'Run AudioEngine component tests', 
    'test:theme-manager': 'Run ThemeManager component tests',
    'test:circle-renderer': 'Run CircleRenderer component tests',
    'test:theme-system': 'Run theme system tests',
    
    // Code quality scripts
    'lint': 'Run ESLint on JavaScript files',
    'lint:fix': 'Run ESLint and automatically fix issues',
    'format': 'Format code with Prettier',
    'format:check': 'Check if code is properly formatted',
    
    // Build scripts
    'build': 'Full build: lint + format check + test',
    'build:production': 'Production build (same as build)',
    'validate': 'Validate codebase (same as build)',
    'precommit': 'Pre-commit hook: lint fix + format'
};

// Script categories for organized display
const categories = {
    'Development': ['serve', 'dev'],
    'Testing - General': ['test', 'test:unit', 'test:integration', 'test:all', 'test:unit:basic'],
    'Testing - Modes': ['test:ci', 'test:verbose', 'test:coverage', 'test:watch', 'test:bail'],
    'Testing - Specialized': ['test:accessibility', 'test:performance'],
    'Testing - Components': ['test:music-theory', 'test:audio-engine', 'test:theme-manager', 'test:circle-renderer', 'test:theme-system'],
    'Code Quality': ['lint', 'lint:fix', 'format', 'format:check'],
    'Build & Deploy': ['build', 'build:production', 'validate', 'precommit']
};

function loadPackageJson() {
    try {
        const packagePath = path.join(process.cwd(), 'package.json');
        const packageContent = fs.readFileSync(packagePath, 'utf8');
        return JSON.parse(packageContent);
    } catch (error) {
        console.error(`${c.red}Error: Could not read package.json${c.reset}`);
        console.error(error.message);
        process.exit(1);
    }
}

function printHeader(packageJson) {
    console.log(`${c.bright}${c.cyan}╭─────────────────────────────────────────────────────────────╮${c.reset}`);
    console.log(`${c.bright}${c.cyan}│${c.reset}  ${c.bright}${packageJson.name || 'NPM Scripts Help'}${c.reset}${' '.repeat(Math.max(0, 55 - (packageJson.name || 'NPM Scripts Help').length))}${c.bright}${c.cyan}│${c.reset}`);
    if (packageJson.description) {
        const desc = packageJson.description;
        const maxWidth = 55;
        if (desc.length <= maxWidth) {
            console.log(`${c.bright}${c.cyan}│${c.reset}  ${c.dim}${desc}${c.reset}${' '.repeat(maxWidth - desc.length)}${c.bright}${c.cyan}│${c.reset}`);
        } else {
            // Word wrap long descriptions
            const words = desc.split(' ');
            let line = '';
            for (const word of words) {
                if ((line + word).length <= maxWidth) {
                    line += (line ? ' ' : '') + word;
                } else {
                    console.log(`${c.bright}${c.cyan}│${c.reset}  ${c.dim}${line}${c.reset}${' '.repeat(maxWidth - line.length)}${c.bright}${c.cyan}│${c.reset}`);
                    line = word;
                }
            }
            if (line) {
                console.log(`${c.bright}${c.cyan}│${c.reset}  ${c.dim}${line}${c.reset}${' '.repeat(maxWidth - line.length)}${c.bright}${c.cyan}│${c.reset}`);
            }
        }
    }
    console.log(`${c.bright}${c.cyan}╰─────────────────────────────────────────────────────────────╯${c.reset}`);
    console.log();
}

function printCategory(categoryName, scripts, allScripts) {
    console.log(`${c.bright}${c.yellow}${categoryName}:${c.reset}`);
    
    // Find the longest script name in this category for alignment
    const maxScriptLength = Math.max(...scripts.map(script => script.length));
    
    scripts.forEach(script => {
        if (allScripts[script]) {
            const padding = ' '.repeat(maxScriptLength - script.length + 2);
            const description = scriptDescriptions[script] || 'No description available';
            console.log(`  ${c.green}npm run ${script}${c.reset}${padding}${c.dim}${description}${c.reset}`);
        }
    });
    console.log();
}

function printUncategorizedScripts(allScripts) {
    // Find scripts that aren't in any category
    const categorizedScripts = new Set();
    Object.values(categories).forEach(scripts => {
        scripts.forEach(script => categorizedScripts.add(script));
    });
    
    const uncategorized = Object.keys(allScripts).filter(script => !categorizedScripts.has(script));
    
    if (uncategorized.length > 0) {
        console.log(`${c.bright}${c.yellow}Other Scripts:${c.reset}`);
        const maxScriptLength = Math.max(...uncategorized.map(script => script.length));
        
        uncategorized.forEach(script => {
            const padding = ' '.repeat(maxScriptLength - script.length + 2);
            const description = scriptDescriptions[script] || allScripts[script];
            console.log(`  ${c.green}npm run ${script}${c.reset}${padding}${c.dim}${description}${c.reset}`);
        });
        console.log();
    }
}

function printFooter() {
    console.log(`${c.dim}Usage: ${c.reset}${c.bright}npm run <script-name>${c.reset}`);
    console.log(`${c.dim}Example: ${c.reset}${c.green}npm run test${c.reset} ${c.dim}or${c.reset} ${c.green}npm run dev${c.reset}`);
    console.log();
    console.log(`${c.dim}Quick Start:${c.reset}`);
    console.log(`  ${c.green}npm run dev${c.reset}     ${c.dim}# Start development server${c.reset}`);
    console.log(`  ${c.green}npm run test${c.reset}    ${c.dim}# Run tests${c.reset}`);
    console.log(`  ${c.green}npm run build${c.reset}   ${c.dim}# Build for production${c.reset}`);
    console.log();
    console.log(`${c.dim}For more information about a specific script, check package.json${c.reset}`);
    console.log(`${c.dim}To run this help again: ${c.reset}${c.green}npm run help${c.reset}`);
}

function printUsage() {
    console.log(`${c.bright}Usage:${c.reset}`);
    console.log(`  ${c.green}npm run help${c.reset}                    ${c.dim}# Show all scripts${c.reset}`);
    console.log(`  ${c.green}npm run help -- --category test${c.reset}  ${c.dim}# Show only test-related scripts${c.reset}`);
    console.log(`  ${c.green}npm run help -- --search lint${c.reset}   ${c.dim}# Search for scripts containing 'lint'${c.reset}`);
    console.log(`  ${c.green}npm run help -- --list${c.reset}          ${c.dim}# List available categories${c.reset}`);
    console.log();
}

function listCategories() {
    console.log(`${c.bright}${c.cyan}Available Categories:${c.reset}`);
    Object.keys(categories).forEach(category => {
        console.log(`  ${c.yellow}${category.toLowerCase()}${c.reset}`);
    });
    console.log();
}

function filterScriptsByCategory(categoryFilter, scripts) {
    const matchingCategories = Object.entries(categories).filter(([name]) =>
        name.toLowerCase().includes(categoryFilter.toLowerCase())
    );

    if (matchingCategories.length === 0) {
        console.log(`${c.red}No categories found matching '${categoryFilter}'${c.reset}`);
        listCategories();
        return null;
    }

    return matchingCategories;
}

function searchScripts(searchTerm, scripts) {
    const matchingScripts = Object.keys(scripts).filter(script =>
        script.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (scriptDescriptions[script] && scriptDescriptions[script].toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (matchingScripts.length === 0) {
        console.log(`${c.red}No scripts found matching '${searchTerm}'${c.reset}`);
        return;
    }

    console.log(`${c.bright}${c.cyan}Scripts matching '${searchTerm}':${c.reset}`);
    const maxScriptLength = Math.max(...matchingScripts.map(script => script.length));

    matchingScripts.forEach(script => {
        const padding = ' '.repeat(maxScriptLength - script.length + 2);
        const description = scriptDescriptions[script] || scripts[script];
        console.log(`  ${c.green}npm run ${script}${c.reset}${padding}${c.dim}${description}${c.reset}`);
    });
    console.log();
}

function main() {
    const args = process.argv.slice(2);
    const packageJson = loadPackageJson();
    const scripts = packageJson.scripts || {};

    if (Object.keys(scripts).length === 0) {
        console.log(`${c.yellow}No npm scripts found in package.json${c.reset}`);
        return;
    }

    // Handle command line arguments
    if (args.includes('--help') || args.includes('-h')) {
        printUsage();
        return;
    }

    if (args.includes('--list')) {
        listCategories();
        return;
    }

    const categoryIndex = args.indexOf('--category');
    if (categoryIndex !== -1 && args[categoryIndex + 1]) {
        const categoryFilter = args[categoryIndex + 1];
        const matchingCategories = filterScriptsByCategory(categoryFilter, scripts);
        if (!matchingCategories) return;

        printHeader(packageJson);
        matchingCategories.forEach(([categoryName, categoryScripts]) => {
            const availableScripts = categoryScripts.filter(script => scripts[script]);
            if (availableScripts.length > 0) {
                printCategory(categoryName, availableScripts, scripts);
            }
        });
        return;
    }

    const searchIndex = args.indexOf('--search');
    if (searchIndex !== -1 && args[searchIndex + 1]) {
        const searchTerm = args[searchIndex + 1];
        printHeader(packageJson);
        searchScripts(searchTerm, scripts);
        return;
    }

    // Default: show all scripts
    printHeader(packageJson);

    // Print categorized scripts
    Object.entries(categories).forEach(([categoryName, categoryScripts]) => {
        const availableScripts = categoryScripts.filter(script => scripts[script]);
        if (availableScripts.length > 0) {
            printCategory(categoryName, availableScripts, scripts);
        }
    });

    // Print any uncategorized scripts
    printUncategorizedScripts(scripts);

    printFooter();
}

// Run the help script
if (require.main === module) {
    main();
}

module.exports = { main, scriptDescriptions, categories };

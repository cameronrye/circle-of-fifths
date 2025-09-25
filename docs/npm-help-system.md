# NPM Help System

This project includes a comprehensive help system for npm scripts, similar to `make help` functionality. The system provides organized, color-coded output showing all available commands with descriptions.

## Quick Start

```bash
# Show all available npm scripts
npm run help

# Show help using make (alternative interface)
make help
```

## Features

### 📋 Organized Script Display
- **Categorized scripts**: Development, Testing, Code Quality, Build & Deploy
- **Color-coded output**: Easy to scan and understand
- **Detailed descriptions**: Each script includes a helpful description
- **Cross-platform**: Works on Windows, macOS, and Linux

### 🔍 Advanced Filtering

#### Search for Scripts
```bash
# Find all scripts containing "test"
npm run help -- --search test

# Find scripts related to "lint"
npm run help -- --search lint
```

#### Filter by Category
```bash
# Show only testing-related scripts
npm run help -- --category testing

# Show only development scripts  
npm run help -- --category development
```

#### List Available Categories
```bash
# See all available categories
npm run help -- --list
```

### 🛠️ Make Interface (Alternative)

For developers who prefer make-style commands:

```bash
# Show make help
make help

# Show all make targets (including component tests)
make help-all

# Use make commands directly
make dev          # Start development server
make test         # Run tests
make build        # Build project
make clean        # Clean and reinstall dependencies
```

## Available Script Categories

### Development
- `serve` / `dev` - Start local development server on port 8000

### Testing - General
- `test` - Run all tests (default test runner)
- `test:unit` - Run unit tests only
- `test:integration` - Run integration tests only
- `test:all` - Run all tests (unit + integration)
- `test:unit:basic` - Run basic unit tests only

### Testing - Modes
- `test:ci` - Run all tests with bail on first failure (for CI)
- `test:verbose` - Run all tests with verbose output
- `test:coverage` - Run all tests with coverage reporting
- `test:watch` - Run tests in watch mode (re-run on file changes)
- `test:bail` - Run all tests, stop on first failure

### Testing - Specialized
- `test:accessibility` - Run accessibility tests
- `test:performance` - Run performance tests

### Testing - Components
- `test:music-theory` - Run MusicTheory component tests
- `test:audio-engine` - Run AudioEngine component tests
- `test:theme-manager` - Run ThemeManager component tests
- `test:circle-renderer` - Run CircleRenderer component tests
- `test:theme-system` - Run theme system tests

### Code Quality
- `lint` - Run ESLint on JavaScript files
- `lint:fix` - Run ESLint and automatically fix issues
- `format` - Format code with Prettier
- `format:check` - Check if code is properly formatted

### Build & Deploy
- `build` - Full build: lint + format check + test
- `build:production` - Production build (same as build)
- `validate` - Validate codebase (same as build)
- `precommit` - Pre-commit hook: lint fix + format

## Implementation Details

### Files
- `scripts/help.js` - Main help script with advanced filtering
- `Makefile` - Alternative make-style interface
- `package.json` - Contains the `help` script definition

### Cross-Platform Compatibility
- **Colors**: Uses ANSI escape codes with TTY detection
- **No Color Mode**: Automatically disables colors in CI environments
- **Shell Compatibility**: Works with bash, zsh, cmd, PowerShell

### Customization

#### Adding New Scripts
1. Add your script to `package.json`
2. Add a description in `scripts/help.js` in the `scriptDescriptions` object
3. Optionally add it to a category in the `categories` object

#### Adding New Categories
1. Add the category to the `categories` object in `scripts/help.js`
2. List the relevant scripts under that category

#### Example: Adding a New Script
```javascript
// In scripts/help.js
const scriptDescriptions = {
    // ... existing descriptions
    'my-new-script': 'Description of what my new script does'
};

const categories = {
    // ... existing categories
    'My Category': ['my-new-script', 'another-script']
};
```

## Usage Examples

```bash
# Basic usage
npm run help

# Find all test-related commands
npm run help -- --search test

# Show only development commands
npm run help -- --category dev

# Use make interface
make help
make dev
make test

# Get help on help system
npm run help -- --help
```

## Benefits

1. **Discoverability**: New team members can quickly find available commands
2. **Documentation**: Each script is documented with its purpose
3. **Organization**: Scripts are logically grouped by function
4. **Flexibility**: Multiple ways to find and filter scripts
5. **Cross-Platform**: Works consistently across all development environments
6. **Familiar**: Similar to `make help` that many developers know

This help system makes the project more approachable and reduces the learning curve for new contributors.

# Changelog

All notable changes to the Circle of Fifths project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

### Removed

### Security

## [1.2.0] - 2025-12-05

### Added

- **SVGPathBuilder Utility** - Fluent API for building SVG paths with chainable methods
- **CircleGeometry Utility** - Centralized geometric calculations for circle visualization
- **CircleState Utility** - State management with pub-sub pattern and undo/redo support
- **Loading Skeleton** - Animated skeleton loader to prevent FOUC during initial render
- **Keyboard Shortcut Hints** - Visual badges showing keyboard shortcuts (S, C, P) on primary buttons
- **Progressive Disclosure** - Collapsible secondary controls using native `<details>` element
- **switchDifficulty Method** - Added missing method to InteractionsHandler for difficulty level switching
- **destroy Methods** - Added cleanup methods to CircleRenderer and InteractionsHandler for proper resource management
- **Enhanced Browser Detection** - Added comprehensive browser info including name, version, OS, tablet detection

### Changed

- **Button Hierarchy** - Implemented visual distinction between primary and secondary actions
- **CircleRenderer Refactoring** - Integrated new utility classes, reduced complexity by 50%
- **Segment Text Rendering** - Enhanced enharmonic labels with tspan elements for better layout
- **Audio Controls Layout** - Reorganized into primary and secondary control groups
- **Test Suite** - Updated tests to handle async rendering with requestAnimationFrame
- **createOscillator Method** - Updated to accept pan parameter for stereo positioning

### Fixed

- **TypeScript Errors** - Fixed 33 TypeScript type errors across 7 files
- **ESLint Errors** - Fixed 6 ESLint curly brace style violations
- **Type Definitions** - Updated types.d.ts with comprehensive class interfaces and Logger type
- **Missing Method Implementations** - Added switchDifficulty and destroy methods that were called but not defined
- **AudioEngine Settings Type** - Added proper AudioEngineSettings interface for type safety

### Removed

### Security

## [1.1.0] - 2025-10-12

### Added

- **Enharmonic Equivalent Display** - Positions 6-10 in the circle now show both sharp and flat names (e.g., 'F♯/G♭') for educational clarity
- **Minor Mode Visual Indicator** - Keys in minor mode now display with 'm' suffix (e.g., 'Cm') for clear visual distinction
- **Enharmonic Normalization** - getRelatedKeys() method now handles both sharp and flat key inputs (C# and Db, F# and Gb, etc.)
- **Comprehensive Test Coverage** - Added tests for flat keys and enharmonic equivalents in musicTheory.test.js
- **Enhanced Accessibility** - Aria-labels now announce both enharmonic names for screen readers (e.g., "F sharp or G flat major")
- **EventBus** - Publish-subscribe event system for loose component coupling
- **ARIA Live Regions** - Real-time screen reader announcements for audio playback
- User-facing error notification system with accessible UI
- Content Security Policy (CSP) meta tag for enhanced security
- Error notification styles with animations and accessibility support
- Getter properties for `currentKey` and `currentMode` in InteractionsHandler
- Conditional error logging in AudioEngine for better debugging
- CHANGELOG.md to track version history
- Comprehensive JSDoc documentation for 15+ previously undocumented methods
- `announcePlaybackStatus()` and `announceAudioStatus()` methods for accessibility
- `updateSegment()` method for efficient single-segment updates in CircleRenderer
- `previousKey` and `previousMode` tracking in event details

### Changed

- **CircleRenderer Performance** - Optimized to update only changed segments instead of re-rendering all 12
- Service worker registration path from `/sw.js` to `./sw.js` for proper GitHub Pages deployment
- Service worker cache cleanup strategy from setInterval to conditional cleanup during operations
- Error handling in `handleInitializationError` to use error parameter for detailed logging
- DOM manipulation in `updateRelatedKeys` and `updateChordProgressions` from innerHTML to safe methods
- `selectKey()` now tracks and updates only affected segments (50-67% fewer DOM operations)
- `switchMode()` checks if mode changed before updating
- Event details now include previous state (`previousKey`, `previousMode`) for better tracking

### Fixed

- **CRITICAL**: Circle of Fifths array now uses standard music theory notation with flats on the left side (Db, Ab, Eb, Bb) instead of sharps throughout
- **CRITICAL**: Flat key lookup failure - getRelatedKeys() now works correctly with flat keys (Db, Ab, Eb, Bb) through enharmonic normalization
- **CRITICAL**: Service worker registration failing on GitHub Pages deployment
- **HIGH**: Undefined instance variables (`currentDifficulty`, `currentRelativeIndex`) in InteractionsHandler
- **HIGH**: Service worker memory leak from setInterval preventing termination
- **MEDIUM**: Silent error swallowing in AudioEngine.stopAll()
- **MEDIUM**: XSS vulnerability from innerHTML usage
- **MEDIUM**: Missing user feedback when initialization errors occur
- Navigation through relative keys now properly uses MusicTheory.getRelatedKeys()

### Removed

- **Resize Method** - Removed unnecessary resize() method from CircleRenderer and resize event handlers from app.js (SVG viewBox handles responsive scaling automatically)

### Security

- Added Content Security Policy to prevent XSS attacks
- Replaced innerHTML with safe DOM manipulation to eliminate XSS risks
- Added HTML escaping helper function for user-facing messages

## [1.0.0] - 2024-01-01

### Added

- Interactive Circle of Fifths visualization with SVG rendering
- Web Audio API integration for real-time audio synthesis
- ADSR envelope shaping for natural-sounding notes
- Multi-oscillator synthesis with sub-oscillators and detuning
- Effects chain with reverb, delay, compression, and filtering
- Voice leading optimization for smooth chord progressions
- Comprehensive music theory engine
    - All major and minor key signatures
    - Scale generation (major, minor, harmonic minor, melodic minor)
    - Chord construction and progressions
    - Circle of fifths relationships (dominant, subdominant, relative)
- Progressive Web App (PWA) functionality
    - Service worker with offline support
    - App manifest with shortcuts
    - Installable on mobile and desktop
- Multiple theme support
    - Light theme
    - Dark theme
    - System preference detection
    - High contrast theme
    - Sepia theme
- Comprehensive accessibility features
    - ARIA labels and roles
    - Keyboard navigation
    - Screen reader announcements
    - Skip links
    - Focus management
- Touch and mouse interaction support
- Responsive design for mobile and desktop
- Browser compatibility with polyfills for older browsers
- Custom test framework with unit, integration, and performance tests
- ESLint and Prettier configuration for code quality
- Comprehensive documentation
    - README with features, usage, and architecture
    - JSDoc comments on public APIs
    - Inline code comments
    - Contributing guidelines

### Features

- **Audio Playback**
    - Play individual notes
    - Play scales (ascending/descending)
    - Play chords (major/minor)
    - Play chord progressions
    - Volume control
    - Adjustable tempo
- **Visual Features**
    - Color-coded key segments
    - Highlighting for related keys
    - Note highlighting during playback
    - Mode switching (major/minor)
    - Responsive circle sizing
- **Educational Features**
    - Key signature display
    - Scale notes display
    - Chord information
    - Related keys visualization
    - Common chord progressions
    - Roman numeral notation

- **User Experience**
    - Keyboard shortcuts (F1 for help)
    - Touch gestures
    - Loading states
    - Smooth animations
    - Theme persistence
    - Cross-tab theme synchronization

### Technical

- Vanilla JavaScript (ES6+)
- No external dependencies for core functionality
- Modular architecture with clear separation of concerns
- Event-driven component communication
- Comprehensive error handling
- Performance optimizations
    - Debounced resize handlers
    - Efficient audio scheduling
    - Cached calculations
- Browser support
    - Modern browsers (Chrome, Firefox, Safari, Edge)
    - Graceful degradation for older browsers
    - Polyfills for IE11 compatibility

## Version History

### Version Numbering

- **Major version** (X.0.0): Breaking changes or major feature additions
- **Minor version** (1.X.0): New features, backward compatible
- **Patch version** (1.0.X): Bug fixes, backward compatible

### Unreleased Changes

Changes in the `[Unreleased]` section will be moved to a versioned release when published.

---

## Links

- [Repository](https://github.com/cameronrye/circle-of-fifths)
- [Issues](https://github.com/cameronrye/circle-of-fifths/issues)
- [Pull Requests](https://github.com/cameronrye/circle-of-fifths/pulls)

---

## Notes

### Breaking Changes

Breaking changes will be clearly marked with **BREAKING CHANGE** in the changelog entry.

### Deprecations

Deprecated features will be marked with **DEPRECATED** and include migration instructions.

### Security Updates

Security-related changes will be marked with **SECURITY** and given high priority.

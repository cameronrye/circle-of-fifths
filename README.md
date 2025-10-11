<div align="center">
  <img src="assets/logo.svg" alt="Circle of Fifths Logo" width="120" height="120">

  # Interactive Circle of Fifths

  A comprehensive web application for learning music theory through an interactive Circle of Fifths visualization. This educational tool combines visual design with audio feedback to help users understand key relationships, scales, and chord progressions.
</div>

🌐 **Live Demo**: [https://cameronrye.github.io/circle-of-fifths/](https://cameronrye.github.io/circle-of-fifths/)

## Features

### Core Functionality

- **Interactive Circular Diagram**: Click or tap any key to explore its properties
- **Dual Mode Support**: Switch between Major and Minor circles
- **Audio Playback**: Hear scales, chords, and progressions for each key
- **Related Key Highlighting**: Visual indication of dominant, subdominant, and relative keys
- **Progressive Difficulty**: Beginner and Advanced modes with appropriate content

### Educational Content

- **Key Signatures**: Complete information about sharps and flats
- **Scale Notes**: Display of all notes in the selected scale
- **Chord Progressions**: Common progressions with Roman numeral analysis
- **Audio Synthesis**: Real-time audio generation using Web Audio API

### User Experience

- **Progressive Web App**: Installable with offline functionality
- **Multiple Themes**: Light, Dark, System, High Contrast, and Sepia themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Touch Optimized**: Enhanced touch interactions for mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support
- **Fast Loading**: Optimized assets and efficient rendering
- **Cross-Browser**: Compatible with modern browsers with polyfills

## Getting Started

### Quick Start

1. Open `index.html` in a modern web browser
2. Click on any key in the circle to select it
3. Use the audio controls to hear scales, chords, and progressions
4. Toggle between Major/Minor modes and Beginner/Advanced levels

### Browser Requirements

- Modern browser with Web Audio API support
- JavaScript enabled
- Audio permissions (for sound playback)

## Usage Guide

### Navigation

- **Click/Tap**: Select a key in the circle
- **Mode Toggle**: Switch between Major and Minor circles
- **Difficulty Toggle**: Change between Beginner and Advanced content
- **Audio Controls**: Play scales, chords, and progressions

### Keyboard Shortcuts

- `S`: Play scale for selected key
- `C`: Play chord for selected key
- `P`: Play chord progression
- `Escape`: Stop all audio
- `Ctrl+M`: Toggle Major/Minor mode
- `Ctrl+D`: Toggle difficulty level
- `F1` or `Shift+?`: Show keyboard shortcuts

### Audio Features

- **Scale Playback**: Hear the complete scale ascending
- **Chord Playback**: Play the tonic chord (major or minor)
- **Progression Playback**: Listen to common chord progressions
- **Volume Control**: Adjustable master volume
- **Stop Function**: Immediately halt all audio

## Technical Architecture

### File Structure

```text
├── index.html              # Main HTML file
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── css/
│   └── styles.css          # Complete stylesheet with themes
├── js/
│   ├── polyfills.js        # Browser compatibility
│   ├── logger.js           # Logging system
│   ├── musicTheory.js      # Music theory data and logic
│   ├── audioEngine.js      # Web Audio API integration
│   ├── circleRenderer.js   # SVG visualization
│   ├── themeManager.js     # Theme system
│   ├── themeToggle.js      # Theme UI controls
│   ├── interactions.js     # User input handling
│   └── app.js              # Main application controller
├── assets/
│   ├── favicon.svg         # Application icon
│   └── favicon.png         # Fallback icon
└── README.md               # This documentation
```

### Core Components

#### MusicTheory Class

- Comprehensive music theory data model
- Key signature calculations
- Scale and chord generation
- Circle of fifths relationships

#### AudioEngine Class

- Web Audio API synthesis
- Real-time audio generation
- Envelope shaping (ADSR)
- Multiple waveform support

#### CircleRenderer Class

- SVG-based visualization
- Dynamic color coding
- Smooth animations
- Responsive scaling

#### InteractionsHandler Class

- Event management
- User input processing
- UI state synchronization
- Accessibility features

## Music Theory Coverage

### Keys and Signatures

- All 12 major keys with proper key signatures
- All 12 minor keys (natural minor)
- Enharmonic equivalents
- Sharp and flat notation

### Relationships

- **Dominant**: Fifth above (clockwise)
- **Subdominant**: Fifth below (counter-clockwise)
- **Relative**: Major/minor pairs sharing key signatures

### Scales and Modes

- Major scales (Ionian mode)
- Natural minor scales (Aeolian mode)
- Proper interval patterns
- Scale degree relationships

### Chord Progressions

- Popular progressions (I-V-vi-IV, ii-V-I)
- Roman numeral analysis
- Major and minor variations
- Jazz and classical patterns

## Accessibility Features

### Keyboard Navigation

- Full keyboard support for all interactive elements
- Tab navigation through circle segments
- Enter/Space activation
- Focus indicators

### Screen Reader Support

- Proper ARIA labels and roles
- Semantic HTML structure
- Alternative text for visual elements
- Status announcements

### Visual Accessibility

- High contrast color scheme
- Scalable vector graphics
- Responsive text sizing
- Reduced motion support

## Browser Compatibility

### Supported Browsers

- Chrome 66+
- Firefox 60+
- Safari 11.1+
- Edge 79+

### Required Features

- Web Audio API
- SVG support
- ES6 JavaScript
- CSS Grid and Flexbox

## Performance Optimization

### Loading Performance

- Preloaded critical resources
- Optimized SVG graphics
- Efficient JavaScript bundling
- Minimal external dependencies

### Runtime Performance

- Efficient audio synthesis
- Optimized DOM updates
- Debounced resize handling
- Memory leak prevention

## Development

### Local Development

1. **Clone the repository**:

    ```bash
    git clone https://github.com/cameronrye/circle-of-fifths.git
    cd circle-of-fifths
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Start development server**:

    ```bash
    npm run serve
    # or use the make interface
    make dev
    ```

    The application will be available at `http://localhost:8000`

4. **Run tests**:

    ```bash
    npm test
    ```

5. **Explore available commands**:

    ```bash
    # Show all available npm scripts with descriptions
    npm run help

    # Or use the make interface
    make help

    # Search for specific commands
    npm run help -- --search test
    ```

### Build and Deployment

#### Building for Production

```bash
npm run build
```

This command runs linting, formatting checks, and all tests to ensure the project is ready for deployment.

#### GitHub Pages Deployment

The project is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment process:

1. **Automatic Deployment**: GitHub Actions workflow (`.github/workflows/deploy.yml`) handles deployment
2. **Build Process**: Runs tests, linting, and formatting checks
3. **Static Hosting**: Deploys to GitHub Pages at `https://cameronrye.github.io/circle-of-fifths/`

#### Manual Deployment

To deploy manually to GitHub Pages:

1. **Ensure all tests pass**:

    ```bash
    npm run build
    ```

2. **Push to main branch**:

    ```bash
    git push origin main
    ```

The GitHub Actions workflow will automatically build and deploy the site.

### Code Organization

- Modular JavaScript architecture
- Separation of concerns
- Comprehensive error handling
- Extensive code documentation

### Customization

- CSS custom properties for theming
- Configurable audio settings
- Extensible music theory data
- Modular component system

## Educational Applications

### Learning Objectives

- Understanding key relationships
- Recognizing key signatures
- Hearing interval relationships
- Exploring chord progressions

### Teaching Integration

- Suitable for music theory courses
- Self-paced learning tool
- Visual and auditory learning styles
- Progressive skill development

## Future Enhancements

### Potential Features

- Additional scales and modes
- Chord voicing variations
- MIDI input/output support
- Practice exercises and quizzes
- User progress tracking

### Technical Improvements

- ✅ Service worker for offline use
- ✅ Progressive Web App features
- ✅ Advanced audio effects
- ✅ Performance analytics
- Enhanced caching strategies
- Background sync capabilities
- Push notifications for updates

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## Support

For questions, issues, or feedback, please create an issue in the project repository.

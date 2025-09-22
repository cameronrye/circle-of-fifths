# Interactive Circle of Fifths

A comprehensive web application for learning music theory through an interactive Circle of Fifths visualization. This educational tool combines visual design with audio feedback to help users understand key relationships, scales, and chord progressions.

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

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessibility**: Full keyboard navigation and screen reader support
- **Fast Loading**: Optimized assets and efficient rendering
- **Cross-Browser**: Compatible with modern browsers

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

```
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Complete stylesheet
├── js/
│   ├── musicTheory.js      # Music theory data and logic
│   ├── audioEngine.js      # Web Audio API integration
│   ├── circleRenderer.js   # SVG visualization
│   ├── interactions.js     # User input handling
│   └── app.js              # Main application controller
├── assets/
│   └── favicon.svg         # Application icon
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

- Service worker for offline use
- Progressive Web App features
- Advanced audio effects
- Performance analytics

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## Support

For questions, issues, or feedback, please create an issue in the project repository.

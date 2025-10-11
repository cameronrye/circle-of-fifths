# Circle of Fifths Logo Design

## Overview

The Circle of Fifths logo features a modern, geometric design with five interlocking circles that represent both the musical concept and the application's purpose.

![Circle of Fifths Logo](../assets/logo.svg)

## Design Concept

### Visual Elements

The logo consists of **five interlocking circles** arranged in a circular/pentagonal pattern, creating a distinctive and memorable mark.

**Key Features:**
- 🔵 **5 Circles**: Directly represents the "Fifths" in Circle of Fifths
- 🔄 **Circular Arrangement**: Represents the cyclical nature of the Circle of Fifths
- 🔗 **Overlapping Design**: Symbolizes the relationships and connections between musical keys
- 🎨 **Gradient Colors**: Transitions from light blue (#3498db) to dark blue (#2c3e50)
- ⚪ **Center Anchor**: Small white dot provides visual balance

### Design Philosophy

1. **Musical Meaning**: The five circles represent the interval of a fifth, the fundamental relationship in the Circle of Fifths
2. **Interconnection**: Overlapping circles symbolize how keys relate to each other through shared notes and harmonic relationships
3. **Circular Motion**: The arrangement suggests the endless cycle of the Circle of Fifths
4. **Modern Aesthetic**: Clean, geometric design that feels contemporary and professional
5. **Educational**: Abstract enough to be distinctive, yet meaningful to those who understand music theory

## Color Palette

The logo uses the application's primary color scheme:

- **Primary Blue**: `#3498db` - Bright, engaging blue (Circle 1)
- **Blue Gradient 2**: `#3182c7` - Transitional shade (Circle 2)
- **Blue Gradient 3**: `#2e6cb3` - Mid-tone blue (Circle 3)
- **Blue Gradient 4**: `#2b569f` - Deeper blue (Circle 4)
- **Dark Blue**: `#2c3e50` - Rich, professional dark blue (Circle 5)
- **White Accent**: `#ffffff` - Center dot for contrast

All circles use 85% opacity to create beautiful color blending in overlapping areas.

## Technical Specifications

### File Formats

The logo is available in multiple formats for different use cases:

#### Vector Format
- **Source**: `assets/logo.svg` - Scalable vector graphic, ideal for all sizes
- **Favicon**: `assets/favicon.svg` - Optimized for browser tabs

#### Raster Formats (PNG)
- `favicon-16x16.png` - Browser favicon (small)
- `favicon-32x32.png` - Browser favicon (standard)
- `favicon-48x48.png` - Browser favicon (large)
- `favicon-64x64.png` - High-DPI favicon
- `icon-128x128.png` - Small app icon
- `icon-192x192.png` - PWA icon (standard)
- `icon-256x256.png` - Medium app icon
- `icon-512x512.png` - PWA icon (large)
- `apple-touch-icon.png` - iOS home screen icon (180x180)

### Dimensions

- **ViewBox**: 100 × 100 units
- **Circle Radius**: 18 units each
- **Center Dot Radius**: 3 units
- **Recommended Display Sizes**: 16px to 512px (scales perfectly at any size)

### Scalability

The logo is designed to work at all sizes:

- ✅ **16×16px**: Recognizable pattern, distinct shape
- ✅ **32×32px**: Clear circles, good detail
- ✅ **64×64px**: Full detail visible
- ✅ **192×192px**: Perfect clarity
- ✅ **512×512px**: Maximum detail and color blending

## Usage Guidelines

### Recommended Uses

- Application icon (desktop, mobile, web)
- Browser favicon
- PWA install icon
- Social media profile images
- Documentation headers
- Marketing materials
- App store listings

### Background Compatibility

The logo works on:
- ✅ Light backgrounds (white, light gray)
- ✅ Dark backgrounds (black, dark gray)
- ✅ Colored backgrounds (with sufficient contrast)

The semi-transparent circles create natural blending with backgrounds while maintaining visibility.

### Minimum Size

- **Digital**: 16×16px (favicon size)
- **Print**: 0.5 inches / 1.27 cm

### Clear Space

Maintain clear space around the logo equal to at least 10% of the logo's width on all sides.

## Generation

Icons are automatically generated from the source SVG using the build script:

```bash
node scripts/generate-icons.js
```

This script uses the Sharp library to convert the SVG to PNG at various sizes with optimal quality.

## Design Rationale

### Why Five Circles?

The number five is fundamental to the Circle of Fifths:
- Moving by **fifths** (5 semitones) creates the circle
- The interval of a **perfect fifth** is the basis of Western harmony
- **Five** circles create a visually balanced, memorable pattern

### Why Interlocking?

The overlapping design represents:
- **Shared notes** between related keys
- **Harmonic relationships** in music theory
- **Interconnected learning** - how understanding one key helps understand others
- **Community and connection** - music brings people together

### Why This Color Scheme?

- **Blue**: Associated with trust, learning, and professionalism
- **Gradient**: Suggests progression and depth of knowledge
- **Dark to Light**: Represents the journey from beginner to advanced understanding

## Accessibility

- **High Contrast**: White center dot provides focal point
- **Color Independence**: Shape is recognizable even in grayscale
- **Simple Geometry**: Easy to recognize and remember
- **No Text**: Works across all languages and cultures

## Version History

- **v1.0** (2025): Initial interlocking circles design
  - Five circles in pentagonal arrangement
  - Blue gradient color scheme
  - Semi-transparent overlapping effect
  - White center anchor point

## Files

All logo files are located in the `assets/` directory:

```
assets/
├── logo.svg                 # Source vector logo
├── favicon.svg              # Browser favicon (SVG)
├── favicon.png              # Browser favicon (32×32 PNG)
├── favicon-16x16.png        # Small favicon
├── favicon-32x32.png        # Standard favicon
├── favicon-48x48.png        # Large favicon
├── favicon-64x64.png        # High-DPI favicon
├── icon-128x128.png         # Small app icon
├── icon-192x192.png         # PWA icon (standard)
├── icon-256x256.png         # Medium app icon
├── icon-512x512.png         # PWA icon (large)
└── apple-touch-icon.png     # iOS home screen icon
```

## Credits

Logo designed for the Interactive Circle of Fifths project.
- **Design**: Geometric interlocking circles concept
- **Colors**: Based on application theme palette
- **Generation**: Automated using Sharp image processing library

---

For questions or suggestions about the logo design, please open an issue in the project repository.


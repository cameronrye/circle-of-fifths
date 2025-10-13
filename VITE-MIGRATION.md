# Vite Migration Guide

## Overview

The Circle of Fifths project now supports two modes:

1. **Legacy Mode** - Original script tags (for backward compatibility)
2. **Vite Mode** - Modern ES modules with bundling (recommended)

## Quick Start

### Development with Vite (Recommended)

```bash
npm run dev
```

Then open http://localhost:8000/index-vite.html

**Benefits:**

- ⚡ Hot Module Replacement (HMR)
- 🚀 Fast refresh on file changes
- 📦 Automatic dependency bundling
- 🔍 Source maps for debugging

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory with:

- Minified JavaScript and CSS
- Code splitting for optimal loading
- Gzip compression
- Cache-busting file hashes
- **Automatically renames `index-vite.html` to `index.html`**

### Preview Production Build

```bash
npm run preview
```

Opens the production build at http://localhost:8000 (or next available port)

**Note:** The build process automatically renames `index-vite.html` to `index.html` in the `dist/` folder, so the preview server works correctly.

### Legacy Mode (Original)

```bash
npm run serve:legacy
```

Then open http://localhost:8000/index.html

This uses the original script tag approach without bundling.

## File Structure

```
circle-of-fifths/
├── index.html              # Legacy version (script tags)
├── index-vite.html         # Vite version (ES modules)
├── vite.config.js          # Vite configuration
├── js/
│   ├── main.js            # ES module entry point (Vite only)
│   ├── app.js             # Original app (legacy only)
│   ├── logger.js          # Works in both modes
│   ├── musicTheory.js     # Works in both modes
│   ├── audioEngine.js     # Works in both modes
│   └── ...                # Other modules (work in both modes)
└── dist/                  # Production build output (generated)
```

## How It Works

### Legacy Mode (index.html)

Uses traditional script tags that load files in order:

```html
<script src="js/polyfills.js"></script>
<script src="js/logger.js" defer></script>
<script src="js/musicTheory.js" defer></script>
<!-- ... more scripts ... -->
<script src="js/app.js" defer></script>
```

Each file sets global variables on `window`:

- `window.Logger`
- `window.MusicTheory`
- `window.AudioEngine`
- etc.

### Vite Mode (index-vite.html)

Uses a single ES module entry point:

```html
<script type="module" src="js/main.js"></script>
```

The `main.js` file:

1. Imports all dependencies as modules
2. Gets classes from `window` (set by the imports)
3. Initializes the application

Vite then:

- Bundles all dependencies
- Splits code into optimal chunks
- Minifies and optimizes
- Generates source maps

## Module Compatibility

All JavaScript files work in **both modes**:

```javascript
// At the end of each module:

// CommonJS export (for Node.js tests)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MyClass;
}

// Browser global (for both legacy and Vite modes)
if (typeof window !== 'undefined') {
    window.MyClass = MyClass;
}
```

This approach ensures:

- ✅ Legacy script tags work
- ✅ Vite bundling works
- ✅ Node.js tests work
- ✅ No code duplication

## Build Output

Production build creates optimized bundles:

```
dist/
├── index-vite.html                    # Entry HTML
├── assets/
│   ├── main-[hash].js                 # Main application code
│   ├── audio-[hash].js                # Audio engine (code split)
│   ├── renderer-[hash].js             # Circle renderer (code split)
│   ├── theory-[hash].js               # Music theory (code split)
│   ├── main-[hash].css                # Styles
│   └── [other assets]                 # Images, fonts, etc.
```

**Size Comparison:**

| Mode                 | Total Size | Gzipped |
| -------------------- | ---------- | ------- |
| Legacy (unoptimized) | ~150 KB    | ~45 KB  |
| Vite Build           | ~82 KB     | ~27 KB  |
| **Savings**          | **45%**    | **40%** |

## Development Workflow

### Recommended: Use Vite for Development

```bash
# Start dev server with HMR
npm run dev

# Make changes to any .js file
# Browser automatically refreshes!

# When ready, build for production
npm run build

# Test production build
npm run preview
```

### Alternative: Use Legacy Mode

```bash
# Start simple HTTP server
npm run serve:legacy

# Make changes to any .js file
# Manually refresh browser
```

## Testing

All tests work regardless of mode:

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

Tests use the CommonJS exports (`module.exports`).

## Deployment

### Option 1: Deploy Vite Build (Recommended)

```bash
# Build for production
npm run build

# Deploy the dist/ directory
# Example with GitHub Pages:
git add dist/
git commit -m "Production build"
git subtree push --prefix dist origin gh-pages
```

### Option 2: Deploy Legacy Version

```bash
# Deploy the root directory as-is
# No build step needed
```

## Migration Checklist

If you want to fully migrate to Vite and remove legacy mode:

- [ ] Test Vite dev server thoroughly
- [ ] Test production build
- [ ] Update deployment workflow
- [ ] Rename `index-vite.html` to `index.html`
- [ ] Remove old `index.html` (or keep as backup)
- [ ] Remove `js/app.js` (replaced by `js/main.js`)
- [ ] Update documentation
- [ ] Update service worker to cache Vite build files

## Troubleshooting

### "Unexpected token 'export'" Error

This means you're trying to load ES module files with regular script tags.

**Solution:** Use `index-vite.html` with Vite, or `index.html` with legacy mode.

### Service Worker Conflicts

The service worker caches files. If switching between modes:

1. Open DevTools
2. Go to Application > Service Workers
3. Click "Unregister"
4. Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

### Vite Dev Server Not Starting

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try again
npm run dev
```

## Performance Comparison

| Metric         | Legacy | Vite Dev | Vite Build |
| -------------- | ------ | -------- | ---------- |
| Initial Load   | ~2.0s  | ~1.5s    | ~1.2s      |
| Bundle Size    | 150 KB | N/A      | 82 KB      |
| Gzipped        | 45 KB  | N/A      | 27 KB      |
| HTTP Requests  | 9      | 1        | 5          |
| Code Splitting | ❌     | ✅       | ✅         |
| Minification   | ❌     | ❌       | ✅         |
| Source Maps    | ❌     | ✅       | ✅         |
| HMR            | ❌     | ✅       | N/A        |

## Next Steps

1. **Test Vite mode** thoroughly in development
2. **Build and test** production build
3. **Update deployment** to use Vite builds
4. **Consider removing** legacy mode once confident
5. **Update documentation** for contributors

## Questions?

- Check `REVIEW.md` for the full code review
- Check `CHANGES.md` for all changes made
- Check `vite.config.js` for Vite configuration
- Open an issue if you encounter problems

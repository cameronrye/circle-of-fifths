#!/usr/bin/env node

/**
 * Generate PNG icons from SVG logo
 * Creates favicons and PWA icons at various sizes
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const LOGO_SVG = path.join(__dirname, '../assets/logo.svg');
const ASSETS_DIR = path.join(__dirname, '../assets');

// Icon sizes to generate
const ICON_SIZES = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 48, name: 'favicon-48x48.png' },
    { size: 64, name: 'favicon-64x64.png' },
    { size: 128, name: 'icon-128x128.png' },
    { size: 192, name: 'icon-192x192.png' },
    { size: 256, name: 'icon-256x256.png' },
    { size: 512, name: 'icon-512x512.png' },
    { size: 180, name: 'apple-touch-icon.png' }, // Apple touch icon
];

async function generateIcons() {
    console.log('🎨 Generating icons from SVG logo...\n');

    // Ensure assets directory exists
    if (!fs.existsSync(ASSETS_DIR)) {
        fs.mkdirSync(ASSETS_DIR, { recursive: true });
    }

    // Read SVG file
    const svgBuffer = fs.readFileSync(LOGO_SVG);

    // Generate each icon size
    for (const { size, name } of ICON_SIZES) {
        try {
            const outputPath = path.join(ASSETS_DIR, name);

            await sharp(svgBuffer)
                .resize(size, size, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 },
                })
                .png()
                .toFile(outputPath);

            console.log(`✅ Generated ${name} (${size}x${size})`);
        } catch (error) {
            console.error(`❌ Failed to generate ${name}:`, error.message);
        }
    }

    // Also update the main favicon.png (32x32 is standard)
    try {
        const faviconPath = path.join(ASSETS_DIR, 'favicon.png');
        await sharp(svgBuffer)
            .resize(32, 32, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .png()
            .toFile(faviconPath);

        console.log(`✅ Generated favicon.png (32x32)`);
    } catch (error) {
        console.error(`❌ Failed to generate favicon.png:`, error.message);
    }

    // Update favicon.svg with the new logo
    try {
        const newFaviconSvgPath = path.join(ASSETS_DIR, 'favicon.svg');
        fs.copyFileSync(LOGO_SVG, newFaviconSvgPath);
        console.log(`✅ Updated favicon.svg`);
    } catch (error) {
        console.error(`❌ Failed to update favicon.svg:`, error.message);
    }

    console.log('\n✨ Icon generation complete!');
    console.log(`📁 Icons saved to: ${ASSETS_DIR}`);
}

// Run the generator
generateIcons().catch((error) => {
    console.error('❌ Icon generation failed:', error);
    process.exit(1);
});


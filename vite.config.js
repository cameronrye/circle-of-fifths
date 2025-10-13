import { defineConfig } from 'vite';
import { resolve } from 'path';
import { renameSync, existsSync } from 'fs';

// Plugin to rename index-vite.html to index.html after build
function renameIndexPlugin() {
    return {
        name: 'rename-index',
        closeBundle() {
            const oldPath = resolve(__dirname, 'dist/index-vite.html');
            const newPath = resolve(__dirname, 'dist/index.html');
            if (existsSync(oldPath)) {
                renameSync(oldPath, newPath);
                console.log('✅ Renamed index-vite.html to index.html');
            }
        }
    };
}

export default defineConfig({
    // Base public path
    base: './',

    // Build configuration
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: false, // Keep console for educational purposes
                drop_debugger: true
            }
        },
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index-vite.html')
            },
            output: {
                // Manual chunk splitting for better caching
                manualChunks: {
                    audio: ['./js/audioEngine.js'],
                    renderer: ['./js/circleRenderer.js'],
                    theory: ['./js/musicTheory.js']
                }
            }
        },
        // Target modern browsers (matching browserslist)
        target: 'es2020',
        cssCodeSplit: true,
        chunkSizeWarningLimit: 500
    },

    // Development server configuration
    server: {
        port: 8000,
        open: true,
        cors: true,
        strictPort: false
    },

    // Preview server (for production build preview)
    preview: {
        port: 8000,
        open: true,
        strictPort: false
    },

    // Plugin configuration
    plugins: [renameIndexPlugin()],

    // Optimize dependencies
    optimizeDeps: {
        include: []
    },

    // Define global constants
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.1.0')
    }
});

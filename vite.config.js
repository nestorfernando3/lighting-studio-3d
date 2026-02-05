import { defineConfig } from 'vite';

export default defineConfig({
    base: process.env.BASE_URL || './',  // Use env var for GitHub Pages, relative for Electron
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true
    }
});

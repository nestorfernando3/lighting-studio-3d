import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ command }) => ({
    base: command === 'build' ? '/lighting-studio-3d/' : '/',
    plugins: [
        visualizer({
            filename: 'bundle-stats.html',
            open: false,
            gzipSize: true,
            brotliSize: true
        })
    ],
    build: {
        target: 'esnext'
    }
}));

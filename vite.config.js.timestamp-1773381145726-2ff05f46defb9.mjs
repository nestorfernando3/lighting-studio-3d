// vite.config.js
import { defineConfig } from "file:///Users/nestor/Documents/LightStudio3D/node_modules/vite/dist/node/index.js";
import { visualizer } from "file:///Users/nestor/Documents/LightStudio3D/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { VitePWA } from "file:///Users/nestor/Documents/LightStudio3D/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig(({ command }) => ({
  base: command === "build" ? "/lighting-studio-3d/" : "/",
  plugins: [
    visualizer({
      filename: "bundle-stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true
    }),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,glb,json}"]
      }
    })
  ],
  build: {
    target: "esnext"
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.js"],
    globals: false
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbmVzdG9yL0RvY3VtZW50cy9MaWdodFN0dWRpbzNEXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbmVzdG9yL0RvY3VtZW50cy9MaWdodFN0dWRpbzNEL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9uZXN0b3IvRG9jdW1lbnRzL0xpZ2h0U3R1ZGlvM0Qvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInO1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBjb21tYW5kIH0pID0+ICh7XG4gICAgYmFzZTogY29tbWFuZCA9PT0gJ2J1aWxkJyA/ICcvbGlnaHRpbmctc3R1ZGlvLTNkLycgOiAnLycsXG4gICAgcGx1Z2luczogW1xuICAgICAgICB2aXN1YWxpemVyKHtcbiAgICAgICAgICAgIGZpbGVuYW1lOiAnYnVuZGxlLXN0YXRzLmh0bWwnLFxuICAgICAgICAgICAgb3BlbjogZmFsc2UsXG4gICAgICAgICAgICBnemlwU2l6ZTogdHJ1ZSxcbiAgICAgICAgICAgIGJyb3RsaVNpemU6IHRydWVcbiAgICAgICAgfSksXG4gICAgICAgIFZpdGVQV0Eoe1xuICAgICAgICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXG4gICAgICAgICAgICB3b3JrYm94OiB7XG4gICAgICAgICAgICAgICAgZ2xvYlBhdHRlcm5zOiBbJyoqLyoue2pzLGNzcyxodG1sLGljbyxwbmcsc3ZnLGdsYixqc29ufSddXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgXSxcbiAgICBidWlsZDoge1xuICAgICAgICB0YXJnZXQ6ICdlc25leHQnXG4gICAgfSxcbiAgICB0ZXN0OiB7XG4gICAgICAgIGVudmlyb25tZW50OiAnbm9kZScsXG4gICAgICAgIGluY2x1ZGU6IFsndGVzdHMvKiovKi50ZXN0LmpzJ10sXG4gICAgICAgIGdsb2JhbHM6IGZhbHNlXG4gICAgfVxufSkpO1xuXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlTLFNBQVMsb0JBQW9CO0FBQzlULFNBQVMsa0JBQWtCO0FBQzNCLFNBQVMsZUFBZTtBQUV4QixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLFFBQVEsT0FBTztBQUFBLEVBQzFDLE1BQU0sWUFBWSxVQUFVLHlCQUF5QjtBQUFBLEVBQ3JELFNBQVM7QUFBQSxJQUNMLFdBQVc7QUFBQSxNQUNQLFVBQVU7QUFBQSxNQUNWLE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxNQUNWLFlBQVk7QUFBQSxJQUNoQixDQUFDO0FBQUEsSUFDRCxRQUFRO0FBQUEsTUFDSixjQUFjO0FBQUEsTUFDZCxTQUFTO0FBQUEsUUFDTCxjQUFjLENBQUMseUNBQXlDO0FBQUEsTUFDNUQ7QUFBQSxJQUNKLENBQUM7QUFBQSxFQUNMO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDSCxRQUFRO0FBQUEsRUFDWjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0YsYUFBYTtBQUFBLElBQ2IsU0FBUyxDQUFDLG9CQUFvQjtBQUFBLElBQzlCLFNBQVM7QUFBQSxFQUNiO0FBQ0osRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K

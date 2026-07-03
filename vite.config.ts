import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Shrink bundled PNG/JPG/SVG at build time. AVIF/WebP are already hand-tuned,
    // so they're excluded from the test to avoid the plugin re-encoding them larger.
    ViteImageOptimizer({
      test: /\.(png|jpe?g|svg)$/i,
      png: { quality: 80 },
      jpeg: { quality: 72 },
      jpg: { quality: 72 },
    }),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

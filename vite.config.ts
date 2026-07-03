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
  build: {
    // Split the vendor monolith into cacheable chunks so no single JS file is
    // huge and they can download in parallel on throttled links.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          // React core MUST stay in ONE chunk — react-dom reads React's internal
          // singleton, so splitting them apart breaks hydration entirely.
          if (
            /[\\/]node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|@remix-run[\\/]router)[\\/]/.test(
              id
            )
          )
            return "react";
          if (id.includes("@tanstack")) return "react-query";
          if (id.includes("@sanity") || id.includes("groq")) return "sanity";
          if (id.includes("embla")) return "carousel";
          if (id.includes("@radix-ui")) return "radix";
          if (id.includes("lucide-react")) return "icons";
          // Everything else: one chunk per package so no "vendor" megachunk forms.
          const after = id.split("node_modules/").pop() || "";
          const pkg = after.startsWith("@")
            ? after.split("/").slice(0, 2).join("/")
            : after.split("/")[0];
          return `vendor-${pkg.replace("@", "").replace("/", "-")}`;
        },
      },
    },
  },
}));

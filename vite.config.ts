import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    cssCodeSplit: false,
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      output: {
        entryFileNames: "index.js",
        chunkFileNames: "[name].js",
        assetFileNames: (info) => {
          const nameFromArray = Array.isArray(info.names)
            ? info.names[0]
            : undefined;
          const name = nameFromArray ?? info.name ?? "";
          if (name.endsWith(".css")) return "styles.css";
          return "[name][extname]";
        },
      },
    },
  },
  publicDir: "public",
});

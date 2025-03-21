import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { peerDependencies } from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "mig-ste",
      fileName: (format) => `index.${format}.js`,
      formats: ["umd", "es"]
    },
    rollupOptions: {
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      },
      external: [...Object.keys(peerDependencies)]
    },
    sourcemap: true,
    emptyOutDir: true
  },
  plugins: [dts()]
});
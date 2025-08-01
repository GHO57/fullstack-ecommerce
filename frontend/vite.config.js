import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/api/v1": "http://localhost:4000",
        },
        historyApiFallback: true,
    },
    build: {
        sourcemap: true,
        minify: "esbuild",
        rollupOptions: {
            treeshake: true,
        },
    },
});

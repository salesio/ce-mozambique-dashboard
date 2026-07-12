import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    build: {
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "CESupabase",
        formats: ["iife"],
        fileName: () => "supabase-bundle.js"
      },
      outDir: "js",
      emptyOutDir: false,
      rollupOptions: {
        output: { extend: true }
      }
    },
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(env.VITE_SUPABASE_URL || ""),
      "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(env.VITE_SUPABASE_ANON_KEY || "")
    }
  };
});
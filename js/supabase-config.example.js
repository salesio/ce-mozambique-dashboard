/**
 * Copy to js/supabase-config.js and fill with your Supabase project values.
 * js/supabase-config.js is gitignored — never commit real keys.
 *
 * For GitHub Pages without a Vite rebuild, this runtime config is used.
 * When running `npm run build:supabase` with a .env file, values are baked into supabase-bundle.js.
 */
window.__CE_ENV__ = {
  VITE_SUPABASE_URL: "https://YOUR_PROJECT_REF.supabase.co",
  VITE_SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY"
};
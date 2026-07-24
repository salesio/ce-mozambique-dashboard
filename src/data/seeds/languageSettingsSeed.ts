import type { LanguageSetting } from "../types/entities";

export const LANGUAGE_SETTINGS_SEED: LanguageSetting[] = [
  {
    id: "lang-pt",
    code: "pt",
    name: "Portuguese",
    name_native: "Português",
    is_active: true,
    is_default: true,
    sort_order: 1,
    created_at: "2026-07-01",
    updated_at: "2026-07-01",
  },
  {
    id: "lang-en",
    code: "en",
    name: "English",
    name_native: "English",
    is_active: true,
    is_default: false,
    sort_order: 2,
    created_at: "2026-07-01",
    updated_at: "2026-07-01",
  },
  {
    id: "lang-fr",
    code: "fr",
    name: "French",
    name_native: "Français",
    is_active: true,
    is_default: false,
    sort_order: 3,
    created_at: "2026-07-01",
    updated_at: "2026-07-01",
  },
];

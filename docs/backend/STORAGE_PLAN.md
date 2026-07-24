# Storage Plan

## Phase 1 status

- Plan + SQL notes only (`database/storage.sql`)
- `VITE_ENABLE_STORAGE=false` by default
- Metadata table `public.documents` prepared in schema

## Phase 5 pilot

- Client: `src/data/adapters/supabase/supabaseStorageClient.ts`
- Documents metadata: `documentsSupabaseAdapter.ts`
- Bucket **finance-proofs** = **private** only (signed URLs)
- When `VITE_ENABLE_STORAGE=false` → mock paths `mock://…` in documents row
- Never use public-assets for payment proofs

## Future buckets

| Bucket | Public | Purpose |
|--------|--------|---------|
| public-assets | yes | logos, non-sensitive public media |
| finance-proofs | no | payment proofs / POP |
| staff-documents | no | contracts, IDs |
| sacrament-documents | no | certificates, marriage docs |
| counseling-documents | no | confidential case files |
| foundation-exams | no | exam attachments |
| program-files | no | program assets |
| ministry-materials | no | catalogues / files |
| media-assets | no | media team files |
| general-documents | no | catch-all private |

## Rules

1. **public-assets** may be public; everything sensitive is private.
2. Never store finance / staff / counseling / sacrament files in public buckets.
3. Prefer **signed URLs** for private objects after Auth is live.
4. Persist metadata in `documents` (`storage_bucket`, `storage_path`, `file_url`, `entity_*`).
5. Frontend may use anon client + user JWT later; service role only on server for admin ops.
6. Legacy finance proof upload path (`PAYMENT_PROOFS_BUCKET` in `src/lib`) stays optional until Storage pilot.

## Link to modules

| Module | Bucket idea |
|--------|-------------|
| Finance / public giving | finance-proofs |
| Staff & RH | staff-documents |
| Sacraments | sacrament-documents |
| Counseling | counseling-documents |
| Foundation School | foundation-exams |
| Programs | program-files |
| Media | media-assets |
| Ministry Materials | ministry-materials |

-- ============================================================================
-- CE Mozambique — Storage plan SQL notes (Backend Phase 1)
-- ============================================================================
-- Supabase Storage buckets are created in the Supabase dashboard / Management API.
-- This file documents intended buckets and metadata linkage via public.documents.
-- See docs/backend/STORAGE_PLAN.md
-- ============================================================================

/*
Buckets (create in Supabase project when enabling VITE_ENABLE_STORAGE):

| Bucket                 | Public | Purpose                              |
|------------------------|--------|--------------------------------------|
| public-assets          | yes    | logos, non-sensitive public media    |
| finance-proofs         | no     | POP / payment proofs                 |
| staff-documents        | no     | contracts, IDs (sensitive)           |
| sacrament-documents    | no     | certificates, marriage docs          |
| counseling-documents   | no     | confidential case files              |
| foundation-exams       | no     | exam attachments                     |
| program-files          | no     | program assets                       |
| ministry-materials     | no     | catalogues / files                   |
| media-assets           | no     | media team files                     |
| general-documents      | no     | catch-all private                    |

Rules:
- Never put finance / staff / counseling / sacrament docs in public-assets.
- Store paths in public.documents (storage_bucket, storage_path, file_url).
- Prefer signed URLs for private buckets (Auth phase).
- Max file size and mime types configured per bucket in Supabase.
- Virus scanning / retention policies = future ops task.

Phase 5 pilot (finance-proofs):
- Create PRIVATE bucket named: finance-proofs
- Do NOT enable public access
- Frontend uses anon key + signed URLs only
- Enable with VITE_ENABLE_STORAGE=true
- When storage disabled, app stores mock metadata only

Example Supabase JS (authenticated client later):

  await supabase.storage.from('finance-proofs').upload(path, file)
  const { data } = await supabase.storage.from('finance-proofs').createSignedUrl(path, 3600)
*/

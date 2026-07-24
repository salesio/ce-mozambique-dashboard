/**
 * Documents metadata + finance proof upload — Phase 5.
 * Private bucket finance-proofs only for POP/proofs.
 */
import type { EntityId } from "../../types/entities";
import type { DataResult } from "../../types/repository";
import {
  createRow,
  deleteRow,
  filterRows,
  getRowById,
  isValidUuid,
  listRows,
  newClientUuid,
  updateRow,
} from "./supabaseRepositoryBase";
import type { SupabaseRow } from "./supabaseTypes";
import {
  FINANCE_PROOFS_BUCKET,
  createSignedUrl,
  getStorageInfo,
  isSupabaseStorageEnabled,
  sanitizeStorageFileName,
  uploadFile,
} from "./supabaseStorageClient";

export type DocumentRow = {
  id: string;
  module?: string | null;
  entity_type?: string | null;
  entity_id?: string | null;
  document_type?: string | null;
  document_title?: string | null;
  file_url?: string | null;
  file_name?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
  storage_bucket?: string | null;
  storage_path?: string | null;
  status?: string | null;
  uploaded_by_name?: string | null;
  is_sensitive?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const TABLE = "documents";

function ok<T>(data: T): DataResult<T> {
  return { ok: true, data };
}
function fail<T>(error: string, code?: string): DataResult<T> {
  return { ok: false, error, code };
}

export function mapDocumentFromRow(row: SupabaseRow | null | undefined): DocumentRow | null {
  if (!row) return null;
  return {
    id: String(row.id || ""),
    module: (row.module as string) || null,
    entity_type: (row.entity_type as string) || null,
    entity_id: row.entity_id != null ? String(row.entity_id) : null,
    document_type: (row.document_type as string) || null,
    document_title: (row.document_title as string) || null,
    file_url: (row.file_url as string) || null,
    file_name: (row.file_name as string) || null,
    file_size: row.file_size != null ? Number(row.file_size) : null,
    mime_type: (row.mime_type as string) || null,
    storage_bucket: (row.storage_bucket as string) || null,
    storage_path: (row.storage_path as string) || null,
    status: (row.status as string) || "Pending Review",
    uploaded_by_name: (row.uploaded_by_name as string) || null,
    is_sensitive: !!row.is_sensitive,
    created_at: (row.created_at as string) || null,
    updated_at: (row.updated_at as string) || null,
  };
}

export async function listDocuments(): Promise<DataResult<DocumentRow[]>> {
  const res = await listRows(TABLE, { orderBy: "created_at", ascending: false });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapDocumentFromRow(r)!).filter(Boolean));
}

export async function getDocumentById(id: EntityId): Promise<DataResult<DocumentRow | null>> {
  const res = await getRowById(TABLE, String(id));
  if (!res.ok) return fail(res.error, res.code);
  return ok(mapDocumentFromRow(res.data));
}

export async function createDocumentMetadata(
  payload: Partial<DocumentRow>,
): Promise<DataResult<DocumentRow>> {
  const row: SupabaseRow = {
    id: payload.id && isValidUuid(payload.id) ? payload.id : newClientUuid(),
    module: payload.module || "finance",
    entity_type: payload.entity_type || null,
    entity_id:
      payload.entity_id && isValidUuid(payload.entity_id) ? payload.entity_id : null,
    document_type: payload.document_type || "payment_proof",
    document_title: payload.document_title || payload.file_name || null,
    file_url: payload.file_url || null,
    file_name: payload.file_name || null,
    file_size: payload.file_size ?? null,
    mime_type: payload.mime_type || null,
    storage_bucket: payload.storage_bucket || null,
    storage_path: payload.storage_path || null,
    status: payload.status || "Pending Review",
    uploaded_by_name: payload.uploaded_by_name || null,
    is_sensitive: payload.is_sensitive ?? true,
    metadata: {},
  };
  const res = await createRow(TABLE, row);
  if (!res.ok) return fail(res.error, res.code);
  const mapped = mapDocumentFromRow(res.data);
  if (!mapped) return fail("Invalid document response", "SUPABASE_ERROR");
  return ok(mapped);
}

export async function updateDocumentMetadata(
  id: EntityId,
  payload: Partial<DocumentRow>,
): Promise<DataResult<DocumentRow>> {
  const row: SupabaseRow = { ...payload, id: undefined } as SupabaseRow;
  delete row.id;
  const res = await updateRow(TABLE, String(id), row);
  if (!res.ok) return fail(res.error, res.code);
  const mapped = mapDocumentFromRow(res.data);
  if (!mapped) return fail("Invalid document response", "SUPABASE_ERROR");
  return ok(mapped);
}

export async function deleteDocumentMetadata(id: EntityId): Promise<DataResult<boolean>> {
  const res = await deleteRow(TABLE, String(id));
  if (!res.ok) return fail(res.error, res.code);
  return ok(true);
}

export async function getDocumentsByModule(module: string): Promise<DataResult<DocumentRow[]>> {
  const res = await filterRows(TABLE, { module });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapDocumentFromRow(r)!).filter(Boolean));
}

export async function getDocumentsByEntity(
  entityType: string,
  entityId: EntityId,
): Promise<DataResult<DocumentRow[]>> {
  const res = await filterRows(TABLE, {
    entity_type: entityType,
    entity_id: String(entityId),
  });
  if (!res.ok) return fail(res.error, res.code);
  return ok((res.data || []).map((r) => mapDocumentFromRow(r)!).filter(Boolean));
}

export async function verifyDocument(
  id: EntityId,
  payload: { verified_by_name?: string } = {},
): Promise<DataResult<DocumentRow>> {
  return updateDocumentMetadata(id, {
    status: "Verified",
    verified_by_name: payload.verified_by_name || "Finance Head",
  });
}

export async function rejectDocument(
  id: EntityId,
  payload: { rejected_by_name?: string; rejection_reason?: string },
): Promise<DataResult<DocumentRow>> {
  return updateDocumentMetadata(id, {
    status: "Rejected",
    rejected_by_name: payload.rejected_by_name || "Finance Head",
    rejection_reason: payload.rejection_reason || "",
  } as Partial<DocumentRow>);
}

/**
 * Upload finance proof to private bucket + create documents metadata.
 */
export async function uploadFinanceProof(
  file: File | Blob,
  payload: {
    entity_type?: string;
    entity_id?: string;
    uploaded_by_name?: string;
    file_name?: string;
  } = {},
): Promise<
  DataResult<{
    document_id: string;
    storage_bucket: string;
    storage_path: string;
    file_name: string;
    signedUrl?: string | null;
    mock?: boolean;
  }>
> {
  const fileName =
    payload.file_name ||
    (file instanceof File ? file.name : "proof.bin");
  const safe = sanitizeStorageFileName(fileName);
  const path = `proofs/${Date.now()}-${safe}`;

  if (!isSupabaseStorageEnabled()) {
    // Controlled mock metadata when storage disabled
    const meta = await createDocumentMetadata({
      module: "finance",
      entity_type: payload.entity_type || "public_giving_submission",
      entity_id: payload.entity_id,
      document_type: "payment_proof",
      document_title: safe,
      file_name: safe,
      file_size: file instanceof File ? file.size : null,
      mime_type: file instanceof File ? file.type : null,
      storage_bucket: FINANCE_PROOFS_BUCKET,
      storage_path: `mock://${path}`,
      file_url: `mock://${path}`,
      status: "Pending Review",
      uploaded_by_name: payload.uploaded_by_name || null,
      is_sensitive: true,
    });
    if (!meta.ok) return fail(meta.error, meta.code);
    return ok({
      document_id: meta.data.id,
      storage_bucket: FINANCE_PROOFS_BUCKET,
      storage_path: `mock://${path}`,
      file_name: safe,
      signedUrl: null,
      mock: true,
    });
  }

  const uploaded = await uploadFile(FINANCE_PROOFS_BUCKET, path, file, {
    contentType: file instanceof File ? file.type : undefined,
  });
  if (!uploaded.ok) return fail(uploaded.error, uploaded.code);

  const signed = await createSignedUrl(FINANCE_PROOFS_BUCKET, uploaded.data.path, 3600);
  const meta = await createDocumentMetadata({
    module: "finance",
    entity_type: payload.entity_type || "public_giving_submission",
    entity_id: payload.entity_id,
    document_type: "payment_proof",
    document_title: safe,
    file_name: safe,
    file_size: file instanceof File ? file.size : null,
    mime_type: file instanceof File ? file.type : null,
    storage_bucket: FINANCE_PROOFS_BUCKET,
    storage_path: uploaded.data.path,
    file_url: signed.ok ? signed.data.signedUrl : null,
    status: "Pending Review",
    uploaded_by_name: payload.uploaded_by_name || null,
    is_sensitive: true,
  });
  if (!meta.ok) return fail(meta.error, meta.code);

  return ok({
    document_id: meta.data.id,
    storage_bucket: FINANCE_PROOFS_BUCKET,
    storage_path: uploaded.data.path,
    file_name: safe,
    signedUrl: signed.ok ? signed.data.signedUrl : null,
    mock: false,
  });
}

export { getStorageInfo, isSupabaseStorageEnabled, FINANCE_PROOFS_BUCKET };

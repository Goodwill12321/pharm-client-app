import { API_BASE_URL, apiFetch } from './index';

export type ClaimAttachmentDto = {
  uid: string;
  fileName?: string;
  contentType?: string;
  sizeBytes?: number;
  createTime?: string;
};

export async function fetchClaimAttachments(claimUid: string): Promise<ClaimAttachmentDto[]> {
  const res = await apiFetch(`${API_BASE_URL}/claims/${encodeURIComponent(claimUid)}/attachments`);
  if (!res.ok) throw new Error('Failed to fetch claim attachments');
  return await res.json();
}

export async function uploadClaimAttachment(claimUid: string, file: globalThis.File): Promise<ClaimAttachmentDto> {
  const fd = new FormData();
  fd.append('file', file);

  const res = await apiFetch(`${API_BASE_URL}/claims/${encodeURIComponent(claimUid)}/attachments`, {
    method: 'POST',
    body: fd,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || 'Failed to upload attachment');
  }
  return await res.json();
}

export async function deleteClaimAttachment(claimUid: string, fileUid: string): Promise<void> {
  const res = await apiFetch(
    `${API_BASE_URL}/claims/${encodeURIComponent(claimUid)}/attachments/${encodeURIComponent(fileUid)}`,
    { method: 'DELETE' },
  );
  if (!res.ok) throw new Error('Failed to delete attachment');
}

export async function getClaimAttachmentDownloadUrl(claimUid: string, fileUid: string): Promise<string> {
  const res = await apiFetch(
    `${API_BASE_URL}/claims/${encodeURIComponent(claimUid)}/attachments/${encodeURIComponent(fileUid)}/download-url`,
  );
  if (!res.ok) throw new Error('Failed to get download url');
  const data = (await res.json()) as { url?: string };
  if (!data.url) throw new Error('No url returned');
  return data.url;
}

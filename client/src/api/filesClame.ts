import { API_BASE_URL, apiFetch } from './index';

export type FilesClameDto = {
  id: number;
  uidClame?: string;
  uidFile?: string;
  createTime?: string;
  updateTime?: string;
};

export async function fetchFilesClame(): Promise<FilesClameDto[]> {
  const res = await apiFetch(`${API_BASE_URL}/files-clame`);
  if (!res.ok) throw new Error('Failed to fetch files clame');
  return await res.json();
}

export async function createFilesClame(payload: Partial<FilesClameDto>): Promise<FilesClameDto> {
  const res = await apiFetch(`${API_BASE_URL}/files-clame`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to link file to claim');
  return await res.json();
}

import { API_BASE_URL, apiFetch } from './index';

export type FileDto = {
  uid: string;
  files?: string;
  createTime?: string;
  updateTime?: string;
};

export async function fetchFiles(): Promise<FileDto[]> {
  const res = await apiFetch(`${API_BASE_URL}/files`);
  if (!res.ok) throw new Error('Failed to fetch files');
  return await res.json();
}

export async function createFile(payload: Partial<FileDto>): Promise<FileDto> {
  const res = await apiFetch(`${API_BASE_URL}/files`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create file');
  return await res.json();
}

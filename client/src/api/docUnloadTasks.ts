import { API_BASE_URL, apiFetch } from './index';
import { DocUnloadTask, DocUnloadTaskViewDto, DocUnloadTaskSummary } from '../types/docUnloadTask';

export interface CreateDocUnloadTaskRequest {
  docType?: string;
  docUid: string;
  docNum?: string;
  docDate?: string;
}

export async function createDocUnloadTask(req: CreateDocUnloadTaskRequest): Promise<DocUnloadTask> {
  const res = await apiFetch(`${API_BASE_URL}/doc-unload-tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const msg = res.status === 409 ? 'Pending unload task already exists' : 'Failed to create unload task';
    const err: any = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return await res.json();
}

export interface DocUnloadTaskListFilters {
  contactUid?: string;
  docUid?: string;
  docNum?: string;
  requestFrom?: string;
  requestTo?: string;
}

export async function fetchDocUnloadTasks(filters: DocUnloadTaskListFilters = {}): Promise<DocUnloadTaskViewDto[]> {
  const params = new URLSearchParams();
  if (filters.contactUid) params.append('contactUid', filters.contactUid);
  if (filters.docUid) params.append('docUid', filters.docUid);
  if (filters.docNum) params.append('docNum', filters.docNum);
  if (filters.requestFrom) params.append('requestFrom', filters.requestFrom);
  if (filters.requestTo) params.append('requestTo', filters.requestTo);
  const res = await apiFetch(`${API_BASE_URL}/doc-unload-tasks?${params}`);
  if (!res.ok) throw new Error('Failed to fetch unload tasks');
  return await res.json();
}

export async function fetchDocUnloadTaskSummaryByDocUids(docUids: string[], contactUid?: string): Promise<DocUnloadTaskSummary[]> {
  const params = new URLSearchParams();
  docUids.forEach(uid => params.append('docUids', uid));
  if (contactUid) params.append('contactUid', contactUid);
  const res = await apiFetch(`${API_BASE_URL}/doc-unload-tasks/summary/by-doc-uids?${params}`);
  if (!res.ok) throw new Error('Failed to fetch unload task summary');
  return await res.json();
}

export async function fetchDocUnloadTaskSummaryByContact(): Promise<DocUnloadTaskSummary[]> {
  const res = await apiFetch(`${API_BASE_URL}/doc-unload-tasks/summary/by-contact`);
  if (!res.ok) throw new Error('Failed to fetch unload task summary by contact');
  return await res.json();
}

export async function fetchDocUnloadHistoryByDocUid(docUid: string): Promise<DocUnloadTask[]> {
  const res = await apiFetch(`${API_BASE_URL}/doc-unload-tasks/history/by-doc/${encodeURIComponent(docUid)}`);
  if (!res.ok) throw new Error('Failed to fetch unload task history');
  return await res.json();
}

export async function markDocUnloadTaskDeleted(uid: string): Promise<DocUnloadTask> {
  const res = await apiFetch(`${API_BASE_URL}/doc-unload-tasks/${encodeURIComponent(uid)}/mark-deleted`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to cancel unload task');
  return await res.json();
}

import { API_BASE_URL, apiFetch } from './index';
import type { ClameH, ClameT, ClameType } from '../types/clame';

export async function fetchClaims(): Promise<ClameH[]> {
  const res = await apiFetch(`${API_BASE_URL}/clameh`);
  if (!res.ok) throw new Error('Failed to fetch claims');
  return await res.json();
}

export async function fetchClaim(uid: string): Promise<ClameH> {
  const res = await apiFetch(`${API_BASE_URL}/clameh/${uid}`);
  if (!res.ok) throw new Error('Failed to fetch claim');
  return await res.json();
}

export async function createClaim(payload: Partial<ClameH>): Promise<ClameH> {
  const res = await apiFetch(`${API_BASE_URL}/clameh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create claim');
  return await res.json();
}

export async function updateClaim(uid: string, patch: Partial<ClameH>): Promise<ClameH> {
  const res = await apiFetch(`${API_BASE_URL}/clameh/${uid}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('Failed to update claim');
  return await res.json();
}

export async function fetchClaimLines(): Promise<ClameT[]> {
  const res = await apiFetch(`${API_BASE_URL}/clamet`);
  if (!res.ok) throw new Error('Failed to fetch claim lines');
  return await res.json();
}

export async function createClaimLine(payload: Partial<ClameT>): Promise<ClameT> {
  const res = await apiFetch(`${API_BASE_URL}/clamet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create claim line');
  return await res.json();
}

export async function updateClaimLine(uidLine: string, patch: Partial<ClameT>): Promise<ClameT> {
  const res = await apiFetch(`${API_BASE_URL}/clamet/${uidLine}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('Failed to update claim line');
  return await res.json();
}

export async function deleteClaimLine(uidLine: string): Promise<void> {
  const res = await apiFetch(`${API_BASE_URL}/clamet/${uidLine}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete claim line');
}

export async function fetchClaimTypes(): Promise<ClameType[]> {
  const res = await apiFetch(`${API_BASE_URL}/clametype`);
  if (!res.ok) throw new Error('Failed to fetch claim types');
  return await res.json();
}

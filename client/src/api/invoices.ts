import { API_BASE_URL, apiFetch } from './index';
import { InvoiceHeader, InvoiceLine } from '../types/invoice';

export async function fetchInvoices(filters: any): Promise<InvoiceHeader[]> {
  const { search, status, dateFrom, dateTo, clientUids } = filters || {};
  const params: any = {};
  if (search) params.search = search;
  if (status) params.status = status;
  if (dateFrom) params.dateFrom = dateFrom;
  if (dateTo) params.dateTo = dateTo;
  if (clientUids) params.clientUids = clientUids;

  const query = new URLSearchParams(params).toString();
  const res = await apiFetch(`${API_BASE_URL}/invoiceh/filtered${query ? `?${query}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch invoices');
  return await res.json();
}

export async function fetchInvoiceLines(uid: string): Promise<InvoiceLine[]> {
  const res = await apiFetch(`${API_BASE_URL}/invoicet/by-uid/${uid}`);
  if (!res.ok) throw new Error('Failed to fetch invoice lines');
  return await res.json();
}

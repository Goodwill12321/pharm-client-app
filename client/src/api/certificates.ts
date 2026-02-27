import { apiFetch } from './index';

export interface CertificateSearchRequest {
  invoiceNumber?: string;
  productName?: string;
  seriesName?: string;
  certificateNumber?: string;
}

export interface CertificateInfoDto {
  uidImage: string;
  sertUid?: string;
  certificateNumber?: string;
  imagePath?: string;
  productName?: string;
  productUid?: string;
  seriesName?: string;
  seriesUid?: string;
  linkType: 'PRODUCT' | 'SERIES' | 'NONE';
  createTime?: string;
}

export interface CertificateAutocompleteDto {
  value: string;
  description?: string;
  type: 'INVOICE' | 'PRODUCT' | 'SERIES' | 'CERTIFICATE';
}

export const searchCertificates = async (searchRequest: CertificateSearchRequest): Promise<CertificateInfoDto[]> => {
  const response = await apiFetch('/api/sert/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchRequest),
  });

  if (!response.ok) {
    throw new Error(`Failed to search certificates: ${response.statusText}`);
  }

  return response.json();
};

export const getAutocompleteSuggestions = async (type: string, query: string): Promise<CertificateAutocompleteDto[]> => {
  console.log(`API: Getting autocomplete suggestions for ${type} with query: ${query}`);
  
  if (!query || query.length < 3) {
    console.log('Query too short, returning empty array');
    return [];
  }

  const url = `/api/sert/autocomplete?type=${encodeURIComponent(type)}&query=${encodeURIComponent(query)}`;
  console.log(`API: Making request to ${url}`);
  
  const response = await apiFetch(url);

  if (!response.ok) {
    console.error(`API: Request failed with status ${response.status}: ${response.statusText}`);
    throw new Error(`Failed to get autocomplete suggestions: ${response.statusText}`);
  }

  const result = await response.json();
  console.log(`API: Got response:`, result);
  return result;
};

export const downloadCertificate = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // Если путь уже содержит полный URL, возвращаем как есть
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Иначе формируем URL для скачивания файла
  return `/api/files/${imagePath}`;
};

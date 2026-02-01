import React, { useState } from 'react';
import { Box, Typography, Container, CircularProgress, Alert } from '@mui/material';
import { CertificateSearchForm } from '../components/CertificateSearchForm';
import { CertificateTable } from '../components/CertificateTable';
import { searchCertificates, CertificateSearchRequest, CertificateInfoDto } from '../api/certificates';

const Certificates: React.FC = () => {
  const [certificates, setCertificates] = useState<CertificateInfoDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (criteria: CertificateSearchRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await searchCertificates(criteria);
      setCertificates(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при поиске сертификатов';
      setError(errorMessage);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box>
        <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', fontWeight: 600, fontSize: '16px' }}>
          Сертификаты
        </Typography>
        
        <CertificateSearchForm onSearch={handleSearch} loading={loading} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#2E7D32' }} />
          </Box>
        )}
        
        {!loading && !error && (
          <CertificateTable certificates={certificates} loading={loading} />
        )}
      </Box>
    </Container>
  );
};

export default Certificates;

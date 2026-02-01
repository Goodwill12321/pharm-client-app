import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Link,
  Alert,
} from '@mui/material';
import { Download as DownloadIcon, Description as FileIcon } from '@mui/icons-material';
import { CertificateInfoDto } from '../api/certificates';

interface CertificateTableProps {
  certificates: CertificateInfoDto[];
  loading?: boolean;
}

export const CertificateTable: React.FC<CertificateTableProps> = ({
  certificates,
  loading = false,
}) => {
  const getDisplayName = (cert: CertificateInfoDto) => {
    if (cert.linkType === 'SERIES' && cert.seriesName) {
      return `${cert.productName || ''} / ${cert.seriesName}`;
    }
    return cert.productName || 'Без названия';
  };

  const getLinkTypeLabel = (linkType: string) => {
    switch (linkType) {
      case 'PRODUCT':
        return 'Товар';
      case 'SERIES':
        return 'Серия';
      default:
        return 'Без привязки';
    }
  };

  const getLinkTypeColor = (linkType: string) => {
    switch (linkType) {
      case 'PRODUCT':
        return '#4CAF50';
      case 'SERIES':
        return '#2196F3';
      default:
        return '#757575';
    }
  };

  const handleDownload = (imagePath: string) => {
    if (!imagePath) return;
    
    // Формируем URL для скачивания
    const downloadUrl = `/api/files/${imagePath}`;
    
    // Создаем временную ссылку для скачивания
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = imagePath.split('/').pop() || 'certificate';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Загрузка...</Typography>
      </Paper>
    );
  }

  if (!certificates || certificates.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Сертификаты не найдены. Попробуйте изменить параметры поиска.
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#2E7D32', fontWeight: 500 }}>
        Найденные сертификаты ({certificates.length})
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f4f6fa' }}>
              <TableCell sx={{ fontWeight: 600, color: '#212121' }}>
                Наименование товара/серии
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#212121' }}>
                Номер сертификата
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#212121' }}>
                Тип привязки
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#212121' }}>
                Файл сертификата
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {certificates.map((cert, index) => (
              <TableRow
                key={`${cert.uid}-${index}`}
                sx={{
                  '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.04)' },
                }}
              >
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {getDisplayName(cert)}
                    </Typography>
                    {cert.productUid && (
                      <Typography variant="caption" sx={{ color: '#757575' }}>
                        UID: {cert.productUid}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {cert.certificateNumber || '—'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getLinkTypeLabel(cert.linkType)}
                    size="small"
                    sx={{
                      bgcolor: getLinkTypeColor(cert.linkType),
                      color: 'white',
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
                <TableCell>
                  {cert.imagePath ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FileIcon sx={{ color: '#2E7D32', fontSize: 20 }} />
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => handleDownload(cert.imagePath!)}
                        sx={{
                          color: '#2E7D32',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                            color: '#1B5E20',
                          },
                        }}
                      >
                        Скачать
                      </Link>
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(cert.imagePath!)}
                        sx={{
                          color: '#2E7D32',
                          '&:hover': {
                            backgroundColor: 'rgba(46, 125, 50, 0.08)',
                          },
                        }}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: '#757575' }}>
                      Нет файла
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

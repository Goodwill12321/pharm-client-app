import React, { useMemo, useState } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Button,
  Snackbar,
} from '@mui/material';
import { Archive as ZipIcon } from '@mui/icons-material';
import { CertificateInfoDto, downloadCertificatesZip, CertificateZipRequest } from '../api/certificates';

// Уменьшенные размеры шрифтов
const FONT_SIZE_BASE = 13; // вместо 16
const FONT_SIZE_SMALL = 11; // вместо 14
const FONT_SIZE_XSMALL = 10; // вместо 12

interface CertificateRow {
  key: string;
  productUid?: string;
  productName: string;
  seriesUid?: string;
  seriesName: string;
  certificateNumber: string;
  linkType: CertificateInfoDto['linkType'];
  imageUids: string[];
  imagesCount: number;
}

interface CertificateTableProps {
  certificates: CertificateInfoDto[];
  loading?: boolean;
}

export const CertificateTable: React.FC<CertificateTableProps> = ({
  certificates,
  loading = false,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const rows: CertificateRow[] = useMemo(() => {
    const map = new Map<string, CertificateRow>();

    certificates.forEach((cert) => {
      const productUid = cert.productUid || '';
      const seriesUid = cert.seriesUid || '';
      const certificateNumber = cert.certificateNumber || '';
      const linkType = cert.linkType;

      const key = `${productUid}::${seriesUid}::${certificateNumber}::${linkType}`;

      const productName = cert.productName || '—';
      const seriesName = cert.seriesName || '—';

      if (!map.has(key)) {
        map.set(key, {
          key,
          productUid: cert.productUid,
          productName,
          seriesUid: cert.seriesUid,
          seriesName,
          certificateNumber: cert.certificateNumber || '—',
          linkType,
          imageUids: [],
          imagesCount: 0,
        });
      }

      const row = map.get(key)!;

      // Считаем количество изображений по uidImage.
      // imagePath может не приходить из search (или быть null), но для ZIP мы отправляем uidImage,
      // а бэкенд сам найдет путь и соберет архив.
      if (cert.uidImage) {
        row.imageUids.push(cert.uidImage);
      }
    });

    // Дедупликация uidImage внутри строки (на случай дублей из join-ов)
    return Array.from(map.values()).map((row) => {
      const unique = Array.from(new Set(row.imageUids));
      return {
        ...row,
        imageUids: unique,
        imagesCount: unique.length,
      };
    });
  }, [certificates]);

  const getLinkTypeLabel = (linkType: CertificateInfoDto['linkType']) => {
    switch (linkType) {
      case 'PRODUCT':
        return 'Товар';
      case 'SERIES':
        return 'Серия';
      default:
        return 'Серт.';
    }
  };

  const getLinkTypeColor = (linkType: CertificateInfoDto['linkType']) => {
    switch (linkType) {
      case 'PRODUCT':
        return '#4CAF50';
      case 'SERIES':
        return '#2196F3';
      default:
        return '#757575';
    }
  };

  const downloadRowZip = async (row: CertificateRow) => {
    if (row.imageUids.length === 0) {
      setNotification({
        open: true,
        message: 'Нет файлов для скачивания',
        severity: 'error'
      });
      return;
    }

    setDownloading(true);
    try {
      const zipRequest: CertificateZipRequest = {
        certificateImageUids: row.imageUids,
      };
      await downloadCertificatesZip(zipRequest);
      setNotification({
        open: true,
        message: 'Архив успешно скачан',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error downloading certificates:', error);
      setNotification({
        open: true,
        message: 'Ошибка при скачивании сертификатов',
        severity: 'error'
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const groupedData = rows;

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
    <Paper sx={{ p: 1.5 }}>
      <Typography variant="h6" sx={{ mb: 1.5, color: '#2E7D32', fontWeight: 500, fontSize: (FONT_SIZE_BASE + 1) + 'px' }}>
        Найденные сертификаты ({certificates.length})
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f4f6fa' }}>
              <TableCell sx={{ fontWeight: 600, color: '#212121', fontSize: FONT_SIZE_SMALL + 'px', py: 1 }}>
                Товар
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#212121', fontSize: FONT_SIZE_SMALL + 'px', py: 1 }}>
                Серия
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#212121', fontSize: FONT_SIZE_SMALL + 'px', py: 1 }}>
                Номер серт.
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#212121', fontSize: FONT_SIZE_SMALL + 'px', py: 1 }}>
                Тип
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#212121', fontSize: FONT_SIZE_SMALL + 'px', py: 1, width: 120 }}>
                Кол-во файлов
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#212121', fontSize: FONT_SIZE_SMALL + 'px', py: 1, width: 160 }}>
                Скачать
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedData.map((row) => (
              <TableRow
                key={row.key}
                sx={{
                  '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.04)' },
                }}
              >
                <TableCell sx={{ fontSize: FONT_SIZE_SMALL + 'px', py: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: FONT_SIZE_SMALL + 'px' }}>
                    {row.productName}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: FONT_SIZE_SMALL + 'px', py: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: FONT_SIZE_SMALL + 'px' }}>
                    {row.seriesName}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: FONT_SIZE_SMALL + 'px', py: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: FONT_SIZE_SMALL + 'px' }}>
                    {row.certificateNumber}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: FONT_SIZE_SMALL + 'px', py: 1 }}>
                  <Chip
                    label={getLinkTypeLabel(row.linkType)}
                    size="small"
                    sx={{
                      bgcolor: getLinkTypeColor(row.linkType),
                      color: 'white',
                      fontWeight: 500,
                      fontSize: FONT_SIZE_XSMALL + 'px',
                      height: 24,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: FONT_SIZE_SMALL + 'px', py: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: FONT_SIZE_SMALL + 'px' }}>
                    {row.imagesCount}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: FONT_SIZE_SMALL + 'px', py: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ZipIcon />}
                    onClick={() => downloadRowZip(row)}
                    disabled={downloading || row.imageUids.length === 0}
                    sx={{
                      borderColor: '#2E7D32',
                      color: '#2E7D32',
                      fontSize: FONT_SIZE_SMALL + 'px',
                      '&:hover': {
                        borderColor: '#1B5E20',
                        backgroundColor: 'rgba(46, 125, 50, 0.04)',
                      },
                    }}
                  >
                    ZIP
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Уведомления */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

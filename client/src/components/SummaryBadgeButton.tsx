import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

interface SummaryBadgeButtonProps {
  label: string;
  sum: number;
  docCount: number;
  color: string;
  loading?: boolean;
  onClick?: () => void;
}

export const SummaryBadgeButton: React.FC<SummaryBadgeButtonProps> = ({ label, sum, docCount, color, loading, onClick }) => (
  <Box
    sx={{
      bgcolor: color,
      color: '#fff',
      borderRadius: 2,
      p: 2,
      mb: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      minWidth: 220,
      boxShadow: 2,
    }}
  >
    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
      {label}
    </Typography>
    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1 }}>
      {loading ? <CircularProgress size={20} color="inherit" /> : sum.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) + ' ₽'}
    </Typography>
    <Typography variant="body2" sx={{ mb: 1 }}>
      Накладных: {docCount}
    </Typography>
    <Button
      size="small"
      variant="contained"
      onClick={onClick}
      disabled={loading}
      sx={{
        alignSelf: 'stretch',
        mt: 0.5,
        fontWeight: 600,
        fontSize: '1rem',
        letterSpacing: 0.5,
        backgroundColor: color,
        color: '#fff',
        '&:hover': {
          backgroundColor: color,
          opacity: 0.9,
        },
      }}
    >
      Подробнее
    </Button>
  </Box>
);

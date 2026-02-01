import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { debtColors } from '../theme/theme';

interface OverdueBadgeButtonProps {
  sum: number;
  docCount: number;
  onClick?: () => void;
  loading?: boolean;
}

export const OverdueBadgeButton: React.FC<OverdueBadgeButtonProps> = ({ sum, docCount, onClick, loading }) => (
  <Box
    sx={{
      bgcolor: debtColors.overdue,
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
      ПДЗ:
    </Typography>
    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1 }}>
      {sum.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽
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
        backgroundColor: debtColors.overdue,
        color: '#fff',
        '&:hover': {
          backgroundColor: debtColors.overdue,
          opacity: 0.9,
        },
      }}
    >
      Подробнее
    </Button>
  </Box>
);

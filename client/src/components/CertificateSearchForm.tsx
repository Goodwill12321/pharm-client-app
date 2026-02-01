import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Collapse,
  IconButton,
  Autocomplete,
} from '@mui/material';
import { Search as SearchIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { CertificateSearchRequest, CertificateAutocompleteDto, getAutocompleteSuggestions } from '../api/certificates';

interface CertificateSearchFormProps {
  onSearch: (criteria: CertificateSearchRequest) => void;
  loading?: boolean;
}

export const CertificateSearchForm: React.FC<CertificateSearchFormProps> = ({
  onSearch,
  loading = false,
}) => {
  const [searchCriteria, setSearchCriteria] = useState<CertificateSearchRequest>({});
  const [expanded, setExpanded] = useState(true);
  const [autocompleteOptions, setAutocompleteOptions] = useState<Record<string, CertificateAutocompleteDto[]>>({});
  const [autocompleteLoading, setAutocompleteLoading] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: keyof CertificateSearchRequest) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchCriteria((prev: CertificateSearchRequest) => ({
      ...prev,
      [field]: event.target.value || undefined,
    }));
  };

  const handleAutocompleteChange = (field: keyof CertificateSearchRequest) => (
    event: React.SyntheticEvent,
    value: string | CertificateAutocompleteDto | null
  ) => {
    const stringValue = typeof value === 'string' ? value : value?.value || null;
    setSearchCriteria((prev: CertificateSearchRequest) => ({
      ...prev,
      [field]: stringValue || undefined,
    }));
  };

  const handleAutocompleteInputChange = (field: keyof CertificateSearchRequest, type: string) => (
    event: React.SyntheticEvent,
    value: string
  ) => {
    setSearchCriteria((prev: CertificateSearchRequest) => ({
      ...prev,
      [field]: value || undefined,
    }));

    // Загружаем автодополнение после 3 символов
    if (value.length >= 3) {
      loadAutocompleteOptions(type, value);
    } else {
      setAutocompleteOptions(prev => ({ ...prev, [type]: [] }));
    }
  };

  const loadAutocompleteOptions = async (type: string, query: string) => {
    console.log(`Loading autocomplete for ${type} with query: ${query}`);
    if (autocompleteLoading[type]) return;

    setAutocompleteLoading(prev => ({ ...prev, [type]: true }));
    
    try {
      const suggestions = await getAutocompleteSuggestions(type, query);
      console.log(`Got ${suggestions.length} suggestions for ${type}:`, suggestions);
      setAutocompleteOptions(prev => ({ ...prev, [type]: suggestions }));
    } catch (error) {
      console.error('Error loading autocomplete options:', error);
      setAutocompleteOptions(prev => ({ ...prev, [type]: [] }));
    } finally {
      setAutocompleteLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleSearch = () => {
    onSearch(searchCriteria);
  };

  const handleClear = () => {
    setSearchCriteria({});
    setAutocompleteOptions({});
    onSearch({});
  };

  const hasAnyFilter = Object.values(searchCriteria).some((value: any) => 
    value !== undefined && value !== null && typeof value === 'string' && value.trim() !== ''
  );

  return (
    <Paper sx={{ p: 2, mb: 2, bgcolor: 'white' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ color: '#2E7D32', fontWeight: 500 }}>
          Поиск сертификатов
        </Typography>
        <IconButton
          onClick={() => setExpanded(!expanded)}
          size="small"
          sx={{ color: '#2E7D32' }}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Grid container spacing={1}>
          {/* 1. Номер накладной (приоритет 1) */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              freeSolo
              options={autocompleteOptions.INVOICE || []}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Номер накладной"
                  placeholder="№ накладной"
                  variant="outlined"
                  size="small"
                  sx={{ '& .MuiInputBase-input': { py: 1 } }}
                />
              )}
              value={searchCriteria.invoiceNumber || null}
              onChange={handleAutocompleteChange('invoiceNumber')}
              onInputChange={handleAutocompleteInputChange('invoiceNumber', 'INVOICE')}
              loading={autocompleteLoading.INVOICE}
            />
          </Grid>
          
          {/* 2. Наименование товара (приоритет 2) */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              freeSolo
              options={autocompleteOptions.PRODUCT || []}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Наименование товара"
                  placeholder="Товар"
                  variant="outlined"
                  size="small"
                  sx={{ '& .MuiInputBase-input': { py: 1 } }}
                />
              )}
              value={searchCriteria.productName || null}
              onChange={handleAutocompleteChange('productName')}
              onInputChange={handleAutocompleteInputChange('productName', 'PRODUCT')}
              loading={autocompleteLoading.PRODUCT}
            />
          </Grid>
          
          {/* 3. Наименование серии (приоритет 3) */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              freeSolo
              options={autocompleteOptions.SERIES || []}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Наименование серии"
                  placeholder="Серия"
                  variant="outlined"
                  size="small"
                  sx={{ '& .MuiInputBase-input': { py: 1 } }}
                />
              )}
              value={searchCriteria.seriesName || null}
              onChange={handleAutocompleteChange('seriesName')}
              onInputChange={handleAutocompleteInputChange('seriesName', 'SERIES')}
              loading={autocompleteLoading.SERIES}
            />
          </Grid>
          
          {/* 4. Номер сертификата (приоритет 4) */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              freeSolo
              options={autocompleteOptions.CERTIFICATE || []}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Номер сертификата"
                  placeholder="Сертификат"
                  variant="outlined"
                  size="small"
                  sx={{ '& .MuiInputBase-input': { py: 1 } }}
                />
              )}
              value={searchCriteria.certificateNumber || null}
              onChange={handleAutocompleteChange('certificateNumber')}
              onInputChange={handleAutocompleteInputChange('certificateNumber', 'CERTIFICATE')}
              loading={autocompleteLoading.CERTIFICATE}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleClear}
                disabled={loading}
                sx={{
                  borderColor: '#2E7D32',
                  color: '#2E7D32',
                  '&:hover': {
                    borderColor: '#1B5E20',
                    backgroundColor: 'rgba(46, 125, 50, 0.04)',
                  },
                }}
              >
                Очистить
              </Button>
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
                startIcon={<SearchIcon />}
                sx={{
                  backgroundColor: '#2E7D32',
                  '&:hover': {
                    backgroundColor: '#1B5E20',
                  },
                }}
              >
                {loading ? 'Поиск...' : 'Найти'}
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        {!hasAnyFilter && (
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f4f6fa', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: '#757575', textAlign: 'center' }}>
              Заполните хотя бы одно поле для поиска или нажмите "Найти" для отображения всех сертификатов.
              Автодополнение доступно после ввода 3+ символов.
            </Typography>
          </Box>
        )}
      </Collapse>
    </Paper>
  );
};

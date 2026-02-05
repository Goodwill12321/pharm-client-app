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
  InputAdornment,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  ExpandMore as ExpandMoreIcon, 
  ExpandLess as ExpandLessIcon,
  Clear as ClearIcon 
} from '@mui/icons-material';
import { CertificateSearchRequest, CertificateAutocompleteDto, getAutocompleteSuggestions } from '../api/certificates';
import { apiFetch } from '../api';

// Уменьшенные размеры шрифтов
const FONT_SIZE_BASE = 13; // вместо 16
const FONT_SIZE_SMALL = 11; // вместо 14

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
    setSearchCriteria((prev: CertificateSearchRequest) => {
      const newCriteria = {
        ...prev,
        [field]: stringValue || undefined,
      };
      
      // Очищаем автодополнение для всех полей при изменении любого поля
      setAutocompleteOptions(prev => ({
        ...prev,
        INVOICE: [],
        PRODUCT: [],
        SERIES: [],
        CERTIFICATE: []
      }));
      
      return newCriteria;
    });
  };

  const handleAutocompleteInputChange = (field: keyof CertificateSearchRequest, type: string) => (
    event: React.SyntheticEvent,
    value: string
  ) => {
    setSearchCriteria((prev: CertificateSearchRequest) => {
      const newCriteria = {
        ...prev,
        [field]: value || undefined,
      };
      
      // Очищаем автодополнение для всех полей при изменении любого поля
      setAutocompleteOptions(prev => ({
        ...prev,
        INVOICE: [],
        PRODUCT: [],
        SERIES: [],
        CERTIFICATE: []
      }));
      
      return newCriteria;
    });

    // Загружаем автодополнение после 3 символов
    if (value.length >= 3) {
      loadAutocompleteOptions(type, value);
    } else {
      setAutocompleteOptions(prev => ({ ...prev, [type]: [] }));
    }
    
    // Сразу вызываем поиск с обновленными критериями
    setTimeout(() => {
      setSearchCriteria(prev => {
        onSearch(prev);
        return prev;
      });
    }, 0);
  };

  const loadAutocompleteOptions = async (type: string, query: string) => {
    console.log(`Loading autocomplete for ${type} with query: ${query}`);
    if (autocompleteLoading[type]) return;

    setAutocompleteLoading(prev => ({ ...prev, [type]: true }));
    
    try {
      // Формируем параметры для иерархического поиска
      const params = new URLSearchParams({
        type: type,
        query: query
      });
      
      // Добавляем текущие фильтры для иерархической фильтрации
      if (searchCriteria.invoiceNumber) {
        params.append('invoiceNumber', searchCriteria.invoiceNumber);
      }
      if (searchCriteria.productName) {
        params.append('productName', searchCriteria.productName);
      }
      if (searchCriteria.seriesName) {
        params.append('seriesName', searchCriteria.seriesName);
      }
      
      const url = `/api/sert/autocomplete?${params.toString()}`;
      console.log(`API: Making request to ${url}`);

      const response = await apiFetch(url);

      if (!response.ok) {
        throw new Error(`Failed to get autocomplete suggestions: ${response.statusText}`);
      }

      const suggestions = await response.json();
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
    onSearch({}); // Сразу вызываем поиск с пустыми критериями
  };

  const hasAnyFilter = Object.values(searchCriteria).some((value: any) => 
    value !== undefined && value !== null && typeof value === 'string' && value.trim() !== ''
  );

  const clearField = (field: keyof CertificateSearchRequest) => {
    setSearchCriteria(prev => {
      const newCriteria = { ...prev };
      delete newCriteria[field];
      
      // Очищаем автодополнение для всех полей при очистке любого поля
      setAutocompleteOptions(prev => ({
        ...prev,
        INVOICE: [],
        PRODUCT: [],
        SERIES: [],
        CERTIFICATE: []
      }));
      
      return newCriteria;
    });
    
    // Сразу вызываем поиск с обновленными критериями ПОСЛЕ обновления состояния
    setTimeout(() => {
      setSearchCriteria(prev => {
        onSearch(prev);
        return prev;
      });
    }, 0);
  };

  return (
    <Paper sx={{ p: 1.5, mb: 2, bgcolor: 'white' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ color: '#2E7D32', fontWeight: 500, fontSize: (FONT_SIZE_BASE + 1) + 'px' }}>
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
              disableClearable
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
                  sx={{ 
                    '& .MuiInputBase-input': { py: 1, fontSize: (FONT_SIZE_SMALL + 1) + 'px' },
                    '& .MuiInputLabel-root': { fontSize: (FONT_SIZE_SMALL + 1) + 'px' },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: searchCriteria.invoiceNumber ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => clearField('invoiceNumber')}
                          sx={{ padding: 0.25, fontSize: '12px' }}
                        >
                          <ClearIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </InputAdornment>
                    ) : params.InputProps?.endAdornment,
                  }}
                />
              )}
              value={searchCriteria.invoiceNumber || undefined}
              inputValue={searchCriteria.invoiceNumber || ''}
              onChange={handleAutocompleteChange('invoiceNumber')}
              onInputChange={handleAutocompleteInputChange('invoiceNumber', 'INVOICE')}
              loading={autocompleteLoading.INVOICE}
              slotProps={{
                paper: {
                  sx: {
                    '& .MuiAutocomplete-option': {
                      fontSize: (FONT_SIZE_SMALL + 1) + 'px'
                    }
                  }
                }
              }}
            />
          </Grid>
          
          {/* 2. Наименование товара (приоритет 2) */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              freeSolo
              disableClearable
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
                  sx={{ 
                    '& .MuiInputBase-input': { py: 1, fontSize: (FONT_SIZE_SMALL + 1) + 'px' },
                    '& .MuiInputLabel-root': { fontSize: (FONT_SIZE_SMALL + 1) + 'px' },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: searchCriteria.productName ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => clearField('productName')}
                          sx={{ padding: 0.25, fontSize: '12px' }}
                        >
                          <ClearIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </InputAdornment>
                    ) : params.InputProps?.endAdornment,
                  }}
                />
              )}
              value={searchCriteria.productName || undefined}
              inputValue={searchCriteria.productName || ''}
              onChange={handleAutocompleteChange('productName')}
              onInputChange={handleAutocompleteInputChange('productName', 'PRODUCT')}
              loading={autocompleteLoading.PRODUCT}
              slotProps={{
                paper: {
                  sx: {
                    '& .MuiAutocomplete-option': {
                      fontSize: (FONT_SIZE_SMALL + 1) + 'px'
                    }
                  }
                }
              }}
            />
          </Grid>
          
          {/* 3. Наименование серии (приоритет 3) */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              freeSolo
              disableClearable
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
                  sx={{ 
                    '& .MuiInputBase-input': { py: 1, fontSize: (FONT_SIZE_SMALL + 1) + 'px' },
                    '& .MuiInputLabel-root': { fontSize: (FONT_SIZE_SMALL + 1) + 'px' },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: searchCriteria.seriesName ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => clearField('seriesName')}
                          sx={{ padding: 0.25, fontSize: '12px' }}
                        >
                          <ClearIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </InputAdornment>
                    ) : params.InputProps?.endAdornment,
                  }}
                />
              )}
              value={searchCriteria.seriesName || undefined}
              inputValue={searchCriteria.seriesName || ''}
              onChange={handleAutocompleteChange('seriesName')}
              onInputChange={handleAutocompleteInputChange('seriesName', 'SERIES')}
              loading={autocompleteLoading.SERIES}
              slotProps={{
                paper: {
                  sx: {
                    '& .MuiAutocomplete-option': {
                      fontSize: (FONT_SIZE_SMALL + 1) + 'px'
                    }
                  }
                }
              }}
            />
          </Grid>
          
          {/* 4. Номер сертификата (приоритет 4) */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              freeSolo
              disableClearable
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
                  sx={{ 
                    '& .MuiInputBase-input': { py: 1, fontSize: (FONT_SIZE_SMALL + 1) + 'px' },
                    '& .MuiInputLabel-root': { fontSize: (FONT_SIZE_SMALL + 1) + 'px' },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: searchCriteria.certificateNumber ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => clearField('certificateNumber')}
                          sx={{ padding: 0.25, fontSize: '12px' }}
                        >
                          <ClearIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </InputAdornment>
                    ) : params.InputProps?.endAdornment,
                  }}
                />
              )}
              value={searchCriteria.certificateNumber || undefined}
              inputValue={searchCriteria.certificateNumber || ''}
              onChange={handleAutocompleteChange('certificateNumber')}
              onInputChange={handleAutocompleteInputChange('certificateNumber', 'CERTIFICATE')}
              loading={autocompleteLoading.CERTIFICATE}
              slotProps={{
                paper: {
                  sx: {
                    '& .MuiAutocomplete-option': {
                      fontSize: (FONT_SIZE_SMALL + 1) + 'px'
                    }
                  }
                }
              }}
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
                  fontSize: FONT_SIZE_SMALL + 'px',
                  py: 0.5,
                  '&:hover': {
                    borderColor: '#1B5E20',
                    backgroundColor: 'rgba(46, 125, 50, 0.04)',
                  },
                }}
              >
                Очистить всё
              </Button>
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
                startIcon={<SearchIcon />}
                sx={{
                  backgroundColor: '#2E7D32',
                  fontSize: FONT_SIZE_SMALL + 'px',
                  py: 0.5,
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
          <Box sx={{ mt: 2, p: 1.5, bgcolor: '#f4f6fa', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: '#757575', textAlign: 'center', fontSize: FONT_SIZE_SMALL + 'px' }}>
              Заполните хотя бы одно поле для поиска или нажмите "Найти" для отображения всех сертификатов.
              Автодополнение доступно после ввода 3+ символов.
            </Typography>
          </Box>
        )}
      </Collapse>
    </Paper>
  );
};

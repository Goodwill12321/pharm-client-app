import { createTheme } from '@mui/material/styles';

// Основные цвета сайта
const primaryGreen = '#2E7D32';  // Тёмно-зелёный (основной)
const secondaryGreen = '#4CAF50'; // Светло-зелёный (вторичный)
const lightGreen = '#81C784';     // Светлый зелёный
const darkGreen = '#1B5E20';      // Очень тёмный зелёный

// Мягкие цвета для бэджей задолженности
export const debtColors = {
  all: '#2196F3',        // Яркий синий Material Design
  overdue: '#E53935',    // Насыщенный красный Material Design
  today: '#FB8C00',     // Яркий оранжевый Material Design
  notDue: '#43A047',     // Насыщенный зелёный Material Design
};

export const appTheme = createTheme({
  palette: {
    primary: {
      main: primaryGreen,
      light: secondaryGreen,
      dark: darkGreen,
      contrastText: '#ffffff',
    },
    secondary: {
      main: secondaryGreen,
      light: lightGreen,
      dark: primaryGreen,
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f6fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    success: {
      main: secondaryGreen,
    },
    info: {
      main: primaryGreen,
    },
  },
  typography: {
    fontFamily: "'Roboto', Arial, sans-serif",
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: primaryGreen,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: primaryGreen,
          '&:hover': {
            backgroundColor: darkGreen,
          },
        },
        outlined: {
          borderColor: primaryGreen,
          color: primaryGreen,
          '&:hover': {
            borderColor: darkGreen,
            backgroundColor: 'rgba(46, 125, 50, 0.04)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(46, 125, 50, 0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '&.MuiChip-colorPrimary': {
            backgroundColor: primaryGreen,
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: secondaryGreen,
          },
        },
      },
    },
  },
});

export default appTheme;

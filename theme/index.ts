import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2a434f',
      light: '#1d2c36',
      dark: '#2b3740',
    },
    secondary: {
      main: '#B94527',
      light: '#d16448',
    },
    info: {
      main: '#246190',
    },
    success: {
      main: '#72be52',
    },
    warning: {
      main: '#deb56f',
      dark: '#b9975d',
      light: '#e2c138',
    },
    error: {
      main: '#c53c3c',
    },
  },
});

export default theme;

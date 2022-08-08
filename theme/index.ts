import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2a434f',
      light: '#2B2E30',
      dark: '#24333d',
    },
    secondary: {
      main: '#B94527',
      light: '#d16448',
    },
    info: {
      main: '#5796c7',
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
      main: '#de6f6f',
    },
  },
});

export default theme;

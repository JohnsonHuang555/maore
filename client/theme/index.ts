import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#1d1d1d',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#57a5c7',
    },
    info: {
      main: '#5796c7',
    },
    success: {
      main: '#72be52',
      dark: '',
    },
    warning: {
      main: '#deb56f',
      dark: '#b9975d',
      light: '#e2c138',
    },
    error: {
      main: '#de6f6f',
    },
    background: {
      default: '#121314',
    },
  },
});

export default theme;

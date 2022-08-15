import { useCallback } from 'react';
import type { AppProps } from 'next/app';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import theme from 'theme';
import rootReducer from 'reducers/rootReducer';
import ServerMiddleware from 'middleware/ServerMiddleware';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { SnackbarKey, SnackbarProvider } from 'notistack';
import SnackbarCloseButton from '@components/SnackbarCloseButton';
import '@styles/globals.scss';

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ServerMiddleware)) // middleware
);

function MyApp({ Component, pageProps }: AppProps) {
  const SnackbarCloseButtonAction = useCallback(
    (key: SnackbarKey) => <SnackbarCloseButton snackbarKey={key} />,
    []
  );

  return (
    <Provider store={store}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          action={(key) => SnackbarCloseButtonAction(key)}
          autoHideDuration={4000}
        >
          <Component {...pageProps} />
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;

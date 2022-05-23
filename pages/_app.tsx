import type { AppProps } from 'next/app';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import theme from 'theme';
import rootReducer from 'reducers/rootReducer';
import ServerMiddleware from 'middleware/ServerMiddleware';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import '@styles/globals.scss';
import { SnackbarProvider } from 'notistack';

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ServerMiddleware)) // middleware
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Component {...pageProps} />
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;

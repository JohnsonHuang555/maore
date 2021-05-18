import type { AppProps } from 'next/app';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { composeWithDevTools } from 'redux-devtools-extension';
import theme from 'theme';
import rootReducer from 'reducers/rootReducer';
import '../styles/globals.scss';

const store = createStore(
  rootReducer,
  composeWithDevTools() // middleware
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;

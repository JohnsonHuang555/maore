import { StoreState } from 'reducers/rootReducer';

export const snackbarSelector = (store: StoreState) => store.app.snackbar;

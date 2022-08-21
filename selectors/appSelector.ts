import { StoreState } from 'reducers/rootReducer';

export const snackbarSelector = (store: StoreState) => store.app.snackbar;
export const userInfoSelector = (store: StoreState) => store.app.userInfo;
export const showLoginModalSelector = (store: StoreState) =>
  store.app.showLoginModal;
export const loadingSelector = (store: StoreState) => store.app.loading;
export const showBaseModalSelector = (store: StoreState) =>
  store.app.showBaseModal;

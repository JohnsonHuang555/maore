import { StoreState } from 'reducers/rootReducer';

export const clientSelector = (store: StoreState) => store.server.client;

import { StoreState } from 'reducers/rootReducer';

export const clientSelector = (store: StoreState) => store.room.client;

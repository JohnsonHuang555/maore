import { StoreState } from 'reducers/rootReducer';

export const roomsSelector = (store: StoreState) => store.room.rooms;
export const createdRoomIdSelector = (store: StoreState) =>
  store.room.createdRoomId;

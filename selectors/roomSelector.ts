import { StoreState } from 'reducers/rootReducer';

export const roomsSelector = (store: StoreState) => store.room.rooms;
export const currentRoomIdSelector = (store: StoreState) =>
  store.room.currentRoom;

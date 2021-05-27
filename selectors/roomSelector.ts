import { StoreState } from 'reducers/rootReducer';

export const roomsSelector = (store: StoreState) => store.room.rooms;
export const createdRoomIdSelector = (store: StoreState) =>
  store.room.createdRoomId;
export const playersSelector = (store: StoreState) => store.room.players;
export const roomInfoSelector = (store: StoreState) => {
  const title = store.room.roomTitle;
  return {
    title,
  };
};

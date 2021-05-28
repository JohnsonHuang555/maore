import { StoreState } from 'reducers/rootReducer';

export const roomsSelector = (store: StoreState) => store.room.rooms;
export const createdRoomIdSelector = (store: StoreState) =>
  store.room.createdRoomId;
export const playersSelector = (store: StoreState) => store.room.players;
export const roomInfoSelector = (store: StoreState) => {
  const { roomTilte, maxPlayers } = store.room.roomInfo;
  return {
    roomTilte,
    maxPlayers,
  };
};

export const playerIdSelector = (store: StoreState) => store.room.yourPlayerId;

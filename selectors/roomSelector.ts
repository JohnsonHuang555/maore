import { StoreState } from 'reducers/rootReducer';

export const roomsSelector = (store: StoreState) => store.room.rooms;
export const createdRoomIdSelector = (store: StoreState) =>
  store.room.createdRoomId;
export const playersSelector = (store: StoreState) => store.room.players;
export const roomInfoSelector = (store: StoreState) => store.room.roomInfo;

export const playerIdSelector = (store: StoreState) => store.room.yourPlayerId;
export const showGameScreenSelector = (store: StoreState) =>
  store.room.showGameScreen;
export const messagesSelector = (store: StoreState) => store.room.messages;
export const isAllPlayersLoadedSelector = (store: StoreState) =>
  store.room.isAllPlayersLoaded;
export const activePlayerSelector = (store: StoreState) =>
  store.room.activePlayer;
export const isYourTurnSelector = (store: StoreState) => {
  const player = store.room.players.find(
    (p) => p.id === store.room.yourPlayerId
  );
  return player?.playerIndex === store.room.activePlayer;
};

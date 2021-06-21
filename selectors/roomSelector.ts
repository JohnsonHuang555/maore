import { GameStatus } from 'models/Room';
import { StoreState } from 'reducers/rootReducer';

export const roomsSelector = (store: StoreState) => store.room.rooms;
export const createdRoomIdSelector = (store: StoreState) =>
  store.room.createdRoomId;
export const playersSelector = (store: StoreState) => store.room.players;
export const roomInfoSelector = (store: StoreState) => store.room.roomInfo;

export const playerIdSelector = (store: StoreState) => store.room.yourPlayerId;
export const showGameScreenSelector = (store: StoreState) => {
  const { gameStatus, showGameScreen } = store.room;
  if (gameStatus === GameStatus.Playing && showGameScreen) {
    return true;
  }
  return false;
};

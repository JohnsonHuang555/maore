import appReducer, { State as AppState } from 'reducers/appReducer';
import roomReducer, { State as RoomState } from 'reducers/roomReducer';
import serverReducer, { State as ServerState } from 'reducers/serverReducer';
import gameStateReducer, {
  State as GameState,
} from 'reducers/gameStateReducer';
import { combineReducers } from 'redux';

export type StoreState = {
  app: AppState;
  room: RoomState;
  server: ServerState;
  gameState: GameState;
};

export default combineReducers({
  app: appReducer,
  room: roomReducer,
  server: serverReducer,
  gameState: gameStateReducer,
});

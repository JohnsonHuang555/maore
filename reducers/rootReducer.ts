import appReducer, { State as AppState } from 'reducers/appReducer';
import roomReducer, { State as RoomState } from 'reducers/roomReducer';
import serverReducer, { State as ServerState } from 'reducers/serverReducer';
import tictactoeReducer, {
  State as TicTacToeState,
} from 'features/tictactoe/redcuers/tictactoeReducer';
import { combineReducers } from 'redux';

export type StoreState = {
  app: AppState;
  room: RoomState;
  server: ServerState;
  tictactoe: TicTacToeState;
};

export default combineReducers({
  app: appReducer,
  room: roomReducer,
  server: serverReducer,
  tictactoe: tictactoeReducer,
});

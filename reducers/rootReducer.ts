import appReducer, { State as AppState } from 'reducers/appReducer';
import roomReducer, { State as RoomState } from 'reducers/roomReducer';
import tictactoeReducer, {
  State as TicTacToeState,
} from 'features/tictactoe/redcuers/tictactoeReducer';
import { combineReducers } from 'redux';

export type StoreState = {
  app: AppState;
  room: RoomState;
  tictactoe: TicTacToeState;
};

export default combineReducers({
  app: appReducer,
  room: roomReducer,
  tictactoe: tictactoeReducer,
});

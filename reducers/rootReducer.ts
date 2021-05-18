import appReducer, { State as AppState } from 'reducers/appReducer';
import roomReducer, { State as RoomState } from 'reducers/roomReducer';
import { combineReducers } from 'redux';

export type StoreState = {
  app: AppState;
  room: RoomState;
};

export default combineReducers({
  app: appReducer,
  room: roomReducer,
});

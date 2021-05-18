import appReducer, { State as AppState } from 'reducers/appReducer';
import { combineReducers } from 'redux';

export type StoreState = {
  app: AppState;
};

export default combineReducers({
  app: appReducer,
});

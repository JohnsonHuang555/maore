import { GameList } from 'models/Game';

export enum ActionType {
  INITIAL_CLIENT = 'INITIAL_CLIENT',
  GET_ROOMS = 'GET_ROOMS',
}

export const initialClient = () => {
  return {
    type: ActionType.INITIAL_CLIENT,
  };
};

export const getRooms = (gamePack: GameList) => {
  return {
    type: ActionType.GET_ROOMS,
    gamePack,
  };
};

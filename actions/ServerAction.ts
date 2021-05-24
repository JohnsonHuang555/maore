import { GameList } from 'models/Game';

export enum ActionType {
  INITIAL_CLIENT = 'INITIAL_CLIENT',
  CREATE_ROOM = 'CREATE_ROOM',
}

export const initialClient = () => {
  return {
    type: ActionType.INITIAL_CLIENT,
  };
};

export type createRoomParams = {
  gamePack: GameList;
  roomTitle: string;
};

export const createRoom = ({ gamePack, roomTitle }: createRoomParams) => {
  return {
    type: ActionType.CREATE_ROOM,
    gamePack,
    roomTitle,
  };
};

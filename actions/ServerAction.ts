import { GameList } from 'models/Game';

export enum ActionType {
  INITIAL_CLIENT = 'INITIAL_CLIENT',
  JOIN_ROOM = 'JOIN_ROOM',
  CREATE_ROOM = 'CREATE_ROOM',
  LEAVE_ROOM = 'LEAVE_ROOM',
}

export const initialClient = (gamePack?: GameList) => {
  return {
    type: ActionType.INITIAL_CLIENT,
    gamePack,
  };
};

export type createRoomParams = {
  gamePack: GameList;
  roomTitle: string;
  playerName: string;
};

export const createRoom = ({
  gamePack,
  roomTitle,
  playerName,
}: createRoomParams) => {
  return {
    type: ActionType.CREATE_ROOM,
    gamePack,
    roomTitle,
    playerName,
  };
};

export const joinRoom = (roomId: string, playerName: string) => {
  return {
    type: ActionType.JOIN_ROOM,
    roomId,
    playerName,
  };
};

export const leaveRoom = () => {
  return {
    type: ActionType.LEAVE_ROOM,
  };
};

import { Client, Room as ClientRoom } from 'colyseus.js';
import { Room } from 'middleware/services/RoomServer';
import { GameList } from 'models/Game';

export enum ActionType {
  INITIAL_CLIENT = 'INITIAL_CLIENT',
  SET_CLIENT = 'SET_CLIENT',
  SET_ROOM = 'SET_ROOM',
  GET_ALL_ROOMS = 'GET_ALL_ROOMS',
  JOIN_ROOM = 'JOIN_ROOM',
  CREATE_ROOM = 'CREATE_ROOM',
  LEAVE_ROOM = 'LEAVE_ROOM',
  READY_GAME = 'READY_GAME',
  START_GAME = 'START_GAME',
}

export const initialClient = () => {
  return {
    type: ActionType.INITIAL_CLIENT,
  };
};

export const setClient = (client: Client) => {
  return {
    type: ActionType.SET_CLIENT,
    client,
  };
};

export const setRoom = (room: ClientRoom<Room>) => {
  return {
    type: ActionType.SET_ROOM,
    room,
  };
};

export const getAllRooms = (gamePack: GameList) => {
  return {
    type: ActionType.GET_ALL_ROOMS,
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

export const readyGame = () => {
  return {
    type: ActionType.READY_GAME,
  };
};

export const startGame = () => {
  return {
    type: ActionType.START_GAME,
  };
};

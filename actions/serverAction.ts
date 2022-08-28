import { Client, Room as ClientRoom } from 'colyseus.js';
import { RoomInfo } from '@domain/models/Room';
import { Room } from 'server/room/state/RoomState';
import { GamePack } from 'server/domain/Game';

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
  SEND_MESSAGE = 'SEND_MESSAGE',
  UPDATE_ROOM_INFO = 'UPDATE_ROOM_INFO',
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

export const getAllRooms = (gamePack: GamePack) => {
  return {
    type: ActionType.GET_ALL_ROOMS,
    gamePack,
  };
};

export type createRoomParams = {
  gamePack: GamePack;
  roomTitle: string;
  playerName: string;
  gameMode?: string;
  photoURL?: string;
};

export const createRoom = ({
  gamePack,
  roomTitle,
  playerName,
  gameMode,
  photoURL,
}: createRoomParams) => {
  return {
    type: ActionType.CREATE_ROOM,
    gamePack,
    roomTitle,
    playerName,
    gameMode,
    photoURL,
  };
};

export const joinRoom = (
  roomId: string,
  playerName: string,
  photoURL?: string
) => {
  return {
    type: ActionType.JOIN_ROOM,
    roomId,
    playerName,
    photoURL,
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

export const sendMessage = (message: string) => {
  return {
    type: ActionType.SEND_MESSAGE,
    message,
  };
};

export const updateRoomInfo = (roomInfo: Partial<RoomInfo>) => {
  return {
    type: ActionType.UPDATE_ROOM_INFO,
    roomInfo,
  };
};

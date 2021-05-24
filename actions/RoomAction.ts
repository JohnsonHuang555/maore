import { RoomAvailable } from 'colyseus.js';
import { Metadata } from 'models/Room';

export enum ActionType {
  LOADED_ROOMS = 'LOADED_ROOMS',
  CREATE_ROOM = 'CREATE_ROOM',
  LOADED_PLAYERS = 'LOADED_PLAYERS',
  SET_PLAYER_INDEX = 'SET_PLAYER_INDEX',
}

export const loadedRoom = (rooms: RoomAvailable<Metadata>[]) => {
  return {
    type: ActionType.LOADED_ROOMS,
    rooms,
  };
};

export const createRoom = (roomId: string) => {
  return {
    type: ActionType.CREATE_ROOM,
    roomId,
  };
};

export const loadRoomPlayers = (roomPlayers: any[]) => {
  return {
    type: ActionType.LOADED_PLAYERS,
    roomPlayers,
  };
};

export const setPlayerIndex = (playerIndex: number) => {
  return {
    type: ActionType.SET_PLAYER_INDEX,
    playerIndex,
  };
};

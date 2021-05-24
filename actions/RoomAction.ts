import { Room as ClientRoom, RoomAvailable } from 'colyseus.js';
import { Metadata, Room } from 'models/Room';

export enum ActionType {
  LOADED_ROOMS = 'LOADED_ROOMS',
  LOADED_CURRENT_ROOM = 'LOADED_CURRENT_ROOM',
  LOADED_PLAYERS = 'LOADED_PLAYERS',
  SET_PLAYER_INDEX = 'SET_PLAYER_INDEX',
}

export const loadedRooms = (rooms: RoomAvailable<Metadata>[]) => {
  return {
    type: ActionType.LOADED_ROOMS,
    rooms,
  };
};

export const loadedCurrentRoom = (room: ClientRoom<Room>) => {
  return {
    type: ActionType.LOADED_CURRENT_ROOM,
    room,
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

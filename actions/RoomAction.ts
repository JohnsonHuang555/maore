import { RoomAvailable } from 'colyseus.js';
import { Player } from 'models/Player';
import { Metadata, RoomInfo } from 'models/Room';

export enum ActionType {
  LOADED_ROOMS = 'LOADED_ROOMS',
  CREATED_ROOM = 'CREATED_ROOM',
  SET_ROOM_INFO = 'SET_ROOM_INFO',
  SET_YOUR_PLAYERID = 'SET_YOUR_PLAYERID',
  ADD_PLAYER = 'ADD_PLAYER',
  REMOVE_PLAYER = 'REMOVE_PLAYER',
  SET_PLAYER_READY = 'SET_PLAYER_READY',
  RESET = 'RESET',
}

export const loadedRooms = (rooms: RoomAvailable<Metadata>[]) => {
  return {
    type: ActionType.LOADED_ROOMS,
    rooms,
  };
};

export const createdRoom = (roomId: string) => {
  return {
    type: ActionType.CREATED_ROOM,
    roomId,
  };
};

export const setRoomInfo = (roomInfo: Partial<RoomInfo>) => {
  return {
    type: ActionType.SET_ROOM_INFO,
    roomInfo,
  };
};

export const addPlayer = (player: Player) => {
  return {
    type: ActionType.ADD_PLAYER,
    player,
  };
};

export const removePlayer = (id: string) => {
  return {
    type: ActionType.REMOVE_PLAYER,
    id,
  };
};

export const setYourPlayerId = (yourPlayerId: string) => {
  return {
    type: ActionType.SET_YOUR_PLAYERID,
    yourPlayerId,
  };
};

export const setPlayerReady = (id: string, isReady: boolean) => {
  return {
    type: ActionType.SET_PLAYER_READY,
    id,
    isReady,
  };
};

export const reset = () => {
  return {
    type: ActionType.RESET,
  };
};

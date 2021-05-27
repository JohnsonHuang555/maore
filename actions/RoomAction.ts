import { RoomAvailable } from 'colyseus.js';
import { Player } from 'models/Player';
import { Metadata } from 'models/Room';

export enum ActionType {
  LOADED_ROOMS = 'LOADED_ROOMS',
  CREATED_ROOM = 'CREATED_ROOM',
  INITIAL_ROOM = 'INITIAL_ROOM',
  UPDATE_PLAYER_INDEX = 'UPDATE_PLAYER_INDEX',
  ADD_PLAYER = 'ADD_PLAYER',
  REMOVE_PLAYER = 'REMOVE_PLAYER',
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

export type initialRoomParams = {
  roomTitle: string;
};

export const initialRoom = ({ roomTitle }: initialRoomParams) => {
  return {
    type: ActionType.INITIAL_ROOM,
    roomTitle,
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

export const updatePlayerIndex = (playerIndex: number) => {
  return {
    type: ActionType.UPDATE_PLAYER_INDEX,
    playerIndex,
  };
};

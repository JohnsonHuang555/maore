import { Room as ClientRoom, RoomAvailable } from 'colyseus.js';
import { Player } from 'models/Player';
import { Metadata, Room } from 'models/Room';

export enum ActionType {
  LOADED_ROOMS = 'LOADED_ROOMS',
  CREATED_ROOM = 'CREATED_ROOM',
  INITIAL_ROOM = 'INITIAL_ROOM',
  UPDATE_PLAYER_INDEX = 'UPDATE_PLAYER_INDEX',
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
  players: Player[];
  roomTitle: string;
};

export const initialRoom = ({ players, roomTitle }: initialRoomParams) => {
  return {
    type: ActionType.INITIAL_ROOM,
    players,
    roomTitle,
  };
};

export const updatePlayerIndex = (playerIndex: number) => {
  return {
    type: ActionType.UPDATE_PLAYER_INDEX,
    playerIndex,
  };
};

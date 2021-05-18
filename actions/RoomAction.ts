import { Room as ClientRoom } from 'colyseus.js';
import { Room } from 'models/Room';

export enum ActionType {
  INITIAL_CLIENT = 'INITIAL_CLIENT',
  LOAD_ROOM = 'LOAD_ROOM',
}

export const initialClient = () => {
  return {
    type: ActionType.INITIAL_CLIENT,
  };
};

export const loadRoom = (room: ClientRoom<Room>) => {
  return {
    type: ActionType.LOAD_ROOM,
    room,
  };
};

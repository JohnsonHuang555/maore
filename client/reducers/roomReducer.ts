import { ActionType } from 'actions/RoomAction';
import { Client, Room as ClientRoom } from 'colyseus.js';
import Room from 'models/Room';
import Phaser from 'phaser';

export type State = {
  client?: Client;
  events?: Phaser.Events.EventEmitter;
  rooms: Room[];
  selectedRoom?: ClientRoom<Room>;
};

const initialState: State = {
  rooms: [],
};

type InitialClientAction = {
  type: ActionType.INITIAL_CLIENT;
};

type LoadedSelectedRoomAction = {
  type: ActionType.LOAD_ROOM;
  room: ClientRoom<Room>;
};

type Action = InitialClientAction | LoadedSelectedRoomAction;

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.INITIAL_CLIENT: {
      const client = new Client('ws://localhost:2567');
      return {
        ...state,
        client,
      };
    }
    case ActionType.LOAD_ROOM: {
      return {
        ...state,
        selectedRoom: action.room,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;

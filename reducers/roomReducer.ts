import { ActionType } from 'actions/RoomAction';
import { Client } from 'colyseus.js';
import { Room } from 'models/Room';
import Phaser from 'phaser';

export type State = {
  client?: Client;
  events?: Phaser.Events.EventEmitter;
  rooms: Room[];
  createdRoomId: string;
};

const initialState: State = {
  rooms: [],
  createdRoomId: '',
};

type InitialClientAction = {
  type: ActionType.INITIAL_CLIENT;
};

type CreatedRoomAction = {
  type: ActionType.CREATE_ROOM;
  roomId: string;
};

type Action = InitialClientAction | CreatedRoomAction;

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.INITIAL_CLIENT: {
      const client = new Client('ws://localhost:3000');
      return {
        ...state,
        client,
      };
    }
    case ActionType.CREATE_ROOM: {
      return {
        ...state,
        createdRoomId: action.roomId,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;

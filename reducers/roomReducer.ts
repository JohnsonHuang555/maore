import { ActionType } from 'actions/RoomAction';
import { Client } from 'colyseus.js';
import Room from 'models/Room';
import Phaser from 'phaser';

export type State = {
  client?: Client;
  events?: Phaser.Events.EventEmitter;
  rooms: Room[];
  selectedRoom?: Room;
};

const initialState: State = {
  rooms: [],
};

type InitialClientAction = {
  type: ActionType.INITIAL_CLIENT;
};

type Action = InitialClientAction;

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.INITIAL_CLIENT: {
      const client = new Client('ws://localhost:2567');
      return {
        ...state,
        client,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;

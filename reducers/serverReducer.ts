import { ActionType } from 'actions/ServerAction';
import { Client, Room as ClientRoom } from 'colyseus.js';
import { Room } from 'middleware/services/RoomServer';

export type State = {
  client?: Client;
  room?: ClientRoom<Room>;
};

const initialState: State = {};

type SetClientAction = {
  type: ActionType.SET_CLIENT;
  client: Client;
};

type SetRoomAction = {
  type: ActionType.SET_ROOM;
  room: ClientRoom<Room>;
};

type Action = SetClientAction | SetRoomAction;

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_CLIENT: {
      return {
        ...state,
        client: action.client,
      };
    }
    case ActionType.SET_ROOM: {
      return {
        ...state,
        room: action.room,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;

import { ActionType } from 'actions/RoomAction';
import { Room as ClientRoom, RoomAvailable } from 'colyseus.js';
import { Metadata, Room } from 'models/Room';

export type State = {
  rooms: RoomAvailable<Metadata>[];
  currentRoom?: ClientRoom<Room>;
  playerIndex: number;
};

const initialState: State = {
  rooms: [],
  playerIndex: -1,
};

type LoadedRoomAction = {
  type: ActionType.LOADED_ROOMS;
  rooms: RoomAvailable<Metadata>[];
};

type CreatedRoomAction = {
  type: ActionType.CREATED_ROOM;
  room: ClientRoom<Room>;
};

type SetPlayerIndex = {
  type: ActionType.SET_PLAYER_INDEX;
  playerIndex: number;
};

type Action = LoadedRoomAction | CreatedRoomAction | SetPlayerIndex;

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.LOADED_ROOMS: {
      return {
        ...state,
        rooms: action.rooms,
      };
    }
    case ActionType.CREATED_ROOM: {
      return {
        ...state,
        currentRoom: action.room,
      };
    }
    case ActionType.SET_PLAYER_INDEX: {
      return {
        ...state,
        playerIndex: action.playerIndex,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;

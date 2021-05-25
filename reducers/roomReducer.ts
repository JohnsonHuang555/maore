import { ActionType } from 'actions/RoomAction';
import { Room as ClientRoom, RoomAvailable } from 'colyseus.js';
import { Player } from 'models/Player';
import { Metadata, Room } from 'models/Room';

export type State = {
  rooms: RoomAvailable<Metadata>[];
  createdRoomId: string;
  players: Player[];
  playerIndex: number;
  roomTitle: string;
};

const initialState: State = {
  rooms: [],
  playerIndex: -1,
  createdRoomId: '',
  players: [],
  roomTitle: '',
};

type LoadedRoomsAction = {
  type: ActionType.LOADED_ROOMS;
  rooms: RoomAvailable<Metadata>[];
};

type CreatedRoomAction = {
  type: ActionType.CREATED_ROOM;
  roomId: string;
};

type InitailRoom = {
  type: ActionType.INITIAL_ROOM;
  players: Player[];
  roomTitle: string;
};

type UpdatePlayerIndex = {
  type: ActionType.UPDATE_PLAYER_INDEX;
  playerIndex: number;
};

type Action =
  | LoadedRoomsAction
  | CreatedRoomAction
  | InitailRoom
  | UpdatePlayerIndex;

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
        createdRoomId: action.roomId,
      };
    }
    case ActionType.INITIAL_ROOM: {
      return {
        ...state,
        players: action.players,
        roomTitle: action.roomTitle,
      };
    }
    case ActionType.UPDATE_PLAYER_INDEX: {
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

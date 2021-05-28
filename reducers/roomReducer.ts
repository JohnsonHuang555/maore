import { ActionType } from 'actions/RoomAction';
import { RoomAvailable } from 'colyseus.js';
import { Player } from 'models/Player';
import { Metadata, RoomInfo } from 'models/Room';

export type State = {
  rooms: RoomAvailable<Metadata>[];
  createdRoomId: string;
  players: Player[];
  roomInfo: RoomInfo;
  yourPlayerId: string;
};

const initialState: State = {
  rooms: [],
  createdRoomId: '',
  players: [],
  yourPlayerId: '',
  roomInfo: {
    roomTilte: '',
    maxPlayers: 0,
  },
};

type LoadedRoomsAction = {
  type: ActionType.LOADED_ROOMS;
  rooms: RoomAvailable<Metadata>[];
};

type CreatedRoomAction = {
  type: ActionType.CREATED_ROOM;
  roomId: string;
};

type SetRoomInfo = {
  type: ActionType.SET_ROOM_INFO;
  roomInfo: Partial<RoomInfo>;
};

type SetYourPlayerIdAction = {
  type: ActionType.SET_YOUR_PLAYERID;
  yourPlayerId: string;
};

type AddPlayerAction = {
  type: ActionType.ADD_PLAYER;
  player: Player;
};

type RemovePlayerAction = {
  type: ActionType.REMOVE_PLAYER;
  id: string;
};

type ResetAction = {
  type: ActionType.RESET;
};

type Action =
  | LoadedRoomsAction
  | CreatedRoomAction
  | SetRoomInfo
  | SetYourPlayerIdAction
  | AddPlayerAction
  | RemovePlayerAction
  | ResetAction;

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
    case ActionType.SET_ROOM_INFO: {
      return {
        ...state,
        roomInfo: {
          ...state.roomInfo,
          ...action.roomInfo,
        },
      };
    }
    case ActionType.SET_YOUR_PLAYERID: {
      return {
        ...state,
        yourPlayerId: action.yourPlayerId,
      };
    }
    case ActionType.ADD_PLAYER: {
      return {
        ...state,
        players: [...state.players, action.player],
      };
    }
    case ActionType.REMOVE_PLAYER: {
      const newPlayers = state.players.filter((p) => p.id !== action.id);
      return {
        ...state,
        players: newPlayers,
      };
    }
    case ActionType.RESET: {
      return {
        ...state,
        createdRoomId: '',
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;

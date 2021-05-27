import { ActionType } from 'actions/RoomAction';
import { RoomAvailable } from 'colyseus.js';
import { Player } from 'models/Player';
import { Metadata } from 'models/Room';

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

type InitailRoomAction = {
  type: ActionType.INITIAL_ROOM;
  roomTitle: string;
};

type UpdatePlayerIndexAction = {
  type: ActionType.UPDATE_PLAYER_INDEX;
  playerIndex: number;
};

type AddPlayerAction = {
  type: ActionType.ADD_PLAYER;
  player: Player;
};

type RemovePlayerAction = {
  type: ActionType.REMOVE_PLAYER;
  id: string;
};

type Action =
  | LoadedRoomsAction
  | CreatedRoomAction
  | InitailRoomAction
  | UpdatePlayerIndexAction
  | AddPlayerAction
  | RemovePlayerAction;

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
        roomTitle: action.roomTitle,
      };
    }
    case ActionType.UPDATE_PLAYER_INDEX: {
      return {
        ...state,
        playerIndex: action.playerIndex,
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
        createdRoomId: '',
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;

import { ActionType } from 'actions/RoomAction';
import { Client, RoomAvailable } from 'colyseus.js';
import { Metadata } from 'models/Room';
import Phaser from 'phaser';

export type State = {
  rooms: RoomAvailable<Metadata>[];
  createdRoomId: string;
  roomPlayers: any[];
  playerIndex: number;
};

const initialState: State = {
  rooms: [],
  createdRoomId: '',
  roomPlayers: [],
  playerIndex: -1,
};

type LoadedRoomAction = {
  type: ActionType.LOADED_ROOMS;
  rooms: RoomAvailable<Metadata>[];
};

type CreatedRoomAction = {
  type: ActionType.CREATE_ROOM;
  roomId: string;
};

type LoadedRoomPlayers = {
  type: ActionType.LOADED_PLAYERS;
  roomPlayers: any[];
};

type SetPlayerIndex = {
  type: ActionType.SET_PLAYER_INDEX;
  playerIndex: number;
};

type Action =
  | LoadedRoomAction
  | CreatedRoomAction
  | LoadedRoomPlayers
  | SetPlayerIndex;

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.LOADED_ROOMS: {
      return {
        ...state,
        rooms: action.rooms,
      };
    }
    case ActionType.CREATE_ROOM: {
      return {
        ...state,
        createdRoomId: action.roomId,
      };
    }
    case ActionType.LOADED_PLAYERS: {
      return {
        ...state,
        roomPlayers: action.roomPlayers,
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

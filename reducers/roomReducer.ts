import { ActionType } from 'actions/RoomAction';
import { Client } from 'colyseus.js';
import { Room } from 'models/Room';
import Phaser from 'phaser';

export type State = {
  client?: Client;
  events?: Phaser.Events.EventEmitter; // FIXME: 要留？
  rooms: Room[];
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

type InitialClientAction = {
  type: ActionType.INITIAL_CLIENT;
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
  | InitialClientAction
  | CreatedRoomAction
  | LoadedRoomPlayers
  | SetPlayerIndex;

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

import { ActionType } from 'actions/RoomAction';
import { RoomAvailable } from 'colyseus.js';
import { Player } from 'models/Player';
import { GameStatus, Metadata, RoomInfo } from 'models/Room';

export type State = {
  isConnected: boolean;
  rooms: RoomAvailable<Metadata>[];
  createdRoomId: string;
  players: Player[];
  roomInfo: RoomInfo;
  yourPlayerId: string;
  gameStatus: GameStatus;
  showGameScreen: boolean;
  winningPlayer: number;
  activePlayer: number;
};

const initialState: State = {
  isConnected: false,
  rooms: [],
  createdRoomId: '',
  players: [],
  yourPlayerId: '',
  roomInfo: {
    roomTilte: '',
    maxPlayers: 0,
    gamePack: '',
  },
  gameStatus: GameStatus.WaitingForPlayers,
  showGameScreen: false,
  winningPlayer: -1,
  activePlayer: -1,
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

type SetPlayerReadyAction = {
  type: ActionType.SET_PLAYER_READY;
  id: string;
  isReady: boolean;
};

type SetPlayerMasterAction = {
  type: ActionType.SET_PLAYER_MASTER;
  id: string;
  isMaster: boolean;
};

type SetPlayerIndexAction = {
  type: ActionType.SET_PLAYER_INDEX;
  id: string;
  playerIndex: number;
};

type UpdateGameStatus = {
  type: ActionType.UPDATE_GAME_STATUS;
  gameStatus: GameStatus;
};

type SetShowGameScreen = {
  type: ActionType.SET_SHOW_GAME_SCREEN;
  show: boolean;
};

type UpdateWinningPlayer = {
  type: ActionType.UPDATE_WINNING_PLAYER;
  playerIndex: number;
};

type UpdateActivePlayer = {
  type: ActionType.UPDATE_ACTIVIE_PLAYER;
  playerIndex: number;
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
  | SetPlayerReadyAction
  | SetPlayerMasterAction
  | SetPlayerIndexAction
  | UpdateGameStatus
  | SetShowGameScreen
  | UpdateWinningPlayer
  | UpdateActivePlayer
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
    case ActionType.SET_PLAYER_READY: {
      const newPlayers = state.players.map((p) => {
        if (p.id === action.id) {
          return {
            ...p,
            isReady: action.isReady,
          };
        }
        return p;
      });
      return {
        ...state,
        players: newPlayers,
      };
    }
    case ActionType.SET_PLAYER_MASTER: {
      const newPlayers = state.players.map((p) => {
        if (p.id === action.id) {
          return {
            ...p,
            isMaster: action.isMaster,
          };
        }
        return p;
      });
      return {
        ...state,
        players: newPlayers,
      };
    }
    case ActionType.SET_PLAYER_INDEX: {
      const newPlayers = state.players.map((p) => {
        if (p.id === action.id) {
          return {
            ...p,
            playerIndex: action.playerIndex,
          };
        }
        return p;
      });
      return {
        ...state,
        players: newPlayers,
      };
    }
    case ActionType.UPDATE_GAME_STATUS: {
      return {
        ...state,
        gameStatus: action.gameStatus,
      };
    }
    case ActionType.SET_SHOW_GAME_SCREEN: {
      return {
        ...state,
        showGameScreen: action.show,
      };
    }
    case ActionType.UPDATE_WINNING_PLAYER: {
      return {
        ...state,
        winningPlayer: action.playerIndex,
      };
    }
    case ActionType.UPDATE_ACTIVIE_PLAYER: {
      return {
        ...state,
        activePlayer: action.playerIndex,
      };
    }
    case ActionType.RESET: {
      return {
        ...state,
        createdRoomId: '',
        roomInfo: {
          roomTilte: '',
          maxPlayers: 0,
          gamePack: '',
        },
        players: [],
        showGameScreen: false,
        gameStatus: GameStatus.WaitingForPlayers,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;

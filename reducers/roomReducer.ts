import { ActionType } from '@actions/RoomAction';
import { RoomAvailable } from 'colyseus.js';
import { Player } from 'domain/models/Player';
import { GameStatus, Metadata, RoomInfo } from 'domain/models/Room';

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
  isAllPlayersLoaded: boolean; // 所有玩家載入狀態,
  messages: string[]; // 聊天訊息
};

const initialState: State = {
  isConnected: false,
  rooms: [],
  createdRoomId: '',
  players: [],
  yourPlayerId: '',
  roomInfo: {
    roomTitle: '',
    maxPlayers: 0,
    gamePack: '',
  },
  gameStatus: GameStatus.WaitingForPlayers,
  showGameScreen: false,
  winningPlayer: -1,
  activePlayer: -1,
  isAllPlayersLoaded: false,
  messages: [],
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
  type: ActionType.SET_YOUR_PLAYER_ID;
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

type UpdatePlayerInfoAction = {
  type: ActionType.UPDATE_PLAYER_INFO;
  id: string;
  playerInfo: Partial<Player>;
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
  type: ActionType.UPDATE_ACTIVE_PLAYER;
  playerIndex: number;
};

type SetMessage = {
  type: ActionType.SET_MESSAGE;
  message: string;
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
  | UpdatePlayerInfoAction
  | UpdateGameStatus
  | SetShowGameScreen
  | UpdateWinningPlayer
  | UpdateActivePlayer
  | SetMessage
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
    case ActionType.SET_YOUR_PLAYER_ID: {
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
    case ActionType.UPDATE_PLAYER_INFO: {
      const newPlayers = state.players.map((p) => {
        if (p.id === action.id) {
          return {
            ...p,
            ...action.playerInfo,
          };
        }
        return p;
      });
      // 有玩家還沒載入完成
      const hasPlayerNotLoaded = newPlayers.find((p) => !p.gameLoaded);
      return {
        ...state,
        players: newPlayers,
        isAllPlayersLoaded: !hasPlayerNotLoaded,
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
    case ActionType.UPDATE_ACTIVE_PLAYER: {
      return {
        ...state,
        activePlayer: action.playerIndex,
      };
    }
    case ActionType.SET_MESSAGE: {
      return {
        ...state,
        messages: [...state.messages, action.message],
      };
    }
    case ActionType.RESET: {
      return {
        ...state,
        createdRoomId: '',
        roomInfo: {
          roomTitle: '',
          maxPlayers: 0,
          gamePack: '',
        },
        players: [],
        showGameScreen: false,
        gameStatus: GameStatus.WaitingForPlayers,
        isAllPlayersLoaded: false,
        messages: [],
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;

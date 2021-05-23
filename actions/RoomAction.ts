export enum ActionType {
  INITIAL_CLIENT = 'INITIAL_CLIENT',
  CREATE_ROOM = 'CREATE_ROOM',
  LOADED_PLAYERS = 'LOADED_PLAYERS',
  SET_PLAYER_INDEX = 'SET_PLAYER_INDEX',
}

export const initialClient = () => {
  return {
    type: ActionType.INITIAL_CLIENT,
  };
};

export const createRoom = (roomId: string) => {
  return {
    type: ActionType.CREATE_ROOM,
    roomId,
  };
};

export const loadRoomPlayers = (roomPlayers: any[]) => {
  return {
    type: ActionType.LOADED_PLAYERS,
    roomPlayers,
  };
};

export const setPlayerIndex = (playerIndex: number) => {
  return {
    type: ActionType.SET_PLAYER_INDEX,
    playerIndex,
  };
};

export enum ActionType {
  INITIAL_CLIENT = 'INITIAL_CLIENT',
  CREATE_ROOM = 'CREATE_ROOM',
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

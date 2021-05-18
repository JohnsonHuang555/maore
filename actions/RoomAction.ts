export enum ActionType {
  INITIAL_CLIENT = 'INITIAL_CLIENT',
}

export const initialClient = () => {
  return {
    type: ActionType.INITIAL_CLIENT,
  };
};

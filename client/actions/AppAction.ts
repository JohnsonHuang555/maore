export enum ActionType {
  SET_SNACKBAR = 'SET_SNACKBAR',
}

type snackbar = {
  show: boolean;
  message: string;
};

export const setSnackbar = ({ show, message }: snackbar) => {
  return {
    type: ActionType.SET_SNACKBAR,
    show,
    message,
  };
};

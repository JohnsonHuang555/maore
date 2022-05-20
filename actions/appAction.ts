import { User } from '@domain/models/User';

export enum ActionType {
  SetSnackbar = 'SetSnackbar',
  ShowLoginModal = 'ShowLoginModal',
  Login = 'Login',
  Logout = 'Logout',
}

type snackbar = {
  show: boolean;
  message: string;
};

export const setSnackbar = ({ show, message }: snackbar) => {
  return {
    type: ActionType.SetSnackbar,
    show,
    message,
  };
};

export const setShowLoginModal = (show: boolean) => {
  return {
    type: ActionType.ShowLoginModal,
    show,
  };
};

export const login = (userInfo: User) => {
  return {
    type: ActionType.Login,
    userInfo,
  }
}

export const logout = () => {
  return {
    type: ActionType.Logout,
  }
}

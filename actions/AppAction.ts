import { User } from '@models/User';

export enum ActionType {
  SET_SNACKBAR = 'SET_SNACKBAR',
  SET_USER_INFO = 'SET_USER_INFO',
  REMOVE_USER_INFO = 'REMOVE_USER_INFO',
  SHOW_LOGIN_MODAL = 'SHOW_LOGIN_MODAL',
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

export const setUserInfo = (userInfo: User) => {
  return {
    type: ActionType.SET_USER_INFO,
    userInfo,
  };
};

export const removeUserInfo = () => {
  return {
    type: ActionType.REMOVE_USER_INFO,
  };
};

export const setShowLoginModal = (show: boolean) => {
  return {
    type: ActionType.SHOW_LOGIN_MODAL,
    show,
  };
};

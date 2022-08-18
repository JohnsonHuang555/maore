import { User } from '@domain/models/User';

export enum ActionType {
  ShowLoginModal = 'showLoginModal',
  Login = 'login',
  Logout = 'logout',
  SetLoading = 'setLoading',
}

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
  };
};

export const logout = () => {
  return {
    type: ActionType.Logout,
  };
};

export const setLoading = (loading: boolean) => {
  return {
    type: ActionType.SetLoading,
    loading,
  };
};

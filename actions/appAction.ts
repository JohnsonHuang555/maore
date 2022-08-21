import { User } from '@domain/models/User';
import { ModalType } from 'reducers/appReducer';

export enum ActionType {
  ShowLoginModal = 'showLoginModal',
  Login = 'login',
  Logout = 'logout',
  SetLoading = 'setLoading',
  ShowBaseModal = 'showBaseModal',
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

type SetShowModalParams = {
  show: boolean;
  modalType?: ModalType;
  message?: string;
};

export const setShowBaseModal = ({
  modalType,
  show,
  message,
}: SetShowModalParams) => {
  return {
    type: ActionType.ShowBaseModal,
    modalType,
    show,
    message,
  };
};

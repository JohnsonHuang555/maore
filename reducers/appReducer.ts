import { ActionType } from '@actions/appAction';
import { User } from '@domain/models/User';

export enum ModalType {
  Info = 'info',
  Error = 'error',
}

export type State = {
  snackbar: {
    show: boolean;
    message: string;
  };
  userInfo?: User;
  showLoginModal: boolean;
  showBaseModal: {
    modalType: ModalType | '';
    show: boolean;
    message: string;
  };
  loading: boolean;
};

const initialState: State = {
  snackbar: {
    show: false,
    message: '',
  },
  showLoginModal: false,
  loading: false,
  showBaseModal: {
    modalType: '',
    show: false,
    message: '',
  },
};

type LoginAction = {
  type: ActionType.Login;
  userInfo: User;
};

type LogoutAction = {
  type: ActionType.Logout;
};

type ShowLoginModalAction = {
  type: ActionType.ShowLoginModal;
  show: boolean;
};

type SetLoadingAction = {
  type: ActionType.SetLoading;
  loading: boolean;
};

type SetShowModalAction = {
  type: ActionType.ShowBaseModal;
  message: string;
  modalType: ModalType;
  show: boolean;
};

type Action =
  | LoginAction
  | LogoutAction
  | ShowLoginModalAction
  | SetLoadingAction
  | SetShowModalAction;

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.Login: {
      return {
        ...state,
        userInfo: action.userInfo,
      };
    }
    case ActionType.Logout: {
      return {
        ...state,
        userInfo: undefined,
      };
    }
    case ActionType.ShowLoginModal: {
      return {
        ...state,
        showLoginModal: action.show,
      };
    }
    case ActionType.SetLoading: {
      return {
        ...state,
        loading: action.loading,
      };
    }
    case ActionType.ShowBaseModal: {
      return {
        ...state,
        showBaseModal: {
          show: action.show,
          message: action.message,
          modalType: action.modalType,
        },
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;

import { ActionType } from '@actions/AppAction';
import { User } from '@models/User';

export type State = {
  snackbar: {
    show: boolean;
    message: string;
  };
  userInfo?: User;
  showLoginModal: boolean;
  isLogin: boolean;
};

const initialState: State = {
  snackbar: {
    show: false,
    message: '',
  },
  showLoginModal: false,
  isLogin: false,
};

type SetSnackbarAction = {
  type: ActionType.SET_SNACKBAR;
  show: boolean;
  message: string;
};

type SetUserInfoAction = {
  type: ActionType.SET_USER_INFO;
  userInfo: User;
};

type RemoveUserInfoAction = {
  type: ActionType.REMOVE_USER_INFO;
};

type ShowLoginModalAction = {
  type: ActionType.SHOW_LOGIN_MODAL;
  show: boolean;
};

type Action =
  | SetSnackbarAction
  | SetUserInfoAction
  | RemoveUserInfoAction
  | ShowLoginModalAction;

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.SET_SNACKBAR: {
      return {
        ...state,
        snackbar: {
          show: action.show,
          message: action.message,
        },
      };
    }
    case ActionType.SET_USER_INFO: {
      return {
        ...state,
        userInfo: action.userInfo,
        isLogin: true,
      };
    }
    case ActionType.REMOVE_USER_INFO: {
      return {
        ...state,
        userInfo: undefined,
        isLogin: false,
      };
    }
    case ActionType.SHOW_LOGIN_MODAL: {
      return {
        ...state,
        showLoginModal: action.show,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;

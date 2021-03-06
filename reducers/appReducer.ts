import { ActionType } from '@actions/appAction';
import { User } from '@domain/models/User';

export type State = {
  snackbar: {
    show: boolean;
    message: string;
  };
  userInfo?: User;
  showLoginModal: boolean;
};

const initialState: State = {
  snackbar: {
    show: false,
    message: '',
  },
  showLoginModal: false,
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

type Action = LoginAction | LogoutAction | ShowLoginModalAction;

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
    default: {
      return state;
    }
  }
};

export default reducer;

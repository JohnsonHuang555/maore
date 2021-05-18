import { ActionType } from 'actions/AppAction';

export type State = {
  snackbar: {
    show: boolean;
    message: string;
  };
};

const initialState: State = {
  snackbar: {
    show: false,
    message: '',
  },
};

type SetSnackbarAction = {
  type: ActionType.SET_SNACKBAR;
  show: boolean;
  message: string;
};

type Action = SetSnackbarAction;

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
    default: {
      return state;
    }
  }
};

export default reducer;

import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { snackbarSelector } from 'selectors/appSelector';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbar } from 'actions/AppAction';
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';

const Toast = () => {
  const dispatch = useDispatch();
  const snackbar = useSelector(snackbarSelector);
  const { show, message } = snackbar;

  const handleClose = (
    _event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(setSnackbar({ show: false, message: '' }));
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={show}
      autoHideDuration={3000}
      onClose={handleClose}
      message={message}
      action={
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <Close fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
      style={{ zIndex: 1500 }}
    />
  );
};

export default Toast;

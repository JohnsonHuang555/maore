import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';

type LoginModalProps = {
  show: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
};

const LoginModal = (props: LoginModalProps) => {
  const { show, onClose, onConfirm } = props;
  const [userName, setUserName] = useState('');
  const router = useRouter();

  const handleOnClose = () => {
    if (router.pathname.substr(1, 5) === 'rooms') {
      return;
    }
    onClose();
  };

  return (
    <Dialog
      open={show}
      onClose={handleOnClose}
      aria-labelledby="login-dialog-title"
      fullWidth
    >
      <DialogTitle id="login-dialog-title">登入</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="user-name"
          label="遊戲暱稱"
          type="text"
          fullWidth
          InputProps={{
            onKeyDown: (e) => {
              if (e.key === 'Enter') {
                onConfirm(userName);
              }
            },
            onChange: (e) => {
              setUserName(e.target.value);
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>
          取消
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onConfirm(userName)}
        >
          確定
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;

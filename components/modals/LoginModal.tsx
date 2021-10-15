import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
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

  return (
    <Dialog
      open={show}
      onClose={onClose}
      aria-labelledby="login-dialog-title"
      // disableBackdropClick={router.pathname.substr(1, 5) === 'rooms'}
      fullWidth
    >
      <DialogTitle id="login-dialog-title">Login</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="user-name"
          label="Your name"
          type="text"
          fullWidth
          onChange={(e) => setUserName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={() => onConfirm(userName)}>確定</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginModal;

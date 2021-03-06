import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material';
import React from 'react';

type ConfirmModalProps = {
  show: boolean;
  text: string;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmModal = (props: ConfirmModalProps) => {
  const { show, text, onClose, onConfirm } = props;

  return (
    <Dialog
      open={show}
      onClose={onClose}
      aria-labelledby="confirm-dialog-slide-title"
      aria-describedby="confirm-dialog-slide-description"
      fullWidth
    >
      <DialogTitle id="confirm-dialog-slide-title">提示</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-slide-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disableElevation onClick={onClose}>
          取消
        </Button>
        <Button disableElevation onClick={onConfirm}>
          確定
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;

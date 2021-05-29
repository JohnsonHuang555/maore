import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@material-ui/core';
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
        <Button onClick={onClose}>取消</Button>
        <Button onClick={onConfirm}>確定</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;

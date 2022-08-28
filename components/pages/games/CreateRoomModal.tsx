import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import { Game } from '@domain/models/Game';
import { useSnackbar } from 'notistack';

type CreateRoomProps = {
  show: boolean;
  selectedGame: Game;
  onCreateRoom: (roomTitle: string) => void;
  onClose: () => void;
};

const CreateRoomModal = (props: CreateRoomProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { show, onCreateRoom, onClose } = props;
  const [roomTitle, setRoomTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const onConfirm = () => {
    if (!roomTitle) {
      enqueueSnackbar('請輸入房間名稱', { variant: 'warning' });
      return;
    }
    setIsCreating(true);
    onCreateRoom(roomTitle);
  };

  return (
    <Dialog
      open={show}
      onClose={onClose}
      aria-labelledby="create-room-dialog-title"
      fullWidth
    >
      <DialogTitle id="create-room-dialog-title">建立房間</DialogTitle>
      <DialogContent style={{ overflow: 'hidden' }}>
        <TextField
          autoFocus
          margin="dense"
          id="room-name"
          label="房間名稱"
          type="text"
          fullWidth
          variant="outlined"
          onChange={(e) => setRoomTitle(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>
          取消
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disabled={isCreating}
          disableElevation
          onClick={onConfirm}
        >
          建立
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRoomModal;

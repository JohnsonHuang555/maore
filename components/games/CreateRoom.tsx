import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
} from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { useDispatch } from 'react-redux';
import { setSnackbar } from 'actions/AppAction';

type CreateRoomProps = {
  show: boolean;
  onCreateRoom: (name: string) => void;
  onClose: () => void;
};

const CreateRoom = (props: CreateRoomProps) => {
  const dispatch = useDispatch();
  const { show, onCreateRoom, onClose } = props;
  const [roomName, setRoomName] = useState('');
  const [selectedMode, setSelectedMode] = useState('');

  const onConfirm = () => {
    if (!roomName) {
      dispatch(
        setSnackbar({
          show: true,
          message: '請輸入房間名稱',
        })
      );
      return;
    }
    onCreateRoom(roomName);
  };

  return (
    <Dialog
      open={show}
      onClose={onClose}
      aria-labelledby="create-room-dialog-title"
      fullWidth
    >
      <DialogTitle id="create-room-dialog-title">Create Room</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="room-name"
          label="Room name"
          type="text"
          fullWidth
          variant="outlined"
          onChange={(e) => setRoomName(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={() => onConfirm()}>建立</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRoom;

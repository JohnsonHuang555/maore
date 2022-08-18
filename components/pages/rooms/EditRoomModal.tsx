import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

type EditRoomModalProps = {
  currentRoomTitle: string;
  show: boolean;
  onClose: () => void;
  onConfirm: (roomTitle: string) => void;
};

const EditRoomModal = (props: EditRoomModalProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { currentRoomTitle, show, onClose, onConfirm } = props;
  const [roomTitle, setRoomTitle] = useState('');

  const handleConfirm = () => {
    if (!roomTitle) {
      enqueueSnackbar('請輸入房間名稱', { variant: 'warning' });
      return;
    }
    onConfirm(roomTitle);
  };

  return (
    <Dialog open={show} onClose={onClose} fullWidth>
      <DialogTitle>編輯房間</DialogTitle>
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
          defaultValue={currentRoomTitle}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={onClose}>
          取消
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disableElevation
          onClick={handleConfirm}
        >
          確定
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditRoomModal;

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { Game } from '@domain/models/Game';
import Grid from '@mui/material/Grid';
import styles from '@styles/components/createRoom.module.scss';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import { useSnackbar } from 'notistack';

type CreateRoomProps = {
  show: boolean;
  selectedGame: Game;
  onCreateRoom: (roomTitle: string, gameMode?: string) => void;
  onClose: () => void;
};

const CreateRoomModal = (props: CreateRoomProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { show, selectedGame, onCreateRoom, onClose } = props;
  const [roomTitle, setRoomTitle] = useState('');
  // 預設選第一個
  const [selectedMode, setSelectedMode] = useState('');
  // lock create button
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (selectedGame.modes) {
      setSelectedMode(selectedGame.modes[0].value);
    }
  }, []);

  const onConfirm = () => {
    if (!roomTitle) {
      enqueueSnackbar('請輸入房間名稱', { variant: 'warning' });
      return;
    }
    setIsCreating(true);
    onCreateRoom(roomTitle, selectedMode);
  };

  return (
    <Dialog
      open={show}
      onClose={onClose}
      aria-labelledby="create-room-dialog-title"
      fullWidth
      maxWidth="md"
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
        {selectedGame.modes && (
          <>
            <div className={styles.gameModeText}>遊戲模式</div>
            <Grid
              container
              spacing={3}
              sx={{ overflowY: 'auto', maxHeight: '380px' }}
            >
              {selectedGame.modes.map((mode) => (
                <Grid
                  key={mode.value}
                  item
                  xs={4}
                  onClick={() => setSelectedMode(mode.value)}
                >
                  <div className={styles.content}>
                    <img src={mode.imageUrl} className={styles.image} />
                    <div
                      className={`${styles.background} ${
                        selectedMode === mode.value ? styles.selectedMode : ''
                      }`}
                    ></div>
                    <div className={styles.modeName}>{mode.label}</div>
                    {mode.value === selectedMode && (
                      <div className={styles.checkIcon}>
                        <CheckCircleOutline
                          style={{ fontSize: '44px' }}
                          htmlColor="#72be52"
                        />
                      </div>
                    )}
                  </div>
                </Grid>
              ))}
            </Grid>
          </>
        )}
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

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { setSnackbar } from 'actions/AppAction';
import { Game } from 'models/Game';
import Grid from '@material-ui/core/Grid';
import styles from 'styles/components/createRoom.module.scss';
import { CheckCircleOutline } from '@material-ui/icons';

type CreateRoomProps = {
  show: boolean;
  selectedGame: Game;
  onCreateRoom: (roomTitle: string, gameMode?: string) => void;
  onClose: () => void;
};

const CreateRoom = (props: CreateRoomProps) => {
  const dispatch = useDispatch();
  const { show, selectedGame, onCreateRoom, onClose } = props;
  const [roomTitle, setRoomTitle] = useState('');
  // 預設選第一個
  const [selectedMode, setSelectedMode] = useState('');

  useEffect(() => {
    if (selectedGame.modes) {
      setSelectedMode(selectedGame.modes[0].value);
    }
  }, []);

  const onConfirm = () => {
    if (!roomTitle) {
      dispatch(
        setSnackbar({
          show: true,
          message: '請輸入房間名稱',
        })
      );
      return;
    }
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
          <Grid container spacing={3}>
            {selectedGame.modes.map((mode) => (
              <Grid
                key={mode.value}
                item
                xs={4}
                onClick={() => setSelectedMode(mode.value)}
              >
                <div className={styles.content}>
                  <img src={mode.image} className={styles.image} />
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={() => onConfirm()}>建立</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRoom;

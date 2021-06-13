import React, { useState } from 'react';
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
import Card from '@material-ui/core/Card';
import { CardActionArea, CardMedia } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Game } from 'models/Game';
import Grid from '@material-ui/core/Grid';

type CreateRoomProps = {
  show: boolean;
  selectedGame: Game;
  onCreateRoom: (roomTitle: string) => void;
  onClose: () => void;
};

const useStyles = makeStyles({
  root: {
    // maxWidth: 345,
  },
  media: {
    height: 200,
  },
});

const CreateRoom = (props: CreateRoomProps) => {
  const dispatch = useDispatch();
  const { show, selectedGame, onCreateRoom, onClose } = props;
  const [roomTitle, setRoomTitle] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const classes = useStyles();

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
    onCreateRoom(roomTitle);
  };

  return (
    <Dialog
      open={show}
      onClose={onClose}
      aria-labelledby="create-room-dialog-title"
      fullWidth
    >
      <DialogTitle id="create-room-dialog-title">Create Room</DialogTitle>
      <DialogContent style={{ overflow: 'hidden' }}>
        <TextField
          autoFocus
          margin="dense"
          id="room-name"
          label="Room name"
          type="text"
          fullWidth
          variant="outlined"
          onChange={(e) => setRoomTitle(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <Grid container spacing={3}>
          {selectedGame.modes.map((mode) => (
            <Grid key={selectedGame.id} item xs={6} onClick={() => {}}>
              <Card className={classes.root}>
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={selectedGame.homeImg}
                    title={selectedGame.name}
                  />
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={() => onConfirm()}>建立</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRoom;

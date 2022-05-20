import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

type GameOverModalProps = {
  show: boolean;
  isWinner: boolean;
  onConfirm: () => void;
};

const GameOverModal = (props: GameOverModalProps) => {
  const { show, isWinner, onConfirm } = props;

  const handleClose = (_e: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick') {
      return;
    }
    onConfirm();
  };

  return (
    <Dialog open={show} fullWidth maxWidth="xs" onClose={handleClose}>
      <DialogTitle>提示</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isWinner ? '你獲勝了！！' : '你輸了'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={onConfirm}>
          結束遊戲
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GameOverModal;

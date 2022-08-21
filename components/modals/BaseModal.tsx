import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material';
import { ModalType } from 'reducers/appReducer';

type BaseModalProps = {
  show: boolean;
  modalType: ModalType | '';
  text: string;
  onClose: () => void;
};

const BaseModal = (props: BaseModalProps) => {
  const { show, modalType, text, onClose } = props;

  const handleClose = () => {
    if (modalType === ModalType.Error) {
      location.href = '/';
      return;
    }
    onClose();
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="base-dialog-slide-title"
      aria-describedby="base-dialog-slide-description"
      fullWidth
    >
      <DialogTitle
        sx={{
          backgroundColor: modalType === ModalType.Error ? 'error.main' : '',
          marginBottom: '20px',
        }}
        id="base-dialog-slide-title"
      >
        {modalType === ModalType.Error ? '錯誤' : '訊息'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="base-dialog-slide-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          disableElevation
          onClick={handleClose}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BaseModal;

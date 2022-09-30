import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

type RuleModalProps = {
  show: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

const RuleModal = (props: RuleModalProps) => {
  const { show, children, onClose } = props;

  return (
    <Dialog
      open={show}
      onClose={onClose}
      aria-labelledby="rule-dialog-slide-title"
      aria-describedby="rule-dialog-slide-description"
      fullWidth
    >
      <DialogTitle id="rule-dialog-slide-title">規則說明</DialogTitle>
      <DialogContent>
        <DialogContentText component="div" id="rule-dialog-slide-description">
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          disableElevation
          onClick={onClose}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RuleModal;

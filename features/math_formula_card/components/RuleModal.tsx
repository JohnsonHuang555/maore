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
  onClose: () => void;
};

const RuleModal = (props: RuleModalProps) => {
  const { show, onClose } = props;

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
          <p>1. 每人起手 8 張隨機數字牌</p>
          <p>2. 將手牌或符號牌拖曳到格子內組合出合法的算式</p>
          <p>3. 每個格子都必須填入，任何一格都不可為空</p>
          <p>4. 依照使用的數字或符號會得到相對應的分數</p>
          <p>5. 當玩家完成算式後，按下送出按鈕即可</p>
          <p>6. 當玩家解題成功後，會隨機產生新的題目</p>
          <p>7. 優先達成勝利條件的玩家獲勝</p>
          <p>8. 數字牌可以組合使用</p>
          <p>ex. 10-2=8</p>
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

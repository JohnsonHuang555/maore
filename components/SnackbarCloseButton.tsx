import { IconButton } from '@mui/material';
import { SnackbarKey, useSnackbar } from 'notistack';
import IconClose from '@mui/icons-material/Close';

type Props = {
  snackbarKey: SnackbarKey;
};

export default function SnackbarCloseButton({ snackbarKey }: Props) {
  const { closeSnackbar } = useSnackbar();
  return (
    <IconButton size="small" onClick={() => closeSnackbar(snackbarKey)}>
      <IconClose />
    </IconButton>
  );
}

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { firebaseApp } from 'firebase/clientApp';
import { setShowLoginModal } from '@actions/appAction';
import { useDispatch } from 'react-redux';

type LoginModalProps = {
  show: boolean;
  onClose: () => void;
  onGuestLogin: (name: string) => void;
};

const LoginModal = (props: LoginModalProps) => {
  const { show, onClose, onGuestLogin } = props;
  const [userName, setUserName] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const auth = getAuth(firebaseApp);

  const handleClose = () => {
    if (router.pathname.split('/').includes('rooms')) {
      return;
    }
    onClose();
  };

  const handleLogin = () => {
    if (!userName) {
      return;
    }
    onGuestLogin(userName);
  };

  // configuration firebase ui
  const config: firebaseui.auth.Config = {
    signInFlow: 'popup',
    signInOptions: [GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => {
        dispatch(setShowLoginModal(false));
        return false;
      },
    },
  };

  return (
    <Dialog maxWidth="md" open={show} onClose={handleClose} fullWidth>
      <DialogTitle>Log in</DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          overflow: 'hidden',
          minHeight: '300px',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ marginBottom: '20px' }}>訪客</Box>
          <TextField
            autoFocus
            label="遊戲暱稱"
            fullWidth
            InputProps={{
              onKeyDown: (e) => {
                if (e.key === 'Enter') {
                  onGuestLogin(userName);
                }
              },
              onChange: (e) => {
                setUserName(e.target.value);
              },
            }}
            sx={{ marginBottom: '20px', flex: 1 }}
          />
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            disableElevation
            onClick={handleLogin}
          >
            開始
          </Button>
        </Box>
        <Box
          sx={{
            flexBasis: '30px',
            display: 'flex',
            flexDirection: 'column',
            margin: '0 20px',
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: '1px', height: '100%', bgcolor: '#fff' }}></Box>
          <Box>or</Box>
          <Box sx={{ width: '1px', height: '100%', bgcolor: '#fff' }}></Box>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ marginBottom: '20px' }}>其他方式登入</Box>
          <StyledFirebaseAuth uiConfig={config} firebaseAuth={auth} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Toast from '@components/Toast';
import {
  showLoginModalSelector,
  userInfoSelector,
} from '@selectors/appSelector';
import { User } from '@domain/models/User';
import {
  removeUserInfo,
  setShowLoginModal,
  setSnackbar,
  setUserInfo,
} from '@actions/appAction';
import LoginModal from '@components/modals/LoginModal';
import { alpha, Badge, IconButton, styled } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userInfo = useSelector(userInfoSelector);
  const showLoginModal = useSelector(showLoginModalSelector);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const obj: User = JSON.parse(userInfo);
      dispatch(setUserInfo(obj));
    }
  }, [dispatch]);

  const onConfirm = (name: string) => {
    const userInfo: User = {
      name,
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    dispatch(setUserInfo(userInfo));
    dispatch(setShowLoginModal(false));
    dispatch(
      setSnackbar({
        show: true,
        message: '登入成功',
      })
    );
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    dispatch(removeUserInfo());
    dispatch(
      setSnackbar({
        show: true,
        message: '登出成功',
      })
    );
  };

  return (
    <>
      <LoginModal
        show={showLoginModal}
        onClose={() => dispatch(setShowLoginModal(false))}
        onConfirm={onConfirm}
      />
      <Toast />
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: '#121314' }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block', cursor: 'pointer' } }}
            onClick={() => router.push('/')}
          >
            Cookuya
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {/* <AppBar position="static">
        <Toolbar sx={{ backgroundColor: '#121314' }}>
          <Typography variant="h6" sx={{ flexGrow: 0.1 }}>
            <Box
              onClick={() => router.push('/')}
              sx={{
                cursor: 'pointer',
                color: 'secondary.main',
                fontSize: '24px',
              }}
            >
              Cookuya
            </Box>
          </Typography>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Box
              onClick={() => router.push('/gameboy')}
              sx={{
                cursor: 'pointer',
                fontSize: '24px',
              }}
            >
              Gameboy
            </Box>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {userInfo ? (
              <>
                <Typography variant="h6" sx={{ mr: '15px' }}>
                  歡迎！{userInfo.name}
                </Typography>
                {router.pathname.substr(1, 5) !== 'rooms' && (
                  <Button
                    variant="contained"
                    size="large"
                    color="secondary"
                    onClick={() => logout()}
                  >
                    登出
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="contained"
                size="large"
                color="secondary"
                onClick={() => dispatch(setShowLoginModal(true))}
              >
                登入
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar> */}
    </>
  );
};

export default Header;

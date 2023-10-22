import React, { MouseEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  showLoginModalSelector,
  showBaseModalSelector,
  userInfoSelector,
} from '@selectors/appSelector';
import { User } from '@domain/models/User';
import {
  login,
  logout,
  setShowBaseModal,
  setShowLoginModal,
} from '@actions/appAction';
import LoginModal from '@components/modals/LoginModal';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { firebaseApp } from 'utils/firebase/clientApp';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { getAuth, signOut } from 'firebase/auth';
import { useSnackbar } from 'notistack';
import Logo from 'components/icons/logo';
import BaseModal from './modals/BaseModal';
import { FormControl, InputLabel, Select } from '@mui/material';

const Header = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const userInfo = useSelector(userInfoSelector);
  const showLoginModal = useSelector(showLoginModalSelector);
  const showBaseModal = useSelector(showBaseModalSelector);

  const auth = getAuth(firebaseApp);
  const [user, loading, _error] = useAuthState(auth);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!loading && user) {
      // 已登入
      const { displayName, photoURL } = user;
      const userInfo: User = {
        name: displayName || '',
        photoURL: photoURL || '',
      };
      dispatch(login(userInfo));
    }
  }, [loading, user]);

  const onGuestLogin = (name: string) => {
    const userInfo: User = {
      name,
    };
    dispatch(login(userInfo));
    dispatch(setShowLoginModal(false));
    enqueueSnackbar('登入成功', { variant: 'success' });
  };

  const onLogout = () => {
    setAnchorElUser(null);
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(logout());
        enqueueSnackbar('登出成功', { variant: 'success' });
      })
      .catch(() => {
        enqueueSnackbar('登出失敗', { variant: 'error' });
      });
  };

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <BaseModal
        modalType={showBaseModal.modalType}
        show={showBaseModal.show}
        text={showBaseModal.message}
        onClose={() => dispatch(setShowBaseModal({ show: false }))}
      />
      <LoginModal
        show={showLoginModal}
        onClose={() => dispatch(setShowLoginModal(false))}
        onGuestLogin={onGuestLogin}
      />
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: '#2a434f' }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              display: {
                cursor: 'pointer',
              },
              color: 'secondary.main',
              mr: 1,
            }}
            onClick={() => (location.href = '/')}
          >
            <Logo />
          </Typography>
          <Box sx={{ flexGrow: 1 }}></Box>
          {/* TODO: 手機板 */}
          {/* <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <Logo />
          </Box> */}
          {/* TODO: 關於我們 */}
          {/* <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box> */}
          {!loading && userInfo && (
            <Box sx={{ flexGrow: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={handleOpenUserMenu}
              >
                <IconButton sx={{ p: 0, mr: 2 }}>
                  <Avatar alt={userInfo.name} src={userInfo.photoURL}></Avatar>
                </IconButton>
                <Box
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                    fontSize: '22px',
                  }}
                >
                  {userInfo.name}
                </Box>
              </Box>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={onLogout}>
                  <Typography textAlign="center">{t('logout')}</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
          {!loading && !user && !userInfo && (
            <Button
              sx={{ minWidth: '100px' }}
              variant="contained"
              color="secondary"
              disableElevation
              onClick={() => dispatch(setShowLoginModal(true))}
            >
              {t('login')}
            </Button>
          )}
          <FormControl sx={{ ml: '20px', minWidth: '120px' }}>
            <InputLabel id="language-second-label">Language</InputLabel>
            <Select
              labelId="language-second-label"
              label="Language"
              value={i18n.language}
              onChange={(e) => router.push('/', '/', { locale: e.target.value })}
            >
              <MenuItem value="zh-TW">繁體中文</MenuItem>
              <MenuItem value="en-US">英文</MenuItem>
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;

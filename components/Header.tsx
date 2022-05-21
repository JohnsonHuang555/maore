import React, { MouseEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Toast from '@components/Toast';
import {
  showLoginModalSelector,
  userInfoSelector,
} from '@selectors/appSelector';
import { User } from '@domain/models/User';
import {
  login,
  logout,
  setShowLoginModal,
  setSnackbar,
} from '@actions/appAction';
import LoginModal from '@components/modals/LoginModal';
import { useAuthState } from 'react-firebase-hooks/auth';
import { createFirebaseApp } from 'firebase/clientApp';
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

// TODO: search
// const Search = styled('div')(({ theme }) => ({
//   position: 'relative',
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: alpha(theme.palette.common.white, 0.15),
//   '&:hover': {
//     backgroundColor: alpha(theme.palette.common.white, 0.25),
//   },
//   marginRight: theme.spacing(2),
//   marginLeft: 0,
//   width: '100%',
//   [theme.breakpoints.up('sm')]: {
//     marginLeft: theme.spacing(3),
//     width: 'auto',
//   },
// }));

// const SearchIconWrapper = styled('div')(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: '100%',
//   position: 'absolute',
//   pointerEvents: 'none',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: 'inherit',
//   '& .MuiInputBase-input': {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//     transition: theme.transitions.create('width'),
//     width: '100%',
//     [theme.breakpoints.up('md')]: {
//       width: '20ch',
//     },
//   },
// }));

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userInfo = useSelector(userInfoSelector);
  const showLoginModal = useSelector(showLoginModalSelector);

  const app = createFirebaseApp();
  const auth = getAuth(app);
  const [user, loading, _error] = useAuthState(auth);

  useEffect(() => {
    if (!loading && user) {
      // 已登入
      const { uid, displayName, photoURL } = user;
      const userInfo: User = {
        id: uid,
        name: displayName || '',
        photo: photoURL || '',
      };
      dispatch(login(userInfo));
    }
  }, [loading, user]);

  const onConfirm = (name: string) => {
    // const userInfo: User = {
    //   id: '123',
    //   name,
    //   photo: '',
    // };
    // dispatch(login(userInfo));
    // dispatch(setShowLoginModal(false));
    // dispatch(
    //   setSnackbar({
    //     show: true,
    //     message: '登入成功',
    //   })
    // );
  };

  const onLogout = () => {
    setAnchorElUser(null);
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch(logout());
        dispatch(
          setSnackbar({
            show: true,
            message: '登出成功',
          })
        );
      })
      .catch((error) => {
        dispatch(
          setSnackbar({
            show: true,
            message: error.message,
          })
        );
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
      <LoginModal
        show={showLoginModal}
        onClose={() => dispatch(setShowLoginModal(false))}
        onConfirm={onConfirm}
      />
      <Toast />
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: '#1d1d1d' }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              display: {
                xs: 'none',
                md: 'block',
                cursor: 'pointer',
              },
              color: 'secondary.main',
              mr: 1,
            }}
            onClick={() => router.push('/')}
          >
            Cookuya
          </Typography>
          <Box sx={{ flexGrow: 1 }}></Box>
          {/* TODO: 手機板 */}
          {/* <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
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
              {/* <Tooltip title="開啟設定"> */}
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={userInfo.name} src={userInfo.photo}></Avatar>
              </IconButton>
              {/* </Tooltip> */}
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
                  <Typography textAlign="center">登出</Typography>
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
              登入
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;

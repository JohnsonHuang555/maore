import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import Toast from 'components/Toast';

const Header = () => {
  const router = useRouter();

  return (
    <>
      <Toast />
      <AppBar position="static">
        <Toolbar>
          {/* TODO: LOGO */}
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            <span
              onClick={() => router.push('/')}
              style={{ cursor: 'pointer' }}
            >
              nekobit
            </span>
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;

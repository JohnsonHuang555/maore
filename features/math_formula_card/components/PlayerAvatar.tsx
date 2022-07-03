import { Avatar, Box } from '@mui/material';
import { userInfoSelector } from '@selectors/appSelector';
import { useSelector } from 'react-redux';

const PlayerAvatar = () => {
  const userInfo = useSelector(userInfoSelector);
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Avatar sx={{ width: 70, height: 70 }} src={userInfo?.photoURL} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          margin: '0 30px',
        }}
      >
        <Box sx={{ fontSize: '26px', marginBottom: '5px' }}>
          {userInfo?.name}
        </Box>
        <Box sx={{ fontSize: '24px' }}>123 分</Box>
      </Box>
    </Box>
  );
};

export default PlayerAvatar;

import { Avatar, Box } from '@mui/material';
import { userInfoSelector } from '@selectors/appSelector';
import { useSelector } from 'react-redux';
import 'animate.css';
import { useEffect, useState } from 'react';
import MaoreFlex from '@components/maore/MaoreFlex';

type PlayerAvatarProp = {
  point: number;
};

const PlayerAvatar = (props: PlayerAvatarProp) => {
  const { point } = props;
  const userInfo = useSelector(userInfoSelector);

  const [showPointAnimate, setShowPointAnimate] = useState(false);

  useEffect(() => {
    if (point !== 0) {
      setShowPointAnimate(true);
      setTimeout(() => {
        setShowPointAnimate(false);
      }, 1000);
    }
  }, [point]);

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
        <Box sx={{ fontSize: '26px', marginBottom: '5px' }}>你</Box>
        <MaoreFlex verticalHorizonCenter>
          <Box
            sx={{ fontSize: '24px', marginRight: '10px' }}
            className={
              showPointAnimate ? 'animate__animated animate__heartBeat' : ''
            }
          >
            {point}
          </Box>
          分
        </MaoreFlex>
      </Box>
    </Box>
  );
};

export default PlayerAvatar;

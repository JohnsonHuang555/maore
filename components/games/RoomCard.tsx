import Button from '@mui/material/Button';
import Icon from 'components/Icon';
import Grid from '@mui/material/Grid';
import People from '@mui/icons-material/People';
import styles from 'styles/components/roomCard.module.scss';

type RoomCardProps = {
  title: string;
  maxPlayers: number;
  nowPlayers: number;
  joinRoom: () => void;
};

const RoomCard = (props: RoomCardProps) => {
  const { title, maxPlayers, nowPlayers, joinRoom } = props;
  return (
    <Grid item lg={6} xs={12}>
      <div className={styles.room}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
        </div>
        <div className={styles.info}>
          <span className={styles.nowPlayers}>
            <Icon title={`${nowPlayers} / ${maxPlayers}`} fontSize="16px">
              <People htmlColor="#fff" />
            </Icon>
          </span>
          <span className={styles.mode}>一般模式</span>
          <Button
            variant="outlined"
            size="large"
            className={styles.joinRoom}
            onClick={() => joinRoom()}
          >
            加入
          </Button>
        </div>
      </div>
    </Grid>
  );
};

export default RoomCard;

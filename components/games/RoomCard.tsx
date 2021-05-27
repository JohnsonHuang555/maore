import { Button } from '@material-ui/core';
import Icon from 'components/Icon';
import Grid from '@material-ui/core/Grid';
import { People } from '@material-ui/icons';
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
    <Grid item lg={4} xs={6}>
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

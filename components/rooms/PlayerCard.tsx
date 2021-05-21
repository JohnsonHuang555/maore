import { Stars, AccountCircle } from '@material-ui/icons';
import Icon from 'components/Icon';
import styles from 'styles/components/playerList.module.scss';

type PlayerListProps = {
  // roomInfo: Room;
  isNowPlayer: (playerId: string) => boolean;
};

const PlayerList = (props: PlayerListProps) => {
  const { isNowPlayer } = props;

  return (
    <>
      {[
        { id: 1, name: 'test', isMaster: true, isReady: true },
        { id: 2, name: 'test1', isMaster: false, isReady: true },
        { id: 3, name: 'test1', isMaster: false, isReady: false },
        { id: 4, name: 'test1', isMaster: false, isReady: false },
        { id: 5, name: 'test1', isMaster: false, isReady: false },
        { id: 6, name: 'test1', isMaster: false, isReady: false },
      ].map((player: any) => (
        <div
          key={player.id}
          className={`${styles.player} ${
            isNowPlayer(player.id) ? styles.nowPlayer : ''
          }`}
        >
          <Icon customStyles={{ width: '50px', height: '50px' }}>
            <AccountCircle
              htmlColor="#cccccc"
              style={{ width: '100%', height: '100%' }}
            />
          </Icon>
          <div className={styles.info}>
            <div
              className={`${styles.playerName} ${
                isNowPlayer(player.id) ? styles.nowPlayerName : ''
              }`}
            >
              {player.name}
            </div>
            {!player.isMaster ? (
              <div
                className={`${player.isReady ? styles.ready : styles.notReady}`}
              >
                Ready
              </div>
            ) : (
              <div className={styles.master}>
                <Icon title="房主" customStyles={{ fontSize: '28px' }}>
                  <Stars htmlColor="#e2c138" />
                </Icon>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default PlayerList;

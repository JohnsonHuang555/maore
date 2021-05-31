import { Stars, AccountCircle } from '@material-ui/icons';
import Icon from 'components/Icon';
import { Player } from 'models/Player';
import styles from 'styles/components/playerList.module.scss';

type PlayerListProps = {
  yourPlayerId: string;
  players: Player[];
};

const PlayerList = (props: PlayerListProps) => {
  const { yourPlayerId, players } = props;

  const isNowPlayer = (id: string) => {
    if (id === yourPlayerId) {
      return true;
    }
    return false;
  };

  return (
    <>
      {players.map((player: Player) => (
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
                <Icon title="房主" fontSize="26px">
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

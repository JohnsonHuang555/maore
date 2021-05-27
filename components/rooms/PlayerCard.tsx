import { Stars, AccountCircle } from '@material-ui/icons';
import Icon from 'components/Icon';
import { Player } from 'models/Player';
import { useSelector } from 'react-redux';
import { playerIndexSelector } from 'selectors/roomSelector';
import styles from 'styles/components/playerList.module.scss';

type PlayerListProps = {
  players: Player[];
};

const PlayerList = (props: PlayerListProps) => {
  const { players } = props;
  const playerIndex = useSelector(playerIndexSelector);

  const isNowPlayer = (idx: number) => {
    if (idx === playerIndex) {
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
            isNowPlayer(player.playerIndex) ? styles.nowPlayer : ''
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
                isNowPlayer(player.playerIndex) ? styles.nowPlayerName : ''
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

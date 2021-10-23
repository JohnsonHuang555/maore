import { Stars, AccountCircle } from '@mui/icons-material';
import Icon from 'components/IconLabel';
import { Player } from 'models/Player';
import styles from 'styles/components/playerList.module.scss';

type PlayerListProps = {
  yourPlayerId: string;
  players: Player[];
};

const PlayerList = (props: PlayerListProps) => {
  const { yourPlayerId, players } = props;

  return <></>;
};

export default PlayerList;

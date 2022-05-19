import { Box } from '@mui/system';
import MathFormulaCard from 'features/math_formula_card/MathFormulaCard';
import { GameList } from 'server/domain/Game';

type WithoutFrameworkProps = {
  gamePack: GameList;
  isMaster: boolean;
};

const WithoutFramework = (props: WithoutFrameworkProps) => {
  const { gamePack, isMaster } = props;

  const renderGame = () => {
    switch (gamePack) {
      case GameList.MathFormulaCard: {
        return <MathFormulaCard isMaster={isMaster} />;
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: '0',
        background: '#1d1d1d',
        zIndex: '999',
      }}
    >
      {renderGame()}
    </Box>
  );
};

export default WithoutFramework;

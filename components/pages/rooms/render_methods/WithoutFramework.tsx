import { Box } from '@mui/system';
import MathFormulaCard from 'features/math_formula_card/MathFormulaCard';
import { GamePack } from 'server/domain/Game';

type WithoutFrameworkProps = {
  gamePack: GamePack;
};

const WithoutFramework = (props: WithoutFrameworkProps) => {
  const { gamePack } = props;

  const renderGame = () => {
    switch (gamePack) {
      case GamePack.MathFormulaCard: {
        return <MathFormulaCard key={gamePack} />;
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
        background: '#2a434f',
        zIndex: '999',
      }}
    >
      {renderGame()}
    </Box>
  );
};

export default WithoutFramework;

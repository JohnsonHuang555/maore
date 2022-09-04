import { Box } from '@mui/system';
import { GamePack } from 'server/domain/Game';
import MathFormulaCard from 'features/math_formula_card/MathFormulaCard';
import ChineseChessHidden from '@features/chinese_chess_hidden/ChineseChessHidden';

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
      case GamePack.ChineseChessHidden: {
        return <ChineseChessHidden key={gamePack} />;
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

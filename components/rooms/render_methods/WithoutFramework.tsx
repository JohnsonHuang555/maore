import { GameList } from "@domain/models/Game";
import { Box } from "@mui/system";
import MathFormulaCard from "features/math_formula_card/MathFormulaCard";

type WithoutFrameworkProps = {
  gamePack: GameList;
}

const WithoutFramework = (props: WithoutFrameworkProps) => {
  const { gamePack } = props;

  const renderGame = () => {
    switch (gamePack) {
      case GameList.MathFormulaCard: {
        return <MathFormulaCard />
      }
    }
  }

  return (
    <Box sx={{
      position: 'fixed',
      width: '100%',
      height: '100%',
      top: '0',
      background: '#1d1d1d',
      zIndex: '999',
    }}>
      {renderGame()}
    </Box>
  )
}

export default WithoutFramework;

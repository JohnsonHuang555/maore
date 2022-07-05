import { Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import MaoreFlex from '@components/Shared/MaoreFlex';
import {
  EasyPart,
  MediumPart,
  HardPart,
} from 'features/math_formula_card/models/Part';
import NumberDropZone from '../NumberDropZone';
import SymbolDropZone from '../SymbolDropZone';
import { MathSymbol } from 'server/games/math_formula_card/state/SelectedElementsState';

type PartAreaProps = {
  easy: EasyPart;
  medium: MediumPart;
  hard: HardPart;
};

const PartArea = (props: PartAreaProps) => {
  const { easy, medium, hard } = props;
  return (
    <>
      <MaoreFlex
        justifyContent="center"
        sx={{
          marginBottom: '20px',
          width: '100%',
        }}
      >
        <MaoreFlex
          justifyContent="flex-end"
          sx={{
            flex: '0.5',
            marginRight: '30px',
          }}
        >
          <Box sx={{ marginRight: '20px' }}>
            <NumberDropZone />
          </Box>
          <Box sx={{ marginRight: '20px' }}>
            <SymbolDropZone availableSymbols={hard.symbolAvailable1} />
          </Box>
          <Box sx={{ marginRight: '20px' }}>
            <NumberDropZone />
          </Box>
          <Box sx={{ marginRight: '20px' }}>
            <SymbolDropZone availableSymbols={hard.symbolAvailable2} />
          </Box>
          <Box sx={{ marginRight: '20px' }}>
            <NumberDropZone />
          </Box>
          <Box sx={{ marginRight: '20px' }}>
            <SymbolDropZone availableSymbols={hard.symbolAvailable3} />
          </Box>
          <Box>
            <NumberDropZone />
          </Box>
        </MaoreFlex>
        <MaoreFlex sx={{ fontSize: '80px', flex: '0.3' }}>
          <Box>={hard.answer}</Box>
          <MaoreFlex
            verticalHorizonCenter
            sx={{
              marginLeft: '40px',
            }}
          >
            <StarIcon htmlColor="#E9C46A" />
            <StarIcon htmlColor="#E9C46A" />
            <StarIcon htmlColor="#E9C46A" />
          </MaoreFlex>
        </MaoreFlex>
      </MaoreFlex>
      <MaoreFlex
        sx={{
          marginBottom: '20px',
          width: '100%',
        }}
      >
        <MaoreFlex
          justifyContent="flex-end"
          sx={{
            flex: '0.5',
            marginRight: '30px',
          }}
        >
          <Box sx={{ marginRight: '20px' }}>
            <NumberDropZone />
          </Box>
          <Box sx={{ marginRight: '20px' }}>
            <SymbolDropZone availableSymbols={medium.symbolAvailable1} />
          </Box>
          <Box sx={{ marginRight: '20px' }}>
            <NumberDropZone />
          </Box>
          <Box sx={{ marginRight: '20px' }}>
            <SymbolDropZone availableSymbols={medium.symbolAvailable2} />
          </Box>
          <Box>
            <NumberDropZone />
          </Box>
        </MaoreFlex>
        <MaoreFlex sx={{ fontSize: '80px', flex: '0.3' }}>
          <Box>={medium.answer}</Box>
          <MaoreFlex
            verticalHorizonCenter
            sx={{
              marginLeft: '40px',
            }}
          >
            <StarIcon htmlColor="#E9C46A" />
            <StarIcon htmlColor="#E9C46A" />
          </MaoreFlex>
        </MaoreFlex>
      </MaoreFlex>
      <MaoreFlex
        sx={{
          width: '100%',
        }}
      >
        <MaoreFlex
          justifyContent="flex-end"
          sx={{
            flex: '0.5',
            marginRight: '30px',
          }}
        >
          <Box sx={{ marginRight: '20px' }}>
            <NumberDropZone />
          </Box>
          <Box sx={{ marginRight: '20px' }}>
            <SymbolDropZone
              availableSymbols={[
                MathSymbol.Plus,
                MathSymbol.Minus,
                MathSymbol.Times,
                MathSymbol.Divide,
              ]}
            />
          </Box>
          <Box>
            <NumberDropZone />
          </Box>
        </MaoreFlex>
        <MaoreFlex sx={{ fontSize: '80px', flex: '0.3' }}>
          <Box>={easy.answer}</Box>
          <MaoreFlex
            verticalHorizonCenter
            sx={{
              marginLeft: '40px',
            }}
          >
            <StarIcon htmlColor="#E9C46A" />
          </MaoreFlex>
        </MaoreFlex>
      </MaoreFlex>
    </>
  );
};

export default PartArea;

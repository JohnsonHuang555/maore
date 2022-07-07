import React from 'react';
import { Box } from '@mui/material';
import MaoreFlex from '@components/Shared/MaoreFlex';
import {
  Formula,
  FormulaType,
} from 'features/math_formula_card/models/Formula';
import NumberDropZone from '../NumberDropZone';
import SymbolDropZone from '../SymbolDropZone';

type PartAreaProps = {
  answer?: number;
  formula?: Formula[];
  onDragToNumberZone: (id: string) => void;
};

const PartArea = (props: PartAreaProps) => {
  const { answer, formula = [], onDragToNumberZone } = props;

  return (
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
        {formula.map((f) => (
          <React.Fragment key={f.id}>
            {f.formulaType === FormulaType.number && (
              <Box sx={{ marginRight: '20px' }}>
                <NumberDropZone id={f.id} onDrop={onDragToNumberZone} />
              </Box>
            )}
            {f.formulaType === FormulaType.symbol && (
              <Box sx={{ marginRight: '20px' }}>
                <SymbolDropZone />
              </Box>
            )}
          </React.Fragment>
        ))}
      </MaoreFlex>
      <MaoreFlex alignItems="center" sx={{ fontSize: '80px', flex: '0.3' }}>
        <Box>={answer}</Box>
      </MaoreFlex>
    </MaoreFlex>
  );
};

export default PartArea;

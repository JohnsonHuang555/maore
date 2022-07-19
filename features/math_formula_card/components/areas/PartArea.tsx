import React from 'react';
import { Box } from '@mui/material';
import MaoreFlex from '@components/Shared/MaoreFlex';
import CardDropZone from '../CardDropZone';
import { SelectedCard } from 'features/math_formula_card/reducers/playerCardsReducer';

type PartAreaProps = {
  answer?: number;
  selectedCards: SelectedCard[];
};

const PartArea = (props: PartAreaProps) => {
  const { answer, selectedCards } = props;

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
        {selectedCards.map((card) => (
          <Box key={card.id} sx={{ marginRight: '20px' }}>
            <CardDropZone
              id={card.id}
              cardId={card.cardId}
              cardNumber={card.cardNumber}
              mathSymbol={card.mathSymbol}
            />
          </Box>
        ))}
      </MaoreFlex>
      <MaoreFlex alignItems="center" sx={{ fontSize: '80px', flex: '0.3' }}>
        <Box>={answer}</Box>
      </MaoreFlex>
    </MaoreFlex>
  );
};

export default PartArea;

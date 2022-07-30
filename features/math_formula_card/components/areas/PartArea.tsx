import React, { useMemo } from 'react';
import { Box, Button } from '@mui/material';
import MaoreFlex from '@components/Shared/MaoreFlex';
import CardDropZone from '../CardDropZone';
import { SelectedCard } from 'features/math_formula_card/reducers/playerCardsReducer';

type PartAreaProps = {
  answer?: number;
  selectedCards: SelectedCard[];
  isYourTurn: boolean;
  onDropCard: (id: string, targetId: string) => void;
  onCheckAnswer: () => void;
};

const PartArea = (props: PartAreaProps) => {
  const { answer, selectedCards, isYourTurn, onDropCard, onCheckAnswer } =
    props;

  // 可以使用檢查按鈕
  const showCheckAnswerBtn = useMemo(() => {
    const allAnswered = selectedCards.filter(
      (s) =>
        (s.cardNumber !== undefined && s.cardNumber !== -1) ||
        (s.mathSymbol !== undefined && s.mathSymbol !== '')
    );
    if (allAnswered.length === selectedCards.length) {
      return true;
    }
    return false;
  }, [selectedCards]);

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
              onDropCard={onDropCard}
            />
          </Box>
        ))}
      </MaoreFlex>
      <MaoreFlex alignItems="center" sx={{ fontSize: '80px', flex: '0.3' }}>
        <Box>={answer}</Box>
        {isYourTurn && (
          <Button
            sx={{
              maxWidth: '200px',
              marginLeft: '50px',
              backgroundColor: '#E76F51',
              ':hover': {
                backgroundColor: '#c04d30',
              },
            }}
            variant="contained"
            size="small"
            disableElevation
            color="secondary"
            disabled={!showCheckAnswerBtn}
            onClick={onCheckAnswer}
          >
            檢查算式
          </Button>
        )}
      </MaoreFlex>
    </MaoreFlex>
  );
};

export default PartArea;

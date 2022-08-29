import React, { useCallback, useMemo } from 'react';
import { Box, Button } from '@mui/material';
import CardDropZone from '../CardDropZone';
import { SelectedCard } from 'features/math_formula_card/reducers/playerCardsReducer';
import MaoreFlex from '@components/maore/MaoreFlex';
import { MathSymbol } from 'server/games/math_formula_card/state/SelectedElementsState';

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

  // 可以使用送出按鈕
  const showCheckAnswerBtn = useMemo(() => {
    if (selectedCards.length === 0) {
      return undefined;
    }
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

  const getPointHint = useCallback((card: SelectedCard) => {
    if (card.cardNumber !== undefined && card.cardNumber !== -1) {
      return '1 分';
    }

    if (card.mathSymbol !== undefined && card.mathSymbol !== '') {
      switch (card.mathSymbol) {
        case MathSymbol.Plus:
        case MathSymbol.Minus:
          return '1 分';
        case MathSymbol.Times:
          return '2 分';
        case MathSymbol.Divide:
          return '3 分';
      }
    }
  }, []);

  return (
    <>
      <MaoreFlex
        alignItems="center"
        sx={{
          marginBottom: '20px',
          ':hover': {
            overflowX: 'auto',
          },
          width: '100%',
          padding: '20px',
          justifyContent: {
            xs: 'flex-start',
            md: 'center',
          },
        }}
      >
        {selectedCards.map((card) => (
          <Box key={card.id} sx={{ marginRight: '20px' }}>
            <Box
              sx={{
                marginBottom: '10px',
                marginTop: '-20px',
                textAlign: 'center',
                height: '30px',
              }}
            >
              {getPointHint(card)}
            </Box>
            <CardDropZone
              id={card.id}
              cardId={card.cardId}
              cardNumber={card.cardNumber}
              mathSymbol={card.mathSymbol}
              onDropCard={onDropCard}
            />
          </Box>
        ))}
        <Box sx={{ fontSize: '80px' }}>={answer}</Box>
        {isYourTurn && (
          <Button
            sx={{
              maxWidth: '200px',
              marginLeft: '50px',
              backgroundColor: '#E76F51',
              ':hover': {
                backgroundColor: '#c04d30',
              },
              display: {
                xs: 'none',
                sm: 'block',
              },
            }}
            variant="contained"
            size="medium"
            disableElevation
            color="secondary"
            disabled={
              showCheckAnswerBtn === undefined ? true : !showCheckAnswerBtn
            }
            onClick={onCheckAnswer}
          >
            送出
          </Button>
        )}
        {/* </MaoreFlex> */}
      </MaoreFlex>
      {isYourTurn && (
        <MaoreFlex verticalHorizonCenter>
          <Button
            sx={{
              maxWidth: '200px',
              backgroundColor: '#E76F51',
              ':hover': {
                backgroundColor: '#c04d30',
              },
              display: {
                xs: 'block',
                sm: 'none',
              },
            }}
            variant="contained"
            size="medium"
            disableElevation
            color="secondary"
            disabled={
              showCheckAnswerBtn === undefined ? true : !showCheckAnswerBtn
            }
            onClick={onCheckAnswer}
          >
            送出
          </Button>
        </MaoreFlex>
      )}
    </>
  );
};

export default PartArea;

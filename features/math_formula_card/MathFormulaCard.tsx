import { RoomMessage } from '@domain/models/Message';
import {
  Box,
  Button,
  CardActionArea,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Zoom,
  Card as MuiCard,
} from '@mui/material';
import {
  isAllPlayersLoadedSelector,
  playerIdSelector,
  playersSelector,
  isYourTurnSelector,
  winnerIndexSelector,
  isMasterSelector,
} from '@selectors/roomSelector';
import { clientRoomSelector } from '@selectors/serverSelector';
import { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IPlayerCard } from 'server/games/math_formula_card/state/PlayerCardState';
import Card from './components/Card';
import OtherPlayer from './components/OtherPlayer';
import { MathFormulaCardMessage } from './models/MathFormulaCardMessage';
import playerCardsReducer, {
  ActionType,
  initialState,
} from './reducers/playerCardsReducer';
import {
  selectedCardSymbolDict,
  selectedCardLabelDict,
  getSelectedCardLabel,
} from './components/SelectedCardDict';
import GameOverModal from './components/GameOverModal';
import { setShowGameScreen } from '@actions/roomAction';
import { gameSettingsSelector } from '@selectors/game_settings/mathFormulaSelector';
import { useSnackbar } from 'notistack';
import LogoutIcon from '@mui/icons-material/Logout';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { MathSymbol } from 'server/games/math_formula_card/state/SelectedElementsState';

const MathFormulaCard = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const gameSettings = useSelector(gameSettingsSelector);
  const clientRoom = useSelector(clientRoomSelector);
  const yourPlayerId = useSelector(playerIdSelector);
  const players = useSelector(playersSelector);
  const isAllPlayerLoaded = useSelector(isAllPlayersLoadedSelector);
  const isYourTurn = useSelector(isYourTurnSelector);
  const winnerIndex = useSelector(winnerIndexSelector);
  const isMaster = useSelector(isMasterSelector);
  const [state, localDispatch] = useReducer(playerCardsReducer, initialState);
  // ????????????????????????????????????????????????????????????????????? state ??????
  const [noDrawCardDelay, setNoDrawCardDelay] = useState(false);

  if (!clientRoom) {
    throw new Error('client room not found...');
  }

  useEffect(() => {
    // listening message from server
    clientRoom.onMessage(
      MathFormulaCardMessage.UseCardsFailed,
      ({ message }) => {
        enqueueSnackbar(message, { variant: 'warning' });
      }
    );

    clientRoom.onMessage(MathFormulaCardMessage.AnswerCorrectly, () => {
      enqueueSnackbar('????????????', { variant: 'success' });
    });

    clientRoom.onMessage(MathFormulaCardMessage.AnsweredWrong, () => {
      enqueueSnackbar('????????????!!', { variant: 'error' });
    });

    clientRoom.state.mathFormulaCard.listen('answer', (currentValue) => {
      localDispatch({
        type: ActionType.CreateAnswer,
        answer: currentValue as number,
      });
    });

    // ????????????????????????
    clientRoom.state.mathFormulaCard.playerInfos.onAdd = (
      playerInfo,
      playerId
    ) => {
      if (playerId === yourPlayerId) {
        playerInfo.onChange = (changes) => {
          changes.forEach((change) => {
            const { field, value } = change;
            switch (field) {
              case 'point': {
                localDispatch({
                  type: ActionType.UpdateYourPoint,
                  point: value,
                });
                break;
              }
            }
          });
        };
        playerInfo.cards.onAdd = (playerCard) => {
          const { id, cardNumber } = playerCard;
          localDispatch({
            type: ActionType.DrawCard,
            playerCard: { id, cardNumber },
          });
        };

        playerInfo.cards.onRemove = (card) => {
          localDispatch({
            type: ActionType.UseCard,
            cardId: card.id,
          });
        };
      } else {
        const player = players.find((p) => p.id === playerId);
        if (!player) {
          throw new Error('player not found');
        }
        // ?????????????????????
        localDispatch({
          type: ActionType.InitOthersPlayerInfo,
          playerId,
          name: player.name,
        });

        playerInfo.onChange = (changes) => {
          changes.forEach((change) => {
            const { field, value } = change;
            switch (field) {
              case 'point': {
                localDispatch({
                  type: ActionType.UpdateOthersPlayerInfo,
                  playerId,
                  playerInfo: {
                    point: value,
                  },
                });
                break;
              }
            }
          });
        };

        playerInfo.cards.onAdd = () => {
          localDispatch({ type: ActionType.DrawOthersCard, playerId });
        };

        playerInfo.cards.onRemove = () => {
          localDispatch({
            type: ActionType.UseOthersCard,
            playerId,
          });
        };
      }
    };

    clientRoom.state.mathFormulaCard.selectedElements.onAdd = (
      selectedElement
    ) => {
      const { id, cardNumber, mathSymbol } = selectedElement;
      const value = mathSymbol || cardNumber;
      if (value !== undefined) {
        localDispatch({ type: ActionType.SelectCard, id, value });
      }
    };

    clientRoom.state.mathFormulaCard.selectedElements.onRemove = (
      selectedElement
    ) => {
      const { id, cardNumber, mathSymbol } = selectedElement;
      const value = mathSymbol || cardNumber;
      if (value !== undefined) {
        localDispatch({ type: ActionType.SelectCard, id, value });
      }
    };

    clientRoom.send(RoomMessage.LoadedGame);

    return () => {
      clientRoom.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    // ???????????????????????????????????????????????????????????????????????????
    if (isAllPlayerLoaded && isMaster && state.answer === undefined) {
      clientRoom.send(RoomMessage.CreateGame);
      clientRoom.send(RoomMessage.CreatePlayerOrder);
    }
  }, [isAllPlayerLoaded]);

  useEffect(() => {
    if (state.errorMsg) {
      enqueueSnackbar(state.errorMsg, { variant: 'error' });
      localDispatch({ type: ActionType.ClearErrorMsg });
    }
  }, [state.errorMsg]);

  useEffect(() => {
    if (winnerIndex !== -1) {
      localDispatch({ type: ActionType.SetWinnerIndex, winnerIndex });
      // ??? master ????????????
      if (isMaster) {
        clientRoom.send(RoomMessage.FinishGame);
      }
    }
  }, [winnerIndex]);

  const renderOtherPlayer = (other: string) => {
    const { remainCardCount, name, point, isNowTurn } =
      state.otherPlayerDict[other];
    return (
      <Box sx={{ flex: 1 }} key={other}>
        <OtherPlayer
          playerCount={players.length}
          remainCardCount={remainCardCount}
          name={name}
          point={point}
          isNowTurn={isNowTurn}
        />
      </Box>
    );
  };

  const renderYourCard = (card: IPlayerCard, index: number) => {
    const isSelected = state.selectedCards.findIndex((s) => s.id === card.id);
    return (
      <Zoom
        key={card.id}
        in={true}
        style={{
          transitionDelay: noDrawCardDelay ? '0ms' : `${index * 100}ms`,
        }}
      >
        <Box
          sx={{
            '.MuiPaper-elevation': {
              border:
                isSelected !== -1 ? '5px solid #b95e47' : '5px solid #525252',
            },
          }}
        >
          <Card
            key={card.id}
            id={card.id}
            value={card.cardNumber}
            width="6rem"
            height="100%"
            onSelect={handleSelectCard}
          />
        </Box>
      </Zoom>
    );
  };

  // ????????????
  const handleSelectCard = (id: string) => {
    // ???????????????
    if (!isYourTurn) {
      enqueueSnackbar('???????????????', { variant: 'warning' });
      return;
    }
    clientRoom.send(MathFormulaCardMessage.SelectCardNumber, { id });
  };

  // ????????????
  const handleSelectSymbol = (mathSymbol: MathSymbol) => {
    // ???????????????
    if (!isYourTurn) {
      enqueueSnackbar('???????????????', { variant: 'warning' });
      return;
    }
    clientRoom.send(MathFormulaCardMessage.SelectMathSymbol, { mathSymbol });
  };

  const useCards = () => {
    // ?????????????????????????????????????????????
    setNoDrawCardDelay(true);
    if (!state.selectedCards.length) {
      enqueueSnackbar('?????????', { variant: 'warning' });
      return;
    }
    clientRoom.send(MathFormulaCardMessage.UseCards);
  };

  const drawCard = () => {
    // ?????????????????????????????????????????????
    setNoDrawCardDelay(true);
    clientRoom.send(MathFormulaCardMessage.DrawCard);
  };

  const getIsWinner = () => {
    const player = players.find((p) => p.id === yourPlayerId);
    if (player?.playerIndex === state.winnerIndex) {
      return true;
    }
    return false;
  };

  return (
    <>
      <GameOverModal
        show={state.winnerIndex !== -1}
        isWinner={getIsWinner()}
        onConfirm={() => dispatch(setShowGameScreen(false))}
      />
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'absolute', top: '25px', right: '50px' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title="????????????">
              <IconButton size="large" aria-label="leave_room">
                <DescriptionOutlinedIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Tooltip title="????????????">
              <IconButton
                size="large"
                aria-label="leave_room"
                onClick={() => (location.href = '/games/math-formula-card')}
              >
                <LogoutIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
        {/* ?????????????????? */}
        <Box
          sx={{
            flexBasis: '15%',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          {Object.keys(state.otherPlayerDict).map((other) =>
            renderOtherPlayer(other)
          )}
        </Box>
        {/* ???????????? */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {state.selectedCards.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '80px',
                  background: 'rgba(0,0,0,0.2)',
                  padding: '10px 20px',
                  marginTop: '50px',
                  marginRight: '20px',
                  gap: '10px',
                }}
              >
                {state.selectedCards.map((selectedCard, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    {getSelectedCardLabel(selectedCard.value)}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ fontSize: '26px' }}>??????</Box>
              <Box sx={{ fontSize: '120px' }}>={state.answer}</Box>
            </Box>
            <Box sx={{ marginTop: '150px', marginRight: '50px' }}>
              <Box
                sx={{
                  textAlign: 'center',
                  marginBottom: '10px',
                  fontSize: '26px',
                }}
              >
                ????????????
              </Box>
              <Grid container spacing={1} sx={{ width: '176px' }}>
                {Object.keys(selectedCardSymbolDict).map((symbol) => (
                  <Grid key={symbol} item xs={6}>
                    <Zoom
                      in={true}
                      style={{
                        transitionDelay: '500ms',
                      }}
                    >
                      <Tooltip title={selectedCardLabelDict[symbol]} arrow>
                        <MuiCard
                          sx={{
                            height: '80px',
                            border: '5px solid #525252',
                            backgroundColor: '#1d1d1d',
                          }}
                          onClick={() =>
                            handleSelectSymbol(symbol as MathSymbol)
                          }
                        >
                          <CardActionArea
                            sx={{
                              height: '100%',
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              fontSize: '36px',
                            }}
                          >
                            {selectedCardSymbolDict[symbol]}
                          </CardActionArea>
                        </MuiCard>
                      </Tooltip>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{ textAlign: 'center', marginBottom: '20px', fontSize: '30px' }}
        >
          {isYourTurn ? '????????????' : '??????????????????'}
        </Box>
        {/* ???????????? */}
        <Box
          sx={{
            flexBasis: '14%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '15px',
              height: '100%',
              flexWrap: 'wrap',
              width: '90vw',
            }}
          >
            {state.yourCards.map((card, index) => renderYourCard(card, index))}
          </Box>
        </Box>
        {/* ?????? */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '20px',
            gap: '15px',
          }}
        >
          <Box sx={{ marginRight: '20px', fontSize: '26px' }}>
            ????????????: {gameSettings?.winnerPoint} ???
          </Box>
          <Box sx={{ marginRight: '20px', fontSize: '26px' }}>
            ??????:{' '}
            <Box component="span" sx={{ color: 'secondary.light' }}>
              {state.yourPoint}
            </Box>{' '}
            ???
          </Box>
          <Button
            sx={{
              minWidth: '100px',
              backgroundColor: '#555454',
              ':hover': { backgroundColor: '#454444' },
            }}
            variant="contained"
            size="large"
            disableElevation
            disabled={state.winnerIndex !== -1}
            onClick={() => localDispatch({ type: ActionType.SortCard })}
          >
            ??????
          </Button>
          <Button
            sx={{
              minWidth: '100px',
              backgroundColor: '#555454',
              ':hover': { backgroundColor: '#454444' },
            }}
            variant="contained"
            size="large"
            disableElevation
            disabled={!isYourTurn || state.winnerIndex !== -1}
            onClick={() => {
              if (state.selectedCards.length !== 0) {
                clientRoom.send(MathFormulaCardMessage.ClearSelectedCards);
              }
            }}
          >
            ??????
          </Button>
          <Button
            sx={{
              minWidth: '150px',
              backgroundColor: '#095858',
              ':hover': {
                backgroundColor: '#044040',
              },
            }}
            variant="contained"
            size="large"
            disableElevation
            color="secondary"
            disabled={!isYourTurn || state.winnerIndex !== -1}
            onClick={() => drawCard()}
          >
            ?????????????????????
          </Button>
          <Button
            sx={{ minWidth: '150px' }}
            variant="contained"
            size="large"
            disableElevation
            color="secondary"
            disabled={!isYourTurn || state.winnerIndex !== -1}
            onClick={() => useCards()}
          >
            ??????
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default MathFormulaCard;

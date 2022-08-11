import { RoomMessage } from '@domain/models/Message';
import { Backdrop, Box, Button, Zoom } from '@mui/material';
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
import { MathFormulaCardMessage } from './models/MathFormulaCardMessage';
import playerCardsReducer, {
  ActionType,
  initialState,
} from './reducers/playerCardsReducer';
import GameOverModal from './components/GameOverModal';
import { setShowGameScreen } from '@actions/roomAction';
import { gameSettingsSelector } from '@selectors/game_settings/mathFormulaSelector';
import { useSnackbar } from 'notistack';
import { MathSymbol } from 'server/games/math_formula_card/state/SelectedElementsState';
import PlayerAvatar from './components/PlayerAvatar';
import ControlArea from './components/areas/ControllArea';
import OtherPlayerArea from './components/areas/OtherPlayerArea';
import PartArea from './components/areas/PartArea';
import MaoreFlex from '@components/maore/MaoreFlex';
import HandCard from './components/HandCard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { selectedCardSymbolDict } from './components/SelectedCardDict';
import MathSymbolCard from './components/MathSymbolCard';
import { DEFAULT_CARD_COUNT } from 'server/games/math_formula_card/commands/CreateGameCommand';

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
  // 為了做抽牌的動畫，只有第一載入完成時要延遲，用 state 控制
  const [noDrawCardDelay, setNoDrawCardDelay] = useState(false);
  const [showYourTurnUI, setShowYourTurnUI] = useState(false);
  const [timer, setTimer] = useState(0);

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
      enqueueSnackbar('你答對了', { variant: 'success' });
    });

    clientRoom.onMessage(MathFormulaCardMessage.AnsweredWrong, () => {
      enqueueSnackbar('你答錯了!!', { variant: 'error' });
    });

    clientRoom.onMessage(RoomMessage.GetTimer, () => {
      setTimer((time) => time - 1);
    });

    clientRoom.state.mathFormulaCard.listen('answer', (currentValue) => {
      localDispatch({
        type: ActionType.CreateAnswer,
        answer: currentValue as number,
      });
    });

    // 監聽玩家資訊更新
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
        // 初始化玩家資訊
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

    clientRoom.state.mathFormulaCard.canUseMathSymbols.onAdd = (card) => {
      localDispatch({
        type: ActionType.UpdateCanUseSymbol,
        id: card.id,
        symbol: card.mathSymbol,
        field: 'create',
      });
      card.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change;
          if (field === 'id') {
            localDispatch({
              type: ActionType.UpdateCanUseSymbol,
              id: value,
              symbol: card.mathSymbol,
              field: 'update',
            });
          }
        });
      };
    };

    clientRoom.state.mathFormulaCard.selectedElements.onAdd = (
      selectedElement
    ) => {
      selectedElement.onChange = (changes) => {
        changes.forEach((change) => {
          const { field, value } = change;
          switch (field) {
            case 'id': {
              localDispatch({
                type: ActionType.SelectCard,
                id: selectedElement.id,
                field: 'create',
              });
              break;
            }
            case 'cardId': {
              localDispatch({
                type: ActionType.SelectCard,
                id: selectedElement.id,
                field: 'update',
                cardId: value,
              });
              break;
            }
            case 'cardNumber': {
              localDispatch({
                type: ActionType.SelectCard,
                id: selectedElement.id,
                field: 'update',
                cardNumber: value,
              });
              break;
            }
            case 'mathSymbol': {
              localDispatch({
                type: ActionType.SelectCard,
                id: selectedElement.id,
                field: 'update',
                mathSymbol: value,
              });
              break;
            }
          }
        });
      };
    };
    clientRoom.state.mathFormulaCard.selectedElements.onRemove = (
      selectedElement
    ) => {
      localDispatch({
        type: ActionType.SelectCard,
        id: selectedElement.id,
        field: 'remove',
      });
    };

    clientRoom.send(RoomMessage.LoadedGame);

    return () => {
      clientRoom.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    // 當所有玩家載入完成，即打建立遊戲事件並判斷只打一次
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
      // 由 master 結束遊戲
      if (isMaster) {
        clientRoom.send(RoomMessage.FinishGame);
      }
    }
  }, [winnerIndex]);

  useEffect(() => {
    // 初始化後取消動畫延遲
    if (state.yourCards.length === DEFAULT_CARD_COUNT && !noDrawCardDelay) {
      setTimeout(() => {
        setNoDrawCardDelay(true);
      }, DEFAULT_CARD_COUNT * 100);
    }
  }, [state.yourCards]);

  useEffect(() => {
    if (isYourTurn) {
      setShowYourTurnUI(true);
    }
    if (gameSettings?.remainedSecond) {
      setTimer(gameSettings.remainedSecond);
    }
  }, [isYourTurn]);

  useEffect(() => {
    if (showYourTurnUI) {
      setTimeout(() => {
        setShowYourTurnUI(false);
        drawCard();
        // 多人才開啟計時
        if (players.length > 1) {
          clientRoom.send(RoomMessage.SetTimer);
        }
      }, 2000);
    }
  }, [showYourTurnUI]);

  const drawCard = () => {
    clientRoom.send(MathFormulaCardMessage.DrawCard);
  };

  const getIsWinner = () => {
    const player = players.find((p) => p.id === yourPlayerId);
    if (player?.playerIndex === state.winnerIndex) {
      return true;
    }
    return false;
  };

  // 拖曳到區塊
  const handleDropCard = (
    id: string,
    targetId: string,
    mathSymbol?: MathSymbol
  ) => {
    if (!isYourTurn) {
      enqueueSnackbar('還沒輪到你', { variant: 'warning' });
      return;
    }
    clientRoom.send(MathFormulaCardMessage.DropCard, {
      id,
      targetId,
      mathSymbol,
    });
  };

  // 檢查答案
  const handleCheckAnswer = () => {
    clientRoom.send(MathFormulaCardMessage.UseCards);
  };

  // 結束回合
  const handleEndPhase = () => {
    clientRoom.send(MathFormulaCardMessage.EndPhase);
  };

  // 排序
  const handleSort = () => {
    localDispatch({ type: ActionType.SortCard });
  };

  // 重選
  const handleReselect = () => {
    enqueueSnackbar('已回到手牌', { variant: 'info' });
    clientRoom.send(MathFormulaCardMessage.ClearSelectedCards);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <GameOverModal
        show={state.winnerIndex !== -1}
        isWinner={getIsWinner()}
        onConfirm={() => dispatch(setShowGameScreen(false))}
      />

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showYourTurnUI}
      >
        <Box sx={{ fontSize: '40px' }}>輪到你了</Box>
      </Backdrop>

      <MaoreFlex
        sx={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          position: 'relative',
          background: '#264653',
        }}
      >
        {/* 操作區塊 */}
        <ControlArea
          showTimer={players.length > 1}
          onRuleClick={() => {}}
          timer={timer}
        />
        {/* 其他玩家區塊 */}
        <MaoreFlex
          alignItems="center"
          sx={{
            flexBasis: '15%',
            gap: '20px',
          }}
        >
          {Object.keys(state.otherPlayerDict).map((playerId) => (
            <OtherPlayerArea
              playerId={playerId}
              playerInfo={state.otherPlayerDict[playerId]}
              playerCount={players.length}
            />
          ))}
        </MaoreFlex>
        {/* 答案區塊 */}
        <MaoreFlex
          verticalHorizonCenter
          sx={{
            flex: 1,
            flexDirection: 'column',
          }}
        >
          <PartArea
            answer={state.answer}
            selectedCards={state.selectedCards}
            isYourTurn={isYourTurn}
            onDropCard={handleDropCard}
            onCheckAnswer={handleCheckAnswer}
          />
        </MaoreFlex>
        <MaoreFlex
          verticalHorizonCenter
          sx={{
            flexDirection: 'column',
            marginBottom: '20px',
          }}
        >
          <Box sx={{ marginBottom: '10px', fontSize: '24px' }}>算式牌</Box>
          <MaoreFlex justifyContent="center" sx={{ gap: '15px' }}>
            {state.canUseMathSymbols.map((card) => (
              <Zoom
                key={card.id}
                in={true}
                style={{
                  transitionDelay: '100ms',
                }}
              >
                <Box>
                  <MathSymbolCard
                    id={card.id}
                    symbolKey={card.mathSymbol}
                    symbolValue={selectedCardSymbolDict[card.mathSymbol]}
                    onDropCard={handleDropCard}
                  />
                </Box>
              </Zoom>
            ))}
          </MaoreFlex>
        </MaoreFlex>
        <Box sx={{ textAlign: 'center', fontSize: '30px' }}>
          {isYourTurn ? '你的回合' : '其他玩家回合'}
        </Box>
        {/* 自己手牌 */}
        <MaoreFlex
          verticalHorizonCenter
          sx={{
            flexBasis: '14%',
            marginBottom: '20px',
          }}
        >
          <MaoreFlex
            alignItems="flex-start"
            sx={{
              width: '15vw',
              flexDirection: 'column',
              padding: '0 50px',
            }}
          >
            <Box
              sx={{
                marginBottom: '20px',
                fontSize: '26px',
              }}
            >
              勝利條件: {gameSettings?.winnerPoint} 分
            </Box>
            <PlayerAvatar point={state.yourPoint} />
          </MaoreFlex>
          <MaoreFlex
            justifyContent="center"
            sx={{
              gap: '15px',
              flexWrap: 'wrap',
              width: '70vw',
            }}
          >
            {state.yourCards.map((card, index) => (
              <Zoom
                key={card.id}
                in={true}
                style={{
                  transitionDelay: noDrawCardDelay
                    ? '100ms'
                    : `${index * 100}ms`,
                }}
              >
                <Box>
                  <HandCard card={card} onDropCard={handleDropCard} />
                </Box>
              </Zoom>
            ))}
          </MaoreFlex>
          <MaoreFlex
            alignItems="flex-end"
            sx={{
              flexDirection: 'column',
              width: '15vw',
              padding: '0 50px',
            }}
          >
            {players.length === 1 ? (
              <Button
                sx={{
                  maxWidth: '200px',
                  minWidth: '150px',
                  backgroundColor: '#E76F51',
                  ':hover': {
                    backgroundColor: '#c04d30',
                  },
                  marginBottom: '10px',
                }}
                variant="contained"
                size="large"
                disableElevation
                disabled={!isYourTurn || state.winnerIndex !== -1}
                onClick={() => drawCard()}
              >
                抽牌
              </Button>
            ) : (
              <Button
                sx={{
                  maxWidth: '200px',
                  minWidth: '150px',
                  backgroundColor: '#E76F51',
                  ':hover': {
                    backgroundColor: '#c04d30',
                  },
                  marginBottom: '10px',
                }}
                variant="contained"
                size="large"
                disableElevation
                disabled={!isYourTurn || state.winnerIndex !== -1}
                onClick={() => handleEndPhase()}
              >
                結束回合
              </Button>
            )}
            <Button
              sx={{
                maxWidth: '200px',
                minWidth: '150px',
                backgroundColor: '#095858',
                ':hover': {
                  backgroundColor: '#044040',
                },
                marginBottom: '10px',
              }}
              variant="contained"
              size="large"
              disableElevation
              color="secondary"
              disabled={!isYourTurn || state.winnerIndex !== -1}
              onClick={() => handleSort()}
            >
              排序
            </Button>
            <Button
              sx={{
                maxWidth: '200px',
                minWidth: '150px',
                backgroundColor: '#415761',
                ':hover': {
                  backgroundColor: '#385968',
                },
              }}
              variant="contained"
              size="large"
              disableElevation
              disabled={!isYourTurn || state.winnerIndex !== -1}
              onClick={() => handleReselect()}
            >
              重選
            </Button>
          </MaoreFlex>
        </MaoreFlex>
      </MaoreFlex>
    </DndProvider>
  );
};

export default MathFormulaCard;

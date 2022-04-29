import { RoomMessage } from '@domain/models/Message';
import {
  playersSelector,
  isAllPlayersLoadedSelector,
  playerIdSelector,
} from '@selectors/roomSelector';
import { clientRoomSelector } from '@selectors/serverSelector';
import { useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import playerCardsReducer, {
  initialState,
} from './reducers/playerCardsReducer';

const MathFormulaCard = () => {
  const clientRoom = useSelector(clientRoomSelector);
  const players = useSelector(playersSelector);
  const yourPlayerId = useSelector(playerIdSelector);
  const isAllPlayerLoaded = useSelector(isAllPlayersLoadedSelector);
  const [state, dispatch] = useReducer(playerCardsReducer, initialState);

  useEffect(() => {
    if (!clientRoom) {
      throw new Error('client room not found...');
    }

    clientRoom.onMessage('message', (message) => {
      console.log('message received from server');
      console.log(message);
    });

    // 監聽抽牌
    clientRoom.state.playerInfos.onAdd = (playerInfo, key) => {
      if (key === yourPlayerId) {
        playerInfo.cards.onAdd = (card) => {
          console.log(card);
        };
      }
    };
    // 監聽出牌
    // clientRoom.state.playerCards.onRemove = (changes) => {
    //   console.log(changes);
    // };

    clientRoom.send(RoomMessage.LoadedGame);

    return () => {
      clientRoom.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (!clientRoom) {
      throw new Error('client room not found...');
    }

    if (isAllPlayerLoaded) {
      clientRoom.send(RoomMessage.CreateGame);
    }
  }, [isAllPlayerLoaded]);

  return <div>123</div>;
};

export default MathFormulaCard;

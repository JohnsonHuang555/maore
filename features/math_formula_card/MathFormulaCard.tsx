import { RoomMessage } from '@domain/models/Message';
import { Button } from '@mui/material';
import { playersSelector } from '@selectors/roomSelector';
import { clientRoomSelector } from '@selectors/serverSelector';
import { useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import playerCardsReducer, {
  initialState,
} from './reducers/playerCardsReducer';

const MathFormulaCard = () => {
  const clientRoom = useSelector(clientRoomSelector);
  const players = useSelector(playersSelector);
  const [state, dispatch] = useReducer(playerCardsReducer, initialState);

  useEffect(() => {
    if (!clientRoom) {
      throw new Error('client room not found...');
    }

    console.log(players);

    // 監聽抽牌
    clientRoom.state.playerCards.onAdd = (changes) => {
      console.log(changes);
    };
    // 監聽出牌
    clientRoom.state.playerCards.onRemove = (changes) => {
      console.log(changes);
    };
    // clientRoom.send(RoomMessage.CreateGame);
  }, []);

  // useEffect(() => {

  // }, [])

  return <div>123</div>;
};

export default MathFormulaCard;

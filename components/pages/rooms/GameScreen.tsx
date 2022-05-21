import React from 'react';
import { RenderMethod } from '@domain/models/Room';
import Phaser from './render_methods/Phaser';
import { useSelector } from 'react-redux';
import { clientRoomSelector } from '@selectors/serverSelector';
import WithoutFramework from './render_methods/WithoutFramework';
import { GameList } from 'server/domain/Game';

const gameRenderFunction: { [key: string]: RenderMethod } = {
  [GameList.ChineseChess]: RenderMethod.Phaser,
  [GameList.MathFormulaCard]: RenderMethod.WithoutFramework,
};

/** 決定要使用的遊戲 */
const GameScreen = () => {
  const clientRoom = useSelector(clientRoomSelector);
  if (!clientRoom) {
    return null;
  }

  const renderGameScreen = () => {
    const renderMethod = gameRenderFunction[clientRoom.name];
    switch (renderMethod) {
      case RenderMethod.Phaser: {
        return <Phaser gamePack={clientRoom.name as GameList} />;
      }
      case RenderMethod.WithoutFramework: {
        return <WithoutFramework gamePack={clientRoom.name as GameList} />;
      }
      case RenderMethod.Kaboom: {
        return <div></div>;
      }
    }
  };

  return renderGameScreen();
};

export default GameScreen;

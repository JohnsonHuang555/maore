import React from 'react';
import { RenderMethod } from '@domain/models/Room';
import { useSelector } from 'react-redux';
import { clientRoomSelector } from '@selectors/serverSelector';
import WithoutFramework from './render_methods/WithoutFramework';
import { GamePack } from 'server/domain/Game';
// import Phaser from './render_methods/Phaser';

const gameRenderFunction: { [key: string]: RenderMethod } = {
  [GamePack.ChineseChess]: RenderMethod.Phaser,
  [GamePack.MathFormulaCard]: RenderMethod.WithoutFramework,
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
      // case RenderMethod.Phaser: {
      //   return <Phaser gamePack={clientRoom.name as GamePack} />;
      // }
      case RenderMethod.WithoutFramework: {
        return <WithoutFramework gamePack={clientRoom.name as GamePack} />;
      }
      case RenderMethod.Kaboom: {
        return <div></div>;
      }
      default: {
        return null;
      }
    }
  };

  return renderGameScreen();
};

export default GameScreen;

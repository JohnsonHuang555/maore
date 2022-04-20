import React from 'react';
import { GameList } from '@domain/models/Game';
import { RenderMethod } from '@domain/models/Room';
import Phaser from './render_methods/Phaser';

export type GameScreenProps = {
  gamePack: GameList | '';
};

const gameRenderFunction: { [key: string]: RenderMethod } = {
  [GameList.ChineseChess]: RenderMethod.Phaser,
  [GameList.MathFormulaCard]: RenderMethod.WithoutFramework,
};

/** 決定要使用的遊戲 */
const GameScreen = (props: GameScreenProps) => {
  const { gamePack } = props;

  const renderGameScreen = () => {
    const renderMethod = gameRenderFunction[gamePack];
    switch (renderMethod) {
      case RenderMethod.Phaser:
        return <Phaser gamePack={gamePack} />;
      case RenderMethod.WithoutFramework:
        return <div></div>;
      case RenderMethod.Kaboom:
        return <div></div>;
    }
  };

  return renderGameScreen();
};

export default GameScreen;

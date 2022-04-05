import { GameList } from '../domain/models/Game';
import express from 'express';
import next from 'next';
import http from 'http';
import { Server } from 'colyseus';
import { monitor } from '@colyseus/monitor';
import ChineseChess from './features/chinese_chess/ChineseChess';
import MathFormulaCard from './features/math_formula_card/MathFormulaCard';
import GameRepository from './services/game/repository/GemeRepository';
import { Games } from './data/Game';
import GameUseCase from './services/game/usecase/GameUseCase';
import GameDelivery from './services/game/delivery/GameDelivery';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

/** 初始化伺服器 */
nextApp.prepare().then(() => {
  const app = express();
  const server = http.createServer(app);
  const gameServer = new Server({ server });

  // 遊戲相關 Service
  const gameRepo = new GameRepository(Games);
  const gameUseCase = new GameUseCase(gameRepo);
  new GameDelivery(app, gameUseCase);

  // 載入所有遊戲 instance
  gameServer
    .define(GameList.ChineseChess, ChineseChess)
    .enableRealtimeListing();

  gameServer
    .define(GameList.MathFormulaCard, MathFormulaCard)
    .enableRealtimeListing();

  app.use('/colyseus', monitor());

  app.all('*', (req, res) => {
    return handle(req, res);
  });

  gameServer.listen(port);
  console.log(`Listening on port: ${port}`);
});

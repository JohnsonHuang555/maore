import { GameList } from '../models/Game';
import express from 'express';
import next from 'next';
import http from 'http';
import { Server } from 'colyseus';
import { monitor } from '@colyseus/monitor';
import ChineseChess from './games/chinese_chess/ChineseChess';
import MathFormulaCard from './games/math_formula_card/MathFormulaCard';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  const server = http.createServer(app);
  const gameServer = new Server({ server });
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

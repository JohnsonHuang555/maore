import express from 'express';
import next from 'next';
import http from 'http';
import { Server, LobbyRoom } from 'colyseus';
import { monitor } from '@colyseus/monitor';
import TicTacToe from './tictactoe/TicTacToe';
import { GameList } from '../models/Game';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  const server = http.createServer(app);
  const gameServer = new Server({ server });

  app.use('/colyseus', monitor());

  app.all('*', (req: any, res: any) => {
    return handle(req, res);
  });

  // lobby
  gameServer.define('lobby', LobbyRoom);

  // games
  gameServer.define(GameList.TicTacToe, TicTacToe);
  gameServer.listen(port);
});

import express from 'express';
import next from 'next';
import http from 'http';
import { Server } from '@colyseus/core';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { monitor } from '@colyseus/monitor';
// import ChineseChess from './games/chinese_chess/ChineseChess';
import MathFormulaCard from './games/math_formula_card/MathFormulaCard';
import { GamePack } from './domain/Game';
import basicAuth from 'express-basic-auth';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const basicAuthMiddleware = basicAuth({
  // 用戶名/密碼列表
  users: {
    admin: 'yoyoyo',
  },
  // 發送 WWW-Authenticate 響應頭部, 提示用戶
  // 填寫用戶名和密碼
  challenge: true,
});

/** 初始化伺服器 */
nextApp.prepare().then(() => {
  const app = express();
  const server = http.createServer(app);
  const gameServer = new Server({
    transport: new WebSocketTransport({
      server,
      pingInterval: 1000,
      pingMaxRetries: 5,
    }),
  });

  // 載入所有遊戲 instance
  // gameServer
  //   .define(GamePack.ChineseChess, ChineseChess)
  //   .enableRealtimeListing();

  gameServer
    .define(GamePack.MathFormulaCard, MathFormulaCard)
    .enableRealtimeListing();

  app.use('/colyseus', basicAuthMiddleware, monitor());

  app.all('*', (req, res) => {
    return handle(req, res);
  });

  gameServer.listen(port);
  console.log(`Listening on port: ${port}`);
});

import { IGameUseCase } from 'server/domain/Game';
import { Express } from 'express';

export default class GameDelivery {
  private gameUseCase: IGameUseCase;
  private app: Express;

  constructor(app: Express, gameUseCase: IGameUseCase) {
    this.gameUseCase = gameUseCase;
    this.app = app;

    this.app.get('/api/games', this.fetchGames.bind(this));
    this.app.get('/api/game/:gamePack', this.fetchGame.bind(this));
  }

  private fetchGames(_req: any, res: any) {
    const games = this.gameUseCase.GetGames();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    return res.status(200).json(games);
  }

  private fetchGame(req: any, res: any) {
    const gamePack = req.params.gamePack;
    const game = this.gameUseCase.GetGameInfo(gamePack);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    return res.status(200).json(game);
  }
}

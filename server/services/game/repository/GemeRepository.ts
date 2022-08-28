import { Game, GamePack, IGameRepository } from '../../../domain/Game';

export default class GameRepository implements IGameRepository {
  private db: Game[];

  // FIXME: db 應為 資料庫 instance
  constructor(db: Game[]) {
    this.db = db;
  }

  public FindAll(): Game[] {
    // FIXME: 做資料庫查詢
    return this.db;
  }

  public FindByGamePack(gamePack: GamePack): Game {
    const game = this.db.find((g) => g.game_pack === gamePack);
    if (!game) {
      throw new Error('game not found...');
    }
    return game;
  }
}

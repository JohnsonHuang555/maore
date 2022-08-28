import {
  Game,
  GamePack,
  IGameRepository,
  IGameUseCase,
} from '../../../domain/Game';

export default class GameUseCase implements IGameUseCase {
  private gameRepo: IGameRepository;

  constructor(gameRepo: IGameRepository) {
    this.gameRepo = gameRepo;
  }

  public GetGames(): Game[] {
    return this.gameRepo.FindAll();
  }

  public GetGameInfo(gamePack: GamePack): Game {
    return this.gameRepo.FindByGamePack(gamePack);
  }
}

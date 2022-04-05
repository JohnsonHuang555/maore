import { Game } from "@models/Game";
import { Game as NetGame } from "server/domain/Game";
import { toJsCaseObject } from 'utils/AjaxDataCase';

export default class GameFactory {
  static createFromNet(netGame: NetGame): Game {
    return toJsCaseObject(netGame);
  }

  static createArrayFromNet(netGames: NetGame[]): Game[] {
    return netGames.map(netGame => this.createFromNet(netGame));
  }
}
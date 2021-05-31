import { Component } from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';

class TicTacToe extends Component {
  state = {
    initialize: true,
    game: {
      type: Phaser.AUTO,
      width: 700,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 },
        },
      },
      scene: [],
    },
  };
  render() {
    const { initialize, game } = this.state;
    return <IonPhaser game={game} initialize={initialize} />;
  }
}
export default TicTacToe;

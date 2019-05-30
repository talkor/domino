import React from 'react';
import PlayerStack from './PlayerStack.jsx';
import Board from './Board.jsx';
import Stock from './Stock.jsx';
import Toolbar from './Toolbar.jsx';
import './Game.css';

const NUM_STACK = 6;
const NUM_TILES = 28;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameTiles: [],
      playerTiles: [],
      moves: [],
      stats: {
        numTurn: 0,
        stockWithdrawals: 0,
        turnTime: [],
        avgTurnTime: 0,
        score: 0
      },
      gameTime: 0
    };
  }

  generatePlayerTiles() {
    const tiles = new Array(NUM_TILES).fill(0).map((_, index) => index);
    const chosenTiles = [];
    for (let index = 0; index < NUM_STACK; index++) {
      const number = Math.floor(Math.random() * Math.floor(tiles.length));
      chosenTiles.push(tiles[number]);
      tiles.splice(number, 1);
    }

    this.setState({ playerTiles: chosenTiles, gameTiles: tiles });
  }

  render() {
    return (
      <div>
        <Toolbar numTurns={this.state.numTurns} />
        <Board />
        <div className="player-section">
          <Stock />
          <PlayerStack playerTiles={this.state.playerTiles} />
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.generatePlayerTiles();
  }
}

export default Game;

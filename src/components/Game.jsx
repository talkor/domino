import React from 'react';
import PlayerStack from './PlayerStack.jsx';
import Board from './Board.jsx';
import './PlayerStack.css';

const NUM_STACK = 6;
const NUM_TILES = 28;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameTiles: '',
      playerTiles: []
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

    this.setState({ playerTiles: chosenTiles });
  }

  render() {
    return (
      <div>
        <p>Hello Domino App Nihao</p>
        <Board />
        <PlayerStack playerTiles={this.state.playerTiles} />
      </div>
    );
  }

  componentDidMount() {
    this.generatePlayerTiles();
  }
}

export default Game;

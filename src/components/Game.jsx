import React from 'react';
import PlayerStack from './PlayerStack.jsx';
import Board from './Board.jsx';
import Stock from './Stock.jsx';
import Toolbar from './Toolbar.jsx';
import './Game.css';

const NUM_STACK = 6;
const NUM_TILES = 28;
const BOARD_SIZE = 40;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameTiles: [],
      playerTiles: [],
      selectedTile: -1,
      boardTiles: [],
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

  generateBoardTiles() {
    this.setState({
      boardTiles: new Array(BOARD_SIZE).fill({}).map((item, index) => {
        return {
          id: index,
          tile: 0,
          placed: false,
          placeholder: true,
          rotated: false
        };
      })
    });
  }

  setSelectedTile(selectedTile) {
    this.setState({ selectedTile });
  }

  onTilePlaced(tileId) {
    const boardTiles = this.state.boardTiles;
    const selectedTile = this.state.selectedTile;
    boardTiles[tileId] = {
      ...boardTiles[tileId],
      tile: selectedTile,
      placed: true,
      placeholder: false
    };

    // Remove from playerTiles
    const playerTiles = this.state.playerTiles;
    playerTiles.splice(playerTiles.indexOf(parseInt(selectedTile, 10)), 1);
    this.setState({ boardTiles, playerTiles, selectedTile: -1 });
  }

  render() {
    return (
      <div>
        <Toolbar numTurns={this.state.numTurns} />
        <Board
          boardTiles={this.state.boardTiles}
          selectedTile={this.state.selectedTile}
          onTilePlaced={this.onTilePlaced.bind(this)}
        />
        <div className="player-section">
          <Stock />
          <PlayerStack
            playerTiles={this.state.playerTiles}
            selectedTile={this.state.selectedTile}
            setSelectedTile={this.setSelectedTile.bind(this)}
            onTilePlace={this.onTilePlaced.bind(this)}
          />
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.generatePlayerTiles();
    this.generateBoardTiles();
  }
}

export default Game;

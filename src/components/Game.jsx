import React from 'react';
import PlayerStack from './PlayerStack.jsx';
import Board from './Board.jsx';
import Stock from './Stock.jsx';
import Toolbar from './Toolbar.jsx';
import './Game.css';

const NUM_STACK = 6;
const NUM_TILES = 28;
const BOARD_SIZE = 40;
const MAX_TILES_FOR_PLAYER = 10;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameTiles: [],
      playerTiles: [],
      boardTiles: [],
      selectedTile: -1,
      moves: [],
      gameTime: 0,
      stats: {
        numTurn: 0,
        stockWithdrawals: 0,
        turnTime: [],
        avgTurnTime: 0,
        score: 0
      }
    };
  }

  generatePlayerTiles() {
    const gameTiles = new Array(NUM_TILES).fill(0).map((_, index) => index);
    const playerTiles = [];

    Array(NUM_STACK)
      .fill('')
      .map(() => {
        const randomIndex = Math.floor(
          Math.random() * Math.floor(gameTiles.length)
        );

        playerTiles.push(gameTiles[randomIndex]);
        gameTiles.splice(randomIndex, 1);
      });

    this.setState({ playerTiles, gameTiles });
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

    if (selectedTile != -1) {
      boardTiles[tileId] = {
        ...boardTiles[tileId],
        tile: selectedTile,
        placed: true,
        placeholder: false,
        rotated: true
      };

      // Remove from playerTiles
      const playerTiles = this.state.playerTiles;
      playerTiles.splice(playerTiles.indexOf(parseInt(selectedTile, 10)), 1);

      this.setState({ boardTiles, playerTiles, selectedTile: -1 });
    } else {
      console.log('You must select a tile first');
    }
  }

  onStockWithdrawal() {
    const gameTiles = this.state.gameTiles;
    const playerTiles = this.state.playerTiles;
    const randomIndex = Math.floor(
      Math.random() * Math.floor(this.state.gameTiles.length)
    );

    if (randomIndex === -1) {
      console.log('Stock is empty');
    } else if (playerTiles.length <= MAX_TILES_FOR_PLAYER) {
      playerTiles.push(this.state.gameTiles[randomIndex]);
      gameTiles.splice(randomIndex, 1);

      this.setState({ playerTiles, gameTiles });
    } else {
      console.log('Cannot hold more than 10 tiles at a time');
    }
  }

  render() {
    return (
      <div>
        <Toolbar stats={this.state.stats} />
        <Board
          boardTiles={this.state.boardTiles}
          selectedTile={this.state.selectedTile}
          onTilePlaced={this.onTilePlaced.bind(this)}
        />
        <div className="player-section">
          <Stock
            gameTiles={this.state.gameTiles}
            empty={this.state.gameTiles.length === 0}
            onStockWithdrawal={this.onStockWithdrawal.bind(this)}
          />
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

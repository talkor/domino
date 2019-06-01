import React from 'react';
import PlayerStack from './PlayerStack.jsx';
import Board from './Board.jsx';
import Stock from './Stock.jsx';
import Toolbar from './Toolbar.jsx';
import { tilesMap } from '../TilesMap';
import './Game.css';

const NUM_STACK = 6;
const NUM_TILES = 28;
const BOARD_SIZE = 108;
const MAX_TILES_FOR_PLAYER = 10;
const MIDDLE_TILE = 53;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameTiles: [],
      playerTiles: [],
      boardTiles: [],
      selectedTile: -1,
      turns: [],
      currentTurn: 0,
      maxTurn: 0,
      elapsedSeconds: 0,
      uiMessage: {
        message: '',
        show: false,
        type: ''
      },
      stats: {
        numTurns: 0,
        stockWithdrawals: 0,
        turnTime: [0],
        avgTurnTime: 0,
        score: 0
      }
    };
  }

  render() {
    return (
      <div>
        <Toolbar
          stats={this.state.stats}
          uiMessage={this.state.uiMessage}
          elapsedSeconds={this.state.elapsedSeconds}
          onPrevClick={() => this.onTurnHistoryClick({ direction: 'prev' })}
          onNextClick={() => this.onTurnHistoryClick({ direction: 'next' })}
        />
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

  async componentDidMount() {
    await this.generatePlayerTiles();
    await this.generateBoardTiles();
    await this.saveTurn();

    this.showUiMessage('Game started', { type: 'info' });
    this.initTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  onTurnHistoryClick({ direction }) {
    let { currentTurn, turns, maxTurn } = this.state;

    if (direction === 'next' && currentTurn < maxTurn) {
      currentTurn = currentTurn + 1;
    } else if (direction === 'prev' && currentTurn > 0) {
      currentTurn = currentTurn - 1;
    }

    this.setState({
      currentTurn,
      playerTiles: turns[currentTurn].playerTiles,
      boardTiles: turns[currentTurn].boardTiles,
      stats: turns[currentTurn].stats
    });
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

    const score = playerTiles.reduce(
      (sum, value) => sum + tilesMap[value].a + tilesMap[value].b,
      0
    );

    this.setState({
      playerTiles,
      gameTiles,
      stats: {
        ...this.state.stats,
        score
      }
    });
  }

  saveTurn() {
    const {
      playerTiles,
      boardTiles,
      stats,
      elapsedSeconds,
      turns
    } = this.state;

    turns.push({
      playerTiles: [...playerTiles],
      boardTiles: [...boardTiles],
      stats,
      elapsedSeconds
    });

    this.setState({ turns });
  }

  generateBoardTiles() {
    const boardTiles = new Array(BOARD_SIZE).fill({}).map((_, index) => {
      return {
        id: index,
        tile: 0,
        placed: false,
        placeholder: true,
        rotated: true,
        rendered: false
      };
    });

    boardTiles[MIDDLE_TILE].rendered = true;
    boardTiles[MIDDLE_TILE].isFirst = true;

    this.setState({
      boardTiles
    });
  }

  async setSelectedTile(selectedTile) {
    await this.setState({ selectedTile });
    this.findPlaceholders();
  }

  findPlaceholders() {
    const { boardTiles, selectedTile } = this.state;
    const avaiablePositions = [];

    boardTiles.map((tile, index) => {
      if (tile.placed === true) {
        // TODO: Handle doubles

        if (tilesMap[tile.tile].a === tilesMap[selectedTile].a) {
          console.log('matched left, rotate clockwise');
          avaiablePositions.push({ position: index - 1, rotate: 90 });
        } else if (tilesMap[tile.tile].a === tilesMap[selectedTile].b) {
          console.log('matched left, rotate unclockwise');
          avaiablePositions.push({ position: index - 1, rotate: 90 });
        } else if (tilesMap[tile.tile].b === tilesMap[selectedTile].a) {
          console.log('matched right, rotate unclockwise');
          avaiablePositions.push({ position: index + 1, rotate: 90 });
        } else if (tilesMap[tile.tile].b === tilesMap[selectedTile].b) {
          console.log('matched right, rotate clockwise');
          avaiablePositions.push({ position: index + 1, rotate: 90 });
        }
      }
    });

    this.clearPlaceholders();
    this.showPlaceholders(avaiablePositions);
  }

  clearPlaceholders() {
    const { boardTiles } = this.state;

    this.setState({
      boardTiles: boardTiles.map(tile => {
        return {
          ...tile,
          rendered: tile.isFirst || tile.placed
        };
      })
    });
  }

  showPlaceholders(positions) {
    const { boardTiles } = this.state;

    positions.map(tile => {
      if (!boardTiles[tile.position].placed) {
        boardTiles[tile.position] = {
          ...boardTiles[tile.position],
          placeholder: true,
          rendered: true
        };
      }
    });

    this.setState({ boardTiles });
  }

  async onTilePlaced(tileId) {
    const boardTiles = this.state.boardTiles;
    const selectedTile = this.state.selectedTile;

    if (boardTiles[tileId].placed === true) {
      this.showUiMessage('This tile is already placed', { type: 'warning' });
    } else if (selectedTile != -1) {
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

      await this.setState({ boardTiles, playerTiles, selectedTile: -1 });
      await this.makeTurn({ method: 'place' });
    } else {
      this.showUiMessage('You must select a tile first', { type: 'warning' });
    }
  }

  showUiMessage(message, { type }) {
    this.setState({
      uiMessage: {
        message,
        type,
        show: true
      }
    });

    setTimeout(
      () =>
        this.setState({
          uiMessage: { ...this.state.uiMessage, show: false }
        }),
      2500
    );
  }

  onStockWithdrawal() {
    const gameTiles = this.state.gameTiles;
    const playerTiles = this.state.playerTiles;
    const randomIndex = Math.floor(
      Math.random() * Math.floor(this.state.gameTiles.length)
    );

    if (randomIndex === -1) {
      this.showUiMessage('Stock is empty!', { type: 'warning' });
    } else if (playerTiles.length <= MAX_TILES_FOR_PLAYER) {
      playerTiles.unshift(this.state.gameTiles[randomIndex]);
      gameTiles.splice(randomIndex, 1);
      this.makeTurn({ method: 'stock' });
      this.setState({ playerTiles, gameTiles });
    } else {
      this.showUiMessage('You cannot hold more than 10 tiles at a time', {
        type: 'warning'
      });
    }
  }

  async makeTurn({ method }) {
    const { numTurns, stockWithdrawals, turnTime } = this.state.stats;
    const { currentTurn } = this.state;

    const timeDifference =
      this.state.elapsedSeconds - turnTime[turnTime.length - 1];
    turnTime.push(timeDifference);

    const score = this.state.playerTiles.reduce(
      (sum, value) => sum + tilesMap[value].a + tilesMap[value].b,
      0
    );

    const updatedAverageTurnTime =
      turnTime.reduce((sum, value) => sum + value, 0) / turnTime.length;

    const stats = {
      ...this.state.stats,
      numTurns: numTurns + 1,
      stockWithdrawals:
        method === 'stock' ? stockWithdrawals + 1 : stockWithdrawals,
      score,
      turnTime,
      avgTurnTime: updatedAverageTurnTime.toFixed(1)
    };

    await this.setState({
      currentTurn: currentTurn + 1,
      maxTurn: currentTurn + 1,
      stats
    });

    await this.saveTurn();
  }

  initTimer() {
    this.interval = setInterval(() => {
      this.setState({ elapsedSeconds: this.state.elapsedSeconds + 1 });
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.interval);
  }
}

export default Game;

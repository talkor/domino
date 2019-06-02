import React from 'react';
import PlayerStack from './PlayerStack.jsx';
import Board from './Board.jsx';
import Stock from './Stock.jsx';
import Toolbar from './Toolbar.jsx';
import { tilesMap } from '../TilesMap';
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
      elapsedSeconds: 0,
      isGameOver: false,
      uiMessage: {
        message: '',
        show: false
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
          isGameOver={this.state.isGameOver}
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

  componentDidMount() {
    this.generatePlayerTiles();
    this.generateBoardTiles();
    this.showUiMessage('Game started');
    this.initTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
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
      this.makeTurn({ method: 'place' });
    } else {
      this.showUiMessage('You must select a tile first');
    }
  }

  showUiMessage(message) {
    this.setState({
      uiMessage: {
        message,
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
      this.showUiMessage('Stock is empty!');
    } else if (playerTiles.length <= MAX_TILES_FOR_PLAYER) {
      playerTiles.push(this.state.gameTiles[randomIndex]);
      gameTiles.splice(randomIndex, 1);
      this.makeTurn({ method: 'stock' });
      this.setState({ playerTiles, gameTiles });
    } else {
      this.showUiMessage('You cannot hold more than 10 tiles at a time');
    }
  }

  makeTurn({ method }) {
    const { numTurns, stockWithdrawals, turnTime } = this.state.stats;

    const timeDifference =
      this.state.elapsedSeconds - turnTime[turnTime.length - 1];
    turnTime.push(timeDifference);

    const score = this.state.playerTiles.reduce(
      (sum, value) => sum + tilesMap[value].a + tilesMap[value].b,
      0
    );

    const updatedAverageTurnTime =
      turnTime.reduce((sum, value) => sum + value, 0) / turnTime.length;

    this.setState({
      stats: {
        ...this.state.stats,
        numTurns: numTurns + 1,
        stockWithdrawals:
          method === 'stock' ? stockWithdrawals + 1 : stockWithdrawals,
        score,
        turnTime,
        avgTurnTime: updatedAverageTurnTime.toFixed(1)
      }
    });


// const noPosibleMoves = false;
// for(var t in this.state.boardTiles) {
//   console.log(t.placeholder);
//   // if(t.placeholder == false) {
//   //   noPosibleMoves = true;
//   // }
// }

/** check if player lost */
/** if no more moves and stack is empty and player still has cards */
    if(this.state.gameTiles.length == 0 && this.state.playerTiles != 0 && noPosibleMoves==true) {
      this.state.isGameOver = true;
      this.gameOver('lose');
    }
/** check if player won */
/** if stack is empty and player hand is empty */
    if(this.state.gameTiles.length == 0 && this.state.playerTiles == 0) {
      this.state.isGameOver = true;
        this.gameOver('win');
    }

  }

  initTimer() {
    this.interval = setInterval(() => {
      this.setState({ elapsedSeconds: this.state.elapsedSeconds + 1 });
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.interval);
  }

  gameOver(result) {
    this.showUiMessage('Game Over');
    
   if(result == 'win') {
    this.showUiMessage('Congratulations, you WON!');
   } else if(result == 'lose') {
    this.showUiMessage('Too bad, you lost. Your score is: ' + this.state.stats.score);
   }

   this.stopTimer();
   /** 
    * Make both buttons visible: .game-button.prev , .game-button.next 
    * 
    * enable new game button
    */

  }

}

export default Game;

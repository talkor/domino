import React from 'react';
import Timer from './Timer.jsx';
import './Toolbar.css';

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="toolbar">
          <span>Turns: {this.props.stats.numTurns}</span>
          <span>Stock Withdrawals: {this.props.stats.stockWithdrawals}</span>
          <span>Avg. Turn Time: {this.props.stats.avgTurnTime}</span>
          <span>Score: {this.props.stats.score}</span>
          <Timer elapsedSeconds={this.props.elapsedSeconds} />
          <button className="game-button new">New Game</button>
          {this.props.isGameOver? <button className="game-button prev">Prev</button>: ''}
          {this.props.isGameOver? <button className="game-button next">Next</button>: ''}
        </div>
        
        <div
          className={`ui-message ${
            this.props.uiMessage.show ? 'show' : 'hide'
          }`}
        >
          {this.props.uiMessage.message}
        </div>
      </React.Fragment>
    );
  }
}

export default Toolbar;

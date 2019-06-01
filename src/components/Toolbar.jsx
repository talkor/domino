import React from 'react';
import Timer from './Timer.jsx';
import './Toolbar.css';

const Toolbar = props => {
  return (
    <React.Fragment>
      <div className="toolbar">
        <span>Turns: {props.stats.numTurns}</span>
        <span>Stock Withdrawals: {props.stats.stockWithdrawals}</span>
        <span>Avg. Turn Time: {props.stats.avgTurnTime}</span>
        <span>Score: {props.stats.score}</span>
        <Timer elapsedSeconds={props.elapsedSeconds} />
        <button className="game-button new">New Game</button>
        <button onClick={props.onPrevClick} className="game-button prev">
          Prev
        </button>
        <button onClick={props.onNextClick} className="game-button next">
          Next
        </button>
      </div>
      <div
        className={`ui-message ${props.uiMessage.show ? 'show' : 'hide'} ${
          props.uiMessage.type
        }`}
      >
        <span>{props.uiMessage.message}</span>
      </div>
    </React.Fragment>
  );
};

export default Toolbar;

import React from 'react';
import './Toolbar.css';

class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="toolbar">
        <span className="timer">00:00</span>
        <span>{this.props.numTurns}</span>
        <button className="game-button new">New Game</button>
        <button className="game-button prev">Prev</button>
        <button className="game-button next">Next</button>
      </div>
    );
  }
}

export default Toolbar;

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
      <div className="toolbar">
        <Timer />
        <span>{this.props.stats.numTurns}</span>
        <button className="game-button new">New Game</button>
        <button className="game-button prev">Prev</button>
        <button className="game-button next">Next</button>
      </div>
    );
  }
}

export default Toolbar;

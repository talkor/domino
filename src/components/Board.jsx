import React from 'react';
import Tile from './Tile.jsx';
import './Board.css';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="board">
        <Tile tile="12" rotated="true" placed="true" />
        <Tile tile="3" placed="true" />
      </div>
    );
  }
}

export default Board;

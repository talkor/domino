import React from 'react';
import Tile from './Tile.jsx';
import './Board.css';

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaceholder: true,
      isPlaced: false
    };
  }

  onTileClick(event, placed) {
    if (!placed) {
      this.setState({
        selectedTile: this.props.selectedTile,
        isPlaceholder: false,
        isPlaced: true
      });

      this.props.onTilePlaced();
    }
  }

  render() {
    return (
      <div className="board">
        <Tile
          tile={this.state.selectedTile}
          placeholder={this.state.isPlaceholder}
          placed={this.state.isPlaced}
          onTileClick={this.onTileClick.bind(this)}
          rotated={false}
        />
      </div>
    );
  }
}

export default Board;

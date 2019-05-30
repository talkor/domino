import React from 'react';
import Tile from './Tile.jsx';
import './PlayerStack.css';

class PlayerStack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTile: -1
    };
  }

  onTileClick(event) {
    event.preventDefault();
    const selectedTile = event.currentTarget.dataset.tile;
    this.setState({
      selectedTile
    });

    this.props.setSelectedTile(selectedTile);
  }

  render() {
    return (
      <div className="player-stack">
        {this.props.playerTiles.map((tile, key) => {
          return (
            <Tile
              tile={tile}
              key={key}
              selected={this.state.selectedTile == tile}
              onTileClick={this.onTileClick.bind(this)}
            />
          );
        })}
      </div>
    );
  }
}

export default PlayerStack;

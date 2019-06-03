import React from 'react';
import Tile from './Tile.jsx';
import './PlayerStack.css';

const PlayerStack = props => {
  const handleTileClick = event => {
    event.preventDefault();
    const selectedTile = event.currentTarget.dataset.tile;
    props.setSelectedTile(selectedTile);
  };

  return (
    <div className="player-stack">
      {props.isGameOver ? (
        ''
      ) : (
        <React.Fragment>
          {props.playerTiles.map((tile, key) => {
            return (
              <Tile
                tile={tile}
                key={key}
                selected={props.selectedTile == tile}
                onTileClick={handleTileClick.bind(this)}
              />
            );
          })}
        </React.Fragment>
      )}
    </div>
  );
};

export default PlayerStack;

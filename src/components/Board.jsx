import React from 'react';
import Tile from './Tile.jsx';
import './Board.css';

const Board = props => {
  const handleTilePlace = event => {
    const tileId = event.currentTarget.id;
    props.onTilePlaced(tileId);
  };

  return (
    <div className="board">
      {props.boardTiles.map(tile => (
        <Tile
          tile={tile.tile}
          placeholder={tile.placeholder}
          placed={tile.placed}
          onTileClick={handleTilePlace}
          rotated={tile.rotated}
          key={tile.id}
          id={tile.id}
          rendered={tile.rendered}
        />
      ))}
    </div>
  );
};

export default Board;

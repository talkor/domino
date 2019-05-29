import React from 'react';
import './Tile.css';
import { tiles } from '../Tiles.jsx';

const Tile = props => {
  return (
    <div
      className={`tile ${props.rotated ? 'rotated' : ''} ${
        props.placed ? 'placed' : ''
      } ${props.selected ? 'selected' : ''}`}
      onClick={props.onTileClick}
      data-tile={props.tile}
    >
      <div className={`side-a tile-${tiles[props.tile].a}`}>
        <span className="dot dot-1" />
        <span className="dot dot-2" />
        <span className="dot dot-3" />
        <span className="dot dot-4" />
        <span className="dot dot-5" />
        <span className="dot dot-6" />
      </div>
      <div className="divider" />
      <div className={`side-b tile-${tiles[props.tile].b}`}>
        <span className="dot dot-1" />
        <span className="dot dot-2" />
        <span className="dot dot-3" />
        <span className="dot dot-4" />
        <span className="dot dot-5" />
        <span className="dot dot-6" />
      </div>
    </div>
  );
};

Tile.defaultProps = {
  rotated: false,
  placed: false
};

export default Tile;

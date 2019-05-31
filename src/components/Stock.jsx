import React from 'react';
import Tile from './Tile.jsx';
import './Stock.css';

const Stock = props => {
  return (
    <Tile
      empty={props.empty}
      tile="0"
      isStock
      onTileClick={props.onStockWithdrawal}
    />
  );
};

export default Stock;

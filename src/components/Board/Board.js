import React from 'react';
import PropTypes from 'prop-types';

import './Board.css';

const cellStates = {
  alive: '+',
  damaged: '*',
  dead: 'x',
  miss: '-',
  unknown: '?',
};

// could be rewritten as functional component, but will create computeBoard func on every render; put on hold for now
class Board extends React.Component {
  computeBoard = () => {
    const board = [];
    const boardSize = 10;

    for (let i = 0; i < boardSize; i++) {
      const row = [];

      for (let j = 0; j < boardSize; j++) {
        row.push(cellStates.unknown);
      }

      board.push(row);
    }

    for (let ship of this.props.ships) {
      const isShipAlive = ship.positions.reduce((acc, curr) => {
        if (acc === true) {
          return true;
        }

        const position = curr;
        return position.isAlive;
      }, false);

      for (let position of ship.positions) {
        const rowIndex = position.y;
        const colIndex = position.x;
        const isCellAlive = position.isAlive;
        board[rowIndex][colIndex] =
          isCellAlive ? cellStates.alive :
          isShipAlive ? cellStates.damaged :
          cellStates.dead;
      }
    }

    for (let position of this.props.missedPositions) {
      const rowIndex = position.y;
      const colIndex = position.x;
      board[rowIndex][colIndex] = cellStates.miss;
    }

    return board;
  }

  render() {
    const computedBoard = this.computeBoard();
    const rowsJsx = [];

    for (let rowIndex = 0; rowIndex < computedBoard.length; rowIndex++) {
      const row = computedBoard[rowIndex];
      const colsJsx = row.map((cellState, colIndex) => {
        const modifierClass =
          cellState === cellStates.miss ? 'board__cell--miss' :
          cellState === cellStates.damaged ? 'board__cell--damaged' :
          cellState === cellStates.dead ? 'board__cell--dead' :
          'board__cell--unknown';

        return (
          <div
            className={`board__cell ${modifierClass}`}
            key={colIndex}
            onClick={this.props.createCellClickHandler(rowIndex, colIndex)}
          >
            {
              cellState === cellStates.miss ? '-' :
              cellState === cellStates.damaged ? '*' :
              cellState === cellStates.dead ? 'x' :
              '?'
            }
          </div>
        );
      });

      const rowJsx = (<div className="board__row" key={rowIndex}>{colsJsx}</div>);
      rowsJsx.push(rowJsx);
    }

    return (
      <div className="board">
        {rowsJsx}
      </div>
    );
  }
}

Board.propTypes = {
  ships: PropTypes.array.isRequired,
  missedPositions: PropTypes.array.isRequired,
  createCellClickHandler: PropTypes.func.isRequired,
};

export default Board;

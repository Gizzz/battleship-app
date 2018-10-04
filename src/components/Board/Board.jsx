import React from 'react';
import './Board.scss';

class Board extends React.Component {
  initialState = {
    ships: [
      { positions: [[2,9,1], [3,9,1], [4,9,1], [5,9,1], [6,9,1]] },
      { positions: [[5,2,1], [5,3,1], [5,4,1], [5,5,1]] },
      { positions: [[8,1,1], [8,2,1], [8,3,1]] },
      { positions: [[3,0,1], [3,1,1], [3,2,1]] },
      { positions: [[0,0,1], [1,0,1]] },
    ],
  }

  state = this.initialState

  createCellClickHandler = (rowIndex, colIndex) => {
    return () => {
      const xPos = colIndex;
      const yPos = rowIndex;

      const shipsCopy = JSON.parse(JSON.stringify(this.state.ships));
      const newShips = shipsCopy.map((ship) => {
        return {
          ...ship,
          positions: ship.positions.map((pos) => {
            const isPositionClicked = pos[0] === xPos && pos[1] === yPos;
            return isPositionClicked ? [pos[0], pos[1], 0] : pos;
          }),
        };
      })
      
      this.setState({ ships: newShips }, () => {
        if (this.computeGameover()) {
          // fire callback in next tick to let React perform render
          setTimeout(() => {
            alert('Game is over. Let\'s start all over again!');
            this.setState({ ...this.initialState });
          }, 10);
        }
      });
    };
  }

  computeGameover = () => {
    for (let ship of this.state.ships) {
      for (let position of ship.positions) {
        const isCellAlive = position[2] === 1;
        if (isCellAlive) {
          return false;
        }
      }
    }

    return true;
  }

  computeBoard = () => {
    const board = [];
    const boardSize = 10;

    for (let i = 0; i < boardSize; i++) {
      const row = [];

      for (let j = 0; j < boardSize; j++) {
        row.push('-');
      }

      board.push(row);
    }

    for (let ship of this.state.ships) {
      for (let position of ship.positions) {
        const rowIndex = position[1];
        const colIndex = position[0];
        const isPositionAlive = position[2] === 1;
        board[rowIndex][colIndex] = isPositionAlive ? '+' : 'x';
      }
    }

    return board;
  }

  render() {
    const computedBoard = this.computeBoard();
    const rowsJsx = [];

    for (let rowIndex = 0; rowIndex < computedBoard.length; rowIndex++) {
      const row = computedBoard[rowIndex];
      const colsJsx = row.map((cellValue, colIndex) => {
        const modifierClass = cellValue === 'x' ? 'board__cell--dead' : '';

        return (
          <div
            className={`board__cell ${modifierClass}`}
            key={colIndex}
            onClick={this.createCellClickHandler(rowIndex, colIndex)}
          >
            {cellValue === 'x' ? 'x' : '?'}
          </div>
        )
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

export default Board;

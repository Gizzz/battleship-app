import React from 'react';
import './Board.scss';

const cellStates = {
  alive: '+',
  damaged: '*',
  dead: 'x',
  miss: '-',
  unknown: '?',
};

class Board extends React.Component {
  initialState = {
    ships: [
      { positions: [[2,9,1], [3,9,1], [4,9,1], [5,9,1], [6,9,1]] },
      { positions: [[5,2,1], [5,3,1], [5,4,1], [5,5,1]] },
      { positions: [[8,1,1], [8,2,1], [8,3,1]] },
      { positions: [[3,0,1], [3,1,1], [3,2,1]] },
      { positions: [[0,0,1], [1,0,1]] },
    ],
    missedPositions: [],
  }

  state = this.initialState

  createCellClickHandler = (rowIndex, colIndex) => {
    return () => {
      const xPos = colIndex;
      const yPos = rowIndex;

      let isUserMissed = true;
      const shipsCopy = JSON.parse(JSON.stringify(this.state.ships));
      const newShips = shipsCopy.map((ship) => {
        return {
          ...ship,
          positions: ship.positions.map((pos) => {
            const isPositionClicked = pos[0] === xPos && pos[1] === yPos;
            if (isPositionClicked) {
              isUserMissed = false;
            }

            return isPositionClicked ? [pos[0], pos[1], 0] : pos;
          }),
        };
      });

      const newMissedPositions = [...this.state.missedPositions];
      const currentPosition = [colIndex, rowIndex];
      if (isUserMissed && !this.isMissedPositionExists(currentPosition)) {
        newMissedPositions.push([xPos, yPos]);
      }

      this.setState({ ships: newShips, missedPositions: newMissedPositions }, () => {
        if (this.computeGameover()) {
          // fire callback in next tick to let React perform render
          setTimeout(() => {
            alert('Game is over. Let\'s start again!');
            this.setState({ ...this.initialState });
          }, 10);
        }
      });
    };
  }

  isMissedPositionExists = (positionParam) => {
    for (let position of this.state.missedPositions) {
      if (position[0] === positionParam[0] && position[1] === positionParam[1]) {
        return true;
      }
    }

    return false;
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
        row.push(cellStates.unknown);
      }

      board.push(row);
    }

    for (let ship of this.state.ships) {
      const isShipAlive = ship.positions.reduce((acc, curr) => {
        if (acc === true) {
          return true;
        }

        const position = curr;
        const isCellDead = position[2] === 0;

        return isCellDead ? false : true;
      }, false);

      for (let position of ship.positions) {
        const rowIndex = position[1];
        const colIndex = position[0];
        const isCellAlive = position[2] === 1;
        board[rowIndex][colIndex] =
          isCellAlive ? cellStates.alive :
          isShipAlive ? cellStates.damaged :
          cellStates.dead;
      }
    }

    for (let position of this.state.missedPositions) {
      const rowIndex = position[1];
      const colIndex = position[0];
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
            onClick={this.createCellClickHandler(rowIndex, colIndex)}
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

export default Board;

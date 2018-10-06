import React from 'react';
import './Board.css';

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
      { positions: [
        {x: 2, y: 9, isAlive: true},
        {x: 3, y: 9, isAlive: true},
        {x: 4, y: 9, isAlive: true},
        {x: 5, y: 9, isAlive: true},
        {x: 6, y: 9, isAlive: true},
      ] },
      { positions: [
        {x: 5, y: 2, isAlive: true},
        {x: 5, y: 3, isAlive: true},
        {x: 5, y: 4, isAlive: true},
        {x: 5, y: 5, isAlive: true},
      ] },
      { positions: [
        {x: 8, y: 1, isAlive: true},
        {x: 8, y: 2, isAlive: true},
        {x: 8, y: 3, isAlive: true},
      ] },
      { positions: [
        {x: 3, y: 0, isAlive: true},
        {x: 3, y: 1, isAlive: true},
        {x: 3, y: 2, isAlive: true},
      ] },
      { positions: [
        {x: 0, y: 0, isAlive: true},
        {x: 1, y: 0, isAlive: true},
      ] },
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
          positions: ship.positions.map((position) => {
            const isPositionClicked = position.x === xPos && position.y === yPos;
            if (isPositionClicked) {
              isUserMissed = false;
            }

            return isPositionClicked ? { ...position, isAlive: false } : position;
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
        if (position.isAlive) {
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

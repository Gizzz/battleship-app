import React from 'react';
import './Board.scss';

class Board extends React.Component {
  initialState = {
    "shipTypes": {
      "carrier": { "size": 5, "count": 1 },
      "battleship": { "size": 4, "count": 1 },
      "cruiser": { "size": 3, "count": 1 },
      "submarine": { "size": 3, "count": 1 },
      "destroyer": { "size": 2, "count": 1 },
    },
    "layout": [
      { "ship": "carrier", "positions": [[2,9], [3,9], [4,9], [5,9], [6,9]] },
      { "ship": "battleship", "positions": [[5,2], [5,3], [5,4], [5,5]] },
      { "ship": "cruiser", "positions": [[8,1], [8,2], [8,3]] },
      { "ship": "submarine", "positions": [[3,0], [3,1], [3,2]] },
      { "ship": "destroyer", "positions": [[0,0], [1,0]] },
    ]
  }

  state = this.initialState

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

    for (let ship of this.state.layout) {
      for (let position of ship.positions) {
        const rowIndex = position[1];
        const colIndex = position[0];
        board[rowIndex][colIndex] = '+';
      }
    }

    return board;
  }

  render() {
    const computedBoard = this.computeBoard();
    const rowsJsx = [];

    for (let i = 0; i < computedBoard.length; i++) {
      const row = computedBoard[i];
      const colsJsx = row.map((cellValue, index) => (
        <div className="board__cell" key={index}>{cellValue}</div>
      ));

      const rowJsx = (<div className="board__row" key={i}>{colsJsx}</div>);
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

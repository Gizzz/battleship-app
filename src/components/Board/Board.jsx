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
      { "shipType": "carrier", "positions": [[2,9,1], [3,9,1], [4,9,1], [5,9,1], [6,9,1]] },
      { "shipType": "battleship", "positions": [[5,2,1], [5,3,1], [5,4,1], [5,5,1]] },
      { "shipType": "cruiser", "positions": [[8,1,1], [8,2,1], [8,3,1]] },
      { "shipType": "submarine", "positions": [[3,0,1], [3,1,1], [3,2,1]] },
      { "shipType": "destroyer", "positions": [[0,0,1], [1,0,1]] },
    ]
  }

  state = this.initialState

  createCellClickHandler = (rowIndex, colIndex) => {
    return () => {
      const xPos = colIndex;
      const yPos = rowIndex;

      const layoutCopy = JSON.parse(JSON.stringify(this.state.layout));
      const newLayout = layoutCopy.map((ship) => {
        return {
          ...ship,
          positions: ship.positions.map((pos) => {
            const isPositionClicked = pos[0] === xPos && pos[1] === yPos;
            return isPositionClicked ? [pos[0], pos[1], 0] : pos;
          }),
        };
      })
      
      this.setState({ layout: newLayout });
    };
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

    for (let ship of this.state.layout) {
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
      const colsJsx = row.map((cellValue, colIndex) => (
        <div
          className="board__cell"
          key={colIndex}
          onClick={this.createCellClickHandler(rowIndex, colIndex)}
        >
          {cellValue}
        </div>
      ));

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

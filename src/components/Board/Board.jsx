import React from 'react';
import './Board.scss';

const Board = () => {
  const rowsCount = 10;
  const rows = [];
  for (let i = 0; i < rowsCount; i++) {
    rows.push(
      <div className="board__row" key={i}>
        <div className="board__cell">x</div>
        <div className="board__cell">x</div>
        <div className="board__cell">x</div>
        <div className="board__cell">x</div>
        <div className="board__cell">x</div>
        <div className="board__cell">x</div>
        <div className="board__cell">x</div>
        <div className="board__cell">x</div>
        <div className="board__cell">x</div>
        <div className="board__cell">x</div>
      </div>
    );
  }

  return (
    <div className="board">
      {rows}
    </div>
  );
};

export default Board;

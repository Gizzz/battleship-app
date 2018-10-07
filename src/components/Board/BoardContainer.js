import React from 'react';
import Board from './Board';

class BoardContainer extends React.Component {
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
    // shape: missedPositions: [{ x: 0, y: 0 }, ...],
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
        newMissedPositions.push({ x: xPos, y: yPos });
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
      if (position.x === positionParam[0] && position.y === positionParam[1]) {
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

  render() {
    return (
      <Board
        ships={this.state.ships}
        missedPositions={this.state.missedPositions}
        createCellClickHandler={this.createCellClickHandler}
      />
    );
  }
}

export default BoardContainer;

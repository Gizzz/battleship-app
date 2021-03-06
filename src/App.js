import React, { Component } from 'react';

import Board from './components/Board';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <h1 className="app__title">Battleship App</h1>
        <p className="app__descr">Search and destroy all enemy ships by clicking on tiles of the board.</p>
        <div className="app__board">
          <Board />
        </div>
      </div>
    );
  }
}

export default App;

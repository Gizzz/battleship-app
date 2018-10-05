import React, { Component } from 'react';

import Board from './components/Board';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <h1 className="app__title">Battleship App</h1>
        <div className="app__board">
          <Board />
        </div>
      </div>
    );
  }
}

export default App;

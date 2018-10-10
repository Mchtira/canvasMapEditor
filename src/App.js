import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TileSet from './components/TileSet.js'
import dungeon from './asset/dungeon.png'
import { store } from './store.js'


class App extends Component {
  constructor () {
    super()
    this.state = store.getState()
    store.subscribe(() => this.setState(store.getState()))
  }

  render() {
    return (
      <div className="App">
        <TileSet {...this.state}/>
      </div>
    );
  }
}

export default App;

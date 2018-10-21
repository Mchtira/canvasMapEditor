import React, { Component } from 'react'
import './App.css'
import TileSet from './components/TileSet.js'
import ShowMap from './components/ShowMap.js'
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
        <ShowMap {...this.state}/>
      </div>
    );
  }
}

export default App

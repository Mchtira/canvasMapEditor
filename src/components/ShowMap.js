import React, { Component } from 'react';
import { actions, store } from '../store.js'

class ShowMap extends Component {
  componentDidMount () {
    const canvas = document.getElementById("map")
    const mapctx = canvas.getContext('2d')
    const mapSize = 20
    const mapHeight = 10 * mapSize
    const mapWidth = mapSize * mapSize
    const squareSide = mapWidth / mapSize

    canvas.width = mapWidth
    canvas.height = mapHeight

    actions.mapInfos({canvas, mapctx, mapHeight, mapWidth, squareSide, mapSize })

    document.getElementById('map').addEventListener('click', e => {
      const { selectionPosX, selectionPosY, tileSize } = store.getState().tileSet
      const image = store.getState().image
      let mouseX = e.layerX
      let mouseY = e.layerY
      if (mouseX > mapWidth) mouseX = mapWidth - 1
      if (mouseY > mapHeight) mouseY = mapHeight - 1
      if (mouseX < 0) mouseX = 1
      if (mouseY < 0) mouseY = 1

      const getIndex = (x, y) => {
        y = Math.floor(y / squareSide) * squareSide
        return Math.floor(x / squareSide) + (mapSize * y / squareSide)
      }

      const getElementFromIndex = (index) => {
        return {
          posX: index % mapSize * mapSize,
          posY: Math.floor(index / mapSize) * mapSize
        }
      }

      const index = getIndex(mouseX, mouseY)
      const { posX, posY } = getElementFromIndex(index)

      mapctx.drawImage(image, selectionPosX, selectionPosY, tileSize, tileSize,
                              posX, posY, mapSize, mapSize)
      this.drawGrid()
    })
    this.drawGrid()
  }

  drawGrid = () => {
    const { mapctx, mapSize, squareSide, mapHeight, mapWidth } = store.getState().map
    let i = 1
    mapctx.beginPath()
    mapctx.fillStyle = "rgb(0,0,0)"

    while (i < mapSize) {
      mapctx.fillRect(i * squareSide, Math.floor(i / mapSize) * squareSide,
                   1, mapHeight)
      mapctx.fillRect(Math.floor(i / mapSize) * squareSide, i * squareSide,
                   mapWidth, 1)
      i++
    }

    mapctx.closePath()
  }

  render() {
    return (
      <div className="ShowMap">
          <canvas style={{position: 'absolute', top: '0px', left:'300px'}}
            id='map'
          />
      </div>
    );
  }
}

export default ShowMap;

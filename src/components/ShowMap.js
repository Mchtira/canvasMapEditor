import React, { Component } from 'react';
import { actions, store } from '../store.js'


class ShowMap extends Component {
  componentDidMount () {
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

    const canvas = document.getElementById("map")
    const mapctx = canvas.getContext('2d')
    const mapSize = 30
    const mapHeight = mapSize * 12
    const mapWidth = mapSize * mapSize
    const squareSide = mapWidth / mapSize
    let startSelection = {}
    let endSelection = {}

    canvas.width = mapWidth
    canvas.height = mapHeight

    actions.mapInfos({canvas, mapctx, mapHeight, mapWidth, squareSide, mapSize })

    document.getElementById('map').addEventListener('mousedown', e => {
      let mouseX = e.offsetX
      let mouseY = e.offsetY
      if (mouseX > mapWidth) mouseX = mapWidth - 1
      if (mouseY > mapHeight) mouseY = mapHeight - 1
      if (mouseX < 0) mouseX = 1
      if (mouseY < 0) mouseY = 1

      const index = getIndex(mouseX, mouseY)
      startSelection = getElementFromIndex(index)
    })

    document.getElementById('map').addEventListener('mouseup', e => {
      let mouseX = e.offsetX
      let mouseY = e.offsetY
      if (mouseX > mapWidth) mouseX = mapWidth - 1
      if (mouseY > mapHeight) mouseY = mapHeight - 1
      if (mouseX < 0) mouseX = 1
      if (mouseY < 0) mouseY = 1

      const index = getIndex(mouseX, mouseY)
      endSelection = getElementFromIndex(index)
      const { selectionPosX, selectionPosY, tileSize } = store.getState().tileSet
      const image = store.getState().image
      let drawThis = []

      const getIndexs = (startSelection, endSelection) => {
        let widthIndex = getIndex(startSelection.posX, startSelection.posY)
        let widthEndIndex = getIndex(endSelection.posX, startSelection.posY)
        let heightIndex = getIndex(startSelection.posX, endSelection.posY)
        let heightEndIndex = getIndex(endSelection.posX, endSelection.posY)
        let tmp = 0

        if (widthIndex > widthEndIndex) {
          tmp = widthEndIndex
          widthEndIndex = widthIndex
          widthIndex = tmp
        }

        if (heightIndex > heightEndIndex) {
          tmp = heightEndIndex
          heightEndIndex = heightIndex
          heightIndex = tmp
        }

        if (widthIndex > heightIndex) {
          tmp = heightIndex
          heightIndex = widthIndex
          widthIndex = tmp
          tmp = heightEndIndex
          heightEndIndex = widthEndIndex
          widthEndIndex = tmp
        }

        const row = (heightIndex - widthIndex) / mapSize

        while (widthIndex <= widthEndIndex) {
          drawThis.push(widthIndex)
          for (let i = 1; i <= row; i++) {
            drawThis.push(widthIndex + (mapSize * i))
          }
          widthIndex++
        }

        drawThis
          .map(index => getElementFromIndex(index))
          .forEach(position => {
            mapctx.drawImage(image, selectionPosX, selectionPosY, tileSize, tileSize,
                             position.posX, position.posY, mapSize, mapSize)
          })
      }

      getIndexs(startSelection, endSelection)

      mapctx.drawImage(image, selectionPosX, selectionPosY, tileSize, tileSize,
                       startSelection.posX, startSelection.posY, mapSize, mapSize)
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
        <canvas style={{position: 'absolute', top: '275px', left: '0px'}} id='map'/>
      </div>
    );
  }
}

export default ShowMap;

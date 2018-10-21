import React, { Component } from 'react'
import { actions, store } from '../store.js'


class ShowMap extends Component {
  componentDidMount () {
    const getMapIndexFromXY = (x, y) => {
      y = Math.floor(y / mapTileSize) * mapTileSize
      return Math.floor(x / mapTileSize) + (mapTilesByRow * y / mapTileSize)
    }

    const getTileIndexFromXY = (x, y) => {
      const { tileWidth, tilesByRow } = store.getState().tileSet
      console.log(y, Math.floor(y / tileWidth) * tileWidth)
      y = Math.floor(y / tileWidth) * tileWidth
      return Math.floor(x / tileWidth) + (tileWidth * y / tileWidth)
    }

    const getMapXYFromIndex = (index) => {
      return {
        x: index % mapTilesByRow * mapTilesByRow,
        y: Math.floor(index / mapTilesByRow) * mapTilesByRow
      }
    }

    const getTileXYFromIndex = (index) => {
      const { tileWidth, tileHeight, tilesByRow, tilesByColumn } = store.getState().tileSet
      console.log(
        'index :', index,
        'x :', index % 28 * 16,
        'y :', Math.floor(index / 28) * 16
      )
      return {
        x: index % tilesByRow * tileWidth,
        y: Math.floor(index / tilesByRow) * tileHeight
      }
    }

    const drawGridOnMap = () => {
      const { mapctx, mapTilesByRow, mapTileSize, mapHeight, mapWidth } = store.getState().map
      let i = 1
      mapctx.beginPath()
      mapctx.fillStyle = "rgb(0,0,0)"

      while (i < mapTilesByRow) {
        mapctx.fillRect(i * mapTileSize, 0, 1, mapHeight)
        mapctx.fillRect(0, i * mapTileSize, mapWidth, 1)
        i++
      }

      mapctx.closePath()
    }

    const getMapIndexsFromXY = (startSelection, endSelection) => {
      let widthIndex = getMapIndexFromXY(startSelection.x, startSelection.y)
      let widthEndIndex = getMapIndexFromXY(endSelection.x, startSelection.y)
      let heightIndex = getMapIndexFromXY(startSelection.x, endSelection.y)
      let heightEndIndex = getMapIndexFromXY(endSelection.x, endSelection.y)
      let tmp = 0
      const selection = []

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

      const row = (heightIndex - widthIndex) / mapTilesByRow

      while (widthIndex <= widthEndIndex) {
        selection.push(widthIndex)
        for (let i = 1; i <= row; i++) {
          selection.push(widthIndex + (mapTilesByRow * i))
        }
        widthIndex++
      }

      return selection
    }

    const canvas = document.getElementById('map')
    const mapctx = canvas.getContext('2d')
    const mapTilesByRow = 16
    const mapTilesByColumn = 16
    const mapHeight = mapTilesByRow * mapTilesByRow
    const mapWidth = mapTilesByRow * mapTilesByRow
    const mapTileSize = mapWidth / mapTilesByRow
    const mapArray = []
    let startSelection = {}
    let endSelection = {}

    canvas.width = mapWidth
    canvas.height = mapHeight
    mapArray.length = mapWidth / mapTilesByRow * mapHeight / mapTilesByRow

    actions.mapInfos({ mapctx, mapHeight, mapWidth, mapTileSize, mapTilesByRow, mapArray })

    document.getElementById('map').addEventListener('mousedown', e => {
      let mouseX = e.offsetX
      let mouseY = e.offsetY
      if (mouseX > mapWidth) mouseX = mapWidth - 1
      if (mouseY > mapHeight) mouseY = mapHeight - 1
      if (mouseX < 0) mouseX = 1
      if (mouseY < 0) mouseY = 1

      const mapIndex = getMapIndexFromXY(mouseX, mouseY)
      startSelection = getMapXYFromIndex(mapIndex)
      endSelection = {}
    })

    document.getElementById('map').addEventListener('mouseup', e => {
      let mouseX = e.offsetX
      let mouseY = e.offsetY
      if (mouseX > mapWidth) mouseX = mapWidth - 1
      if (mouseY > mapHeight) mouseY = mapHeight - 1
      if (mouseX < 0) mouseX = 1
      if (mouseY < 0) mouseY = 1

      const mapIndex = getMapIndexFromXY(mouseX, mouseY)
      endSelection = getMapXYFromIndex(mapIndex)
      const { tileWidth, tileHeight, tileIndex } = store.getState().tileSet
      const image = store.getState().image
      const selectedIndexs = getMapIndexsFromXY(startSelection, endSelection)

      selectedIndexs.forEach(index => mapArray[index] = tileIndex)

      mapArray.forEach((tileIndex, mapIndex) => {
        const tilePos = getTileXYFromIndex(tileIndex)
        const mapPos = getMapXYFromIndex(mapIndex)
        mapctx.drawImage(image, tilePos.x, tilePos.y, tileWidth, tileHeight, mapPos.x, mapPos.y, mapTilesByRow, mapTilesByRow)
      })

      drawGridOnMap()
      startSelection = {}
      endSelection = {}
      actions.mapInfos({ mapArray })
    })

    drawGridOnMap()
  }

  render() {
    return (
      <div className="ShowMap">
        <canvas id='map' style={{position: 'absolute', left: '500px'}}/>
      </div>
    )
  }
}

export default ShowMap

import React, { Component } from 'react'
import { actions, store } from '../store.js'


class ShowMap extends Component {
  componentDidMount () {
    const getMapIndexFromXY = (x, y) => {
      y = Math.floor(y / mapTileSize) * mapTileSize
      return Math.floor(x / mapTileSize) + (y * mapTilesByRow / mapTileSize)
    }

    const getTileIndexFromXY = (x, y) => {
      const { tileWidth, tilesByRow } = store.getState().tileSet
      y = Math.floor(y / tileWidth) * tileWidth
      return Math.floor(x / tileWidth) + (tileWidth * y / tileWidth)
    }

    const getMapXYFromIndex = (index) => {
      return {
        x: index % mapTilesByRow * mapTileSize,
        y: Math.floor(index / mapTilesByRow) * mapTileSize
      }
    }

    const getTileXYFromIndex = (index) => {
      const { tileWidth, tileHeight, tilesByRow, tilesByColumn } = store.getState().tileSet
      return {
        x: index % tilesByRow * tileWidth,
        y: Math.floor(index / tilesByRow) * tileHeight
      }
    }

    const drawMap = () => {
      const { mapctx, mapTileSize, mapArray } = store.getState().map
      const { tileWidth, tileHeight } = store.getState().tileSet
      const image = store.getState().image

      mapArray.forEach((tileIndex, mapIndex) => {
        const tilePos = getTileXYFromIndex(tileIndex)
        const mapPos = getMapXYFromIndex(mapIndex)
        mapctx.beginPath()
        mapctx.fillStyle = "rgb(255,255,255)"

        if (tileIndex === -1) {
          mapctx.fillRect(mapPos.x, mapPos.y, mapTileSize, mapTileSize)
        } else {
          mapctx.fillRect(mapPos.x, mapPos.y, mapTileSize, mapTileSize)
          mapctx.drawImage(image, tilePos.x, tilePos.y, tileWidth, tileHeight, mapPos.x, mapPos.y, mapTileSize, mapTileSize)
        }
        mapctx.closePath()
      })
    }

    const drawGridOnMap = () => {
      const { mapctx, mapTilesByRow, mapTilesByColumn, mapTileSize, mapHeight, mapWidth } = store.getState().map
      let i = 1
      mapctx.beginPath()
      mapctx.fillStyle = "rgb(0,0,0)"
      mapctx.fillRect(0 * (mapWidth / mapTilesByRow), 0, 0.5, mapHeight)
      mapctx.fillRect(0, 0 * (mapHeight / mapTilesByColumn), mapWidth, 1)

      while (i <= mapTilesByRow) {
        mapctx.fillRect(i * (mapWidth / mapTilesByRow) - 0.5, 0, 0.5, mapHeight)
        i++
      }

      i = 1

      while (i <= mapTilesByColumn) {
        mapctx.fillRect(0, i * (mapHeight / mapTilesByColumn) - 0.5, mapWidth, 0.5)
        i++
      }

      mapctx.closePath()
    }

    const getMapIndexsFromXY = (startSelection, endSelection) => {
      let widthIndex = getMapIndexFromXY(startSelection.x, startSelection.y)
      let widthEndIndex = getMapIndexFromXY(endSelection.x, startSelection.y)
      let heightIndex = getMapIndexFromXY(startSelection.x, endSelection.y)
      let heightEndIndex = getMapIndexFromXY(endSelection.x, endSelection.y)
      const selection = []
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
    const mapTileSize = 16
    const mapTilesByRow = 20
    const mapTilesByColumn = 20
    const mapWidth = mapTilesByRow * mapTileSize
    const mapHeight = mapTilesByColumn * mapTileSize
    const mapArray = []
    let startSelection = {}
    let endSelection = {}

    canvas.width = mapWidth
    canvas.height = mapHeight
    mapArray.length = mapTilesByRow * mapTilesByColumn
    mapArray.fill(-1)

    actions.mapInfos({ mapctx, mapHeight, mapWidth, mapTileSize, mapTilesByRow, mapTilesByColumn, mapArray })

    document.getElementById('map').addEventListener('mousedown', e => {
      let mouseX = e.offsetX
      let mouseY = e.offsetY
      if (mouseX >= mapWidth) mouseX = mapWidth - 1
      if (mouseY >= mapHeight) mouseY = mapHeight - 1
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
          mapctx.fillStyle = "rgb(255,255,255)"
        if (tileIndex === -1) {
          mapctx.fillRect(mapPos.x, mapPos.y, mapTileSize, mapTileSize)
        } else {
          mapctx.fillRect(mapPos.x, mapPos.y, mapTileSize, mapTileSize)
          mapctx.drawImage(image, tilePos.x, tilePos.y, tileWidth, tileHeight, mapPos.x, mapPos.y, mapTileSize, mapTileSize)
        }
      })

      drawGridOnMap()
      startSelection = {}
      endSelection = {}
      actions.mapInfos({ mapArray })
    })
    drawMap()
    drawGridOnMap()
  }

  render() {
    return (
      <div className="ShowMap" style={{ padding: '1%'}}>
        <canvas id='map'/>
      </div>
    )
  }
}

export default ShowMap

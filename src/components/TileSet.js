import React, { Component } from 'react'
import { actions, store } from '../store.js'

class TileSet extends Component {
  componentDidMount () {
    const getTileIndexFromXY = (x, y) => {
      const {tileWidth, tilesByRow} = store.getState().tileSet
      y = Math.floor(y / tileWidth) * tileWidth
      return Math.floor(x / tileWidth) + (tilesByRow * y / tileWidth)
    }

    const drawGridOnTile = () => {
      const { tilectx, tilesByColumn, tilesByRow, tileWidth, tileHeight, canvasHeightPx, canvasWidthPx } = store.getState().tileSet
      let i = 1
      tilectx.beginPath()
      tilectx.fillStyle = "rgb(0,0,0)"
      tilectx.fillRect(0, 0, 0.5, canvasHeightPx)
      tilectx.fillRect(0, 0, canvasWidthPx, 0.5)

      while (i <= tilesByRow) {
        tilectx.fillRect(i * tileWidth - 0.5, 0, 0.5, canvasHeightPx)
        i++

      }

      i = 1

      while (i <= tilesByColumn) {
        tilectx.fillRect(0, i * tileHeight - 0.5, canvasWidthPx, 1)
        i++
      }

      tilectx.closePath()
    }

    const drawImageOnTile = () => {
      const { tilectx, canvasWidthPx, canvasHeightPx } = store.getState().tileSet
      const image = store.getState().image
      tilectx.beginPath()
      tilectx.fillStyle = "rgb(255,255,255)"
      tilectx.fillRect(0, 0, canvasWidthPx, canvasHeightPx)
      tilectx.closePath()
      tilectx.drawImage(image, 0, 0)
      image.style.display = 'none'
      drawGridOnTile()
    }

    const image = document.getElementById('img')
    const canvas = document.getElementById('tileset')
    const tilectx = canvas.getContext('2d')
    const tileWidth = 16
    const tileHeight = 16
    const tilesByColumn = 16
    const tilesByRow = 16
    const canvasWidthPx = tilesByRow * tileWidth
    const canvasHeightPx = tilesByColumn * tileHeight

    canvas.width = canvasWidthPx
    canvas.height = canvasHeightPx

    actions.tileSetInfos({ canvas, tilectx, canvasHeightPx, canvasWidthPx, tileWidth, tileHeight, tilesByColumn, tilesByRow, drawGridOnTile, drawImageOnTile })
    actions.loadImg(image)

    document.getElementById('tileset').addEventListener('click', evt => {
      const { canvasWidthPx, canvasHeightPx } = store.getState().tileSet
      let mouseX = evt.offsetX
      let mouseY = evt.offsetY
      if (mouseX >= canvasWidthPx) mouseX = canvasWidthPx - 1
      if (mouseY >= canvasHeightPx) mouseY = canvasHeightPx - 1
      if (mouseX < 0) mouseX = 1
      if (mouseY < 0) mouseY = 1

      const tileIndex = getTileIndexFromXY(mouseX, mouseY)
      actions.tileSetInfos({ tileIndex })

      drawImageOnTile()
    })

    drawImageOnTile()
  }

  handleTileSize = (e) => {
    const { canvas, tilesByRow, tilesByColumn, drawImageOnTile } = store.getState().tileSet
    const tileWidth = e.target.value
    const tileHeight = e.target.value
    const canvasWidthPx = tileWidth * tilesByRow
    const canvasHeightPx = tileHeight * tilesByColumn
    actions.tileSetInfos({ tileWidth , tileHeight, canvasWidthPx, canvasHeightPx })
    canvas.width = canvasWidthPx
    canvas.height = canvasHeightPx
    drawImageOnTile()

  }

  handleTilesByRow = (e) => {
    const { canvas, tileWidth, drawImageOnTile } = store.getState().tileSet
    const tilesByRow = e.target.value
    const canvasWidthPx = tileWidth * tilesByRow
    actions.tileSetInfos({ tilesByRow, canvasWidthPx })
    canvas.width = canvasWidthPx
    drawImageOnTile()

  }

  handleTilesByColumn = (e) => {
    const { canvas, tileHeight, drawImageOnTile } = store.getState().tileSet
    const tilesByColumn = e.target.value
    const canvasHeightPx = tileHeight * tilesByColumn
    actions.tileSetInfos({ tilesByColumn, canvasHeightPx })
    canvas.height = canvasHeightPx
    drawImageOnTile()

  }

  handleImage = (e) => {
    const { drawImageOnTile } = store.getState().tileSet
    const image = document.getElementById('img')
    if (e.target.files[0])
      actions.tileSetInfos({ source: URL.createObjectURL(e.target.files[0]) })
    actions.loadImg(image)
    drawImageOnTile()
  }

  render() {
    const { canvasWidthPx, canvasHeightPx, tileWidth, tileHeight } = store.getState().tileSet
    return (
      <div className='Tileset'
           style={{ display: 'flex', flexDirection: 'column', padding: '1%' }}>
        <img id='img'
             src={ store.getState().tileSet.source }
             alt=''/>
        <canvas id='tileset' style={{width:`${canvasWidthPx}px`}}/>
        <div style={{ height: tileHeight, width: tileWidth, background: 'red', margin: '1px', marginLeft: '0px' }}
             onClick={() => actions.tileSetInfos({ tileIndex: -1 })}/>
        <div style={{width: '256px'}}>
          <input type='file'
                 onChange={this.handleImage}/>
          <input type='number'
                 placeholder="Taille en px d'un tile"
                 onChange={this.handleTileSize}/>
          <input type='number'
                 placeholder="Nombre de tiles par ligne"
                 onChange={this.handleTilesByRow}/>
          <input type='number'
                 placeholder="Nombre de tiles par colone"
                 onChange={this.handleTilesByColumn}/>
          <div style={{ width: '256px', height: canvasHeightPx + 'px', overflow: 'scroll', overflowWrap: 'break-word' }}>
            {JSON.stringify(store.getState().map.mapArray)}
          </div>
        </div>

      </div>
    )
  }
}

export default TileSet

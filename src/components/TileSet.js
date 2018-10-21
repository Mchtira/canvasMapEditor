import React, { Component } from 'react'
import dungeon from '../asset/tileset.png'
import { actions, store } from '../store.js'

class TileSet extends Component {
  componentDidMount () {
    const getTileIndexFromXY = (x, y) => {
      y = Math.floor(y / tileWidth) * tileWidth
      return Math.floor(x / tileWidth) + (tilesByRow * y / tileWidth)
    }

    const drawGridOnTile = () => {
      const { tilectx, tilesByColumn, tilesByRow, tileWidth, tileHeight, canvasHeightPx, canvasWidthPx } = store.getState().tileSet
      let i = 1
      tilectx.beginPath()
      tilectx.fillStyle = "rgb(0,0,0)"
      tilectx.fillRect(0 * (canvasWidthPx / tilesByRow), 0, 0.5, canvasHeightPx)
      tilectx.fillRect(0, 0 * (canvasHeightPx / tilesByColumn), canvasWidthPx, 1)

      while (i <= tilesByRow) {
        tilectx.fillRect(i * (canvasWidthPx / tilesByRow) - 0.5, 0, 0.5, canvasHeightPx)
        i++

      }

      i = 1

      while (i <= tilesByColumn) {
        tilectx.fillRect(0, i * (canvasHeightPx / tilesByColumn) - 0.5, canvasWidthPx, 1)
        i++
      }

      tilectx.closePath()
    }

    const drawImageOnTile = () => {
      const { tilectx, canvasWidthPx, canvasHeightPx } = store.getState().tileSet
      const image = store.getState().image
      tilectx.drawImage(image, 0, 0)
      image.style.display = 'none'
      drawGridOnTile()
    }

    const image = document.getElementById('img')
    const canvas = document.getElementById("tileset")
    const tilectx = canvas.getContext('2d')
    const imageOriginalWidth = 352
    const imageOriginalHeight = 288
    const tileWidth = 16
    const tileHeight = 16
    const tilesByColumn = imageOriginalHeight / tileHeight
    const tilesByRow = imageOriginalWidth / tileWidth
    const canvasWidthPx = tilesByRow * tileWidth
    const canvasHeightPx = tilesByColumn * tileHeight

    canvas.width = canvasWidthPx
    canvas.height = canvasHeightPx

    actions.tileSetInfos({ tilectx, canvasHeightPx, canvasWidthPx, tileWidth, tileHeight, tilesByColumn, tilesByRow })
    actions.loadImg(image)

    document.getElementById('tileset').addEventListener('click', evt => {
      let mouseX = evt.offsetX
      let mouseY = evt.offsetY
      if (mouseX >= canvasWidthPx) mouseX = canvasWidthPx - 1
      if (mouseY >= canvasHeightPx) mouseY = canvasHeightPx - 1
      if (mouseX < 0) mouseX = 1
      if (mouseY < 0) mouseY = 1

      const tileIndex = getTileIndexFromXY(mouseX, mouseY)
      console.log('tileIndex : ', tileIndex, 'x : ', mouseX, 'y : ', mouseY)
      actions.tileSetInfos({ tileIndex })

      drawImageOnTile()
    })

    drawGridOnTile()
  }

  render() {
    return (
      <div className="tileset">
            <img style={{position: 'absolute', left: '1%', zIndex: 0}}
                 id='img'
                 src={dungeon}
                 alt=''/>
            <canvas style={{position: 'absolute', left: '1%', zIndex: 1}}
                    id="tileset"/>
      </div>
    )
  }
}

export default TileSet

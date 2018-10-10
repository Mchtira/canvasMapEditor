import React, { Component } from 'react';
import ShowMap from './ShowMap.js'
import dungeon from '../asset/dungeon.png'
import { actions, store } from '../store.js'

class TileSet extends Component {
  componentDidMount () {
    const canvas = document.getElementById("tileset")
    const tilectx = canvas.getContext('2d')
    const tileSize = 16
    const tileHeight = tileSize * tileSize
    const tileWidth = tileSize * tileSize
    const tileSquareSide = tileWidth / tileSize

    canvas.width = tileWidth
    canvas.height = tileHeight

    actions.tileSetInfos({ canvas, tilectx, tileHeight, tileWidth, tileSquareSide, tileSize })

    document.getElementById('tileset').addEventListener('click', evt => {
      let mouseX = evt.offsetX
      let mouseY = evt.offsetY
      if (mouseX > tileWidth) mouseX = tileWidth - 1
      if (mouseY > tileHeight) mouseY = tileHeight - 1
      if (mouseX < 0) mouseX = 1
      if (mouseY < 0) mouseY = 1

      const getIndex = (x, y) => {
        y = Math.floor(y / tileSquareSide) * tileSquareSide
        return Math.floor(x / tileSquareSide) + (tileSize * y / tileSquareSide)
      }

      const getElementFromIndex = (index) => {
        return {
          posX: index % tileSize * tileSize,
          posY: Math.floor(index / tileSize) * tileSize
        }
      }

      const index = getIndex(mouseX, mouseY)
      const {posX, posY} = getElementFromIndex(index)

      actions.tileSetInfos({selectionPosX: posX, selectionPosY: posY})
    })

    this.drawImage()
  }

  drawGrid = () => {
    const { tilectx, tileSize, tileSquareSide, tileHeight, tileWidth } = store.getState().tileSet
    let i = 1
    tilectx.beginPath()
    tilectx.fillStyle = "rgb(0,0,0)"

    while (i < tileSize) {
      tilectx.fillRect(i * tileSquareSide, Math.floor(i / tileSize) * tileSquareSide,
                   1, tileHeight)
      tilectx.fillRect(Math.floor(i / tileSize) * tileSquareSide, i * tileSquareSide,
                   tileWidth, 1)
      i++
    }

    tilectx.closePath()
  }

  drawImage = () => {
    const { tilectx, tileHeight, tileSize } = store.getState().tileSet
    const image = document.getElementById('img')
    actions.loadImg(image)
    tilectx.drawImage(image, 0, 0)
    this.drawGrid()
  }


  render() {
    return (
    <div>
      <div className="tileset">
          <img style={{position: 'absolute', top: '0px', left: '0px', zIndex: 0}}
               id='img'
               src={dungeon}/>
          <canvas style={{position: 'absolute', top: '0', left: '0px', zIndex: 1}}
                  id="tileset"/>
      </div>
      <ShowMap />
    </div>
    );
  }
}

export default TileSet;

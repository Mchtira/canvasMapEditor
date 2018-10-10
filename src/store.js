import {createStore} from 'redux'

const initialState = {
  map: {},
  tileSet: {},
  image: ''
}

const reducer = (state, action) => {
  if (action.type === 'MAP_INFOS') {
    return {
      ...state,
      map: {
        ...action.infos
      }
    }
  } else if (action.type === 'TILES_INFOS') {
    const tileSet = state.tileSet
    return {
      ...state,
      tileSet: {
        ...tileSet,
        ...action.infos
      }
    }
  } else if (action.type === 'LOAD_IMG') {
    return {
      ...state,
      image: action.img
    }
  }
  return state
}

export const actions = {
  tileSetInfos: (infos) => store.dispatch({ type: 'TILES_INFOS', infos }),
  mapInfos: (infos) => store.dispatch({ type: 'MAP_INFOS', infos }),
  loadImg: (img) => store.dispatch({ type: 'LOAD_IMG', img}),
}

export const store = createStore(reducer, initialState)
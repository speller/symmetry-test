import { ACTION_LOAD_DATA } from './constants'

export function loadData (from, to, prefCode, cityCode) {
  return {
    type: ACTION_LOAD_DATA,
    payload: {
      from,
      to,
      prefCode,
      cityCode
    }
  }
}
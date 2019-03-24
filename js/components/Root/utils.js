import {put} from 'redux-saga/effects'


export function putFailAction(actionType, e, data) {
  return put({
    type: actionType,
    payload: { message: e.message ? e.message : 'Unknown error' },
    data,
  })
}

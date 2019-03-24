import {put} from 'redux-saga/dist/redux-saga-effects-npm-proxy.esm'


export function putFailAction(actionType, e, data) {
  return put({
    type: actionType,
    payload: { message: e.message ? e.message : 'Unknown error' },
    data,
  })
}

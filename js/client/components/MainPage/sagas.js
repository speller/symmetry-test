import { call, put, takeLatest, delay } from 'redux-saga/dist/redux-saga-effects-npm-proxy.esm'
import { putFailAction } from '../Root/utils'
import {
  ACTION_SEND_MESSAGE,
  ACTION_SEND_MESSAGE_FAIL,
  ACTION_SEND_MESSAGE_SUCCESS,
} from './constants'

function * sendMessageWorker(action) {
  try {
    yield call(
      [action.ws, 'sendMessage'],
      JSON.stringify(action.payload)
    )
    yield delay(300)
    yield put({
      type: ACTION_SEND_MESSAGE_SUCCESS,
    })
  } catch (e) {
    yield putFailAction(ACTION_SEND_MESSAGE_FAIL, e)
  }
}


export default [
  function * () {
    yield takeLatest(ACTION_SEND_MESSAGE, sendMessageWorker)
  },
]
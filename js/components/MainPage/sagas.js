import { call, put, takeLatest } from 'redux-saga/effects'
import axios from 'axios'
import { putFailAction } from '../Root/utils'
import { ACTION_LOAD_DATA, ACTION_LOAD_DATA_FAIL, ACTION_LOAD_DATA_SUCCESS } from './constants'
import { BASE_URL } from '../Root/constants'

function * getDataWorker(action) {
  try {
    const payload = action.payload
    const response = yield call(
      axios,
      {
        url: '/PropertyTransaction/GetTransactions',
        baseURL: BASE_URL,
        method: 'post',
        withCredentials: true,
        data: {...action.payload},
      }
    )
    const result = response.data
    if (result && result.success) {
      yield put({
        type: ACTION_LOAD_DATA_SUCCESS,
        payload: result.data,
      })
    } else {
      yield putFailAction(ACTION_LOAD_DATA_FAIL, {message: result.reason ?? 'unknown error'})
    }
  } catch (e) {
    yield putFailAction(ACTION_LOAD_DATA_FAIL, e)
  }
}


export default [
  function * () {
    yield takeLatest(ACTION_LOAD_DATA, getDataWorker)
  },
]
import { delay, call, put, takeLatest } from 'redux-saga/effects'
import {
  ACTION_LOGIN,
  ACTION_LOGIN_FAIL,
  ACTION_LOGIN_SUCCESS,
  ACTION_LOGOUT,
  ACTION_LOGOUT_SUCCESS,
} from './constants'
import axios from 'axios'
import { putFailAction } from './utils'
import config from '../../../config'

function * loginWorker(action) {
  try {
    const response = yield call(
      axios,
      {
        url: '/login',
        baseURL: config.client.api_url,
        method: 'post',
        data: {...action.payload},
        withCredentials: true,
      }
    )
    const result = response.data
    if (result && result.success) {
      yield put({
        type: ACTION_LOGIN_SUCCESS,
        payload: result.user,
      })
    } else {
      yield putFailAction(ACTION_LOGIN_FAIL, {message: result.reason ?? 'unknown error'})
    }
  } catch (e) {
    yield putFailAction(ACTION_LOGIN_FAIL, e)
  }
}


function * logoutWorker(action) {
  // Add delay to mimic like API call
  yield delay(500)
  yield put({
    type: ACTION_LOGOUT_SUCCESS,
  })
}


export default [
  function * () {
    yield takeLatest(ACTION_LOGIN, loginWorker)
  },
  function * () {
    yield takeLatest(ACTION_LOGOUT, logoutWorker)
  },
]
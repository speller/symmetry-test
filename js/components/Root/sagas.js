import { delay, call, put, takeLatest } from 'redux-saga/effects'
import {
  ACTION_LOGIN,
  ACTION_LOGIN_FAIL,
  ACTION_LOGIN_SUCCESS,
  ACTION_LOGOUT,
  ACTION_LOGOUT_FAIL,
  ACTION_LOGOUT_SUCCESS,
  BASE_URL,
} from './constants'
import { putFailAction } from './utils'
import config from '../../config'


function * loginWorker(action) {
  const name = action.payload.name
  const password = action.payload.password

  let user
  const users = config.users

  for (const record of users) {
    if (record.name === name && record.password === password) {
      user = {...record}
    }
  }

  // Add delay to mimic like API call
  yield delay(500)

  if (user) {
    yield put({
      type: ACTION_LOGIN_SUCCESS,
      payload: user.name,
    })
  } else {
    yield putFailAction(ACTION_LOGIN_FAIL, { message: 'User not found' })
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
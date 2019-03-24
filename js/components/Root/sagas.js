import { all, call, put, takeLatest } from 'redux-saga/effects'
import {
  ACTION_CHECK_LOGIN,
  ACTION_CHECK_LOGIN_FAIL,
  ACTION_CHECK_LOGIN_SUCCESS,
  ACTION_LOGIN,
  ACTION_LOGIN_FAIL,
  ACTION_LOGIN_SUCCESS,
  ACTION_LOGOUT,
  ACTION_LOGOUT_FAIL,
  ACTION_LOGOUT_SUCCESS,
  ACTION_REGISTER,
  ACTION_REGISTER_FAIL,
  ACTION_REGISTER_SUCCESS,
  ACTION_SET_PAGE,
  BASE_URL,
  PAGE_LOGIN
} from './constants'
import axios from 'axios'
import { putFailAction } from './utils'

function * loginWorker(action) {
  try {
    const response = yield call(
      axios,
      {
        url: '/Authentication/Login',
        baseURL: BASE_URL,
        method: 'post',
        data: {...action.payload},
        withCredentials: true,
      }
    )
    const result = response.data
    if (result && result.success) {
      yield put({
        type: ACTION_LOGIN_SUCCESS,
        payload: result.email,
      })
    } else {
      yield putFailAction(ACTION_LOGIN_FAIL, {message: result.reason ?? 'unknown error'})
    }
  } catch (e) {
    yield putFailAction(ACTION_LOGIN_FAIL, e)
  }
}


function * registerWorker(action) {
  try {
    const response = yield call(
      axios,
      {
        url: '/Authentication/Register',
        baseURL: BASE_URL,
        method: 'post',
        data: {...action.payload},
        withCredentials: true,
      }
    )
    const result = response.data
    if (result && result.success) {
      yield put({
        type: ACTION_REGISTER_SUCCESS,
        payload: result.email,
      })
    } else {
      yield putFailAction(ACTION_REGISTER_FAIL, {message: result.reason ?? 'unknown error'})
    }
  } catch (e) {
    yield putFailAction(ACTION_REGISTER_FAIL, e)
  }
}


function * logoutWorker(action) {
  try {
    const response = yield call(
      axios,
      {
        url: '/Authentication/Logout',
        baseURL: BASE_URL,
        method: 'post',
        withCredentials: true,
      }
    )
    const result = response.data
    if (result && result.success) {
      yield put({
        type: ACTION_LOGOUT_SUCCESS,
        payload: result.email,
      })
    } else {
      yield putFailAction(ACTION_LOGIN_FAIL, {message: result.reason ?? 'unknown error'})
    }
  } catch (e) {
    yield putFailAction(ACTION_LOGOUT_FAIL, e)
  }
}


function * checkLoginWorker(action) {
  try {
    const response = yield call(
      axios,
      {
        url: '/Authentication/GetLoginStatus',
        baseURL: BASE_URL,
        method: 'get',
        withCredentials: true,
      }
    )
    const result = response.data
    if (result && result.success) {
      yield put({
        type: ACTION_CHECK_LOGIN_SUCCESS,
        payload: result.email,
      })
    } else {
      yield all([
        putFailAction(ACTION_CHECK_LOGIN_FAIL, {message: result.reason ?? 'unknown error'}),
        put({
          type: ACTION_SET_PAGE,
          payload: PAGE_LOGIN,
        }),
      ])
    }
  } catch (e) {
    yield putFailAction(ACTION_CHECK_LOGIN_FAIL, e)
  }
}



export default [
  function * () {
    yield takeLatest(ACTION_LOGIN, loginWorker)
  },
  function * () {
    yield takeLatest(ACTION_REGISTER, registerWorker)
  },
  function * () {
    yield takeLatest(ACTION_LOGOUT, logoutWorker)
  },
  function * () {
    yield takeLatest(ACTION_CHECK_LOGIN, checkLoginWorker)
  },
]
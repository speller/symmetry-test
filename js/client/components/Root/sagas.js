import { delay, call, put, take, takeLatest, takeEvery } from 'redux-saga/effects'
import { putFailAction } from './utils'
import {
  ACTION_DELETE_MESSAGE,
  ACTION_DELETE_MESSAGE_FAIL,
  ACTION_DELETE_MESSAGE_SUCCESS,
  ACTION_DISPATCH_MESSAGE,
  ACTION_INCOMING_MESSAGE,
  ACTION_LOGIN,
  ACTION_LOGIN_FAIL,
  ACTION_LOGIN_SUCCESS,
  ACTION_LOGOUT,
  ACTION_LOGOUT_FAIL,
  ACTION_LOGOUT_SUCCESS,
  ACTION_SEND_EMAIL,
  ACTION_SEND_EMAIL_FAIL,
  ACTION_SEND_EMAIL_SUCCESS,
  ACTION_SEND_MESSAGE,
  ACTION_SEND_MESSAGE_FAIL,
  ACTION_SEND_MESSAGE_SUCCESS,
} from './constants'
import {
  MESSAGE_TYPE_DELETE_MESSAGE,
  MESSAGE_TYPE_DELETE_MESSAGE_FAIL,
  MESSAGE_TYPE_DELETE_MESSAGE_SUCCESS,
  MESSAGE_TYPE_LOGIN,
  MESSAGE_TYPE_LOGIN_FAIL,
  MESSAGE_TYPE_LOGIN_SUCCESS,
  MESSAGE_TYPE_LOGOUT,
  MESSAGE_TYPE_LOGOUT_FAIL,
  MESSAGE_TYPE_LOGOUT_SUCCESS,
  MESSAGE_TYPE_SEND_EMAIL,
  MESSAGE_TYPE_SEND_EMAIL_FAIL,
  MESSAGE_TYPE_SEND_EMAIL_SUCCESS,
  MESSAGE_TYPE_TEXT,
} from '../../../common/constants'


function * sendMessageWorker(action) {
  try {
    yield call(
      [action.ws, 'sendMessage'],
      JSON.stringify({
        type: MESSAGE_TYPE_TEXT,
        ...action.payload,
      })
    )
    yield delay(300)
    yield put({
      type: ACTION_SEND_MESSAGE_SUCCESS,
    })
  } catch (e) {
    yield putFailAction(ACTION_SEND_MESSAGE_FAIL, e)
  }
}


function * deleteMessageWorker(action) {
  try {
    yield call(
      [action.ws, 'sendMessage'],
      JSON.stringify({
        type: MESSAGE_TYPE_DELETE_MESSAGE,
        ...action.payload,
      })
    )

    const responseAction = yield take(
      action =>
        action.type === ACTION_DISPATCH_MESSAGE &&
        (action.payload.type === MESSAGE_TYPE_DELETE_MESSAGE_SUCCESS || action.payload.type === MESSAGE_TYPE_DELETE_MESSAGE_FAIL)
    )

    if (responseAction.payload.type === MESSAGE_TYPE_DELETE_MESSAGE_SUCCESS) {
      yield put({
        type: ACTION_DELETE_MESSAGE_SUCCESS,
        payload: responseAction.payload,
        context: responseAction.context,
      })
    } else {
      yield putFailAction(ACTION_DELETE_MESSAGE_FAIL, responseAction.payload)
    }
  } catch (e) {
    yield putFailAction(ACTION_DELETE_MESSAGE_FAIL, e)
  }
}

// For cases when someone deletes message, not current user
function * broadcastDeleteMessageWorker(action) {
  yield put({
    type: ACTION_DELETE_MESSAGE_SUCCESS,
    payload: action.payload,
    context: action.context,
  })
}


function * loginWorker(action) {
  try {
    yield call(
      [action.ws, 'sendMessage'],
      JSON.stringify({
        type: MESSAGE_TYPE_LOGIN,
        ...action.payload,
      })
    )
    const responseAction = yield take(
      action =>
        action.type === ACTION_DISPATCH_MESSAGE &&
        (action.payload.type === MESSAGE_TYPE_LOGIN_SUCCESS || action.payload.type === MESSAGE_TYPE_LOGIN_FAIL)
    )

    if (responseAction.payload.type === MESSAGE_TYPE_LOGIN_SUCCESS) {
      yield put({
        type: ACTION_LOGIN_SUCCESS,
        payload: responseAction.payload,
        context: responseAction.context,
      })
    } else {
      yield putFailAction(ACTION_LOGIN_FAIL, responseAction.payload)
    }

  } catch (e) {
    yield putFailAction(ACTION_LOGIN_FAIL, e)
  }
}


function * logoutWorker(action) {
  try {
    yield call(
      [action.ws, 'sendMessage'],
      JSON.stringify({
        type: MESSAGE_TYPE_LOGOUT,
        ...action.payload,
      })
    )
    const responseAction = yield take(
      action =>
        action.type === ACTION_DISPATCH_MESSAGE &&
        (action.payload.type === MESSAGE_TYPE_LOGOUT_SUCCESS || action.payload.type === MESSAGE_TYPE_LOGOUT_FAIL)
    )

    if (responseAction.payload.type === MESSAGE_TYPE_LOGOUT_SUCCESS) {
      yield put({
        type: ACTION_LOGOUT_SUCCESS,
        context: responseAction.context,
      })
    } else {
      yield putFailAction(ACTION_LOGOUT_FAIL, responseAction.payload)
    }

  } catch (e) {
    yield putFailAction(ACTION_LOGOUT_FAIL, e)
  }
}


function * incomingMessageWorker(action) {
  yield put({
    type: ACTION_INCOMING_MESSAGE,
    payload: action.payload,
    context: action.context,
  })
}


function * sendMailWorker(action) {
  try {
    yield call(
      [action.ws, 'sendMessage'],
      JSON.stringify({
        type: MESSAGE_TYPE_SEND_EMAIL,
        ...action.payload,
      })
    )
    const responseAction = yield take(
      action =>
        action.type === ACTION_DISPATCH_MESSAGE &&
        (action.payload.type === MESSAGE_TYPE_SEND_EMAIL_SUCCESS || action.payload.type === MESSAGE_TYPE_SEND_EMAIL_FAIL)
    )

    if (responseAction.payload.type === MESSAGE_TYPE_SEND_EMAIL_SUCCESS) {
      yield put({
        type: ACTION_SEND_EMAIL_SUCCESS,
      })
    } else {
      yield putFailAction(ACTION_SEND_EMAIL_FAIL, responseAction.payload)
    }

  } catch (e) {
    yield putFailAction(ACTION_SEND_EMAIL_FAIL, e)
  }
}


export default [
  function * () {
    yield takeLatest(ACTION_LOGIN, loginWorker)
  },
  function * () {
    yield takeLatest(ACTION_LOGOUT, logoutWorker)
  },
  function * () {
    yield takeLatest(ACTION_SEND_MESSAGE, sendMessageWorker)
  },
  function * () {
    yield takeLatest(ACTION_DELETE_MESSAGE, deleteMessageWorker)
  },
  function * () {
    yield takeLatest(ACTION_SEND_EMAIL, sendMailWorker)
  },
  function * () {
    yield takeEvery(
      action =>
        action.type === ACTION_DISPATCH_MESSAGE &&
        action.payload.type === MESSAGE_TYPE_TEXT,
      incomingMessageWorker
    )
  },
  function * () {
    yield takeEvery(
      action =>
        action.type === ACTION_DISPATCH_MESSAGE &&
        action.payload.type === MESSAGE_TYPE_DELETE_MESSAGE_SUCCESS,
      broadcastDeleteMessageWorker
    )
  },
]
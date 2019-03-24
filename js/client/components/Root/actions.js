import {
  ACTION_DISPATCH_MESSAGE, ACTION_LOGIN,
  ACTION_LOGOUT, ACTION_SEND_MESSAGE,
  ACTION_SET_PAGE,
  PAGE_LOGIN,
  PAGE_MAIN,
} from './constants'


export function dispatchWsMessage(message, context) {
  return {
    type: ACTION_DISPATCH_MESSAGE,
    payload: message,
    context,
  }
}

export function startLogin(login, password, context, ws) {
  return {
    type: ACTION_LOGIN,
    payload: {
      login,
      password,
    },
    context,
    ws,
  }
}

export function sendMessage(text, userId, ws) {
  return {
    type: ACTION_SEND_MESSAGE,
    payload: {
      userId,
      text,
    },
    ws,
  }
}
export function showLoginPage() {
  return { 
    type: ACTION_SET_PAGE,
    payload: PAGE_LOGIN,
  }
}

export function showMainPage() {
  return {
    type: ACTION_SET_PAGE,
    payload: PAGE_MAIN,
  }
}

export function logout() {
  return {
    type: ACTION_LOGOUT,
  }
}
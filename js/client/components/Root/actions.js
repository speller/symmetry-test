import {
  ACTION_CLEAR_CHAT,
  ACTION_DELETE_MESSAGE,
  ACTION_DISPATCH_MESSAGE,
  ACTION_LOGIN,
  ACTION_LOGOUT,
  ACTION_LOGOUT_SUCCESS,
  ACTION_SEND_EMAIL,
  ACTION_SEND_MESSAGE,
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

export function sendMessage(text, ws) {
  return {
    type: ACTION_SEND_MESSAGE,
    payload: {
      text,
    },
    ws,
  }
}

export function deleteMessage(messageId, ws) {
  return {
    type: ACTION_DELETE_MESSAGE,
    payload: {
      messageId,
    },
    ws,
  }
}

export function sendEmail(email, messageIds, ws) {
  return {
    type: ACTION_SEND_EMAIL,
    payload: {
      email,
      messageIds,
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

export function logout(ws) {
  return {
    type: ACTION_LOGOUT,
    ws,
  }
}

export function disconnected(context) {
  return {
    type: ACTION_LOGOUT_SUCCESS,
    context,
  }
}

export function clearChat(context) {
  return {
    type: ACTION_CLEAR_CHAT,
    context,
  }
}
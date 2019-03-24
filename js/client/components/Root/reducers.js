import {
  ACTION_CLEAR_CHAT,
  ACTION_DELETE_MESSAGE_SUCCESS,
  ACTION_INCOMING_MESSAGE,
  ACTION_LOGIN_FAIL,
  ACTION_LOGIN_SUCCESS,
  ACTION_LOGOUT,
  ACTION_LOGOUT_FAIL,
  ACTION_LOGOUT_SUCCESS,
  ACTION_SET_PAGE,
} from './constants'
import ChatContext from './chat-context'

export default function(state = {}, action) {
  switch (action.type) {
  case ACTION_INCOMING_MESSAGE:
    const context = ChatContext.clone(action.context)
    context.messages.push(action.payload)
    return {
      ...state,
      chatContext: context,
    }

  case ACTION_SET_PAGE:
    return {
      ...state,
      page: action.payload,
    }
    
  case ACTION_LOGIN_SUCCESS:
    const context1 = ChatContext.clone(action.context)
    context1.user = action.payload.user
    context1.messages = []
    return {
      ...state,
      chatContext: context1,
    }

  case ACTION_LOGIN_FAIL:
    alert('Login failed: ' + action.payload.message)
    return {
      ...state,
    }

  case ACTION_LOGOUT:
    return {
      ...state,
      logoutInProgress: true,
    }

  case ACTION_LOGOUT_SUCCESS:
    const context2 = ChatContext.clone(action.context)
    context2.user = null
    context2.messages = []
    return {
      ...state,
      logoutInProgress: false,
      chatContext: context2,
    }

  case ACTION_LOGOUT_FAIL:
    alert('Logout failed: ' + action.payload.message)
    return {
      ...state,
      logoutInProgress: false,
    }

  case ACTION_DELETE_MESSAGE_SUCCESS:
    const context3 = ChatContext.clone(action.context)
    context3.messages = context3.messages.filter(msg => msg.messageId !== action.payload.messageId)
    return {
      ...state,
      chatContext: context3,
    }

  case ACTION_CLEAR_CHAT:
    const context4 = ChatContext.clone(action.context)
    context4.messages = []
    return {
      ...state,
      chatContext: context4,
    }

  default:
    return {...state}
  }
}
import {
  ACTION_CHECK_LOGIN,
  ACTION_CHECK_LOGIN_FAIL,
  ACTION_CHECK_LOGIN_SUCCESS,
  ACTION_LOGIN_FAIL,
  ACTION_LOGIN_SUCCESS,
  ACTION_LOGOUT,
  ACTION_LOGOUT_FAIL,
  ACTION_LOGOUT_SUCCESS,
  ACTION_SET_PAGE
} from './constants'

export default function(state = {}, action) {
  switch (action.type) {
    case ACTION_SET_PAGE:
      return {
        ...state,
        page: action.payload,
      }
    
    case ACTION_LOGIN_SUCCESS:
      return {
        ...state,
        currentLogin: action.payload,
        shouldCheckLogin: false,
        loginCheckInProgress: false,
      }

    case ACTION_LOGIN_FAIL:
      alert("Logout failed: " + action.payload.message)
      return {
        ...state,
        shouldCheckLogin: false,
        loginCheckInProgress: false,
      }

    case ACTION_LOGOUT:
      return {
        ...state,
        logoutInProgress: true,
      }

    case ACTION_LOGOUT_SUCCESS:
      return {
        ...state,
        logoutInProgress: false,
        currentLogin: false,
      }

    case ACTION_LOGOUT_FAIL:
      alert("Logout failed: " + action.payload.message)
      return {
        ...state,
        logoutInProgress: false,
      }

    case ACTION_CHECK_LOGIN:
      return {
        ...state,
        shouldCheckLogin: false,
        loginCheckInProgress: true,
      }

    case ACTION_CHECK_LOGIN_SUCCESS:
      return {
        ...state,
        shouldCheckLogin: false,
        loginCheckInProgress: false,
        currentLogin: action.payload,
        initialized: true,
      }

    case ACTION_CHECK_LOGIN_FAIL:
      return {
        ...state,
        shouldCheckLogin: false,
        loginCheckInProgress: false,
        initialized: true,
      }

    default:
      return {...state}
  }
}
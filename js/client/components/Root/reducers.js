import {
  ACTION_LOGIN_FAIL,
  ACTION_LOGIN_SUCCESS,
  ACTION_LOGOUT,
  ACTION_LOGOUT_FAIL,
  ACTION_LOGOUT_SUCCESS,
  ACTION_SET_PAGE,
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
      currentUser: action.payload,
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
    return {
      ...state,
      logoutInProgress: false,
      currentUser: null,
    }

  case ACTION_LOGOUT_FAIL:
    alert('Logout failed: ' + action.payload.message)
    return {
      ...state,
      logoutInProgress: false,
    }

  default:
    return {...state}
  }
}
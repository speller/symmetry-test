import {
  ACTION_LOGIN,
  ACTION_LOGIN_FAIL,
  ACTION_LOGIN_SUCCESS,
  ACTION_REGISTER,
  ACTION_REGISTER_FAIL,
  ACTION_REGISTER_SUCCESS,
} from '../Root/constants'

export default function(state = {}, action) {
  let newState = {}
  switch (action.type) {
  case ACTION_LOGIN:
    newState = {
      inProgress: true,
      loggedIn: false,
    }
    break
      
  case ACTION_LOGIN_SUCCESS:
    newState = {
      inProgress: false,
      loggedIn: true,
    }
    break
      
  case ACTION_LOGIN_FAIL:
    newState = {
      inProgress: false,
    }
    alert(`Login error: ${action.payload.message}`)
    break
      
  case ACTION_REGISTER:
    newState = {
      inProgress: true,
      loggedIn: false,
    }
    break
      
  case ACTION_REGISTER_SUCCESS:
    newState = {
      inProgress: false,
      loggedIn: true,
    }
    break
      
  case ACTION_REGISTER_FAIL:
    newState = {
      inProgress: false,
    }
    alert(`Register error: ${action.payload.message}`)
    break
  }
  
  return {
    ...state,
    ...newState,
  }
}
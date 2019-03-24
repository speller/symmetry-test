import {
  ACTION_LOGIN,
  ACTION_LOGIN_FAIL,
  ACTION_LOGIN_SUCCESS,
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
    break
  }

  return {
    ...state,
    ...newState,
  }
}
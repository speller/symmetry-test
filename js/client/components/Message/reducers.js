import {
  ACTION_DELETE_MESSAGE,
  ACTION_DELETE_MESSAGE_FAIL,
  ACTION_DELETE_MESSAGE_SUCCESS,
} from '../Root/constants'

export default function(state = {}, action) {
  switch (action.type) {
  case ACTION_DELETE_MESSAGE:
    return {
      ...state,
      deleteInProgress: true,
    }

  case ACTION_DELETE_MESSAGE_SUCCESS:
    return {
      ...state,
      deleteInProgress: false,
    }

  case ACTION_DELETE_MESSAGE_FAIL:
    alert('Delete message failed: ' + action.payload.message)
    return {
      ...state,
      deleteInProgress: false,
    }

  default:
    return {...state}
  }
}
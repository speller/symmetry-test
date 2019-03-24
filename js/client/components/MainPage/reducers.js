import {
  ACTION_SEND_MESSAGE,
  ACTION_SEND_MESSAGE_FAIL,
  ACTION_SEND_MESSAGE_SUCCESS,
} from './constants'

export default function(state = {}, action) {
  switch (action.type) {
  case ACTION_SEND_MESSAGE: {
    return {
      inProgress: true,
      messageSentSuccess: false,
    }
  }
    
  case ACTION_SEND_MESSAGE_SUCCESS: {
    return {
      inProgress: false,
      messageSentSuccess: true,
    }
  }

  case ACTION_SEND_MESSAGE_FAIL: {
    alert('Send message fail: ' + action.payload.message)
    return {
      inProgress: false,
    }
  }

  default:
    return {...state}
  }
}
import { ACTION_SEND_MESSAGE } from './constants'
import { MESSAGE_TYPE_TEXT } from '../../../common/constants'

export function sendMessage(text, userId, ws) {
  return {
    type: ACTION_SEND_MESSAGE,
    payload: {
      type: MESSAGE_TYPE_TEXT,
      userId,
      text,
    },
    ws,
  }
}
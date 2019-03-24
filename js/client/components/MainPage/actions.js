import { ACTION_SEND_MESSAGE } from './constants'

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
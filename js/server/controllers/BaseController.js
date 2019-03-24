import { MESSAGE_TYPE_TEXT } from '../../common/constants'

class BaseController {
  sendError(server, connectionId, type, message) {
    server.sendMessage(
      connectionId,
      {
        type,
        message,
      }
    )
  }

  sendMessageAsSystem(server, connectionId, text) {
    server.sendMessage(
      connectionId,
      {
        type: MESSAGE_TYPE_TEXT,
        userId: -1,
        userName: 'System',
        text,
      }
    )

  }
}

export default BaseController
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
        time: new Date(),
        text,
      }
    )
  }

  sendBroadcastMessageAsSystem(server, text, excludedConnections = []) {
    server.sendBroadcastMessage(
      {
        type: MESSAGE_TYPE_TEXT,
        userId: -1,
        userName: 'System',
        time: new Date(),
        text,
      },
      excludedConnections
    )
  }
}

export default BaseController
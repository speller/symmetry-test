/**
 * Controller for chat message commands
 */
import { MESSAGE_TYPE_TEXT } from '../../common/constants'

class MessageController {
  _clearRefOnExit = true
  messageProvider
  userProvider

  constructor(messageProvider, userProvider) {
    this.userProvider = userProvider
    this.messageProvider = messageProvider
  }

  messageAction(request) {
    const { data, connectionId, server } = request
    server.sendMessage(
      connectionId,
      {
        type: MESSAGE_TYPE_TEXT,
        userId: data.userId,
        userName: 'John Doe',
        text: data.text,
      }
    )
  }
}

export default MessageController
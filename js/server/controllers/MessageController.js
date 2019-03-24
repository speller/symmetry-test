import { MESSAGE_TYPE_TEXT } from '../../common/constants'
import BaseController from './BaseController'

/**
 * Controller for chat message commands
 */
class MessageController extends BaseController {
  _clearRefOnExit = true
  messageProvider
  userProvider

  constructor(messageProvider, userProvider) {
    super()
    this.userProvider = userProvider
    this.messageProvider = messageProvider
  }

  /**
   * Action executed on message received from client
   * @param request
   * @returns {Promise<void>}
   */
  async messageAction(request) {
    const { data, connectionId, server } = request
    const userId = server.getConnectionUserId(connectionId)
    const user = await this.userProvider.findUserById(userId)
    if (user) {
      server.sendBroadcastMessage(
        {
          type: MESSAGE_TYPE_TEXT,
          userId: user.id,
          userName: user.name,
          text: data.text,
        }
      )
    }
  }
}

export default MessageController
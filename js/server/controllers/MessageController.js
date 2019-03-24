import { MESSAGE_TYPE_TEXT } from '../../common/constants'
import BaseController from './BaseController'

/**
 * Controller for chat message commands
 */
class MessageController extends BaseController {
  messageProvider
  userProvider

  /**
   * @param messageProvider
   * @param userProvider
   */
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
    const user = await this.userProvider.findUserById(server.getConnectionUserId(connectionId))
    if (user) {
      const msgId = await this.messageProvider.addMessage(
        user.id,
        data.text,
        new Date()
      )
      const msg = await this.messageProvider.findMessageById(msgId)
      server.sendBroadcastMessage(
        {
          type: MESSAGE_TYPE_TEXT,
          userId: user.id,
          userName: user.name,
          text: msg.text,
          time: msg.timestamp,
          messageId: msg.id,
        }
      )
    }
  }
}

export default MessageController
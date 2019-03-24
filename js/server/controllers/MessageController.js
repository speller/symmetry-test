import {
  MESSAGE_TYPE_DELETE_MESSAGE_FAIL,
  MESSAGE_TYPE_DELETE_MESSAGE_SUCCESS,
  MESSAGE_TYPE_TEXT,
} from '../../common/constants'
import BaseController from './BaseController'
import { getColorByUserId } from '../utils'

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
          userColor: getColorByUserId(user.id),
        }
      )
    }
  }

  /**
   * Delete a message action handler
   * @param request
   * @returns {Promise<void>}
   */
  async deleteMessageAction(request) {
    const { data, connectionId, server } = request
    const sendErrorMessage = text => {
      this.sendError(
        server,
        connectionId,
        MESSAGE_TYPE_DELETE_MESSAGE_FAIL,
        text
      )
    }

    const user = await this.userProvider.findUserById(server.getConnectionUserId(connectionId))
    if (!user) {
      sendErrorMessage('User not found')
      return
    }

    const msg = await this.messageProvider.findMessageById(data.messageId)
    if (!msg) {
      sendErrorMessage('Message not found')
      return
    }

    const isAdmin = Boolean(user.is_admin)
    if (!isAdmin && msg.user_id !== user.id) {
      sendErrorMessage('Permission denied')
      return
    }

    try {
      await this.messageProvider.markMessageDeleted(msg.id, user.id)
    } catch (e) {
      sendErrorMessage(e.message)
    }

    server.sendBroadcastMessage(
      {
        type: MESSAGE_TYPE_DELETE_MESSAGE_SUCCESS,
        messageId: msg.id,
      }
    )
  }
}

export default MessageController
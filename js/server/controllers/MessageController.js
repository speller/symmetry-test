import {
  MESSAGE_TYPE_DELETE_MESSAGE_FAIL,
  MESSAGE_TYPE_DELETE_MESSAGE_SUCCESS,
  MESSAGE_TYPE_TEXT,
} from '../../common/constants'
import BaseController from './BaseController'
import { getColorByUserId } from '../utils'
import { CHAT_COMMAND_DIRECT_MESSAGE } from '../constants'

const chatCommands = [
  CHAT_COMMAND_DIRECT_MESSAGE,
]

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
      this.processCommand(request, user)
    }
  }

  processCommand(request, user) {
    const { data } = request
    const text = data.text
    const curCommand = chatCommands.filter(cmd => text.match(new RegExp(`\^\/${cmd} `)))[0] ?? null
    console.log(`message command: ${curCommand}`)
    switch (curCommand) {
    case CHAT_COMMAND_DIRECT_MESSAGE: return this.processDirectMessage(request, user)
    default: return this.processDefaultCommand(request, user)
    }
  }

  async processDefaultCommand(request, user) {
    const { data, server } = request
    const msgId = await this.messageProvider.addMessage(
      user.id,
      data.text,
      new Date(),
      null
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

  async processDirectMessage(request, user) {
    const { data, connectionId, server } = request
    const text = data.text

    const re = new RegExp(`^\\/${CHAT_COMMAND_DIRECT_MESSAGE} ([\\w]+) (.+)$`)
    const result = re.exec(text)
    if (!result) {
      console.log('dm command failed to parse message')
      return
    }

    const recipientName = result[1]
    const msgText = result[2]
    const recipient = await this.userProvider.findUserByLogin(recipientName)

    if (!recipient) {
      console.log(`recipient ${recipientName} not found`)
      return
    }

    const msgId = await this.messageProvider.addMessage(
      user.id,
      msgText,
      new Date(),
      recipient.id
    )
    const msg = await this.messageProvider.findMessageById(msgId)
    const msgObject = {
      type: MESSAGE_TYPE_TEXT,
      userId: user.id,
      userName: user.name,
      text: msg.text,
      time: msg.timestamp,
      messageId: msg.id,
      userColor: getColorByUserId(user.id),
      isDirectMessage: msg.recipient_user_id > 0,
      recipientId: msg.recipient_user_id,
      recipientName: msg.recipient_name,
      recipientUserColor: getColorByUserId(msg.recipient_user_id),
    }
    server.sendMessage(
      connectionId,
      msgObject
    )
    const recipientConnections = server.getConnectionByUserId(recipient.id)
    for (const i in recipientConnections) {
      server.sendMessage(
        recipientConnections[i],
        msgObject
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
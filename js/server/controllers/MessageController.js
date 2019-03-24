import {
  MESSAGE_TYPE_DELETE_MESSAGE_FAIL,
  MESSAGE_TYPE_DELETE_MESSAGE_SUCCESS,
  MESSAGE_TYPE_TEXT,
} from '../../common/constants'
import BaseController from './BaseController'
import { getColorByUserId } from '../utils'
import { CHAT_COMMAND_DIRECT_MESSAGE, CHAT_COMMAND_HISTORY } from '../constants'

const chatCommands = [
  CHAT_COMMAND_DIRECT_MESSAGE,
  CHAT_COMMAND_HISTORY,
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
    const { connectionId, server } = request
    const user = await this.userProvider.findUserById(server.getConnectionUserId(connectionId))
    if (user) {
      this.processCommand(request, user)
    }
  }

  processCommand(request, user) {
    const { data } = request
    const text = data.text
    const commandsPattern = chatCommands.join('|')
    const matches = RegExp(`^/(${commandsPattern})( |$)`).exec(text)
    const curCommand = matches ? matches[1] : null
    console.log(`message command: ${curCommand}`)
    switch (curCommand) {
    case CHAT_COMMAND_DIRECT_MESSAGE: return this.processDirectMessage(request, user)
    case CHAT_COMMAND_HISTORY: return this.processHistory(request, user)
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

  async processHistory(request, user) {
    const { data, connectionId, server } = request
    const text = data.text

    const re = new RegExp(`^\\/${CHAT_COMMAND_HISTORY}( \\d+|)( \\d+|)$`)
    const result = re.exec(text)
    if (!result) {
      console.log('history command failed to parse message')
      return
    }

    console.log(`parsed values: ${result[1]}, ${result[2]}`)
    const startIdx = result[1] ? Number(result[1].trim()) : -1
    const endIdx = result[2] ? Number(result[2].trim()) : -1
    let messages

    if (startIdx < 0) {
      console.log(`fetching last 20`)
      messages = await this.messageProvider.getLastMessages(20, user.id)
    } else {
      console.log(`fetching: ${startIdx}, ${endIdx < 0 ? 10 : endIdx - startIdx}`)
      messages = await this.messageProvider.getMessagesRange(user.id, startIdx, endIdx < 0 ? 10 : endIdx - startIdx)
    }

    for (const i in messages) {
      const msg = messages[i]
      server.sendMessage(
        connectionId,
        {
          type: MESSAGE_TYPE_TEXT,
          userId: msg.user_id,
          userName: msg.user_name,
          text: msg.text,
          time: msg.timestamp,
          messageId: msg.id,
          userColor: getColorByUserId(msg.user_id),
          isDirectMessage: msg.recipient_user_id > 0,
          recipientId: msg.recipient_user_id,
          recipientName: msg.recipient_name,
          recipientUserColor: getColorByUserId(msg.recipient_user_id),
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
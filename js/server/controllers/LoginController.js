import isPlainObject from 'lodash-es/isPlainObject'
import {
  MESSAGE_TYPE_LOGIN_FAIL,
  MESSAGE_TYPE_LOGIN_SUCCESS, MESSAGE_TYPE_LOGOUT_SUCCESS, MESSAGE_TYPE_TEXT,
} from '../../common/constants'
import BaseController from './BaseController'
import { getColorByUserId } from '../utils'

/**
 * Login controller
 */
class LoginController extends BaseController {
  userProvider
  messageProvider

  constructor(userProvider, messageProvider) {
    super()
    this.userProvider = userProvider
    this.messageProvider = messageProvider
  }

  /**
   * Check login credentials and return user data on success
   * @param request
   */
  async loginAction(request) {
    const { data, connectionId, server } = request
    console.log('Log in request')

    const sendErrorMessage = text => {
      this.sendError(
        server,
        connectionId,
        MESSAGE_TYPE_LOGIN_FAIL,
        text
      )
    }

    if (!isPlainObject(data)) {
      sendErrorMessage('Invalid input data')
      return
    }
    if (!data.login) {
      sendErrorMessage('Login not specified')
      return
    }
    if (!data.password) {
      sendErrorMessage('Password is not specified')
      return
    }

    console.log(`Check login for: ${data.login}`)

    let user
    try {
      user = await this.userProvider.findUserByLogin(data.login)
    } catch (e) {
      sendErrorMessage(e.message)
      console.log(`${data.login} db failed`)
      return
    }

    if (!user) {
      sendErrorMessage('User not found')
      console.log(`${data.login} not found`)
      return
    }

    if (user.password !== data.password) {
      sendErrorMessage('Invalid password')
      console.log('Invalid password')
      return
    }

    console.log('Login success')

    server.authenticateClient(connectionId, user.id)

    server.sendMessage(
      connectionId,
      {
        type: MESSAGE_TYPE_LOGIN_SUCCESS,
        user: {
          id: user.id,
          name: user.name,
          login: user.login,
          isAdmin: user.is_admin,
        },
      }
    )

    this.sendBroadcastMessageAsSystem(
      server,
      `${user.name} has joined this chat`
    )

    const lastMessages = await this.messageProvider.getLastMessages(20, user.id)
    for (const i in lastMessages) {
      const message = lastMessages[i]
      server.sendMessage(
        connectionId,
        {
          type: MESSAGE_TYPE_TEXT,
          userId: message.user_id,
          userName: message.user_name,
          text: message.text,
          time: message.timestamp,
          messageId: message.id,
          userColor: getColorByUserId(message.user_id),
          isDirectMessage: message.recipient_user_id > 0,
          recipientId: message.recipient_user_id,
          recipientName: message.recipient_name,
          recipientUserColor: getColorByUserId(message.recipient_user_id),
        }
      )
    }
  }

  /**
   * Handle user logout
   * @param request
   */
  logoutAction(request) {
    const { connectionId, server } = request
    console.log('Logout request')

    const userId = server.getConnectionUserId(connectionId)
    server.authenticateClient(connectionId, null)
    server.sendMessage(
      connectionId,
      {
        type: MESSAGE_TYPE_LOGOUT_SUCCESS,
      }
    )

    this.userProvider.findUserById(userId)
      .then(user => {
        if (user) {
          this.sendBroadcastMessageAsSystem(
            server,
            `${user.name} has left this chat`
          )
        }
      })
  }
}

export default LoginController
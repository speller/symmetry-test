import isPlainObject from 'lodash-es/isPlainObject'
import {
  MESSAGE_TYPE_LOGIN_FAIL,
  MESSAGE_TYPE_LOGIN_SUCCESS,
} from '../../common/constants'
import BaseController from './BaseController'

/**
 * Login controller
 */
class LoginController extends BaseController {
  userProvider
  _clearRefOnExit = true

  constructor(userProvider) {
    super()
    this.userProvider = userProvider
  }

  /**
   * Check login credentials and return user data on success
   * @param request
   */
  loginAction(request) {
    const { data, connectionId, server } = request
    console.log('Log in request')

    if (!isPlainObject(data)) {
      server.sendMessage(
        connectionId,
        {error: 'Invalid input data'}
      )
      return
    }
    if (!data.login) {
      server.sendMessage(
        connectionId,
        {error: 'Login not specified'}
      )
      return
    }
    if (!data.password) {
      server.sendMessage(
        connectionId,
        {error: 'Password not specified'}
      )
      return
    }

    console.log(`Check login for: ${data.login}`)

    this.userProvider.findUserByLogin(data.login)
      .then(user => {
        if (!user) {
          this.sendError(
            server,
            connectionId,
            MESSAGE_TYPE_LOGIN_FAIL,
            'User not found'
          )
          console.log(`${data.login} not found`)
          return
        }

        if (user.password !== data.password) {
          this.sendError(
            server,
            connectionId,
            'Invalid password'
          )
          console.log('Invalid password')
          return
        }

        console.log('Login success')
        // Login success
        server.authenticateClient(connectionId, user.id)
        server.sendMessage(
          connectionId,
          {
            type: MESSAGE_TYPE_LOGIN_SUCCESS,
            user: {
              id: user.id,
              name: user.name,
              login: user.login,
            },
          }
        )
        this.sendBroadcastMessage(
          server,
          `${user.name} has joined this chat`
        )
      })
      .catch(error => {
        this.sendError(
          server,
          connectionId,
          MESSAGE_TYPE_LOGIN_FAIL,
          error.message
        )
      })
  }
}

export default LoginController
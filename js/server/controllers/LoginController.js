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

    console.log(`${data.login} login requested`)

    this.userProvider.findUserByLogin(data.login)
      .then(result => {
        const [rows] = result
        const user = rows[0]

        if (!user) {
          this.sendError(
            server,
            connectionId,
            MESSAGE_TYPE_LOGIN_FAIL,
            'User not found'
          )
          return
        }

        if (user.password !== data.password) {
          this.sendError(
            server,
            connectionId,
            'Invalid password'
          )
        }

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
        this.sendMessageAsSystem(
          server,
          connectionId,
          `Welcome, ${user.name}`
        )
      })
      .catch(error => {
        this.sendError(
          server,
          connectionId,
          MESSAGE_TYPE_LOGIN_FAIL,
          error
        )
      })
  }
}

export default LoginController
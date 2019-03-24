import assert from 'assert'

import LoginController from '../js/server/controllers/LoginController'
import { MESSAGE_TYPE_LOGIN_FAIL, MESSAGE_TYPE_LOGIN_SUCCESS, MESSAGE_TYPE_TEXT } from '../js/common/constants'
import omit from 'lodash-es/omit'


function createLoginController(userProvider, messageProvider) {
  return new LoginController(userProvider || {}, messageProvider || {})
}


describe('LoginController', () => {
  describe('#loginAction()', () => {
    it('should fail if no data', async() => {
      let responseData, responseConId
      await createLoginController().loginAction({
        server: {
          sendMessage: (conId, data) => {
            responseData = data
            responseConId = conId
          },
        },
        connectionId: 'con-id',
      })
      assert.strictEqual(
        responseConId,
        'con-id'
      )
      assert.deepEqual(
        responseData,
        {
          type: MESSAGE_TYPE_LOGIN_FAIL,
          message: 'Invalid input data',
        }
      )
    })

    it('should fail if no login', async() => {
      let responseData, responseConId
      await createLoginController().loginAction({
        server: {
          sendMessage: (conId, data) => {
            responseData = data
            responseConId = conId
          },
        },
        connectionId: 'con-id',
        data: {},
      })
      assert.strictEqual(
        responseConId,
        'con-id'
      )
      assert.deepEqual(
        responseData,
        {
          type: MESSAGE_TYPE_LOGIN_FAIL,
          message: 'Login not specified',
        }
      )
    })

    it('should fail if no password', async() => {
      let responseData, responseConId
      await createLoginController().loginAction({
        server: {
          sendMessage: (conId, data) => {
            responseData = data
            responseConId = conId
          },
        },
        connectionId: 'con-id',
        data: {
          login: 'Login',
        },
      })
      assert.strictEqual(
        responseConId,
        'con-id'
      )
      assert.deepEqual(
        responseData,
        {
          type: MESSAGE_TYPE_LOGIN_FAIL,
          message: 'Password is not specified',
        }
      )
    })

    it('should fail if user DB failed', async() => {
      let responseData, responseConId
      const userProvider = {
        findUserByLogin: login => {
          throw new Error('DB error')
        },
      }
      await createLoginController(userProvider).loginAction({
        server: {
          sendMessage: (conId, data) => {
            responseData = data
            responseConId = conId
          },
        },
        connectionId: 'con-id',
        data: {
          login: 'Login',
          password: 'pwd',
        },
      })
      assert.strictEqual(
        responseConId,
        'con-id'
      )
      assert.deepEqual(
        responseData,
        {
          type: MESSAGE_TYPE_LOGIN_FAIL,
          message: 'DB error',
        }
      )
    })

    it('should fail if user not found', async() => {
      let responseData, responseConId
      const userProvider = {
        findUserByLogin: login => null,
      }
      await createLoginController(userProvider).loginAction({
        server: {
          sendMessage: (conId, data) => {
            responseData = data
            responseConId = conId
          },
        },
        connectionId: 'con-id',
        data: {
          login: 'Login',
          password: 'pwd',
        },
      })
      assert.strictEqual(
        responseConId,
        'con-id'
      )
      assert.deepEqual(
        responseData,
        {
          type: MESSAGE_TYPE_LOGIN_FAIL,
          message: 'User not found',
        }
      )
    })

    it('should fail if password do not mach', async() => {
      let responseData, responseConId
      const userProvider = {
        findUserByLogin: login => ({id: 1, password: 'pwdd'}),
      }
      await createLoginController(userProvider).loginAction({
        server: {
          sendMessage: (conId, data) => {
            responseData = data
            responseConId = conId
          },
        },
        connectionId: 'con-id',
        data: {
          login: 'Login',
          password: 'pwd',
        },
      })
      assert.strictEqual(
        responseConId,
        'con-id'
      )
      assert.deepEqual(
        responseData,
        {
          type: MESSAGE_TYPE_LOGIN_FAIL,
          message: 'Invalid password',
        }
      )
    })

    it('authenticate successfully', async() => {
      let authenticated, responseData, bcResponseData
      const userProvider = {
        findUserByLogin: login => ({id: 1, password: 'pwd', login: 'Login', name: 'Login Login', is_admin: 1}),
      }
      const messageProvider = {
        getLastMessages: () => [],
      }
      await createLoginController(userProvider, messageProvider).loginAction({
        server: {
          authenticateClient: (conId, userId) => {
            authenticated = conId === 'con-id' && userId === 1
          },
          sendMessage: (conId, data) => {
            if (conId === 'con-id') {
              responseData = data
            }
          },
          sendBroadcastMessage: data => {
            bcResponseData = data
          },
        },
        connectionId: 'con-id',
        data: {
          login: 'Login',
          password: 'pwd',
        },
      })
      assert.strictEqual(
        authenticated,
        true
      )
      assert.deepEqual(
        responseData,
        {
          type: MESSAGE_TYPE_LOGIN_SUCCESS,
          user: {
            id: 1,
            name: 'Login Login',
            login: 'Login',
            isAdmin: 1,
          },
        }
      )
      assert.deepEqual(
        omit(bcResponseData, 'time'),
        {
          type: MESSAGE_TYPE_TEXT,
          userId: -1,
          userName: 'System',
          text: 'Login Login has joined this chat',
        }
      )
    })
  })

})
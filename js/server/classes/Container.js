import MessageController from '../controllers/MessageController'
import SqlMessageProvider from './SqlMessageProvider'
import isFunction from 'lodash-es/isFunction'
import ChatRouter from './ChatRouter'
import Router from './Router'
import WebSocketServer from './WebSocketServer'
import ApiServer from './ApiServer'
import SqlUserProvider from './SqlUserProvider'

/**
 * Very simple dependency container
 */
class Container {
  cache = {}
  parameters = {}

  /**
   * Instantiate service by its name
   * @param id
   * @returns {*}
   */
  get(id) {
    if (this.cache[id]) {
      return this.cache[id]
    }

    const method = `get${id}`
    if (isFunction(this[method])) {
      return this.cache[id] = this[method]()
    } else {
      throw new Error(`Can not find servise with id ${id}`)
    }
  }

  setParameter(name, value) {
    this.parameters[name] = value
  }

  getParameter(name) {
    return this.parameters[name]
  }

  getMessageProvider() {
    return new SqlMessageProvider()
  }

  getUserProvider() {
    return new SqlUserProvider()
  }

  getMessageController() {
    return new MessageController(
      this.get('MessageProvider'),
      this.get('UserProvider')
    )
  }

  getChatRouter() {
    return new ChatRouter(this)
  }

  getApiRouter() {
    return new Router()
  }

  getChatServer() {
    return new WebSocketServer(
      this.getParameter('chat_config'),
      this.get('ChatRouter')
    )
  }

  getApiServer() {
    return new ApiServer(
      this.getParameter('api_config'),
      this.get('ApiRouter')
    )
  }
}
export default Container
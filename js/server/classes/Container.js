import MessageController from '../controllers/MessageController'
import SqlMessageProvider from './SqlMessageProvider'
import isFunction from 'lodash-es/isFunction'
import ChatRouter from './ChatRouter'
import WebSocketServer from './WebSocketServer'
import SqlUserProvider from './SqlUserProvider'
import MySQL from './MySQL'
import LoginController from '../controllers/LoginController'

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

  /**
   * Clear specific service cache
   * @param id
   */
  unset(id) {
    delete this.cache[id]
  }

  /**
   * Set container parameter
   * @param name
   * @param value
   */
  setParameter(name, value) {
    this.parameters[name] = value
  }

  /**
   * Get parameter value
   * @param name
   * @returns {*}
   */
  getParameter(name) {
    return this.parameters[name]
  }

  // Part below is the simplified result from what compiled service containers usually are.

  getMessageProvider() {
    return new SqlMessageProvider(
      this.get('MySQL')
    )
  }

  getUserProvider() {
    return new SqlUserProvider(
      this.get('MySQL')
    )
  }

  getMySQL() {
    return new MySQL(
      this.getParameter('mysql_config')
    )
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

  getChatServer() {
    return new WebSocketServer(
      this.getParameter('chat_config'),
      this.get('ChatRouter')
    )
  }

  getLoginController() {
    return new LoginController(
      this.get('UserProvider')
    )
  }
}
export default Container
import config from './config'
import {
  MESSAGE_TYPE_DELETE_MESSAGE,
  MESSAGE_TYPE_LOGIN,
  MESSAGE_TYPE_LOGOUT,
  MESSAGE_TYPE_TEXT,
} from './common/constants'
import Container from './server/classes/Container'


const container = new Container()

// Initialize container configuration
container.setParameter(
  'chat_config',
  {
    host: config.server.ws_host,
    port: config.server.ws_port,
  }
)
container.setParameter(
  'mysql_config',
  config.server.mysql
)

const chatRouter = container.get('ChatRouter')

// Setup WebSocket routes
chatRouter.addCommand(MESSAGE_TYPE_LOGIN, ['LoginController', 'loginAction'])
chatRouter.addCommand(MESSAGE_TYPE_LOGOUT, ['LoginController', 'logoutAction'])
chatRouter.addCommand(MESSAGE_TYPE_TEXT, ['MessageController', 'messageAction'])
chatRouter.addCommand(MESSAGE_TYPE_DELETE_MESSAGE, ['MessageController', 'deleteMessageAction'])

// Run server
container.get('ChatServer').run()
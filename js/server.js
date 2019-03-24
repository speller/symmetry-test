import config from './config'
import DefaultController from './server/controllers/DefaultController'
import LoginController from './server/controllers/LoginController'
import { MESSAGE_TYPE_LOGIN, MESSAGE_TYPE_TEXT } from './common/constants'
import Container from './server/classes/Container'


const container = new Container()

// Initialize WebSocket and API servers

container.setParameter(
  'chat_config',
  {
    host: config.server.ws_host,
    port: config.server.ws_port,
  }
)
container.setParameter(
  'api_config',
  {
    host: config.server.api_host,
    port: config.server.api_port,
  }
)
container.setParameter(
  'mysql_config',
  config.server.mysql
)

const apiRouter = container.get('ApiRouter')
const chatRouter = container.get('ChatRouter')

// Setup WebSocket routes
chatRouter.addCommand(MESSAGE_TYPE_TEXT, ['MessageController', 'messageAction'])
chatRouter.addCommand(MESSAGE_TYPE_LOGIN, ['LoginController', 'loginAction'])

// Setup API server routes
apiRouter.get('/', DefaultController.default)

// Run servers
container.get('ApiServer').run()
container.get('ChatServer').run()
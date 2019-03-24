import WebSocketServer from './server/classes/WebSocketServer'
import ChatCommandProcessor from './server/classes/ChatCommandProcessor'
import ApiServer from './server/classes/ApiServer'
import config from './config'
import Router from './server/classes/Router'
import DefaultController from './server/controllers/DefaultController'
import LoginController from './server/controllers/LoginController'


// Initialize WebSocket and API servers

const ws = new WebSocketServer(
  {
    host: config.server.ws_host,
    port: config.server.ws_port,
  },
  new ChatCommandProcessor()
)

const router = new Router()
const apiServer = new ApiServer(
  {
    host: config.server.api_host,
    port: config.server.api_port,
  },
  router
)

// Setup API server routes

router.get('/', DefaultController.default)
router.post('/login', LoginController.login)
router.options('/login', LoginController.loginOptions)

// Run servers

ws.run()
apiServer.run()
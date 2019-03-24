import WebSocketServer from './classes/WebSocketServer'
import ChatCommandProcessor from './classes/ChatCommandProcessor'


const ws = new WebSocketServer(
  new ChatCommandProcessor(),
  12345
)

ws.run()
import WebSocket from 'ws'
import { MESSAGE_TYPE_TEXT } from '../../common/constants'

class WebSocketServer {

  commandProcessor
  config

  constructor(config, commandProcessor) {
    this.config = config
    this.commandProcessor = commandProcessor
  }

  run() {
    const cfg = this.config
    const port = cfg.port || 12345
    const host = cfg.host || '0.0.0.0'

    const wss = new WebSocket.Server(
      {
        port: port,
        host: host,
        perMessageDeflate: {
          zlibDeflateOptions: {
            chunkSize: 1024,
            memLevel: 7,
            level: 3,
          },
          zlibInflateOptions: {
            chunkSize: 10 * 1024,
          },
          clientNoContextTakeover: true,
          serverNoContextTakeover: true,
          serverMaxWindowBits: 10,
          concurrencyLimit: 10,
          threshold: 1024,
        },
      },
      () => {
        console.log(`WebSocket server is listening on ${host}:${port}`)
      }
    )

    wss.on('connection', ws => {
      console.log('Client connected')
      ws.on('message', message => {
        console.log('received: %s', message)
        let response
        let msg
        try {
          msg = JSON.parse(message)
        } catch (e) {
          console.log('Can not parse JSON')
        }
        if (msg) {
          response = this.commandProcessor.processCommand(msg)
          if (response) {
            const resText = JSON.stringify(response)
            ws.send(resText)
          }
        }
      })
      ws.send(JSON.stringify({
        type: MESSAGE_TYPE_TEXT,
        userId: -1,
        userName: 'System',
        text: 'Hello WebSocket client!',
      }))
    })
  }
}

export default WebSocketServer
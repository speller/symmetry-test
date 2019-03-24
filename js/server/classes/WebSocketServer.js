import WebSocket from 'ws'

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
        try {
          let msg = JSON.parse(message)
          response = this.commandProcessor.processCommand(msg)
        } catch (e) {
          console.log('Can not parse JSON')
        }
        if (response) {
          ws.send(JSON.stringify(response))
        }
      })
      ws.send('Hello WebSocket client!')
    })
  }
}

export default WebSocketServer
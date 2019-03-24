import WebSocket from 'ws'

class WebSocketServer {

  commandProcessor = null
  portNumber = null

  constructor(commandProcessor, portNumber) {
    this.commandProcessor = commandProcessor
    this.portNumber = portNumber
  }

  run() {
    const wss = new WebSocket.Server(
      {
        port: this.portNumber,
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
        console.log(`Listening on port ${this.portNumber}`)
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
      ws.send('connected')
    })
  }
}

export default WebSocketServer
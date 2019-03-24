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
          // Other options settable:
          clientNoContextTakeover: true, // Defaults to negotiated value.
          serverNoContextTakeover: true, // Defaults to negotiated value.
          serverMaxWindowBits: 10, // Defaults to negotiated value.
          // Below options specified as default values.
          concurrencyLimit: 10, // Limits zlib concurrency for perf.
          threshold: 1024, // Size (in bytes) below which messages
          // should not be compressed.
        },
      },
      () => {
        console.log(`Listening on port ${this.portNumber}`)
      }
    )

    wss.on('connection', function(ws) {
      ws.on('message', function(message) {
        console.log('received: %s', message)
      })

      ws.send('something')
    })
  }
}

export default WebSocketServer
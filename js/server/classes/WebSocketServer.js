import WebSocket from 'ws'
import { MESSAGE_TYPE_TEXT } from '../../common/constants'
import { makeRandomId } from '../../common/utils'
import isPlainObject from 'lodash-es/isPlainObject'

class WebSocketServer {

  router
  config
  connections = []

  constructor(config, commandProcessor) {
    this.config = config
    this.router = commandProcessor
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
      const connectionId = makeRandomId(64)
      this.connections.push({
        ws,
        userId: null,
        connectionId,
      })
      ws.__connectionId = connectionId

      ws.on('message', message => {
        console.log('received: %s', message)
        let response
        let data
        try {
          data = JSON.parse(message)
        } catch (e) {
          console.log('Can not parse JSON')
        }
        if (data) {
          this.router.processMessage({
            data,
            connectionId,
            server: this,
          })
        }
      })

      ws.on('close', ws => {
        this.connections = this.connections.filter(con => con.connectionId !== ws.__connectionId)
      })

      ws.send(JSON.stringify({
        type: MESSAGE_TYPE_TEXT,
        userId: -1,
        userName: 'System',
        text: 'Hello WebSocket client! Please login to start conversation.',
      }))
    })
  }

  /**
   * Find connection by id
   * @param connectionId
   * @returns {*}
   */
  findConnection(connectionId) {
    return this.connections.find(con => con.connectionId === connectionId)
  }

  /**
   * Authenticate user on the specified connection
   * @param connectionId
   * @param userId
   */
  authenticateClient(connectionId, userId) {
    const con = this.findConnection(connectionId)
    if (!con) {
      throw new Error(`Connection ${connectionId} not found`)
    }
    con.userId = userId
  }

  /**
   * Send message to the specified connection
   * @param connectionId
   * @param data
   */
  sendMessage(connectionId, data) {
    const con = this.findConnection(connectionId)
    if (!con) {
      throw new Error(`Connection ${connectionId} not found`)
    }

    if (!isPlainObject(data)) {
      data = {data: data}
    }
    con.ws.send(JSON.stringify(data))
  }
}

export default WebSocketServer
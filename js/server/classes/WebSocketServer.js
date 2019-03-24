import WebSocket from 'ws'
import { MESSAGE_TYPE_TEXT } from '../../common/constants'
import { makeRandomId } from '../../common/utils'
import isPlainObject from 'lodash-es/isPlainObject'

/**
 * Web socket server 
 */
class WebSocketServer {

  router
  config
  connections = []

  constructor(config, commandProcessor) {
    this.config = config
    this.router = commandProcessor
  }

  /**
   * Run web socket server
   */
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
        console.log('Client disconnected')
        this.connections = this.connections.filter(con => con.connectionId !== connectionId)
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

  /**
   * Send message to all client connections.
   * @param data
   * @param excludeConnections
   */
  sendBroadcastMessage(data, excludeConnections = []) {
    if (!isPlainObject(data)) {
      data = {data: data}
    }
    data = JSON.stringify(data)

    this.connections
      .filter(connection => !!connection.userId)
      .filter(connection => !excludeConnections.find(con => con.connectionId === connection.id))
      .forEach(connection => {
        connection.ws.send(data)
      })
  }

  /**
   * Send message to specified user id client connections.
   * @param userId
   * @param data
   */
  sendMessageToUserId(userId, data) {
    if (!isPlainObject(data)) {
      data = {data: data}
    }
    data = JSON.stringify(data)

    this.connections
      .filter(connection => connection.userId === userId)
      .forEach(connection => connection.ws.send(data))
  }

  /**
   * Returns user id assigned to the specified connection
   * @param connectionId
   * @returns {*}
   */
  getConnectionUserId(connectionId) {
    const con = this.findConnection(connectionId)
    return con ? con.userId : null
  }

  /**
   * Returns connections by user id
   * @returns {*}
   * @param userId
   */
  getConnectionByUserId(userId) {
    return this.connections
      .filter(connection => connection.userId === userId)
  }
}

export default WebSocketServer
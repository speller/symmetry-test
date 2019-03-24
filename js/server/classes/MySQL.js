import mysql from 'mysql2/promise'

/**
 * MySQL abstraction layer.
 * Configures connection on class creation
 */
class MySQL {
  config
  connection

  constructor(config) {
    this.config = config
  }

  async connect() {
    if (!this.connection) {
      this.connection = await mysql.createConnection(this.config)
    }
    return this.connection
  }

  async query() {
    const connection = await this.connect()
    return connection.query.apply(connection, arguments)
  }
}
export default MySQL
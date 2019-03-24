import BaseProvider from './BaseProvider'

/**
 * MySQL provider for messages
 */
class SqlMessageProvider extends BaseProvider{
  connection

  /**
   * @param connection
   */
  constructor(connection) {
    super()
    this.connection = connection
  }

  /**
   * Adds new message and returns its ID
   * @param userId
   * @param text
   * @param dateTime
   * @returns {Promise<null>}
   */
  async addMessage(userId, text, dateTime) {
    const result = await this.connection.query(
      'INSERT INTO messages (user_id, timestamp, text) VALUES (?, ?, ?)',
      [
        userId,
        this.formatDateTimeForDB(dateTime),
        text,
      ]
    )
    return result[0].insertId
  }

  /**
   * Search message by id.
   * @param id
   * @returns {Promise<null>}
   */
  async findMessageById(id) {
    const [rows] = await this.connection.query(
      'SELECT * FROM messages WHERE id = ?', [id]
    )
    return rows[0] ? rows[0] : null
  }
}
export default SqlMessageProvider
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
      'SELECT m.*, u.name AS user_name ' +
      'FROM messages m ' +
      'JOIN users u ON m.user_id = u.id ' +
      'WHERE m.id = ?',
      [id]
    )
    return rows[0] ? rows[0] : null
  }

  /**
   * Returns last messages
   * @param count
   * @returns {Promise<null>}
   */
  async getLastMessages(count) {
    const [rows] = await this.connection.query(
      'SELECT m.*, u.name AS user_name ' +
      'FROM messages m ' +
      'JOIN users u ON m.user_id = u.id ' +
      'WHERE m.deleted_by_user_id IS NULL ' +
      'ORDER BY m.timestamp DESC, m.id DESC ' +
      'LIMIT ?', [count]
    )
    return rows.reverse()
  }

  async markMessageDeleted(id, userId) {
    await this.connection.query(
      'UPDATE messages SET deleted_by_user_id = ? WHERE id = ?',
      [userId, id]
    )
  }
}
export default SqlMessageProvider
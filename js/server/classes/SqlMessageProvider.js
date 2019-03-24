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
   * @param recipientUserId
   * @returns {Promise<null>}
   */
  async addMessage(userId, text, dateTime, recipientUserId) {
    const result = await this.connection.query(
      'INSERT INTO messages (user_id, timestamp, text, recipient_user_id) VALUES (?, ?, ?, ?)',
      [
        userId,
        this.formatDateTimeForDB(dateTime),
        text,
        recipientUserId,
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
      'SELECT m.*, u.name AS user_name, u2.name AS recipient_name ' +
      'FROM messages m ' +
      'JOIN users u ON m.user_id = u.id ' +
      'LEFT JOIN users u2 ON m.recipient_user_id = u2.id ' +
      'WHERE m.id = ?',
      [id]
    )
    return rows[0] ? rows[0] : null
  }

  /**
   * Returns last messages
   * @param count
   * @param userId
   * @returns {Promise<null>}
   */
  async getLastMessages(count, userId) {
    const [rows] = await this.connection.query(
      'SELECT m.*, u.name AS user_name, u2.name AS recipient_name ' +
      'FROM messages m ' +
      'JOIN users u ON m.user_id = u.id ' +
      'LEFT JOIN users u2 ON m.recipient_user_id = u2.id ' +
      'WHERE m.deleted_by_user_id IS NULL AND ' +
      ' (m.recipient_user_id = ? OR m.recipient_user_id IS NULL) ' +
      'ORDER BY m.timestamp DESC, m.id DESC ' +
      'LIMIT ?',
      [userId, count]
    )
    return rows.reverse()
  }

  /**
   * Returns range of messages
   * @param count
   * @param userId
   * @param startIdx
   * @returns {Promise<null>}
   */
  async getMessagesRange(userId, startIdx, count) {
    const [rows] = await this.connection.query(
      'SELECT m.*, u.name AS user_name, u2.name AS recipient_name ' +
      'FROM messages m ' +
      'JOIN users u ON m.user_id = u.id ' +
      'LEFT JOIN users u2 ON m.recipient_user_id = u2.id ' +
      'WHERE m.deleted_by_user_id IS NULL AND ' +
      ' (m.recipient_user_id = ? OR m.recipient_user_id IS NULL) ' +
      'ORDER BY m.timestamp ASC, m.id ASC ' +
      'LIMIT ?, ?',
      [userId, startIdx, count]
    )
    return rows
  }

  async markMessageDeleted(id, userId) {
    await this.connection.query(
      'UPDATE messages SET deleted_by_user_id = ? WHERE id = ?',
      [userId, id]
    )
  }
}
export default SqlMessageProvider
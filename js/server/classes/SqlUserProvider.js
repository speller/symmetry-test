/**
 * User provider by MySQL connection
 */
class SqlUserProvider {
  connection

  constructor(connection) {
    this.connection = connection
  }

  async findUserByLogin(login) {
    const [rows] = await this.connection.query(
      'SELECT * FROM users WHERE login = ?', [login]
    )
    return rows[0] ? rows[0] : null
  }

  async findUserById(id) {
    const [rows] = await this.connection.query(
      'SELECT * FROM users WHERE id = ?', [id]
    )
    return rows[0] ? rows[0] : null
  }
}
export default SqlUserProvider
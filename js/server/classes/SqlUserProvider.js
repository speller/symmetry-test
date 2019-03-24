/**
 * User provider by MySQL connection
 */
class SqlUserProvider {
  connection

  constructor(connection) {
    this.connection = connection
  }

  findUserByLogin(login) {
    return this.connection.query(
      'SELECT * FROM users WHERE login = ?', [login]
    )
  }
}
export default SqlUserProvider
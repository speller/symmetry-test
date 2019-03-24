import { formatDate } from '../../common/utils'

/**
 * Base provider class with common utilities
 */
class BaseProvider {
  /**
   * Format date time to insert into DB
   * @param date
   * @returns {string}
   */
  formatDateTimeForDB(date) {
    return formatDate(date, 'Y-m-d H:i:s')
  }
}

export default BaseProvider
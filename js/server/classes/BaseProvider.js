import { formatDate } from '../../common/utils'

class BaseProvider {
  formatDateTimeForDB(date) {
    return formatDate(date, 'Y-m-d H:i:s')
  }
}

export default BaseProvider
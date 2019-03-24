/**
 * Controller for chat message commands
 */
import { MESSAGE_TYPE_TEXT } from '../../common/constants'

class MessageController {
  messageProvider
  userProvider

  constructor(messageProvider, userProvider) {
    this.userProvider = userProvider
    this.messageProvider = messageProvider
  }

  messageAction(data) {
    return {
      type: MESSAGE_TYPE_TEXT,
      userId: data.userId,
      userName: 'John Doe',
      text: data.text,
    }
  }
}

export default MessageController
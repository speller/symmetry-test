import BaseController from './BaseController'
import Sendmail from 'sendmail'
import {
  MESSAGE_TYPE_SEND_EMAIL_FAIL,
  MESSAGE_TYPE_SEND_EMAIL_SUCCESS,
} from '../../common/constants'

class EmailController extends BaseController {
  userProvider
  messageProvider

  constructor(userProvider, messageProvider) {
    super()
    this.userProvider = userProvider
    this.messageProvider = messageProvider
  }

  async sendEmailHistoryAction(request) {
    const { data, connectionId, server } = request
    const sendErrorMessage = text => {
      this.sendError(
        server,
        connectionId,
        MESSAGE_TYPE_SEND_EMAIL_FAIL,
        text
      )
    }

    const user = await this.userProvider.findUserById(server.getConnectionUserId(connectionId))
    if (!user) {
      sendErrorMessage('User not found')
      return
    }

    const messageIds = data.messageIds
    if (!messageIds || messageIds.length === 0) {
      sendErrorMessage('No messages to send')
      return
    }

    const email = data.email
    if (!email || email.length < 6) {
      sendErrorMessage('Invalid email')
      return
    }

    const messages = await this.messageProvider.getMessagesByIdsForUser(messageIds, user.id)
    // Map list of IDs to emails. We can have duplicate ids - need to duplicate messages also
    const resultMessages = messageIds.map(id => messages.find(msg => msg.id === id))

    let emailText = ''

    resultMessages.forEach(msg => {
      emailText += `${msg.user_name} [${msg.timestamp}]\n${msg.text}\n\n`
    })

    console.log(`Sending ${resultMessages.length} emails to ${email}`)

    Sendmail({
      from: 'no-reply@example.com',
      to: email,
      subject: 'Chat history',
      text: emailText,
    }, function(err, reply) {
      sendErrorMessage(err.message)
      console.log(err && err.stack)
      console.dir(reply)
    })

    server.sendMessage(
      connectionId,
      {
        type: MESSAGE_TYPE_SEND_EMAIL_SUCCESS,
      }
    )
  }
}

export default EmailController
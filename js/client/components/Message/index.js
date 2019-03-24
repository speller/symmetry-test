import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import { formatDate } from '../../../common/utils'
import './styles.scss'

/**
 * Message component. Represents single message in chat.
 */
class Message extends Component {

  static propTypes = {
    message: PropTypes.object.isRequired,
  }

  render() {
    const msg = this.props.message
    const time = msg.time ? new Date(msg.time) : null
    return (
      <Paper className="message">
        <div>
          <Typography className="author" variant="caption" gutterBottom inline>{msg.userName ?? 'Unknown'}</Typography>
          <Typography className="time" variant="caption" gutterBottom inline>{time ? formatDate(time, 'Y-m-d H:i:s') : ''}</Typography>
        </div>
        <Typography className="text" variant="body1">
          {msg.text ?? '-'}
        </Typography>
      </Paper>
    )
  }
}

export default Message
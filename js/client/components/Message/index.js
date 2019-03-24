import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'

/**
 * Message component. Represents single message in chat.
 */
class Message extends Component {

  static propTypes = {
    author: PropTypes.string,
    text: PropTypes.string,
  }

  render() {
    return (
      <Paper className="message">
        <Typography className="author" variant="caption" gutterBottom>{this.props.author ?? 'Unknown'}</Typography>
        <Typography className="text" variant="body1">
          {this.props.text ?? '-'}
        </Typography>
      </Paper>
    )
  }
}

export default Message
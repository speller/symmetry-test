import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'
import PropTypes from 'prop-types'
import { formatDate } from '../../../common/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'
import './styles.scss'

/**
 * Message component. Represents single message in chat.
 */
class Message extends Component {

  static propTypes = {
    message: PropTypes.object.isRequired,
    canDelete: PropTypes.bool.isRequired,
    deleteProc: PropTypes.func.isRequired,
  }

  static defaultProps = {
    deleteInProgress: false,
  }

  state = {
    deleteInProgress: false,
  }

  handleDelete() {
    const props = this.props
    this.setState({deleteInProgress: true})
    props.deleteProc(props.message.messageId)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.deleteInProgress && !this.props.deleteInProgress && this.state.deleteInProgress) {
      this.setState({deleteInProgress: false})
    }
  }

  render() {
    const props = this.props
    const msg = props.message
    const time = msg.time ? new Date(msg.time) : null
    const deleteInProgress = props.deleteInProgress && this.state.deleteInProgress
    return (
      <Paper className="message">
        <div className="header">
          <Typography className="author" variant="caption" gutterBottom>{msg.userName ?? 'Unknown'}</Typography>
          <Typography className="time" variant="caption" gutterBottom>{time ? formatDate(time, 'Y-m-d H:i:s') : ''}</Typography>
          {props.canDelete &&
          <Button
            className="delete"
            variant="text"
            size="small"
            title="Delete message"
            onClick={this.handleDelete.bind(this)}
          >
            <FontAwesomeIcon icon="times-circle" />
          </Button>}
        </div>
        <Typography className="text" variant="body1">
          {msg.text ?? '-'}
        </Typography>
        {deleteInProgress &&
        <LinearProgress />}
      </Paper>
    )
  }
}

export default connect(
  // Map store state to our component props
  (state) => {
    const myState = state['message'] || {}
    return {...myState}
  },
  // Add actions methods to our component props
  (dispatch) => {
    return {
    }
  },
)(Message)
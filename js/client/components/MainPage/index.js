import React, { Component } from 'react'
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper/index'
import { sendMessage } from './actions'
import './styles.scss'
import LinearProgress from '@material-ui/core/LinearProgress'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import { Button, Typography } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'

class MainPage extends Component {

  static propTypes = {
    messages: PropTypes.array,
    webSocket: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  }

  static defaultProps = {
    messages: [],
    inProgress: false,
    messageSentSuccess: false,
  }
  
  state = {
    text: '',
  }

  handleTextKeyDown(event) {
    if (event.keyCode === 13 && event.ctrlKey) {
      this.sendTextMessage()
    }
  }

  sendTextMessage() {
    const state = this.state
    const props = this.props
    if (state.text) {
      props.sendTextMessage(state.text, props.user.id, props.webSocket)
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const props = this.props
    // Reset text on successful message sent
    if (!props.inProgress && prevProps.inProgress && props.messageSentSuccess) {
      this.setState({text: ''})
    }
  }

  render() {
    const props = this.props

    const inProgress = props.inProgress

    return (
      <div className="main-page">
        <div className="chat-history">
          <Paper className="message">
            <Typography className="author" variant="caption" gutterBottom>John Doe</Typography>
            <Typography className="text" variant="body1">
              Hello world!
            </Typography>
          </Paper>
        </div>

        <div className="send-msg-block">
          <Input
            multiline
            id="text"
            name="text"
            className="text"
            autoComplete="Message Text"
            autoFocus
            disabled={inProgress}
            value={this.state.text}
            onChange={(e) => this.setState({text: e.target.value})}
            onKeyDown={this.handleTextKeyDown.bind(this)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="submit"
            disabled={inProgress}
            onClick={this.sendTextMessage.bind(this)}
          >
            <FontAwesomeIcon icon="paper-plane" />
          </Button>
        </div>
        {inProgress &&
        <LinearProgress />}
      </div>
    )
  }
}

export default connect(
  // Map store state to our component props
  (state) => {
    const myState = state['mainPage'] || {}
    return {...myState}
  },
  // Add actions methods to our component props
  (dispatch) => {
    return {
      sendTextMessage: (text, userId, ms) =>
        dispatch(sendMessage(text, userId, ms)),
    }
  },
)(MainPage)
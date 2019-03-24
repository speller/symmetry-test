import React, { Component } from 'react'
import { connect } from 'react-redux'
import './styles.scss'
import LinearProgress from '@material-ui/core/LinearProgress'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import Message from '../Message'

class ChatForm extends Component {

  static propTypes = {
    sendMessageProc: PropTypes.func.isRequired,
    deleteMessageProc: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    chatContext: PropTypes.object.isRequired,
  }

  static defaultProps = {
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
      props.sendMessageProc(state.text)
    }
  }

  clearInputText() {
    this.setState({text: ''})
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const props = this.props
    // Reset text on successful message sent
    if (!props.inProgress && prevProps.inProgress && props.messageSentSuccess) {
      this.clearInputText()
    }
  }

  render() {
    const props = this.props

    const inProgress = props.inProgress
    const isLoggedIn = props.isLoggedIn
    const user = props.chatContext.user

    return (
      <div className="main-page">
        <div className="chat-history">
          {props.chatContext.messages.map((message, key) => (
            <Message
              key={key}
              message={message}
              canDelete={!!user && message.userId > 0 && (user.isAdmin || user.id === message.userId)}
              deleteProc={props.deleteMessageProc}
            />
          ))}
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
    }
  },
  null,
  {
    forwardRef : true,
  }
)(ChatForm)
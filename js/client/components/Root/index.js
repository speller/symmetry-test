import 'regenerator-runtime/runtime'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  AppBar,
  Button,
  CssBaseline,
  LinearProgress,
  Toolbar,
  Typography,
} from '@material-ui/core'
import {
  clearChat,
  deleteMessage,
  disconnected,
  dispatchWsMessage,
  logout,
  sendEmail,
  sendMessage,
  showLoginPage,
  startLogin,
} from './actions'
import './styles.scss'
import LoginForm from '../LoginForm'
import { PAGE_LOGIN, PAGE_MAIN } from './constants'
import ChatForm from '../ChatForm'
import Websocket from 'react-websocket'
import config from '../../../config'
import ChatContext from './chat-context'

class Root extends Component {
  
  static defaultProps = {
    page: PAGE_MAIN,
    initialized: false,
    logoutInProgress: false,
    chatContext: new ChatContext(),
  }

  webSocketRef
  chatFormRef

  state = {
    wsConnected: false,
    wsShouldConnect: false,
  }

  constructor(props) {
    super(props)
    this.webSocketRef = React.createRef()
    this.chatFormRef = React.createRef()
  }

  isInProgress() {
    return this.props.logoutInProgress
  }

  isLoggedIn() {
    return !!this.props.chatContext.user
  }

  handleWsMessage(data) {
    console.log(data)
    let msg
    try {
      msg = JSON.parse(data)
    } catch (e) {
      return
    }
    this.props.dispatchWsMessage(msg, this.props.chatContext)
  }

  handleWsClosed() {
    this.setState({wsConnected: false})
    this.props.disconnected(this.props.chatContext)
  }

  handleWsConnected() {
    this.setState({wsConnected: true})
  }

  isWsConnected() {
    return this.state.wsConnected
  }

  shouldWsConnect() {
    return this.state.wsShouldConnect
  }

  getWsRef() {
    return this.webSocketRef.current
  }

  handleLogin(login, password) {
    const props = this.props
    props.startLogin(login, password, props.chatContext, this.getWsRef())
  }

  handleLogout() {
    this.props.logout(this.getWsRef())
  }

  handleSendMessage(text) {
    const props = this.props
    if (!this.isWsConnected() && !this.shouldWsConnect()) {
      if (text === '/join') {
        this.setState({wsShouldConnect: true})
        this.clearInputText()
      }
    } else {
      if (text === '/leave') {
        this.setState({wsShouldConnect: false})
        this.clearInputText()
      } else if (this.isLoggedIn()) {
        if (text === '/clear') {
          props.clearChat(props.chatContext)
          this.clearInputText()
        } else {
          props.sendTextMessage(text, this.getWsRef())
        }
      }
    }
  }
  
  clearInputText() {
    const ref = this.chatFormRef.current
    if (ref) {
      ref.clearInputText()
    }
  }

  handleDeleteMessage(msgId) {
    const props = this.props
    props.deleteMessage(msgId, this.getWsRef(), props.chatContext)
  }

  handleSendEmail() {
    const msgIds = this.props.chatContext.messages
      .filter(msg => msg.messageId > 0)
      .map(msg => msg.messageId)
    if (msgIds.length > 0) {
      const email = prompt('Enter your email')
      if (email) {
        this.props.sendEmail(email, msgIds, this.getWsRef())
      }
    }
  }

  componentWillUnmount() {
    this.webSocketRef = null
  }

  render() {
    const props = this.props

    const isInProgress = this.isInProgress()
    const isLoggedIn = this.isLoggedIn()
    const isWsConnected = this.isWsConnected()
    const shouldWsConnect = this.shouldWsConnect()

    return (
      <div className="app-root">
        <CssBaseline />
        <AppBar position="static" color="default" className="app-bar">
          <Toolbar className="toolbar-title">
            <Typography variant="h6" color="inherit" noWrap className="title">
              Test Chat
            </Typography>
            <Button
              className="sendmail"
              color="primary"
              variant="outlined"
              onClick={this.handleSendEmail.bind(this)}
              disabled={isInProgress || !isLoggedIn}
            >
              Send E-Mail
            </Button>
            {shouldWsConnect &&
            <Button 
              color="primary" 
              variant="outlined" 
              onClick={() => this.setState({wsShouldConnect: false})}
              disabled={isInProgress}
            >
              Disconnect
            </Button>}
            {!shouldWsConnect &&
            <Button 
              color="primary" 
              variant="outlined" 
              onClick={() => this.setState({wsShouldConnect: true})}
              disabled={isInProgress}
            >
              Connect
            </Button>}
            {!isLoggedIn &&
            <Button
              className="login"
              color="primary"
              variant="outlined"
              onClick={props.showLoginPage}
              disabled={isInProgress || !isWsConnected}
            >
              Login
            </Button>}
            {isLoggedIn &&
            <Button
              className="logout"
              color="primary"
              variant="outlined"
              onClick={this.handleLogout.bind(this)}
              disabled={isInProgress || !isWsConnected}
            >
              {props.chatContext.user.name} Logout
            </Button>}
          </Toolbar>
        </AppBar>
        {this.state.wsShouldConnect &&
        <Websocket
          ref={this.webSocketRef}
          url={config.client.ws_url}
          reconnectIntervalInMilliSeconds={2000}
          onMessage={this.handleWsMessage.bind(this)}
          onOpen={this.handleWsConnected.bind(this)}
          onClose={this.handleWsClosed.bind(this)}
        />}
        {!isWsConnected &&
        <Typography variant="body1" className="disconnected">No connection</Typography>}
        {isInProgress &&
        <LinearProgress />}
        <main className="layout">
          {props.page === PAGE_LOGIN &&
            <LoginForm loginProc={this.handleLogin.bind(this)} />
          }
          {props.page === PAGE_MAIN &&
            <ChatForm
              ref={this.chatFormRef}
              chatContext={props.chatContext}
              sendMessageProc={this.handleSendMessage.bind(this)}
              deleteMessageProc={this.handleDeleteMessage.bind(this)}
              isLoggedIn={isLoggedIn}
            />
          }
        </main>
      </div>
    )
  }
}

export default connect(
  // Map store state to our component props
  (state) => {
    const myState = state['root'] || {}
    return {...myState}
  },
  // Add actions methods to our component props
  (dispatch) => {
    return {
      startLogin: (name, password, ctx, ws) =>
        dispatch(startLogin(name, password, ctx, ws)),
      showLoginPage: () =>
        dispatch(showLoginPage()),
      logout: (ws) =>
        dispatch(logout(ws)),
      dispatchWsMessage: (msg, ctx) =>
        dispatch(dispatchWsMessage(msg, ctx)),
      sendTextMessage: (text, ws) =>
        dispatch(sendMessage(text, ws)),
      deleteMessage: (msgId, ws) =>
        dispatch(deleteMessage(msgId, ws)),
      disconnected: (ctx) =>
        dispatch(disconnected(ctx)),
      sendEmail: (email, messageIds, ws) =>
        dispatch(sendEmail(email, messageIds, ws)),
      clearChat: (ctx) =>
        dispatch(clearChat(ctx)),
    }
  },
)(Root)
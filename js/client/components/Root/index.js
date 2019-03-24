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
  dispatchWsMessage,
  logout, sendMessage,
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

  constructor(props) {
    super(props)
    this.webSocketRef = React.createRef()
  }

  isInProgress() {
    return this.props.logoutInProgress
  }

  isLoggedIn() {
    return !!this.props.chatContext.user
  }

  handleWsData(data) {
    console.log(data)
    let msg
    try {
      msg = JSON.parse(data)
    } catch (e) {
      return
    }
    this.props.dispatchWsMessage(msg, this.props.chatContext)
  }

  handleLogin(login, password) {
    const props = this.props
    props.startLogin(login, password, props.chatContext, this.webSocketRef.current)
  }

  handleSendMessage(text) {

  }
  
  componentWillUnmount() {
    this.webSocketRef = null
  }

  render() {
    const props = this.props

    const isInProgress = this.isInProgress()
    const isLoggedIn = this.isLoggedIn()

    return (
      <div className="app-root">
        <CssBaseline />
        <AppBar position="static" color="default" className="app-bar">
          <Toolbar className="toolbar-title">
            <Typography variant="h6" color="inherit" noWrap className="title">
              Test Chat
            </Typography>
            {!isLoggedIn &&
            <Button 
              color="primary" 
              variant="outlined" 
              className="login" 
              onClick={props.showLoginPage}
              disabled={isInProgress}
            >
              Login
            </Button>}
            {isLoggedIn &&
            <Button 
              color="primary" 
              variant="outlined" 
              onClick={props.logout}
              disabled={isInProgress}
            >
              {props.chatContext.user.name} Logout
            </Button>}
          </Toolbar>
        </AppBar>
        <Websocket
          ref={this.webSocketRef}
          url={config.client.ws_url}
          onMessage={this.handleWsData.bind(this)}
        />
        {isInProgress &&
        <LinearProgress />}
        <main className="layout">
          {props.page === PAGE_LOGIN &&
            <LoginForm loginProc={this.handleLogin.bind(this)} />
          }
          {props.page === PAGE_MAIN &&
            <ChatForm
              chatContext={props.chatContext}
              sendMessageProc={this.handleSendMessage.bind(this)}
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
      logout: () =>
        dispatch(logout()),
      dispatchWsMessage: (msg, ctx) =>
        dispatch(dispatchWsMessage(msg, ctx)),
      sendTextMessage: (text, userId, ms) =>
        dispatch(sendMessage(text, userId, ms)),
    }
  },
)(Root)
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
import './styles.scss'
import LoginForm from '../LoginForm'
import { PAGE_LOGIN, PAGE_MAIN } from './constants'
import { logout, showLoginPage } from './actions'
import MainPage from '../MainPage'
import Websocket from 'react-websocket'
import config from '../../../config'
import { MESSAGE_TYPE_TEXT } from '../../../common/constants'

class Root extends Component {
  
  static defaultProps = {
    page: PAGE_MAIN,
    currentUser: null,
    initialized: false,
    logoutInProgress: false,
  }

  state = {
    messages: [],
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
    return !!this.props.currentUser
  }

  handleWsData(data) {
    console.log(data)
    try {
      const req = JSON.parse(data)

      switch (req.type) {
      case MESSAGE_TYPE_TEXT:
        let messages = this.state.messages.concat([])
        messages.push(req)
        this.setState({messages})
        break
      }
    } catch (e) {
      // Do nothing on unknown message format
    }
  }
  
  componentDidMount() {
    if (!this.currentUser && !this.isInProgress()) {
      this.props.showLoginPage()
    }
  }

  componentWillUnmount() {
    this.webSocketRef = null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.props.currentUser && prevProps.currentUser) {
      this.setState({messages: []})
    }
  }

  render() {
    const props = this.props
    const msgs = this.state.messages
    
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
              {props.currentUser.name} Logout
            </Button>}
          </Toolbar>
        </AppBar>
        {isLoggedIn &&
        <Websocket
          ref={this.webSocketRef}
          url={config.client.ws_url}
          onMessage={this.handleWsData.bind(this)}
        />}
        {isInProgress &&
        <LinearProgress />}
        <main className="layout">
          {props.page === PAGE_LOGIN &&
            <LoginForm />
          }
          {props.page === PAGE_MAIN && isLoggedIn &&
            <MainPage
              webSocket={this.webSocketRef.current}
              user={props.currentUser}
              messages={this.state.messages}
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
      showLoginPage: () => dispatch(showLoginPage()),
      logout: () => dispatch(logout()),
    }
  },
)(Root)
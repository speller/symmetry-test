import 'regenerator-runtime/runtime'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { AppBar, Button, CssBaseline, LinearProgress, Toolbar, Typography } from '@material-ui/core'
import './styles.scss'
import LoginForm from '../LoginForm'
import { PAGE_LOGIN, PAGE_MAIN, PAGE_REGISTER } from './constants'
import { checkLoginStatus, logout, showLoginPage, showMainPage, showRegisterPage } from './actions'
import { MODE_LOGIN, MODE_REGISTER } from '../LoginForm/constants'
import MainPage from '../MainPage'

class Root extends Component {
  
  static defaultProps = {
    page: PAGE_MAIN,
    currentLogin: null,
    shouldCheckLogin: true,
    initialized: false,
    loginCheckInProgress: false,
    logoutInProgress: false,
  }
  
  isInProgress() {
    return this.props.loginCheckInProgress || this.props.logoutInProgress; 
  }
  
  shouldCheckLogin() {
    return this.props.shouldCheckLogin && !this.props.loginCheckInProgress
  }
  
  canShowContent() {
    return this.props.initialized;
  }
  
  componentDidMount () {
    if (this.shouldCheckLogin()) {
      this.props.checkLoginStatus()
    }
  }

  render () {
    const props = this.props;
    
    const isInProgress = this.isInProgress() || props.shouldCheckLogin
    const isLoggedIn = !!props.currentLogin
    const canShowContent = this.canShowContent()
    
    return (
      <div className="app-root">
        <CssBaseline />
        <AppBar position="static" color="default" className="app-bar">
          <Toolbar className="toolbar-title">
            <Typography variant="h6" color="inherit" noWrap className="title">
              Property Transactions
            </Typography>
            <Button className="main-link">
              Main Page
            </Button>
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
            {!isLoggedIn && 
            <Button 
              color="primary" 
              variant="outlined" 
              onClick={props.showRegisterPage}
              disabled={isInProgress}
            >
              Register
            </Button>}
            {isLoggedIn && 
            <Button 
              color="primary" 
              variant="outlined" 
              onClick={props.logout}
              disabled={isInProgress}
            >
              {props.currentLogin} Logout
            </Button>}
          </Toolbar>
        </AppBar>
        {isInProgress &&
        <LinearProgress />}
        <main className="layout">
          {canShowContent && props.page === PAGE_REGISTER &&
            <LoginForm mode={MODE_REGISTER}/>
          }
          {canShowContent && props.page === PAGE_LOGIN &&
            <LoginForm mode={MODE_LOGIN}/>
          }
          {canShowContent && props.page === PAGE_MAIN && isLoggedIn &&
            <MainPage />
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
      showRegisterPage: () => dispatch(showRegisterPage()),
      showMainPage: () => dispatch(showMainPage()),
      checkLoginStatus: () => dispatch(checkLoginStatus()),
      logout: () => dispatch(logout()),
    }
  },
)(Root)
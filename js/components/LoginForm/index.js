import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import './styles.scss'
import { Avatar, Button, FormControl, Input, InputLabel, LinearProgress, Paper, Typography } from '@material-ui/core'
import { MODE_LOGIN } from './constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { goToMainPage, startLogin, startRegister } from './actions'

class LoginForm extends Component {

  static propTypes = {
    mode: PropTypes.string.isRequired,
    inProgress: PropTypes.bool,
  }
  
  static defaultProps = {
    inProgress: false,
  }
  
  state = {
    email: '',
    password: '',
  }
  
  handleSubmit(event) {
    event.preventDefault()
    if (this.props.mode === MODE_LOGIN) {
      this.props.startLogin(this.state.email, this.state.password)
    } else {
      this.props.startRegister(this.state.email, this.state.password)
    }
  }
  
  componentDidUpdate (prevProps, prevState, snapshot) {
    const props = this.props
    if (props.loggedIn && prevProps.loggedIn !== props.loggedIn) {
      props.goToMainPage()
    }
  }

  render () {
    const props = this.props
    
    return (
      <div className="login-form">
        <Paper className="paper">
          <Avatar className="avatar">
            <FontAwesomeIcon icon="lock" />
          </Avatar>
          <Typography component="h1" variant="h5">
            {props.mode === MODE_LOGIN ? 'Login' : 'Register'}
          </Typography>
          <form className="form" onSubmit={event => this.handleSubmit(event)}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input 
                id="email" 
                name="email" 
                autoComplete="email" 
                autoFocus 
                disabled={props.inProgress} 
                value={this.state.email}
                onChange={(e) => this.setState({email: e.target.value})}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input 
                name="password" 
                type="password" 
                id="password" 
                autoComplete="current-password" 
                disabled={props.inProgress}
                value={this.state.password}
                onChange={(e) => this.setState({password: e.target.value})}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="submit"
              disabled={props.inProgress}
            >
              {props.mode === MODE_LOGIN ? 'Login' : 'Register'}
            </Button>
            {props.inProgress && 
              <LinearProgress />}
          </form>
        </Paper>
      </div>
    )
  }
}

export default connect(
  // Map store state to our component props
  (state) => {
    const myState = state['loginForm'] || {}
    return {...myState}
  },
  // Add actions methods to our component props
  (dispatch) => {
    return {
      startLogin: (email, password) => 
        dispatch(startLogin(email, password)),
      startRegister: (email, password) => 
        dispatch(startRegister(email, password)),
      goToMainPage: () =>
        dispatch(goToMainPage()),
    }
  },
)(LoginForm)
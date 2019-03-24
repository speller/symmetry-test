import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import './styles.scss'
import { Avatar, Button, FormControl, Input, InputLabel, LinearProgress, Paper, Typography } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { goToMainPage, startLogin, startRegister } from './actions'

class LoginForm extends Component {

  static propTypes = {
    inProgress: PropTypes.bool,
  }
  
  static defaultProps = {
    inProgress: false,
  }
  
  state = {
    name: '',
    password: '',
  }
  
  handleSubmit(event) {
    event.preventDefault()
    this.props.startLogin(this.state.name, this.state.password)
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    const props = this.props
    if (props.loggedIn && prevProps.loggedIn !== props.loggedIn) {
      props.goToMainPage()
    }
  }

  render() {
    const props = this.props
    
    return (
      <div className="login-form">
        <Paper className="paper">
          <Avatar className="avatar">
            <FontAwesomeIcon icon="lock" />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <form className="form" onSubmit={event => this.handleSubmit(event)}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Name</InputLabel>
              <Input 
                id="name"
                name="email" 
                autoComplete="email" 
                autoFocus 
                disabled={props.inProgress} 
                value={this.state.name}
                onChange={(e) => this.setState({name: e.target.value})}
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
              Login
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
      startLogin: (name, password) =>
        dispatch(startLogin(name, password)),
      goToMainPage: () =>
        dispatch(goToMainPage()),
    }
  },
)(LoginForm)
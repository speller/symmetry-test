import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import './styles.scss'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import LinearProgress from '@material-ui/core/LinearProgress'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { goToMainPage } from './actions'

class LoginForm extends Component {

  static propTypes = {
    inProgress: PropTypes.bool,
    loginProc: PropTypes.func.isRequired,
  }
  
  static defaultProps = {
    inProgress: false,
  }
  
  state = {
    login: '',
    password: '',
  }
  
  handleSubmit(event) {
    event.preventDefault()
    this.props.loginProc(this.state.login, this.state.password)
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
              <InputLabel htmlFor="email">Login</InputLabel>
              <Input 
                id="login"
                name="login"
                autoComplete="Login"
                autoFocus 
                disabled={props.inProgress} 
                value={this.state.login}
                onChange={(e) => this.setState({login: e.target.value})}
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
      goToMainPage: () =>
        dispatch(goToMainPage()),
    }
  },
)(LoginForm)
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper/index'
import { loadData } from './actions'
import './styles.scss'
import LinearProgress from '@material-ui/core/LinearProgress'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import { Button, Typography } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class MainPage extends Component {

  static defaultProps = {
  }
  
  state = {
    text: '',
  }
  
  render() {
    const props = this.props
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
            // disableUnderline
            id="text"
            name="text"
            className="text"
            autoComplete="Message Text"
            autoFocus
            disabled={props.inProgress}
            value={this.state.text}
            onChange={(e) => this.setState({text: e.target.value})}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="submit"
            disabled={props.inProgress}
          >
            <FontAwesomeIcon icon="paper-plane" />
          </Button>
        </div>
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
      loadData: (from, to, prefCode, cityCode) => 
        dispatch(loadData(from, to, prefCode, cityCode)),
    }
  },
)(MainPage)
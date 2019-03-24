import React, { Component } from 'react'
import { connect } from 'react-redux'
import Paper from '@material-ui/core/Paper'
import { loadData } from './actions'
import './styles.scss'
import LinearProgress from '@material-ui/core/LinearProgress'

class MainPage extends Component {

  static defaultProps = {
  }
  
  state = {
  }
  
  componentDidMount() {
    this.doLoadData()    
  }
  
  render() {
    return (
      <div className="main-page">
        <Paper className="paper" />
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
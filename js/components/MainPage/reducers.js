import { ACTION_LOAD_DATA, ACTION_LOAD_DATA_FAIL, ACTION_LOAD_DATA_SUCCESS } from './constants'

export default function(state = {}, action) {
  switch (action.type) {
    case ACTION_LOAD_DATA:
      return {
        ...state,
        inProgress: true,
      }
      
    case ACTION_LOAD_DATA_SUCCESS: {
      return {
        inProgress: false,
        rows: action.payload,
      }  
    }
    
    case ACTION_LOAD_DATA_FAIL: {
      alert("Load data fail: " + action.payload.message)
      return {
        inProgress: false,
      }  
    }
    
    default:
      return {...state}
  }
}
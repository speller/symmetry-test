import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import Root from './client/components/Root'
import rootSagas from './client/components/Root/sagas'
import mainPageSagas from './client/components/ChatForm/sagas'
import rootReducers from './client/components/Root/reducers'
import loginFormReducers from './client/components/LoginForm/reducers'
import mainPageReducers from './client/components/ChatForm/reducers'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons/faPaperPlane'

library.add(
  faLock,
  faPaperPlane,
)


function Page(store) {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  )
}

// Initialize reducers and sagas for the app
const reducers = {
  root: rootReducers,
  loginForm: loginFormReducers,
  mainPage: mainPageReducers,
}
const sagas = [].concat(rootSagas, mainPageSagas)


// Create Redux store with all the enhancements
const sagaMiddleware = createSagaMiddleware()
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  Object.keys(reducers).length ? combineReducers(reducers) : state => ({...state}),
  {},
  composeEnhancers(
    applyMiddleware(sagaMiddleware)
  )
)

// Run sagas
const rootSaga = function * () {
  yield all(sagas.map(saga => saga()))
}
sagaMiddleware.run(rootSaga)

// Render the whole application
ReactDOM.render(
  Page(store),
  document.getElementById('root')
)

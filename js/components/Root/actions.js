import { ACTION_CHECK_LOGIN, ACTION_LOGOUT, ACTION_SET_PAGE, PAGE_LOGIN, PAGE_MAIN, PAGE_REGISTER } from './constants'

export function showLoginPage () {
  return { 
    type: ACTION_SET_PAGE,
    payload: PAGE_LOGIN,
  }
}

export function showRegisterPage () {
  return {
    type: ACTION_SET_PAGE,
    payload: PAGE_REGISTER,
  }
}

export function showMainPage () {
  return {
    type: ACTION_SET_PAGE,
    payload: PAGE_MAIN,
  }
}

export function checkLoginStatus () {
  return {
    type: ACTION_CHECK_LOGIN,
  }
}

export function logout () {
  return {
    type: ACTION_LOGOUT,
  }
}

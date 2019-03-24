import { ACTION_LOGOUT, ACTION_SET_PAGE, PAGE_LOGIN, PAGE_MAIN } from './constants'

export function showLoginPage() {
  return { 
    type: ACTION_SET_PAGE,
    payload: PAGE_LOGIN,
  }
}

export function showMainPage() {
  return {
    type: ACTION_SET_PAGE,
    payload: PAGE_MAIN,
  }
}

export function logout() {
  return {
    type: ACTION_LOGOUT,
  }
}
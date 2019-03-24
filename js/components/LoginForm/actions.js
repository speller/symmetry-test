import { ACTION_LOGIN, ACTION_SET_PAGE, PAGE_MAIN } from '../Root/constants'

export function startLogin(name, password) {
  return {
    type: ACTION_LOGIN,
    payload: {
      name,
      password,
    },
  }
}

export function goToMainPage() {
  return {
    type: ACTION_SET_PAGE,
    payload: PAGE_MAIN,
  }
}
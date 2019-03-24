import { ACTION_LOGIN, ACTION_REGISTER, ACTION_SET_PAGE, PAGE_MAIN } from '../Root/constants'

export function startLogin(email, password) {
  return {
    type: ACTION_LOGIN,
    payload: {
      email,
      password,
    }
  }
}

export function startRegister(email, password) {
  return {
    type: ACTION_REGISTER,
    payload: {
      email,
      password,
    }
  }
}

export function goToMainPage () {
  return {
    type: ACTION_SET_PAGE,
    payload: PAGE_MAIN,
  }
}
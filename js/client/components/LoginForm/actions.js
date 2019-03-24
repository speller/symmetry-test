import { ACTION_SET_PAGE, PAGE_MAIN } from '../Root/constants'

export function goToMainPage() {
  return {
    type: ACTION_SET_PAGE,
    payload: PAGE_MAIN,
  }
}
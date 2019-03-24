/**
 * Various utilities
 */

/**
 * Creates random string to be used as ID
 * @param length
 * @returns {string|string}
 */
export function makeRandomId(length) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}
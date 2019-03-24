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
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}

/**
 * Convert number to string not less than 2 digits
 * @param v
 * @returns {string}
 * @private
 */
function _formatInt(v) {
  const r = String(v)
  return v < 10 ? '0' + r : r
}

/**
 * Formats date using specified format. Simplified version.
 * @param date
 * @param format
 * @returns {string|string}
 */
export function formatDate(date, format) {
  const replacements = {
    Y: () => date.getUTCFullYear(),
    m: () => _formatInt(date.getUTCMonth()+1),
    d: () => _formatInt(date.getUTCDate()),
    H: () => _formatInt(date.getUTCHours()),
    i: () => _formatInt(date.getUTCMinutes()),
    s: () => _formatInt(date.getUTCSeconds()),
  }
  let result = ''
  for (let i = 0; i < format.length; i++) {
    const c = format[i]
    const f = replacements[c]
    result += f ? f() : c
  }
  return result
}
/**
 * Return user name color depending on user id
 * @param userId
 * @returns {string}
 */
export function getColorByUserId(userId) {
  const colors = ['blue', 'brown', 'cornflowerblue', 'crimson', 'darkcyan']
  return colors[userId % colors.length]
}
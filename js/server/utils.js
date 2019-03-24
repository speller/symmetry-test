
export function getColorByUserId(userId) {
  const colors = ['blue', 'brown', 'cornflowerblue', 'crimson', 'darkcyan']
  return colors[userId % colors.length]
}
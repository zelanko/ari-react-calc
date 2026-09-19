export function formatNumber(value) {
  if (!Number.isFinite(value)) return 'Error'
  return String(Number(value.toFixed(10)))
}

export function calculate(left, operator, right) {
  const first = Number(left)
  const second = Number(right)

  if (operator === '+') return first + second
  if (operator === '-') return first - second
  if (operator === '*') return first * second
  if (operator === '/') return second === 0 ? Number.NaN : first / second
  return second
}

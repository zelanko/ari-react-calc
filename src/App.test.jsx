import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App.jsx'
import { calculate, formatNumber } from './calculator.js'

function calculator() {
  render(<App />)
  return screen.getByRole('region', { name: 'Calculator' })
}

function display() {
  return screen.getByRole('status')
}

describe('calculator helpers', () => {
  it.each([
    ['+', '7', '5', 12],
    ['-', '9', '4', 5],
    ['*', '6', '7', 42],
    ['/', '8', '2', 4],
  ])('calculates %s correctly', (operator, left, right, expected) => {
    expect(calculate(left, operator, right)).toBe(expected)
  })

  it('returns NaN for division by zero and Error when formatted', () => {
    expect(calculate('8', '/', '0')).toBeNaN()
    expect(formatNumber(Number.NaN)).toBe('Error')
  })

  it('rounds floating point noise', () => {
    expect(formatNumber(calculate('0.1', '+', '0.2'))).toBe('0.3')
  })
})

describe('calculator UI', () => {
  it('starts at zero with a ready message', () => {
    calculator()
    expect(display()).toHaveTextContent('0')
    expect(screen.getByText('Ready when you are')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: "Ari's Practice Calc" })).toBeInTheDocument()
  })

  it.each([
    [['7', '+', '5', '='], '12'],
    [['9', '−', '4', '='], '5'],
    [['6', '×', '7', '='], '42'],
    [['8', '÷', '2', '='], '4'],
  ])('calculates %s', async (labels, expected) => {
    const user = userEvent.setup()
    calculator()
    for (const label of labels) await user.click(screen.getByRole('button', { name: label }))
    expect(display()).toHaveTextContent(expected)
  })

  it('supports decimals, percent, and delete', async () => {
    const user = userEvent.setup()
    calculator()
    await user.click(screen.getByRole('button', { name: '1' }))
    await user.click(screen.getByRole('button', { name: '.' }))
    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: '%' }))
    expect(display()).toHaveTextContent('0.015')
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(display()).toHaveTextContent('0.01')
  })

  it('does not add a second decimal and normalizes leading zeroes', async () => {
    const user = userEvent.setup()
    calculator()
    await user.click(screen.getByRole('button', { name: '0' }))
    await user.click(screen.getByRole('button', { name: '5' }))
    await user.click(screen.getByRole('button', { name: '.' }))
    await user.click(screen.getByRole('button', { name: '.' }))
    await user.click(screen.getByRole('button', { name: '2' }))
    expect(display()).toHaveTextContent('5.2')
  })

  it('clears all state and recovers from division by zero', async () => {
    const user = userEvent.setup()
    calculator()
    for (const label of ['8', '÷', '0', '=']) {
      await user.click(screen.getByRole('button', { name: label }))
    }
    expect(display()).toHaveTextContent('Error')
    await user.click(screen.getByRole('button', { name: '3' }))
    expect(display()).toHaveTextContent('3')
    await user.click(screen.getByRole('button', { name: 'AC' }))
    expect(display()).toHaveTextContent('0')
    expect(screen.getByText('Ready when you are')).toBeInTheDocument()
  })

  it('allows replacing a pending operator and evaluates left to right', async () => {
    const user = userEvent.setup()
    calculator()
    for (const label of ['5', '+', '−', '2', '=']) {
      await user.click(screen.getByRole('button', { name: label }))
    }
    expect(display()).toHaveTextContent('3')

    for (const label of ['AC', '2', '+', '3', '×', '4', '=']) {
      await user.click(screen.getByRole('button', { name: label }))
    }
    expect(display()).toHaveTextContent('20')
  })

  it('supports keyboard input and shortcuts', async () => {
    const user = userEvent.setup()
    calculator()
    await user.keyboard('7+5=')
    expect(display()).toHaveTextContent('12')
    await user.keyboard('{Backspace}')
    expect(display()).toHaveTextContent('1')
    await user.keyboard('{Escape}')
    expect(display()).toHaveTextContent('0')
  })
})

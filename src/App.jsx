import './App.css'

import { useEffect, useState } from 'react'

const buttons = [
  { label: 'AC', value: 'clear', kind: 'utility' },
  { label: 'DEL', value: 'delete', kind: 'utility' },
  { label: '%', value: 'percent', kind: 'utility' },
  { label: '÷', value: '/', kind: 'operator' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '×', value: '*', kind: 'operator' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '−', value: '-', kind: 'operator' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '+', value: '+', kind: 'operator' },
  { label: '0', value: '0', kind: 'zero' },
  { label: '.', value: '.' },
  { label: '=', value: 'equals', kind: 'equals' },
]

function formatNumber(value) {
  if (!Number.isFinite(value)) return 'Error'
  return String(Number(value.toFixed(10)))
}

function calculate(left, operator, right) {
  const first = Number(left)
  const second = Number(right)

  if (operator === '+') return first + second
  if (operator === '-') return first - second
  if (operator === '*') return first * second
  if (operator === '/') return second === 0 ? Number.NaN : first / second
  return second
}

function App() {
  const [display, setDisplay] = useState('0')
  const [previous, setPrevious] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [expression, setExpression] = useState('')

  const reset = () => {
    setDisplay('0')
    setPrevious(null)
    setOperator(null)
    setWaitingForOperand(false)
    setExpression('')
  }

  const inputDigit = (digit) => {
    if (display === 'Error' || waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
      return
    }
    setDisplay(display === '0' ? digit : `${display}${digit}`)
  }

  const inputDecimal = () => {
    if (display === 'Error' || waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }
    if (!display.includes('.')) setDisplay(`${display}.`)
  }

  const chooseOperator = (nextOperator) => {
    if (display === 'Error') return
    if (operator && !waitingForOperand) {
      const result = calculate(previous, operator, display)
      const formatted = formatNumber(result)
      setDisplay(formatted)
      setPrevious(formatted)
    } else {
      setPrevious(display)
    }
    setOperator(nextOperator)
    setWaitingForOperand(true)
    setExpression(`${display} ${nextOperator}`)
  }

  const performCalculation = () => {
    if (!operator || previous === null || display === 'Error') return
    const result = formatNumber(calculate(previous, operator, display))
    setExpression(`${previous} ${operator} ${display} =`)
    setDisplay(result)
    setPrevious(null)
    setOperator(null)
    setWaitingForOperand(true)
  }

  const handlePress = (value) => {
    if (/^\d$/.test(value)) inputDigit(value)
    else if (value === '.') inputDecimal()
    else if (value === 'clear') reset()
    else if (value === 'delete') {
      if (display.length > 1 && display !== 'Error') setDisplay(display.slice(0, -1))
      else setDisplay('0')
    } else if (value === 'percent' && display !== 'Error') {
      setDisplay(formatNumber(Number(display) / 100))
    } else if (value === 'equals') performCalculation()
    else chooseOperator(value)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key
      if (/^\d$/.test(key) || key === '.') handlePress(key)
      else if (['+', '-', '*', '/'].includes(key)) handlePress(key)
      else if (key === 'Enter' || key === '=') handlePress('equals')
      else if (key === 'Escape') handlePress('clear')
      else if (key === 'Backspace') handlePress('delete')
      else if (key === '%') handlePress('percent')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  return (
    <main className="app-shell">
      <div className="brand-mark" aria-hidden="true">/ /</div>
      <section className="calculator" aria-label="Calculator">
        <header className="calculator-header">
          <div>
            <p className="eyebrow">Pocket utility / 01</p>
            <h1>Ari's Practice Calc</h1>
          </div>
          <span className="status-light" aria-label="Ready" />
        </header>

        <div className="display" aria-live="polite">
          <p className="expression">{expression || 'Ready when you are'}</p>
          <output>{display}</output>
        </div>

        <div className="keypad">
          {buttons.map(({ label, value, kind = '' }) => (
            <button
              key={value}
              type="button"
              className={`key ${kind}`}
              onClick={() => handlePress(value)}
              aria-label={label === 'DEL' ? 'Delete' : label}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="hint">Keyboard ready <span>·</span> ESC to clear</p>
      </section>
    </main>
  )
}

export default App

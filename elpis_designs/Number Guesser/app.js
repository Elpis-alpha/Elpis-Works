// Game values
const min = 1
const max = 10
const totalGuesses = 3

let winningNum
let guessesLeft
let over

// UI elements
const form = document.querySelector('#guess-form')
const guessBtn = document.querySelector('#guess-btn')
const guessInput = document.querySelector('#guess-input')
const message = document.querySelector('#message')
const pips = document.querySelector('#pips')
const livesText = document.querySelector('#lives-text')
const historyEl = document.querySelector('#history')

document.querySelector('.min-num').textContent = min
document.querySelector('.max-num').textContent = max
guessInput.min = min
guessInput.max = max

form.addEventListener('submit', function (e) {
  e.preventDefault()
  if (over) {
    newGame()
    return
  }

  const guess = Number(guessInput.value)

  if (guessInput.value.trim() === '' || !Number.isInteger(guess) || guess < min || guess > max) {
    setMessage(`Enter a whole number from ${min} to ${max}.`, 'hint')
    shake()
    guessInput.select()
    return
  }

  if (guess === winningNum) {
    addHistory(guess, true)
    gameOver(true, `${winningNum} is right. You got it in ${totalGuesses - guessesLeft + 1}!`)
    return
  }

  guessesLeft -= 1
  addHistory(guess, false)
  renderLives()

  if (guessesLeft === 0) {
    gameOver(false, `Out of guesses. The number was ${winningNum}.`)
    return
  }

  const direction = guess < winningNum ? 'higher' : 'lower'
  const close = Math.abs(guess - winningNum) <= 2 ? 'Close! ' : ''
  const left = guessesLeft === 1 ? '1 guess left' : `${guessesLeft} guesses left`
  setMessage(`${close}${guess} is not it. Go ${direction}. ${left}.`, 'hint')
  shake()
  guessInput.value = ''
  guessInput.focus()
})

function newGame() {
  winningNum = getRandomNum(min, max)
  guessesLeft = totalGuesses
  over = false
  guessInput.disabled = false
  guessInput.value = ''
  guessBtn.textContent = 'Guess'
  historyEl.innerHTML = ''
  setMessage('', '')
  renderLives()
  guessInput.focus()
}

function getRandomNum(lo, hi) {
  return Math.floor(Math.random() * (hi - lo + 1) + lo)
}

function setMessage(msg, cls) {
  message.textContent = msg
  message.className = 'message ' + cls
}

function renderLives() {
  pips.innerHTML = ''
  for (let i = 0; i < totalGuesses; i++) {
    const pip = document.createElement('span')
    pip.className = 'pip' + (i >= guessesLeft ? ' used' : '')
    pips.appendChild(pip)
  }
  livesText.textContent = `${guessesLeft} of ${totalGuesses}`
}

function addHistory(guess, right) {
  const li = document.createElement('li')
  li.textContent = right ? `${guess} ✓` : `${guess} ${guess < winningNum ? '↑' : '↓'}`
  li.setAttribute('aria-label', right ? `${guess}, correct` : `${guess}, ${guess < winningNum ? 'too low' : 'too high'}`)
  if (right) li.className = 'right'
  historyEl.appendChild(li)
}

function shake() {
  form.classList.remove('shake')
  void form.offsetWidth
  form.classList.add('shake')
}

function gameOver(won, msg) {
  over = true
  guessInput.disabled = true
  guessInput.value = ''
  setMessage(msg, won ? 'won' : 'lost')
  guessBtn.textContent = 'Play again'
  guessBtn.focus()
}

newGame()

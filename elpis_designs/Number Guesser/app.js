// Game Values 
let min = 1;

let max = 10;

let winningNum = getRandomNum(min, max)

let guesses = 3


// UI Lements
const game = document.querySelector('#game')

const minNum = document.querySelector('.min-num')

const maxNum = document.querySelector('.max-num')

const guessBtn = document.querySelector('#guess-btn')

const guessInput = document.querySelector('#guess-input')

const message = document.querySelector('.message')

const form = document.querySelector('.form-holder')


// Assign UI min and max
minNum.textContent = min

maxNum.textContent = max


// Event Listeners 
guessBtn.addEventListener('click', function () {

  let guess = parseInt(guessInput.value)

  // Validate
  if (isNaN(guess) || guess < min || guess > max) {
    setMessage(`Please enter a number between ${min} and ${max}`, 'black', 'underline')
  } else {
    // If won
    if (guess === winningNum) {
      gameOver(true, `You have guessed the right number, ${winningNum} is correct`)
    } else {
      // Wrong Number
      guesses -= 1

      if (guesses === 0) {
        gameOver(false, `Game Over, you lost. The correct number was ${winningNum}`)
      } else {
        if (Math.abs(guess - winningNum) <= 3) {
          setMessage(`You are close but ${guess} is not correct, ${guesses} guesses left`, 'yellow', 'underline')
        } else {
          setMessage(`You are far, ${guess} is not correct, ${guesses} guesses left`, 'yellow', 'underline')
        }
      }
    }
  }
  guessInput.value = '';
})

game.addEventListener('mousedown', function (e) {
  if (e.target.className === 'play-again') {
    guessInput.disabled = false
    window.location.reload();
  }
})

form.addEventListener('submit', function (e) {
  e.preventDefault();
})

window.addEventListener('load', function (e) {
  guessInput.disabled = false;
})

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// Send Message
function setMessage(msg, color, decor) {
  message.textContent = msg;
  message.style.color = color;
  message.style.textDecoration = decor;
}

// Game Over
function gameOver(won, msg) {
  let color
  won === true ? (color = 'greenyellow', decor = 'none') : (color = 'black', decor = 'underline')

  guessInput.disabled = true;

  setMessage(msg, color, decor)

  guessBtn.value = 'Play Again';

  guessBtn.className += 'play-again';
}
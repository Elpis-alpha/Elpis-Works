const form = document.querySelector('#joke-form')
const numInput = document.querySelector('#number')
const button = document.querySelector('.get-jokes')
const hint = document.querySelector('#hint')
const statusEl = document.querySelector('#status')
const list = document.querySelector('#jokes')

const MAX = 20
let jokesCache = null

form.addEventListener('submit', getJokes)

// Load the local "API" once and keep it.
function loadJokes() {
  if (jokesCache) return Promise.resolve(jokesCache)
  return fetch('chuckNoris.json')
    .then(res => {
      if (!res.ok) throw new Error(res.status)
      return res.json()
    })
    .then(data => {
      if (data.type !== 'success') throw new Error('Bad response')
      jokesCache = data.value.map(j => j.joke.replace(/&quot;/g, '"'))
      return jokesCache
    })
}

// Pick n distinct jokes (partial Fisher-Yates shuffle).
function pick(all, n) {
  const pool = all.slice()
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(Math.random() * (pool.length - i))
    const tmp = pool[i]
    pool[i] = pool[j]
    pool[j] = tmp
  }
  return pool.slice(0, n)
}

function getJokes(e) {
  e.preventDefault()

  const number = Number(numInput.value)
  if (!Number.isInteger(number) || number < 1 || number > MAX) {
    numInput.setAttribute('aria-invalid', 'true')
    hint.textContent = `Enter a whole number from 1 to ${MAX}.`
    hint.classList.add('error')
    numInput.focus()
    return
  }
  numInput.removeAttribute('aria-invalid')
  hint.textContent = `Pick a number from 1 to ${MAX}.`
  hint.classList.remove('error')

  button.setAttribute('aria-busy', 'true')
  button.textContent = 'Getting jokes…'

  loadJokes()
    .then(all => {
      list.innerHTML = ''
      pick(all, number).forEach((joke, i) => {
        const li = document.createElement('li')
        li.textContent = joke
        li.style.setProperty('--i', i)
        list.appendChild(li)
      })
      statusEl.textContent = number === 1 ? 'Here is your joke.' : `Here are ${number} jokes.`
    })
    .catch(() => {
      list.innerHTML = ''
      statusEl.textContent = 'Could not load the jokes. Check your connection and try again.'
    })
    .finally(() => {
      button.removeAttribute('aria-busy')
      button.textContent = 'Get jokes'
    })
}

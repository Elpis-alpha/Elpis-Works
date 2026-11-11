// UI elements
const UISearchForm = document.querySelector('#search-word')
const UISearchInput = document.querySelector('#word-input')
const UIDisplayWord = document.querySelector('#display-meaning')
const UIStatus = document.querySelector('#status')
const UIMore = document.querySelector('#more')

// The dictionary is split into one file per starting letter (words/a.json ... words/z.json,
// plus words/_.json for entries that start with anything else), so an exact or
// "starts with" search only downloads one letter instead of the whole dictionary.
const SHARDS = 'abcdefghijklmnopqrstuvwxyz_'.split('')
const PAGE = 50
const cache = {}
const loaded = {}

let results = []
let shown = 0
let currentWord = ''
let searchId = 0

function shardFor(word) {
  const c = word.charAt(0)
  return c >= 'a' && c <= 'z' ? c : '_'
}

function loadShard(letter) {
  if (!cache[letter]) {
    cache[letter] = fetch(`words/${letter}.json`).then(res => {
      if (!res.ok) throw new Error(res.status)
      return res.json()
    }).then(data => {
      loaded[letter] = data
      return data
    })
    cache[letter].catch(() => { delete cache[letter] })
  }
  return cache[letter]
}

function setStatus(text, loading) {
  UIStatus.textContent = text
  UIStatus.classList.toggle('loading', !!loading)
}

function mode() {
  return document.querySelector('input[name=mode]:checked').value
}

// Events
UISearchForm.addEventListener('submit', function (e) {
  e.preventDefault()
  findWord()
})
document.querySelectorAll('input[name=mode]').forEach(r => {
  r.addEventListener('change', () => { if (UISearchInput.value.trim()) findWord() })
})
UIMore.addEventListener('click', renderMore)

function findWord() {
  const word = UISearchInput.value.trim().toLowerCase()
  const m = mode()
  const id = ++searchId

  UIDisplayWord.innerHTML = ''
  UIMore.hidden = true
  results = []
  shown = 0
  currentWord = word

  syncUrl(word, m)

  if (!word) {
    setStatus('')
    showNotice('Type a word to look it up', 'Enter a word above, then choose how it should match.')
    UISearchInput.focus()
    return
  }

  if (m === 'contain' && word.length < 2) {
    setStatus('')
    showNotice('Type at least 2 letters', 'Contains searches every word, so it needs at least 2 letters to search for.')
    UISearchInput.focus()
    return
  }

  const letters = m === 'contain' ? SHARDS : [shardFor(word)]
  let done = 0
  setStatus(m === 'contain' ? 'Searching every word…' : 'Searching…', true)

  Promise.all(letters.map(l => loadShard(l).then(data => {
    done++
    if (m === 'contain' && id === searchId) setStatus(`Searching every word… ${done} of ${letters.length} letters`, true)
    return data
  })))
    .then(shards => {
      if (id !== searchId) return

      shards.forEach(data => {
        for (const key in data) {
          if (m === 'exact' ? key === word
            : m === 'start' ? key.startsWith(word)
            : key.includes(word)) {
            results.push(key)
          }
        }
      })

      // Exact match first, then words that start with the search, then the rest; alphabetical within each.
      const rank = k => (k === word ? 0 : k.startsWith(word) ? 1 : 2)
      results.sort((a, b) => rank(a) - rank(b) || (a < b ? -1 : a > b ? 1 : 0))

      if (!results.length) {
        setStatus('')
        const tip = m === 'contain' ? 'Check the spelling and try again.' : 'Check the spelling, or try Contains to search inside words.'
        showNotice(`No words match “${word}”`, tip)
        return
      }

      setStatus(results.length === 1 ? '1 word found' : `${results.length.toLocaleString()} words found`)
      renderMore()
    })
    .catch(() => {
      if (id !== searchId) return
      setStatus('')
      showNotice('Could not load the dictionary', 'Check your connection and search again.')
    })
}

function renderMore() {
  const frag = document.createDocumentFragment()
  results.slice(shown, shown + PAGE).forEach(key => {
    const entry = document.createElement('article')
    entry.className = 'entry'

    const h = document.createElement('h2')
    h.className = 'word'
    highlight(h, key, currentWord)

    const p = document.createElement('p')
    p.className = 'meaning'
    p.textContent = loaded[shardFor(key)][key]

    entry.appendChild(h)
    entry.appendChild(p)
    frag.appendChild(entry)
  })
  UIDisplayWord.appendChild(frag)
  shown = Math.min(shown + PAGE, results.length)

  const left = results.length - shown
  UIMore.hidden = left <= 0
  UIMore.textContent = `Show ${Math.min(left, PAGE)} more of ${left.toLocaleString()}`
}

function highlight(el, key, word) {
  const i = key.indexOf(word)
  if (i < 0 || !word) { el.textContent = key; return }
  el.appendChild(document.createTextNode(key.slice(0, i)))
  const mark = document.createElement('mark')
  mark.textContent = key.slice(i, i + word.length)
  el.appendChild(mark)
  el.appendChild(document.createTextNode(key.slice(i + word.length)))
}

function showNotice(title, text) {
  UIDisplayWord.innerHTML = ''
  const box = document.createElement('div')
  box.className = 'notice'
  const h = document.createElement('h2')
  h.textContent = title
  const p = document.createElement('p')
  p.textContent = text
  box.appendChild(h)
  box.appendChild(p)
  UIDisplayWord.appendChild(box)
}

// Keep the search in the URL so a lookup can be shared or bookmarked.
function syncUrl(word, m) {
  const params = new URLSearchParams()
  if (word) params.set('q', word)
  if (m !== 'start') params.set('mode', m)
  const qs = params.toString()
  history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''))
}

;(function restore() {
  const params = new URLSearchParams(location.search)
  const m = params.get('mode')
  const radio = document.querySelector(`input[name=mode][value="${m === 'exact' || m === 'contain' ? m : 'start'}"]`)
  radio.checked = true
  const q = params.get('q')
  if (q) {
    UISearchInput.value = q
    findWord()
  } else {
    UISearchInput.focus()
  }
})()

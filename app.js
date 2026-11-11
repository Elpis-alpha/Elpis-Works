(function () {
  'use strict'

  var projects = [
    {
      title: 'Book List',
      path: 'elpis_designs/Book List/ES6/index.html',
      image: 'images/book_list.jpg',
      color: '#708090',
      alt: 'Book List app: a white card on slate gray with title, author and ISBN fields, an Add book button and a table of three books',
      description: 'Add and delete books in a tidy table. Your list is saved to local storage.',
      tags: ['Storage', 'Forms']
    },
    {
      title: 'Chuck Norris Joke Generator',
      path: 'elpis_designs/Chuck Norris Generator/index.html',
      image: 'images/chuck_norris.jpg',
      color: '#ffffff',
      alt: 'Chuck Norris Joke Generator: a bold heading, a number field set to 3, a blue Get jokes button and three numbered jokes',
      description: 'Pick how many jokes you want and fetch them from a local JSON API.',
      tags: ['API']
    },
    {
      title: 'Elpis Dictionary',
      path: 'elpis_designs/Elpis Dictionary/index.html',
      image: 'images/elpis_dictionary.jpg',
      color: '#9acd32',
      alt: 'Elpis Dictionary: a search for "verdant" on a green background, with match options and the definitions of verdant and verdantly',
      description: 'Search a dictionary by whole word, starting letters or any containing text.',
      tags: ['API', 'Tool']
    },
    {
      title: 'Loan Calculator',
      path: 'elpis_designs/Loan Calculator/index.html',
      image: 'images/loan_calculator.jpg',
      color: '#e9967a',
      alt: 'Loan Calculator: a dark red card with a $25,000 loan at 6.5% over 5 years, a monthly payment of $489.15 and a bar splitting principal from interest',
      description: 'Enter an amount, interest rate and term to see your repayment breakdown.',
      tags: ['Tool', 'Forms']
    },
    {
      title: 'Number Guesser',
      path: 'elpis_designs/Number Guesser/index.html',
      image: 'images/number_guesser.jpg',
      color: '#b258ca',
      alt: 'Number Guesser: a purple card with one guess left, a hint that says close, go lower, and two earlier guesses',
      description: 'A small guessing game that reacts to every attempt and tracks your progress.',
      tags: ['Game']
    },
    {
      title: 'Task List',
      path: 'elpis_designs/Tasks/index.html',
      image: 'images/task_list.jpg',
      color: '#4c6180',
      alt: 'Task List: a card on slate blue with a New task field, a filter box and three tasks, the first checked off',
      description: 'Add, check off, filter and remove tasks, with everything saved in local storage.',
      tags: ['Storage', 'Tool']
    },
    {
      title: 'Form Validation',
      path: 'elpis_designs/Form Validation/index.html',
      image: 'images/form_validation.jpg',
      color: '#00ffff',
      alt: 'Form Validation: a sign-up form on cyan with name, ZIP code and phone marked valid and an error under the email field',
      description: 'A form that validates each field as you leave it, with instant feedback.',
      tags: ['Forms']
    },
    {
      title: 'Tracalorie',
      path: 'elpis_designs/Tracalorie/index.html',
      image: 'images/tracalorie.jpg',
      color: '#ff69b4',
      alt: 'Tracalorie: a white card on pink showing 1,280 calories today with a progress bar, an Add a meal form and three logged meals',
      description: 'Track your calorie intake with add, edit and delete for every meal.',
      tags: ['Storage', 'Tool']
    }
  ]

  var root = document.documentElement
  var grid = document.getElementById('grid')
  var chipsEl = document.getElementById('chips')
  var search = document.getElementById('search')
  var statusEl = document.getElementById('status')
  var emptyEl = document.getElementById('empty')
  var toggle = document.getElementById('theme-toggle')
  var activeTag = 'All'

  function store(kind, key, value) {
    try {
      var s = kind === 'local' ? localStorage : sessionStorage
      if (value === undefined) return s.getItem(key)
      s.setItem(key, value)
    } catch (e) { return null }
  }

  /* ---- Theme ---- */
  function currentTheme() {
    return root.dataset.theme ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  }
  function syncToggle() {
    var next = currentTheme() === 'light' ? 'dark' : 'light'
    toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme')
    toggle.title = 'Switch to ' + next + ' theme'
  }
  toggle.addEventListener('click', function () {
    var next = currentTheme() === 'light' ? 'dark' : 'light'
    root.dataset.theme = next
    store('local', 'theme', next)
    var color = next === 'light' ? '#f3f5f7' : '#00192a'
    ;['tc-dark', 'tc-light'].forEach(function (id) {
      var m = document.getElementById(id)
      if (m) m.setAttribute('content', color)
    })
    syncToggle()
  })
  syncToggle()

  /* ---- Cards ---- */
  function el(tag, cls, text) {
    var n = document.createElement(tag)
    if (cls) n.className = cls
    if (text) n.textContent = text
    return n
  }

  var cards = projects.map(function (p) {
    var a = el('a', 'card')
    a.href = encodeURI(p.path)
    a.setAttribute('aria-label', p.title + ': ' + p.description)

    var media = el('div', 'card-media')
    media.style.setProperty('--mat', p.color)
    var img = el('img')
    img.src = p.image
    img.alt = p.alt
    img.width = 1152
    img.height = 864
    img.loading = 'lazy'
    img.decoding = 'async'
    media.appendChild(img)

    var body = el('div', 'card-body')
    body.appendChild(el('h3', 'card-title', p.title))
    body.appendChild(el('p', 'card-desc', p.description))
    body.appendChild(el('p', 'card-tags', p.tags.join(', ')))

    a.appendChild(media)
    a.appendChild(body)
    grid.appendChild(a)
    return a
  })

  /* ---- Filter ---- */
  var tagCounts = { All: projects.length }
  var allTags = ['All']
  projects.forEach(function (p) {
    p.tags.forEach(function (t) {
      if (!tagCounts[t]) { tagCounts[t] = 0; allTags.push(t) }
      tagCounts[t]++
    })
  })

  var chips = allTags.map(function (t) {
    var b = el('button', 'chip', t)
    b.type = 'button'
    b.dataset.tag = t
    var n = el('span', 'chip-n', String(tagCounts[t]))
    n.setAttribute('aria-hidden', 'true')
    b.appendChild(n)
    b.setAttribute('aria-label', t + ', ' + tagCounts[t] + (tagCounts[t] === 1 ? ' project' : ' projects'))
    b.addEventListener('click', function () { setTag(t) })
    chipsEl.appendChild(b)
    return b
  })

  function setTag(t) {
    activeTag = allTags.indexOf(t) >= 0 ? t : 'All'
    chips.forEach(function (c) {
      c.setAttribute('aria-pressed', String(c.dataset.tag === activeTag))
    })
    applyFilter()
  }

  /* Keep the filter in the URL so a filtered view can be shared or bookmarked. */
  function syncUrl() {
    if (!window.history || !history.replaceState) return
    var params = new URLSearchParams()
    var q = search.value.trim()
    if (q) params.set('q', q)
    if (activeTag !== 'All') params.set('tag', activeTag)
    var qs = params.toString()
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash)
  }

  function applyFilter() {
    var terms = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
    var shown = 0
    projects.forEach(function (p, i) {
      var hay = (p.title + ' ' + p.description + ' ' + p.tags.join(' ')).toLowerCase()
      var ok = (activeTag === 'All' || p.tags.indexOf(activeTag) >= 0) &&
        terms.every(function (w) { return hay.indexOf(w) >= 0 })
      cards[i].hidden = !ok
      if (ok) shown++
    })
    emptyEl.hidden = shown !== 0
    statusEl.textContent = shown === projects.length && !terms.length && activeTag === 'All'
      ? '' : 'Showing ' + shown + ' of ' + projects.length + ' projects'
    syncUrl()
  }

  function reset() {
    search.value = ''
    setTag('All')
  }

  search.addEventListener('input', applyFilter)
  search.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && search.value) { e.preventDefault(); search.value = ''; applyFilter() }
  })
  document.getElementById('reset').addEventListener('click', function () {
    reset()
    search.focus()
  })

  /* "/" jumps to search from anywhere except another text field. */
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return
    var t = e.target
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
    e.preventDefault()
    search.focus()
    search.select()
  })

  var params = new URLSearchParams(location.search)
  search.value = params.get('q') || ''
  setTag(params.get('tag') || 'All')

  document.getElementById('total-count').textContent = projects.length
  document.getElementById('year').textContent = new Date().getFullYear()

  /* ---- Intro (first visit per session only) ---- */
  if (root.classList.contains('intro')) {
    store('session', 'seen', '1')
    setTimeout(function () { root.classList.remove('intro') }, 900)
  }
})()

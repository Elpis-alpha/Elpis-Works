(function () {
  'use strict'

  var projects = [
    {
      title: 'Book List',
      path: 'elpis_designs/Book List/ES6/index.html',
      image: 'images/book_list.jpg',
      alt: 'Book List app: an Add Book form with title, author and ISBN fields above an empty table',
      description: 'Add and delete books in a tidy table. Your list is saved to local storage.',
      tags: ['Storage', 'Forms']
    },
    {
      title: 'Chuck Norris Joke Generator',
      path: 'elpis_designs/Chuck Norris Generator/index.html',
      image: 'images/chuck_norris.jpg',
      alt: 'Chuck Norris Joke Generator: a number input, a Get Jokes button and a list of six jokes',
      description: 'Pick how many jokes you want and fetch them from a local JSON API.',
      tags: ['API']
    },
    {
      title: 'Elpis Dictionary',
      path: 'elpis_designs/Elpis Dictionary/index.html',
      image: 'images/elpis_dictionary.jpg',
      alt: 'Elpis Dictionary: a search box with word match options and definitions for words starting with "critic" on a green background',
      description: 'Search a dictionary by whole word, starting letters or any containing text.',
      tags: ['API', 'Tool']
    },
    {
      title: 'Loan Calculator',
      path: 'elpis_designs/Loan Calculator/index.html',
      image: 'images/loan_calculator.jpg',
      alt: 'Loan Calculator: a dark red card with amount, interest and years fields and a Calculate button on a salmon background',
      description: 'Enter an amount, interest rate and term to see your repayment breakdown.',
      tags: ['Tool', 'Forms']
    },
    {
      title: 'Number Guesser',
      path: 'elpis_designs/Number Guesser/index.html',
      image: 'images/number_guesser.jpg',
      alt: 'Number Guesser: a purple card asking you to guess a number between 1 and 10 with an input and Submit button',
      description: 'A small guessing game that reacts to every attempt and tracks your progress.',
      tags: ['Game']
    },
    {
      title: 'Task List',
      path: 'elpis_designs/Tasks/index.html',
      image: 'images/task_list.jpg',
      alt: 'Task List: a gray card with a New Task field, Add Task button, a filter box and a Clear Tasks button on a blue background',
      description: 'Add, remove and filter tasks, with everything saved in local storage.',
      tags: ['Storage', 'Tool']
    },
    {
      title: 'Form Validation',
      path: 'elpis_designs/Form Validation/index.html',
      image: 'images/form_validation.jpg',
      alt: 'Form Validation: a cyan form with name, zipcode, email and phone number fields and a Submit button',
      description: 'A form that validates each field as you leave it, with instant feedback.',
      tags: ['Forms']
    },
    {
      title: 'Tracalorie',
      path: 'elpis_designs/Tracalorie/index.html',
      image: 'images/tracalorie.jpg',
      alt: 'Tracalorie: a pink calorie tracker showing an Add Meal form, a total of 3600 calories and a list of three meals',
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
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  }
  function syncToggle() {
    toggle.setAttribute('aria-pressed', String(currentTheme() === 'light'))
    toggle.title = 'Switch to ' + (currentTheme() === 'light' ? 'dark' : 'light') + ' theme'
  }
  toggle.addEventListener('click', function () {
    var next = currentTheme() === 'light' ? 'dark' : 'light'
    root.dataset.theme = next
    store('local', 'theme', next)
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

  var cards = projects.map(function (p, i) {
    var a = el('a', 'card')
    a.href = encodeURI(p.path)
    a.setAttribute('aria-label', p.title + ': ' + p.description)
    a.style.setProperty('--i', i)

    var media = el('div', 'card-media')
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
    var tags = el('ul', 'tags')
    p.tags.forEach(function (t) { tags.appendChild(el('li', 'tag', t)) })
    body.appendChild(tags)

    a.appendChild(media)
    a.appendChild(body)
    grid.appendChild(a)
    return a
  })

  /* ---- Filter ---- */
  var allTags = ['All']
  projects.forEach(function (p) {
    p.tags.forEach(function (t) { if (allTags.indexOf(t) < 0) allTags.push(t) })
  })
  allTags.forEach(function (t) {
    var b = el('button', 'chip', t)
    b.type = 'button'
    b.setAttribute('aria-pressed', String(t === 'All'))
    b.addEventListener('click', function () {
      activeTag = t
      Array.prototype.forEach.call(chipsEl.children, function (c) {
        c.setAttribute('aria-pressed', String(c === b))
      })
      applyFilter()
    })
    chipsEl.appendChild(b)
  })

  function applyFilter() {
    var q = search.value.trim().toLowerCase()
    var shown = 0
    projects.forEach(function (p, i) {
      var hay = (p.title + ' ' + p.description + ' ' + p.tags.join(' ')).toLowerCase()
      var ok = (activeTag === 'All' || p.tags.indexOf(activeTag) >= 0) && hay.indexOf(q) >= 0
      cards[i].hidden = !ok
      if (ok) shown++
    })
    emptyEl.hidden = shown !== 0
    statusEl.textContent = shown === projects.length && !q && activeTag === 'All'
      ? '' : 'Showing ' + shown + ' of ' + projects.length + ' projects'
  }
  search.addEventListener('input', applyFilter)

  document.getElementById('total-count').textContent = projects.length
  document.getElementById('year').textContent = new Date().getFullYear()

  /* ---- Intro (first visit per session only) ---- */
  if (root.classList.contains('intro')) {
    store('session', 'seen', '1')
    setTimeout(function () { root.classList.remove('intro') }, 1100)
  }
})()

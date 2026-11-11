const form = document.querySelector('#book-form')
const list = document.querySelector('#book-list')
const fields = {
  title: document.querySelector('#title'),
  author: document.querySelector('#author'),
  isbn: document.querySelector('#isbn')
}

class Book {
  constructor(title, author, isbn) {
    this.title = title
    this.author = author
    this.isbn = isbn
  }
}

class UI {
  static addBookToList(book) {
    const row = document.createElement('tr')
    row.dataset.isbn = book.isbn

    for (const key of ['title', 'author', 'isbn']) {
      const td = document.createElement('td')
      td.textContent = book[key]
      if (key === 'isbn') td.className = 'isbn'
      row.appendChild(td)
    }

    const cell = document.createElement('td')
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'delete'
    btn.textContent = '×'
    btn.setAttribute('aria-label', `Remove ${book.title}`)
    cell.appendChild(btn)
    row.appendChild(cell)

    list.appendChild(row)
    UI.updateCount()
  }

  static showAlert(msg, cls) {
    const box = document.querySelector('#alerts')
    clearTimeout(UI.alertTimer)
    box.innerHTML = ''
    const div = document.createElement('p')
    div.className = `alert ${cls}`
    div.textContent = msg
    box.appendChild(div)
    UI.alertTimer = setTimeout(() => { box.innerHTML = '' }, 3000)
  }

  static deleteBook(row) {
    const title = row.firstElementChild.textContent
    row.remove()
    UI.updateCount()
    UI.showAlert(`Removed “${title}”`, 'success')
  }

  static updateCount() {
    const n = list.children.length
    document.querySelector('#book-count').textContent = n
    document.querySelector('#empty').hidden = n > 0
  }

  static clearFields() {
    Object.values(fields).forEach(f => {
      f.value = ''
      f.removeAttribute('aria-invalid')
    })
    fields.title.focus()
  }
}

class Store {
  static getBooks() {
    try {
      return JSON.parse(localStorage.getItem('books')) || []
    } catch (e) {
      return []
    }
  }

  static save(books) {
    try { localStorage.setItem('books', JSON.stringify(books)) } catch (e) { /* storage unavailable */ }
  }

  static displayBooks() {
    Store.getBooks().forEach(book => UI.addBookToList(book))
    UI.updateCount()
  }

  static addBook(book) {
    const books = Store.getBooks()
    books.push(book)
    Store.save(books)
  }

  static hasIsbn(isbn) {
    return Store.getBooks().some(book => book.isbn === isbn)
  }

  static removeBook(isbn) {
    const books = Store.getBooks()
    const i = books.findIndex(book => book.isbn === isbn)
    if (i !== -1) books.splice(i, 1)
    Store.save(books)
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', Store.displayBooks)

form.addEventListener('submit', function (e) {
  e.preventDefault()

  const title = fields.title.value.trim()
  const author = fields.author.value.trim()
  const isbn = fields.isbn.value.trim()

  const missing = Object.entries({ title, author, isbn }).filter(([, v]) => v === '').map(([k]) => k)
  Object.keys(fields).forEach(k => fields[k].setAttribute('aria-invalid', String(missing.includes(k))))

  if (missing.length) {
    UI.showAlert('Fill in the title, author and ISBN to add a book.', 'error')
    fields[missing[0]].focus()
    return
  }

  if (Store.hasIsbn(isbn)) {
    fields.isbn.setAttribute('aria-invalid', 'true')
    UI.showAlert(`A book with ISBN ${isbn} is already on your list.`, 'error')
    fields.isbn.focus()
    return
  }

  const book = new Book(title, author, isbn)
  UI.addBookToList(book)
  Store.addBook(book)
  UI.showAlert(`Added “${title}”`, 'success')
  UI.clearFields()
})

list.addEventListener('click', function (e) {
  const btn = e.target.closest('.delete')
  if (!btn) return
  const row = btn.closest('tr')
  Store.removeBook(row.dataset.isbn)
  UI.deleteBook(row)
})

const form = document.querySelector('#book-form')

const table = document.querySelector('#book-list')


class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.querySelector('#book-list')

    const row = document.createElement('tr')

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href='#' class='delete'>X</a></td>
    `

    list.appendChild(row)
  }

  showAlert(msg, cls) {
    const div = document.createElement('div')

    div.className = `alert ${cls}`

    div.appendChild(document.createTextNode(msg))

    const card = document.querySelector('.card')

    const form = document.querySelector('#book-form')

    card.insertBefore(div, form)

    setTimeout(function () {
      document.querySelector('.alert').remove()
    }, 3000)
  }

  deleteBook(target) {
    if (target.className === 'delete') {
      const ui = new UI();

      target.parentElement.parentElement.remove();

      ui.showAlert('Book Removed', 'success')
    }
  }

  clearFields() {
    document.querySelector('#title').value = ''

    document.querySelector('#author').value = ''

    document.querySelector('#isbn').value = ''
  }
}

class Store {
  static getBook() {
    let books;

    if (localStorage.getItem('books') === null) {
      books = []
    }
    else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books
  }

  static displayBooks() {
    const books = Store.getBook()

    books.forEach(function (book) {
      const ui = new UI();

      ui.addBookToList(book)
    })
  }

  static addBook(book) {
    const books = Store.getBook()

    books.push(book)

    localStorage.setItem('books', JSON.stringify(books))
  }

  static removeBook(isbn) {
    const books = Store.getBook()

    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    })

    localStorage.setItem('books', JSON.stringify(books))
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', Store.displayBooks)

form.addEventListener('submit', function (e) {
  e.preventDefault()

  const title = document.querySelector('#title').value

  const author = document.querySelector('#author').value

  const isbn = document.querySelector('#isbn').value

  const book = new Book(title, author, isbn);

  const ui = new UI();

  if (title === '' || author === '' || isbn === '') {
    ui.showAlert('Please fill in all fields', 'error')
  }
  else {
    ui.addBookToList(book);

    Store.addBook(book)

    ui.showAlert('Book Added', 'success')

    ui.clearFields();
  }

  e.preventDefault();
})

table.addEventListener('click', function (e) {
  e.preventDefault()

  const ui = new UI();

  ui.deleteBook(e.target);

  Store.removeBook(e.target.parentElement.previousElementSibling.textContent)

  e.preventDefault()
})

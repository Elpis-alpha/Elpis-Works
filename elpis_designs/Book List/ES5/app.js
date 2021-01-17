// Initialize Variables
const form = document.querySelector('#book-form')

const table = document.querySelector('#book-list')

// Book Constructor
function Book(title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn
}

// UI Constructor
function UI() { }

UI.prototype.addBookToList = function (book) {
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

UI.prototype.showAlert = function (msg, cls) {
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

UI.prototype.clearFields = function () {
  document.querySelector('#title').value = ''

  document.querySelector('#author').value = ''

  document.querySelector('#isbn').value = ''
}

UI.prototype.deletebook = function (target) {
  if (target.className === 'delete') {
    const ui = new UI();

    target.parentElement.parentElement.remove();

    ui.showAlert('Book Removed', 'success')
  }
}

// Event Listeners
form.addEventListener('submit', function (e) {
  e.preventDefault()

  const title = document.querySelector('#title').value

  const author = document.querySelector('#author').value

  const isbn = document.querySelector('#isbn').value

  const book = new Book(title, author, isbn);

  const ui = new UI();

  if (title === '' || author === '' || isbn === '') {
    ui.showAlert('Please fill in all fields', 'error')
  } else {
    ui.addBookToList(book);

    ui.showAlert('Book Added', 'success')

    ui.clearFields();
  }

  e.preventDefault();
})

table.addEventListener('click', function (e) {
  e.preventDefault()

  const ui = new UI();

  ui.deletebook(e.target);

  e.preventDefault()
})
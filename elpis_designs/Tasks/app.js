// UI elements
const form = document.querySelector('#task-form')
const taskInput = document.querySelector('#new-task')
const formError = document.querySelector('#form-error')
const taskList = document.querySelector('#collection')
const filter = document.querySelector('#filter')
const summary = document.querySelector('#summary')
const empty = document.querySelector('#empty')
const clearBtn = document.querySelector('#clear-tasks')
const clearDoneBtn = document.querySelector('#clear-done')

const KEY = 'tasks'
let tasks = load()

// Storage. Older versions saved a plain array of strings; upgrade those to objects.
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY)) || []
    return raw.map((t, i) => typeof t === 'string'
      ? { id: i + 1, text: t, done: false }
      : t)
  } catch (e) {
    return []
  }
}

function save() {
  // Only this app's key is touched, so other demos' saved data is left alone.
  try { localStorage.setItem(KEY, JSON.stringify(tasks)) } catch (e) { /* storage unavailable */ }
}

// Rendering
function render() {
  taskList.innerHTML = ''
  // The filter is only shown for 2+ tasks; drop a leftover query when it disappears.
  if (tasks.length < 2) filter.value = ''
  const q = filter.value.trim().toLowerCase()
  let visible = 0

  tasks.forEach(task => {
    const li = document.createElement('li')
    li.className = 'task' + (task.done ? ' done' : '')
    li.dataset.id = task.id
    li.hidden = q !== '' && task.text.toLowerCase().indexOf(q) === -1
    if (!li.hidden) visible++

    const box = document.createElement('input')
    box.type = 'checkbox'
    box.id = 'task-' + task.id
    box.checked = task.done

    const label = document.createElement('label')
    label.htmlFor = box.id
    label.textContent = task.text

    const del = document.createElement('button')
    del.type = 'button'
    del.className = 'delete-item'
    del.textContent = '×'
    del.setAttribute('aria-label', 'Delete ' + task.text)

    li.appendChild(box)
    li.appendChild(label)
    li.appendChild(del)
    taskList.appendChild(li)
  })

  const done = tasks.filter(t => t.done).length
  summary.textContent = tasks.length
    ? `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}, ${done} done`
    : ''

  if (!tasks.length) {
    empty.textContent = 'Nothing to do yet. Add a task above.'
  } else if (!visible) {
    empty.textContent = `No tasks match “${filter.value.trim()}”.`
  }
  empty.hidden = tasks.length > 0 && visible > 0

  filter.hidden = tasks.length < 2
  clearDoneBtn.hidden = done === 0
  clearBtn.hidden = tasks.length === 0
}

// Events
form.addEventListener('submit', function (e) {
  e.preventDefault()
  const text = taskInput.value.trim()

  if (!text) {
    formError.hidden = false
    taskInput.setAttribute('aria-invalid', 'true')
    taskInput.focus()
    return
  }

  formError.hidden = true
  taskInput.removeAttribute('aria-invalid')
  const id = tasks.reduce((m, t) => Math.max(m, t.id), 0) + 1
  tasks.push({ id: id, text: text, done: false })
  save()
  taskInput.value = ''
  render()
  taskInput.focus()
})

taskInput.addEventListener('input', function () {
  if (!formError.hidden && taskInput.value.trim()) {
    formError.hidden = true
    taskInput.removeAttribute('aria-invalid')
  }
})

taskList.addEventListener('change', function (e) {
  if (e.target.type !== 'checkbox') return
  const id = Number(e.target.closest('.task').dataset.id)
  const task = tasks.find(t => t.id === id)
  task.done = e.target.checked
  save()
  render()
  document.getElementById('task-' + id).focus()
})

taskList.addEventListener('click', function (e) {
  const del = e.target.closest('.delete-item')
  if (!del) return
  const li = del.closest('.task')
  const visible = el => el && !el.hidden
  let next = li.nextElementSibling
  while (next && !visible(next)) next = next.nextElementSibling
  if (!next) {
    next = li.previousElementSibling
    while (next && !visible(next)) next = next.previousElementSibling
  }
  const nextId = next && next.dataset.id
  tasks = tasks.filter(t => t.id !== Number(li.dataset.id))
  save()
  render()
  // Keep keyboard focus nearby after the row disappears.
  const target = nextId && taskList.querySelector(`[data-id="${nextId}"] .delete-item`)
  ;(target || taskInput).focus()
})

filter.addEventListener('input', render)

clearDoneBtn.addEventListener('click', function () {
  tasks = tasks.filter(t => !t.done)
  save()
  render()
})

clearBtn.addEventListener('click', function () {
  const what = tasks.length === 1 ? 'your 1 task' : `all ${tasks.length} tasks`
  if (!confirm(`Delete ${what}? This can't be undone.`)) return
  tasks = []
  filter.value = ''
  save()
  render()
  taskInput.focus()
})

render()

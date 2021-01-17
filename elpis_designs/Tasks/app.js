// Define UI Variables

const form = document.querySelector('#task-form')

const taskList = document.querySelector('.collection')

const clearBtn = document.querySelector('#clear-tasks')

const filter = document.querySelector('#filter')

const taskInput = document.querySelector('#new-task')



// Load all Events

loadEventListeners();



// Define loadEventListeners

function loadEventListeners() {

  // Display tasks on ul
  document.addEventListener('DOMContentLoaded', getTasks)

  function getTasks(e) {
    let tasks = localStorage.getItem('tasks')

    if (tasks === null) {
      tasks = []
    } else {
      tasks = JSON.parse(tasks)
    }

    tasks.forEach(function (task) {
      // Create list item
      const li = document.createElement('li')

      li.className = 'brend'
      li.id = 'mend'

      li.appendChild(document.createTextNode(task))


      // create the x -- i
      const link = document.createElement('i')

      link.className = 'delete-item'

      link.appendChild(document.createTextNode('x'))


      // Put link in li
      li.appendChild(link)


      // Put li in ul
      taskList.appendChild(li)
    })
  }

  // Add task Event
  form.addEventListener('submit', addTask)

  function addTask(e) {
    if (taskInput.value === '') {
      alert('You need to add a task')
    } else {


      // Create list item
      const li = document.createElement('li')

      li.className = 'brend'
      li.id = 'mend'

      li.appendChild(document.createTextNode(taskInput.value))


      // create the x -- i
      const link = document.createElement('i')

      link.className = 'delete-item'

      link.appendChild(document.createTextNode('x'))


      // Put link in li
      li.appendChild(link)


      // Put li in ul
      taskList.appendChild(li)


      // Store in Local Storage
      storeTaskInLocalStorage(taskInput.value)


      // Clear input
      taskInput.value = ''
    }

    e.preventDefault();
  }


  // Store Task
  function storeTaskInLocalStorage(task) {
    let tasks = localStorage.getItem('tasks')

    if (tasks === null) {
      tasks = []
    } else {
      tasks = JSON.parse(tasks)
    }

    tasks.push(task)

    tasks = JSON.stringify(tasks)

    localStorage.setItem('tasks', tasks)
  }


  // Remove task Event
  taskList.addEventListener('click', removeTask)

  function removeTask(e) {
    if (e.target.classList.contains('delete-item')) {
      if (confirm('Are you sure?')) {
        e.target.parentElement.remove();

        // Remove from LS
        removeTaskFromLocalStorage(e.target.parentElement)
      }
    }
  }


  //Remove from LS
  function removeTaskFromLocalStorage(taskItem) {
    let tasks = localStorage.getItem('tasks')

    if (tasks === null) {
      tasks = []
    } else {
      tasks = JSON.parse(tasks)
    }

    itemContent = taskItem.textContent

    itemContent = itemContent.slice(0, itemContent.length - 1)

    tasks.forEach(function (task, index) {
      if (itemContent === task) {
        tasks.splice(index, 1)
      }
    })

    localStorage.setItem('tasks', JSON.stringify(tasks))
  }


  // Clear task event
  clearBtn.addEventListener('click', clearTasks)

  function clearTasks(e) {
    while (taskList.firstChild) {
      taskList.removeChild(taskList.firstChild)
    }

    clearTasksFromLocalStorage()
  }

  function clearTasksFromLocalStorage() {
    localStorage.clear()
  }


  // Filter through tasks event
  filter.addEventListener('keyup', filterTasks)

  function filterTasks(e) {
    const text = e.target.value.toLowerCase()

    document.querySelectorAll('#mend').forEach(
      function (task) {
        const item = task.firstChild.textContent.toLowerCase()

        if (item.indexOf(text) != -1) {
          task.style.display = 'block';
        } else {
          task.style.display = 'none';
        }
      }
    );
  }
}
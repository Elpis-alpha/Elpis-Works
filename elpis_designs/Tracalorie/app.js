// Storage Controller
const StorageCtrl = (function () {
  const KEY = 'items'

  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || []
    } catch (e) {
      return []
    }
  }

  function write(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)) } catch (e) { /* storage unavailable */ }
  }

  return {
    getItemsFromStore: read,
    storeItem: function (item) {
      const items = read()
      items.push(item)
      write(items)
    },
    updateItemStorage: function (updated) {
      write(read().map(item => (item.id === updated.id ? updated : item)))
    },
    deleteItemStorage: function (id) {
      write(read().filter(item => item.id !== id))
    },
    clearItemsStorage: function () {
      localStorage.removeItem(KEY)
    }
  }
})()

// Item Controller
const ItemCtrl = (function () {
  class Item {
    constructor(id, name, calories) {
      this.id = id
      this.name = name
      this.calories = calories
    }
  }

  const data = {
    items: StorageCtrl.getItemsFromStore(),
    currentItem: null
  }

  return {
    getItems: () => data.items,
    addItem: function (name, calories) {
      const id = data.items.reduce((max, item) => Math.max(max, item.id), -1) + 1
      const newItem = new Item(id, name, calories)
      data.items.push(newItem)
      return newItem
    },
    getTotalCalories: () => data.items.reduce((sum, item) => sum + item.calories, 0),
    getItemByID: id => data.items.find(item => item.id === id) || null,
    setCurrItem: item => { data.currentItem = item },
    getCurrentItem: () => data.currentItem,
    updateItem: function (name, calories) {
      const item = data.currentItem
      item.name = name
      item.calories = calories
      return item
    },
    deleteItem: function (id) {
      data.items = data.items.filter(item => item.id !== id)
    },
    clearAllItems: function () {
      data.items = []
    }
  }
})()

// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    form: '#meal-form',
    formTitle: '#form-title',
    formError: '#form-error',
    itemList: '#item-list',
    empty: '#empty',
    addBtn: '#meal-add',
    updateBtn: '#meal-update',
    deleteBtn: '#meal-delete',
    clearBtn: '#clr-all',
    backBtn: '#meal-back',
    itemName: '#item-name',
    itemCalories: '#item-calories',
    totalCalories: '#total-calories',
    meterFill: '#meter-fill'
  }

  const GUIDE = 2000
  const $ = sel => document.querySelector(sel)
  const pencilSVG = '<svg viewBox="0 0 512 512" aria-hidden="true" focusable="false"><path d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"/></svg>'

  function fillItem(li, item) {
    li.innerHTML = ''
    const name = document.createElement('span')
    name.className = 'item-name'
    name.textContent = item.name

    const cal = document.createElement('span')
    cal.className = 'item-cal'
    cal.textContent = `${item.calories.toLocaleString()} kcal`

    const edit = document.createElement('button')
    edit.type = 'button'
    edit.className = 'edit-item'
    edit.setAttribute('aria-label', `Edit ${item.name}`)
    edit.innerHTML = pencilSVG // static icon markup, no user data

    li.appendChild(name)
    li.appendChild(cal)
    li.appendChild(edit)
  }

  return {
    getSelectors: () => UISelectors,
    populateItemList: function (items) {
      $(UISelectors.itemList).innerHTML = ''
      items.forEach(item => UICtrl.addListItem(item))
    },
    addListItem: function (item) {
      const li = document.createElement('li')
      li.className = 'list-item'
      li.id = `item-${item.id}`
      fillItem(li, item)
      $(UISelectors.itemList).appendChild(li)
    },
    updateListItem: function (item) {
      fillItem($(`#item-${item.id}`), item)
    },
    deleteListItem: function (id) {
      $(`#item-${id}`).remove()
    },
    removeAllItems: function () {
      $(UISelectors.itemList).innerHTML = ''
    },
    getItemInput: function () {
      return {
        name: $(UISelectors.itemName).value.trim(),
        calories: $(UISelectors.itemCalories).value.trim()
      }
    },
    showError: function (msg, field) {
      const err = $(UISelectors.formError)
      err.textContent = msg
      err.hidden = false
      ;[UISelectors.itemName, UISelectors.itemCalories].forEach(sel => {
        $(sel).setAttribute('aria-invalid', String(sel === field))
      })
      $(field).focus()
    },
    clearError: function () {
      $(UISelectors.formError).hidden = true
      $(UISelectors.itemName).removeAttribute('aria-invalid')
      $(UISelectors.itemCalories).removeAttribute('aria-invalid')
    },
    clearInput: function () {
      $(UISelectors.itemName).value = ''
      $(UISelectors.itemCalories).value = ''
    },
    showTotalCal: function (total, count) {
      $(UISelectors.totalCalories).textContent = total.toLocaleString()
      const fill = $(UISelectors.meterFill)
      fill.style.width = Math.min(100, (total / GUIDE) * 100) + '%'
      fill.classList.toggle('over', total > GUIDE)
      $(UISelectors.empty).hidden = count > 0
      $(UISelectors.clearBtn).hidden = count === 0
    },
    clearEditState: function () {
      UICtrl.clearInput()
      UICtrl.clearError()
      $(UISelectors.form).classList.remove('editing')
      $(UISelectors.formTitle).textContent = 'Add a meal'
      $(UISelectors.updateBtn).hidden = true
      $(UISelectors.deleteBtn).hidden = true
      $(UISelectors.backBtn).hidden = true
      $(UISelectors.addBtn).hidden = false
      document.querySelectorAll('.list-item.current').forEach(li => li.classList.remove('current'))
    },
    showEditState: function () {
      $(UISelectors.form).classList.add('editing')
      $(UISelectors.formTitle).textContent = 'Edit meal'
      $(UISelectors.updateBtn).hidden = false
      $(UISelectors.deleteBtn).hidden = false
      $(UISelectors.backBtn).hidden = false
      $(UISelectors.addBtn).hidden = true
    },
    addItemToForm: function () {
      const item = ItemCtrl.getCurrentItem()
      UICtrl.clearError()
      $(UISelectors.itemName).value = item.name
      $(UISelectors.itemCalories).value = item.calories
      document.querySelectorAll('.list-item.current').forEach(li => li.classList.remove('current'))
      $(`#item-${item.id}`).classList.add('current')
      UICtrl.showEditState()
      $(UISelectors.itemName).focus()
    }
  }
})()

// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  const UISelectors = UICtrl.getSelectors()

  function refreshTotal() {
    UICtrl.showTotalCal(ItemCtrl.getTotalCalories(), ItemCtrl.getItems().length)
  }

  // Shared validation for add and update; returns { name, calories } or null.
  function readInput() {
    const input = UICtrl.getItemInput()
    const calories = Number(input.calories)

    if (!input.name) {
      UICtrl.showError('Enter what you ate.', UISelectors.itemName)
      return null
    }
    if (!Number.isInteger(calories) || calories < 1) {
      UICtrl.showError('Enter calories as a whole number above 0.', UISelectors.itemCalories)
      return null
    }
    UICtrl.clearError()
    return { name: input.name, calories: calories }
  }

  // Enter (or either submit button) adds a meal, or saves changes while editing.
  const formSubmit = function (e) {
    e.preventDefault()
    if (ItemCtrl.getCurrentItem()) itemUpdateSubmit()
    else itemAddSubmit()
  }

  const itemAddSubmit = function () {
    const input = readInput()
    if (!input) return

    const newItem = ItemCtrl.addItem(input.name, input.calories)
    UICtrl.addListItem(newItem)
    StorageCtrl.storeItem(newItem)
    refreshTotal()
    UICtrl.clearInput()
    document.querySelector(UISelectors.itemName).focus()
  }

  const itemEditClick = function (e) {
    const btn = e.target.closest('.edit-item')
    if (!btn) return
    const id = parseInt(btn.closest('.list-item').id.split('-')[1], 10)
    ItemCtrl.setCurrItem(ItemCtrl.getItemByID(id))
    UICtrl.addItemToForm()
  }

  const itemUpdateSubmit = function () {
    const input = readInput()
    if (!input) return

    const updatedItem = ItemCtrl.updateItem(input.name, input.calories)
    UICtrl.updateListItem(updatedItem)
    StorageCtrl.updateItemStorage(updatedItem)
    endEdit(updatedItem.id)
    refreshTotal()
  }

  const itemDeleteSubmit = function () {
    const currItem = ItemCtrl.getCurrentItem()
    ItemCtrl.deleteItem(currItem.id)
    UICtrl.deleteListItem(currItem.id)
    StorageCtrl.deleteItemStorage(currItem.id)
    endEdit(null)
    refreshTotal()
  }

  function endEdit(focusId) {
    ItemCtrl.setCurrItem(null)
    UICtrl.clearEditState()
    const btn = focusId !== null && document.querySelector(`#item-${focusId} .edit-item`)
    ;(btn || document.querySelector(UISelectors.itemName)).focus()
  }

  const clearAllItemsClick = function () {
    const n = ItemCtrl.getItems().length
    if (!confirm(`Delete ${n === 1 ? 'your 1 meal' : `all ${n} meals`}? This can't be undone.`)) return
    ItemCtrl.clearAllItems()
    UICtrl.removeAllItems()
    StorageCtrl.clearItemsStorage()
    endEdit(null)
    refreshTotal()
  }

  const loadEventListeners = function () {
    document.querySelector(UISelectors.form).addEventListener('submit', formSubmit)
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick)
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit)
    document.querySelector(UISelectors.backBtn).addEventListener('click', () => endEdit(ItemCtrl.getCurrentItem().id))
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick)
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && ItemCtrl.getCurrentItem()) endEdit(ItemCtrl.getCurrentItem().id)
    })
  }

  return {
    init: function () {
      UICtrl.clearEditState()
      UICtrl.populateItemList(ItemCtrl.getItems())
      refreshTotal()
      loadEventListeners()
    }
  }
})(ItemCtrl, StorageCtrl, UICtrl)

// Initialize
App.init()

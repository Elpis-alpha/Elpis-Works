// Storage Controller
const StorageCtrl = (function () {

  return {
    storeItem: function (item) {
      let items;

      if (localStorage.getItem('items') === null) {
        items = []

        items.push(item)

        localStorage.setItem('items', JSON.stringify(items))
      } else {
        items = localStorage.getItem('items')

        items = JSON.parse(items)

        items.push(item)

        localStorage.setItem('items', JSON.stringify(items))
      }
    },
    getItemsFromStore: function () {
      let items;

      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'))
      }

      return items
    },
    updateItemStorage: function (iteme) {
      let items = JSON.parse(localStorage.getItem('items'))

      items.forEach((item, index) => {
        if (iteme.id === item.id) {
          items.splice(index, 1, iteme)
        }
      })

      localStorage.setItem('items', JSON.stringify(items))
    },
    deleteItemStorage: function (id) {
      let items = JSON.parse(localStorage.getItem('items'))

      items.forEach((item, index) => {
        if (id === item.id) {
          items.splice(index, 1)
        }
      })

      localStorage.setItem('items', JSON.stringify(items))
    },
    clearItemsStorage: function () {
      localStorage.removeItem('items')
    }
  }
})()

// Item Controller
const ItemCtrl = (function () {
  class Item {
    constructor(id, name, calories) {
      this.id = id;
      this.name = name;
      this.calories = calories;
    }
  }

  const data = {
    items: StorageCtrl.getItemsFromStore(),
    currentItem: null,
    totalCalories: 0
  }

  return {
    logData: function () {
      return data
    },
    getItems: function () {
      return data.items
    },
    addItem: function (name, calories) {
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1
      } else {
        ID = 0;
      }

      calories = parseInt(calories)

      const newItem = new Item(ID, name, calories);

      data.items.push(newItem)

      return newItem
    },
    getTotalCalories: function () {
      let total = 0;

      data.items.forEach(item => {
        total += item.calories;
      });

      data.totalCalories = total;

      return total
    },
    getItemByID: function (id) {
      let found = null;
      data.items.forEach((item) => {
        if (item.id == id) {
          found = item
        }
      })

      return found
    },
    setCurrItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem
    },
    updateItem: function (name, calories) {
      calories = parseInt(calories)

      let found = null;

      data.items.forEach(item => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item
        }
      });

      return found
    },
    deleteItem: function (id) {
      ids = data.items.map(function (item) {
        return item.id
      })

      const index = ids.indexOf(id)

      data.items.splice(index, 1)
    },
    clearAllItems: function () {
      data.items = []
    }
  }
})()


// UI Controller
const UICtrl = (function () {

  const UISelectors = {
    pencilSVG: `
    <svg class='right-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path class='right-icon' d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z" />
    </svg>`,
    itemList: '#item-list',
    addBtn: '#meal-add',
    updateBtn: '#meal-update',
    deleteBtn: '#meal-delete',
    clearBtn: '#clr-all',
    backBtn: '#meal-back',
    itemName: '#item-name',
    listItems: '#item-list li',
    itemCalories: '#item-calories',
    totalCalories: '#total-calories'
  }

  return {
    populateItemList: function (items) {
      let html = ``;

      items.forEach((item) => {
        html += `
          <li class="list-item" id="item-${item.id}">
            <p><strong>${item.name}: </strong> ${item.calories} Calories</p>
            <a class='right-icon'>
              ${UISelectors.pencilSVG}
            </a>
          </li>
        `
      });

      document.querySelector(UISelectors.itemList).innerHTML = html
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemName).value,
        calories: document.querySelector(UISelectors.itemCalories).value,
      }
    },
    addListItem: function (item) {
      // Creation
      const li = document.createElement('li')

      li.classList.add('list-item')
      li.id = `item-${item.id}`

      li.innerHTML = `
      <p><strong>${item.name}: </strong> ${item.calories} Calories</p>
      <a class='right-icon'>
        ${UISelectors.pencilSVG}
      </a>
      `;

      document.querySelector(UISelectors.itemList).insertAdjacentElement
        ('beforeend', li)
    },
    getSelectors: function () {
      return UISelectors
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemName).value = '';
      document.querySelector(UISelectors.itemCalories).value = '';
    },
    showTotalCal: function (total) {
      document.querySelector(UISelectors.totalCalories).textContent = total
    },
    clearEditState: function () {
      UICtrl.clearInput()

      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemName).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCalories).value =
        ItemCtrl.getCurrentItem().calories;

      UICtrl.showEditState()
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems)

      listItems = Array.from(listItems)

      listItems.forEach(listItem => {
        const itemID = listItem.getAttribute('id')

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
            <p><strong>${item.name}: </strong> ${item.calories} Calories</p>
            <a class='right-icon'>
              ${UISelectors.pencilSVG}
            </a>
          `
        }
      });
    },
    deleteListItem: function (id) {
      const itemId = `#item-${id}`

      const item = document.querySelector(itemId)

      item.remove()
    },
    removeAllItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems)

      listItems = Array.from(listItems)

      listItems.forEach((item) => {
        item.remove()
      })
    }
  }
})()


// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {

  const loadEventListeners = function () {
    const UISelectors = UICtrl.getSelectors();

    document.querySelector(UISelectors.addBtn).addEventListener
      ('click', itemAddSubmit)

    document.querySelector(UISelectors.itemList).addEventListener
      ('click', itemEditClick)

    document.addEventListener('keypress', function (e) {
      if (e.which === 13 || e.keyCode == 13 || e.key === 'Enter') {
        e.preventDefault()
        return false
      }
    })

    document.querySelector(UISelectors.updateBtn).addEventListener
      ('click', itemUpdateSubmit)

    document.querySelector(UISelectors.backBtn).addEventListener
      ('click', (e) => {
        e.preventDefault()
        UICtrl.clearEditState()
      })

    document.querySelector(UISelectors.clearBtn).addEventListener
      ('click', clearAllItemsClick)

    document.querySelector(UISelectors.deleteBtn).addEventListener
      ('click', itemDeleteSubmit)
  }

  const itemAddSubmit = function (e) {
    e.preventDefault()

    const input = UICtrl.getItemInput()

    if (input.name !== '' && input.calories !== '') {
      const newItem = ItemCtrl.addItem(input.name, input.calories)

      UICtrl.addListItem(newItem)

      const totalCalories = ItemCtrl.getTotalCalories()

      UICtrl.showTotalCal(totalCalories)

      StorageCtrl.storeItem(newItem)

      UICtrl.clearInput()
    }
  }

  const itemEditClick = function (e) {
    e.preventDefault()

    if
      (e.target.classList.contains('right-icon')) {
      const listItem = e.target.parentElement

      const listID = parseInt(listItem.id.split('-')[1])

      const itemToEdit = ItemCtrl.getItemByID(listID)

      ItemCtrl.setCurrItem(itemToEdit)

      UICtrl.addItemToForm();
    }
  }

  const itemUpdateSubmit = function (e) {
    e.preventDefault();

    const input = UICtrl.getItemInput()

    const updatedItem = ItemCtrl.updateItem(input.name, input.calories)

    UICtrl.updateListItem(updatedItem)

    const totalCalories = ItemCtrl.getTotalCalories()

    StorageCtrl.updateItemStorage(updatedItem)

    UICtrl.clearEditState()

    UICtrl.showTotalCal(totalCalories)
  }

  const itemDeleteSubmit = function (e) {
    e.preventDefault()

    const currItem = ItemCtrl.getCurrentItem()

    ItemCtrl.deleteItem(currItem.id)

    UICtrl.deleteListItem(currItem.id)

    StorageCtrl.deleteItemStorage(currItem.id)

    const totalCalories = ItemCtrl.getTotalCalories()

    UICtrl.showTotalCal(totalCalories)

    UICtrl.clearEditState()
  }

  const clearAllItemsClick = function (e) {
    e.preventDefault()

    ItemCtrl.clearAllItems()

    UICtrl.removeAllItems()

    StorageCtrl.clearItemsStorage()

    const totalCalories = ItemCtrl.getTotalCalories()

    UICtrl.showTotalCal(totalCalories)
  }

  return {
    init: function () {

      UICtrl.clearEditState()

      // Fetch items from data
      const items = ItemCtrl.getItems();

      // populate Items into ui
      UICtrl.populateItemList(items);

      const totalCalories = ItemCtrl.getTotalCalories()

      UICtrl.showTotalCal(totalCalories)

      // Load Events
      loadEventListeners()
    }
  }
})
  (ItemCtrl, StorageCtrl, UICtrl)


// Initialize
App.init()
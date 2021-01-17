// Define UI Variables
const UISearchForm = document.querySelector('#search-word')

const UISearchInput = document.querySelector('#word-input')

const UIDisplayWord = document.querySelector('#display-meaning')

const UIwordOnly = document.querySelector('#word-only')

const UIwordStarting = document.querySelector('#word-starting')

const UIwordInside = document.querySelector('#word-inside')

const UIloader = document.querySelector('.loader')

const UInewWord = document.querySelector('div#display-meaning > li div.meaning a:hover')

// Define Inside Variables
let qcorrectSet;

let acorrectSet;

let xhr;


// Event Listeners

window.addEventListener('load', initXHR)

UISearchForm.addEventListener('submit', findWord)


// Functions
function initXHR() {
  xhr = new XMLHttpRequest();

  xhr.open('get', 'dictionary.json', true)

  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      dict = JSON.parse(xhr.responseText)

      qcorrectSet = Object.keys(dict)
      acorrectSet = Object.values(dict)
    }
  }

  xhr.send();
}

function findWord(e) {
  e.preventDefault();

  UIDisplayWord.style.display = 'none'
  UIloader.style.display = 'flex'

  setTimeout(function () {
    word = UISearchInput.value.toLowerCase()

    let finalOutput = '';
    let finalList = [];

    if (word != '') {
      qcorrectSet.forEach(function (aword, index) {
        if (UIwordOnly.checked) {
          if (aword === word) {
            finalList.push(`${aword}   ?${index}`)
          }
        }

        if (UIwordStarting.checked) {
          if (aword.slice(0, word.length) === word) {
            finalList.push(`${aword}   ?${index}`)
          }
        }

        if (UIwordInside.checked) {
          if (aword.indexOf(word) != -1) {
            finalList.push(`${aword}   ?${index}`)
          }
        }
      })

      finalList.sort()

      finalList.forEach(function (value) {
        let x = Number(value.split('?')[1]);

        finalOutput += `
      <li>
        <div class='word'>${qcorrectSet[x]}</div>
        <div class='meaning'>${acorrectSet[x]}</div>
      </li>
      `
      })
    } else {
      finalList = ['x']
    }

    if (finalList.length === 0) {
      finalOutput = `
      <li>
      <div class='word' style='padding-bottom: 1rem'>Word does not Exist</div>
      <div class='meaning' style='padding-top: 1rem; text-align: center'>Sorry but the word you are looking for does not exist in our database, if you'll like to add a new word fill out <a onclick="alert('Sorry but you don\\'t have sufficient permissions to perform this action, please contact the developer')">this form</a></div>
      </li>
      `
    } else if (finalList[0] === 'x') {
      finalOutput = `
      <li>
      <div class='word' style='padding-bottom: 1rem'>Search Box is Empty</div>
      <div class='meaning' style='padding-top: 1rem; text-align: center'>Type a word in the above search box to find its meaning</div>
      </li>
      `
    }

    UIDisplayWord.innerHTML = ''
    UIDisplayWord.innerHTML += finalOutput
    UIloader.style.display = 'none'
    UIDisplayWord.style.display = 'flex'

    e.preventDefault();
  }, 1000)
}
// UI variables
UICreg = document.querySelector('div.creg')

UICregHolder = document.querySelector('.creg-holder')

UIinitialContent = document.querySelector('.initial-content')

body = document.body


// Script Variables 
const windowHeight = window.outerHeight

const windowWidth = window.outerWidth


// Event Listeners
document.addEventListener('DOMContentLoaded', startPage)


// Functions
function getWindowRadius() {
  let rad = (Math.pow(windowHeight, 2)) + (Math.pow(windowWidth, 2))

  rad = Math.pow(rad, (1/2))

  rad = rad / 2

  rad = Math.ceil(rad)

  return rad
}

function startPage() {
  setTimeout(() => {
    UICreg.style.padding = `${getWindowRadius() +20}px`
  }, 4000);

  setTimeout(() => {
    body.classList.add('finished')
    
    UICregHolder.remove()
    
    UIinitialContent.remove()

    setTimeout(() => {
      body.classList.add('finished1')

      setTimeout(() => {
        body.classList.add('finished2')
      }, 2000)
    }, 2500)
  }, 9000)
}


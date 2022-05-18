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

// For Debugging
const timeDiff = initTime => console.log(new Date().getTime() - initTime)

const delayFor = async time => await new Promise(resolve => setTimeout(() => { resolve(time) }, time))

// Functions
function getWindowRadius() {

  let rad = (Math.pow(windowHeight, 2)) + (Math.pow(windowWidth, 2))

  rad = Math.pow(rad, (1 / 2))

  rad = rad / 2

  rad = Math.ceil(rad)

  return rad

}

async function startPage() {

  const initTime = new Date().getTime()


  await delayFor(2000)

  UICreg.style.padding = `${getWindowRadius() + 50}px`


  await delayFor(1000)

  body.classList.add('finished')

  UICregHolder.remove()

  UIinitialContent.remove()


  body.classList.add('finished1')

  body.classList.add('finished2')

}


document.querySelector('.get-jokes').addEventListener('click', getJokes)

const num = document.querySelector('input[type=number]');

function getJokes(e) {
  e.preventDefault()

  document.querySelector('.loader').style.display = 'none';
  document.querySelector('.jokes').style.display = 'none';

  const number = num.value

  const xhr = new XMLHttpRequest();

  xhr.open('GET', 'chuckNoris.json', true)

  xhr.onload = function () {
    if (this.status === 200) {
      const response = JSON.parse(this.responseText)

      acctt = Math.ceil(Math.random() * (574 - number))

      if (number <= 574) {
        response.value = response.value.splice(acctt, number)
      }

      let output = ''

      if (response.type === 'success') {
        response.value.forEach(function (joke, index) {
          output += `<li>${joke.joke}</li>`
        });
      } else {
        output += `<li>Something went wrong</li>`
      }

      document.querySelector('.loader').style.display = 'flex';

      setTimeout(function () {
        document.querySelector('.loader').style.display = 'none';

        document.querySelector('.jokes').style.display = 'block';
        document.querySelector('.jokes').innerHTML = output;
      }, 1000)
    }
  }
  xhr.send()

  e.preventDefault()
}

document.addEventListener('DOMContentLoaded', function (e) {
  document.querySelector('.loader').style.display = 'none';
  document.querySelector('.jokes').style.display = 'none';
})



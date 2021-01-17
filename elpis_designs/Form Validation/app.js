// UI Variables
const name = document.querySelector('#name');

const zipcode = document.querySelector('#zipcode');

const email = document.querySelector('#email');

const phone = document.querySelector('#phone');



// Event Listeners
name.addEventListener('blur', validateName)

zipcode.addEventListener('blur', validateZipcode)

email.addEventListener('blur', validateEmail)

phone.addEventListener('blur', validatePhone)


// Functions
function validateName(e) {
  const name = document.getElementById('name');
  
  const re = /^([A-Z]){2,10}$/i;

  if (!re.test(name.value)) {
    name.classList.add('show-alert')
  } else {
    name.classList.remove('show-alert')
  }
}


function validateZipcode(e) {
  const zip = document.getElementById('zipcode');
  
  const re = /^ID-([0-9]){4}$/;

  if (!re.test(zip.value)) {
    zip.classList.add('show-alert')
  } else {
    zip.classList.remove('show-alert')
  }
}


function validateEmail(e) {
  const email = document.getElementById('email');
  
  const re = /^([A-Za-z0-9_\-\.]+)@([A-Za-z0-9_\-\.]+)\.([A-Za-z]{2,5})$/;

  if (!re.test(email.value)) {
    email.classList.add('show-alert')
  } else {
    email.classList.remove('show-alert')
  }
}

function validatePhone(e) {
  const phone = document.getElementById('phone');
  
  const re = /^((\+)?234)?(\-)?[0-9]{2,3}(\-)?[0-9]{4}(\-)?[0-9]{4}$/;

  if (!re.test(phone.value)) {
    phone.classList.add('show-alert')
  } else {
    phone.classList.remove('show-alert')
  }
}

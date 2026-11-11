// Each field: its rule, and the message shown when it fails.
const rules = {
  name: {
    test: v => /^\p{L}[\p{L}' -]{1,29}$/u.test(v),
    error: 'Use 2 to 30 letters. Spaces, hyphens and apostrophes are fine.'
  },
  zipcode: {
    test: v => /^\d{5}(-\d{4})?$/.test(v),
    error: 'Enter 5 digits, like 94107, or ZIP+4 like 94107-1234.'
  },
  email: {
    test: v => /^[A-Za-z0-9_.+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(v),
    error: 'Enter an email address like ada@example.com.'
  },
  phone: {
    // Spaces are ignored, so "0803 123 4567" and "08031234567" both pass.
    test: v => /^((\+)?234)?(-)?[0-9]{2,3}(-)?[0-9]{4}(-)?[0-9]{4}$/.test(v.replace(/\s+/g, '')),
    error: 'Enter a Nigerian number like 0803 123 4567 or +234 803 123 4567.'
  }
}

const form = document.getElementById('signup')
const done = document.getElementById('done')

function validate(id) {
  const input = document.getElementById(id)
  const hint = document.getElementById(id + '-hint')
  const value = input.value.trim()
  const ok = rules[id].test(value)

  input.setAttribute('aria-invalid', String(!ok))
  hint.textContent = ok ? hint.dataset.hint : (value ? rules[id].error : 'This field is required.')
  hint.classList.toggle('error', !ok)
  return ok
}

Object.keys(rules).forEach(id => {
  const input = document.getElementById(id)

  // Check when the person leaves the field (only if they typed something),
  input.addEventListener('blur', () => { if (input.value.trim()) validate(id) })

  // then re-check while they fix it, so the error clears as soon as it's right.
  input.addEventListener('input', () => { if (input.hasAttribute('aria-invalid')) validate(id) })
})

form.addEventListener('submit', e => {
  e.preventDefault()

  const failed = Object.keys(rules).filter(id => !validate(id))
  if (failed.length) {
    document.getElementById(failed[0]).focus()
    return
  }

  const first = document.getElementById('name').value.trim().split(' ')[0]
  document.getElementById('done-msg').textContent =
    `Thanks, ${first}. All four fields are valid.`
  form.hidden = true
  done.hidden = false
  done.focus()
})

document.getElementById('again').addEventListener('click', () => {
  form.reset()
  Object.keys(rules).forEach(id => {
    const input = document.getElementById(id)
    const hint = document.getElementById(id + '-hint')
    input.removeAttribute('aria-invalid')
    hint.textContent = hint.dataset.hint
    hint.classList.remove('error')
  })
  done.hidden = true
  form.hidden = false
  document.getElementById('name').focus()
})

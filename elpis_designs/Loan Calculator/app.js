// UI vars
const form = document.getElementById('loan-form')
const amount = document.getElementById('amount')
const interest = document.getElementById('interest')
const years = document.getElementById('years')
const errorBox = document.getElementById('error')
const results = document.getElementById('results')

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

form.addEventListener('submit', function (e) {
  e.preventDefault()
  calculateResults(true)
})

// Once results are showing, keep them in sync while the numbers change.
form.addEventListener('input', function () {
  if (!results.hidden) calculateResults(false)
})

function calculateResults(fromSubmit) {
  const principal = parseFloat(amount.value)
  const yearlyRate = parseFloat(interest.value)
  const term = parseFloat(years.value)

  const problems = []
  if (!(principal > 0)) problems.push([amount, 'Enter a loan amount above 0.'])
  if (!(yearlyRate >= 0)) problems.push([interest, 'Enter an interest rate of 0 or more.'])
  if (!(term >= 1 && term <= 50)) problems.push([years, 'Enter a term between 1 and 50 years.'])

  ;[amount, interest, years].forEach(input => {
    input.setAttribute('aria-invalid', String(problems.some(p => p[0] === input)))
  })

  if (problems.length) {
    results.hidden = true
    if (fromSubmit) {
      showError(problems[0][1])
      problems[0][0].focus()
    }
    return
  }
  hideError()

  // Monthly payment on an amortised loan
  const rate = yearlyRate / 100 / 12
  const payments = Math.round(term * 12)
  const monthly = rate === 0
    ? principal / payments
    : (principal * rate * Math.pow(1 + rate, payments)) / (Math.pow(1 + rate, payments) - 1)

  if (!isFinite(monthly)) {
    results.hidden = true
    showError('Those numbers are too large to calculate. Try a smaller amount or rate.')
    return
  }

  const total = monthly * payments
  const totalInterest = total - principal

  document.getElementById('monthly-payment').textContent = money.format(monthly)
  document.getElementById('principal-out').textContent = money.format(principal)
  document.getElementById('total-interest').textContent = money.format(totalInterest)
  document.getElementById('total-payment').textContent = money.format(total)
  document.getElementById('bar-principal').style.flexGrow = principal
  document.getElementById('bar-interest').style.flexGrow = totalInterest

  results.hidden = false
}

function showError(message) {
  errorBox.textContent = message
  errorBox.hidden = false
}

function hideError() {
  errorBox.hidden = true
  errorBox.textContent = ''
}

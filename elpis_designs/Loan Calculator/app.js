// Listen for submit

document.getElementById('loan-form').addEventListener('submit',
  function (e) {
    // Hide Results
    document.querySelector('.results').style.display = 'none'

    // Show Loader
    document.getElementById('loading').style.display = 'block'

    setTimeout(calculateResults, 2000)

    e.preventDefault()
  })

// Calculate Results
function calculateResults() {

  // UI Vars
  const amount = document.getElementById('amount')

  const intrest = document.getElementById('intrest')

  const years = document.getElementById('years')

  const monthlyPayment = document.getElementById('monthly-payment')

  const totalPayment = document.getElementById('total-payment')

  const totalIntrest = document.getElementById('total-intrest')


  // Calculated constants

  const principal = parseFloat(amount.value)

  const calculatedIntrest = parseFloat(intrest.value) / 100 / 12

  const calculatedPayments = parseFloat(years.value) * 12


  // Monthly Payment

  const x = Math.pow(1 + calculatedIntrest, calculatedPayments)

  const monthly = (principal * x * calculatedIntrest) / (x - 1)


  // Finite Conditional

  if (isFinite(monthly)) {
    monthlyPayment.value = monthly.toFixed(2);
    totalPayment.value = (monthly * calculatedPayments).toFixed(2);
    totalIntrest.value = ((monthly * calculatedPayments) - principal).toFixed(2)

    // Hide Results
    document.querySelector('.results').style.display = 'block'

    // Show Loader
    document.getElementById('loading').style.display = 'none'

  } else {
    showError('Please check your numbers')
  }
}


// Show Error
function showError(error) {
  
  // Hide Results
  document.querySelector('.results').style.display = 'none'

  // Show Loader
  document.getElementById('loading').style.display = 'none'

  const card = document.querySelector('.card')

  const heading = document.querySelector('.heading')

  const errorDiv = document.createElement('div');

  errorDiv.className = 'danger-alert'

  errorDiv.appendChild(document.createTextNode(error));

  // Insert Error

  card.insertBefore(errorDiv, heading)


  // Clear Error
  setTimeout(clearError, 3000)
}


// Clear Error
function clearError() {
  document.querySelector('.danger-alert').remove();
}
const emailForm = document.getElementById('emailForm');
const emailFormContainer = document.getElementById('emailFormContainer');
const confirmationCodeContainer = document.getElementById(
  'confirmationCodeContainer',
);
const signupFormContainer = document.getElementById('signupFormContainer');
const confirmButton = document.getElementById('confirmButton');
const inputs = document.querySelectorAll('.code-input');
const emailInput = emailForm.querySelector('.email-input');
const nameInput = document.querySelector('.name-input');
const signupForm = document.getElementById('signupForm');
let createUserToken = '';

// Handle email form submission
emailForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = emailForm.querySelector('.email-input').value;

  const response = await fetch('/auth/otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: email, method: 'EMAIL' }),
  });

  if (response.ok) {
    emailFormContainer.style.display = 'none';
    confirmationCodeContainer.style.display = 'block';
    console.log('Email submitted successfully');
  } else {
    console.error('Failed to submit email');
  }
});

// Code input behavior
inputs.forEach((input, index) => {
  input.addEventListener('input', () => {
    if (input.value.length === 1 && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
    checkAllInputsFilled();
  });

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace' && input.value === '' && index > 0) {
      inputs[index - 1].focus();
    }
  });
});

function checkAllInputsFilled() {
  const allFilled = Array.from(inputs).every(
    (input) => input.value.length === 1,
  );
  document.getElementById('confirmButton').disabled = !allFilled;
}

// Timer for code resend
let timeLeft = 30;
const timer = document.getElementById('timer');
const interval = setInterval(() => {
  timeLeft--;
  timer.textContent = `${timeLeft}s`;
  if (timeLeft <= 0) {
    clearInterval(interval);
    timer.textContent = '0s';
    document.getElementById('resend').style.color = 'blue';
  }
}, 1000);

// Resend code functionality
document.getElementById('resend').addEventListener('click', async () => {
  if (timeLeft <= 0) {
    alert('Resending code...');
    const email = emailInput.value;
    const response = await fetch('/auth/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: email, method: 'EMAIL' }),
    });

    if (response.ok) {
      console.log('Email submitted successfully');
    } else {
      console.error('Failed to submit email');
    }
  }
});

// Handle confirmation button click to submit code
confirmButton.addEventListener('click', async () => {
  const code = Array.from(inputs)
    .map((input) => input.value)
    .join('');
  const email = emailInput.value;

  const credentials = `${email}:${code}`;
  const base64Credentials = btoa(credentials);

  const response = await fetch('/auth/token/email', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64Credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, code }),
  });

  if (response.ok) {
    const data = await response.json();
    if (data.data) {
      createUserToken = data.data.createUserToken;

      if (data.data.isNewUser) {
        confirmationCodeContainer.style.display = 'none';
        signupFormContainer.style.display = 'block';
      } else {
        console.log('User verified successfully');
        window.location.href = '/discover'; // Redirect to discover page
      }
    }
  } else {
    alert('Invalid code. Please try again.');
  }
});

// Handle signup form submission
signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = nameInput.value;
  const email = emailInput.value;

  const spinner = document.querySelector('.spinner');
  const signupText = document.querySelector('.signup-text');

  signupText.style.display = 'none';
  spinner.style.display = 'block';

  fetch('/users', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${createUserToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.statusCode === 200) {
        window.location.href = '/discover'; // Redirect to discover page after signup
      } else {
        throw new Error('Failed to sign up');
      }
    })
    .catch((error) => {
      alert('Signup failed. Please try again.');
    })
    .finally(() => {
      spinner.style.display = 'none';
      signupText.style.display = 'block';
    });
});

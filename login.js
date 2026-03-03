const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberInput = document.getElementById('remember');
const message = document.getElementById('message');
const togglePasswordBtn = document.getElementById('toggle-password');

const savedEmail = localStorage.getItem('thecodstore_saved_email');
if (savedEmail) {
  emailInput.value = savedEmail;
  rememberInput.checked = true;
}

function setMessage(text, type) {
  message.textContent = text;
  message.classList.remove('error', 'success');
  if (type) message.classList.add(type);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

togglePasswordBtn.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  togglePasswordBtn.textContent = isPassword ? 'Hide' : 'Show';
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    setMessage('Please fill in email and password.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    setMessage('Please use a valid email address.', 'error');
    return;
  }

  if (password.length < 6) {
    setMessage('Password must have at least 6 characters.', 'error');
    return;
  }

  if (rememberInput.checked) {
    localStorage.setItem('thecodstore_saved_email', email);
  } else {
    localStorage.removeItem('thecodstore_saved_email');
  }

  sessionStorage.setItem('thecodstore_user', email);
  setMessage('Login successful. Redirecting to store...', 'success');

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 900);
});

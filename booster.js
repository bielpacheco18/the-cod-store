const form = document.getElementById('booster-form');
const message = document.getElementById('form-message');

function setMessage(text, type) {
  message.textContent = text;
  message.classList.remove('error', 'success');
  if (type) message.classList.add(type);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(data) {
  if (!data.fullName || !data.email || !data.discord || !data.game || !data.rank || !data.hours || !data.experience) {
    return 'Please fill all required fields.';
  }
  if (!isValidEmail(data.email)) return 'Please enter a valid email.';
  if (Number(data.hours) < 1) return 'Availability must be at least 1 hour per week.';
  if (data.experience.length < 30) return 'Please provide at least 30 characters about your experience.';
  return '';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = {
    fullName: document.getElementById('full-name').value.trim(),
    email: document.getElementById('email').value.trim(),
    discord: document.getElementById('discord').value.trim(),
    game: document.getElementById('game').value.trim(),
    rank: document.getElementById('rank').value.trim(),
    hours: document.getElementById('hours').value.trim(),
    experience: document.getElementById('experience').value.trim()
  };

  const error = validateForm(data);
  if (error) {
    setMessage(error, 'error');
    return;
  }

  const applications = JSON.parse(localStorage.getItem('thecodstore_booster_applications') || '[]');
  applications.push({
    ...data,
    createdAt: new Date().toISOString()
  });
  localStorage.setItem('thecodstore_booster_applications', JSON.stringify(applications));

  setMessage('Application submitted successfully. Our team will contact you on Discord or email.', 'success');
  form.reset();
});

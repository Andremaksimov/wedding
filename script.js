const guestName = document.getElementById('guestName');
const weddingDate = document.getElementById('weddingDate');
const venue = document.getElementById('venue');
const meetingPlace = document.getElementById('meetingPlace');
const meetingTime = document.getElementById('meetingTime');

const previewName = document.getElementById('previewName');
const previewDate = document.getElementById('previewDate');
const previewVenue = document.getElementById('previewVenue');
const previewMeetingPlace = document.getElementById('previewMeetingPlace');
const previewMeetingTime = document.getElementById('previewMeetingTime');

const days = document.getElementById('days');
const hours = document.getElementById('hours');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');
const countdownStatus = document.getElementById('countdownStatus');

function formatDate(value) {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  return `${d}.${m}.${y}`;
}

function updatePreview() {
  previewName.textContent = guestName.value.trim() || 'Ваше имя';
  previewDate.textContent = formatDate(weddingDate.value) || '05.09.2026';
  previewVenue.textContent = venue.value.trim() || 'Чаша, Золотой зал';
  previewMeetingPlace.textContent = meetingPlace.value.trim() || 'У входа в Золотой зал';
  previewMeetingTime.textContent = meetingTime.value || '16:00';
}

[guestName, weddingDate, venue, meetingPlace, meetingTime].forEach(el => {
  el.addEventListener('input', updatePreview);
  el.addEventListener('change', updatePreview);
});

function updateCountdown() {
  if (!weddingDate.value) return;

  // Считаем до 12:00 по локальному времени браузера.
  const target = new Date(`${weddingDate.value}T12:00:00`);
  const diff = target - new Date();

  if (diff <= 0) {
    days.textContent = '0';
    hours.textContent = '0';
    minutes.textContent = '0';
    seconds.textContent = '0';
    countdownStatus.textContent = 'Этот день уже наступил ❤️';
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  days.textContent = Math.floor(totalSeconds / 86400);
  hours.textContent = Math.floor((totalSeconds % 86400) / 3600);
  minutes.textContent = Math.floor((totalSeconds % 3600) / 60);
  seconds.textContent = totalSeconds % 60;
  countdownStatus.textContent = '';
}

setInterval(updateCountdown, 1000);
updatePreview();
updateCountdown();

function buildPersonalLink() {
  const name = guestName.value.trim();
  if (!name) {
    guestName.focus();
    alert('Введите ФИО гостя.');
    return;
  }

  const params = new URLSearchParams({
    guest: name,
    date: weddingDate.value,
    venue: venue.value.trim(),
    meetingPlace: meetingPlace.value.trim(),
    meetingTime: meetingTime.value
  });

  const url = `${location.origin}${location.pathname}?${params.toString()}`;
  document.getElementById('generatedLink').value = url;
  document.getElementById('result').classList.remove('hidden');
  document.getElementById('resultText').textContent =
    'Гость откроет эту ссылку и сразу увидит персональное приглашение.';
}

document.getElementById('generateBtn').addEventListener('click', buildPersonalLink);

document.getElementById('copyBtn').addEventListener('click', async () => {
  const input = document.getElementById('generatedLink');
  try {
    await navigator.clipboard.writeText(input.value);
    document.getElementById('copyBtn').textContent = 'Скопировано';
    setTimeout(() => document.getElementById('copyBtn').textContent = 'Копировать', 1500);
  } catch {
    input.select();
    document.execCommand('copy');
  }
});

// Если открыли уже персональную ссылку — показываем сразу приглашение,
// а форму конструктора скрываем.
const params = new URLSearchParams(location.search);
if (params.has('guest')) {
  guestName.value = params.get('guest') || '';
  weddingDate.value = params.get('date') || '2026-09-05';
  venue.value = params.get('venue') || 'Чаша, Золотой зал';
  meetingPlace.value = params.get('meetingPlace') || 'У входа в Золотой зал';
  meetingTime.value = params.get('meetingTime') || '16:00';
  updatePreview();

  document.querySelector('.panel').style.display = 'none';
  document.querySelector('.builder').style.gridTemplateColumns = '1fr';
  document.querySelector('.preview-wrap').style.width = '100%';
}

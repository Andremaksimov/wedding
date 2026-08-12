const guestName = document.getElementById('guestName');
const weddingDate = document.getElementById('weddingDate');
const venue = document.getElementById('venue');
const meetingPlace = document.getElementById('meetingPlace');
const timeType = document.getElementById('timeType');
const meetingTime = document.getElementById('meetingTime');
const enableSecondMeeting = document.getElementById('enableSecondMeeting');
const secondMeetingFields = document.getElementById('secondMeetingFields');
const meetingPlace2 = document.getElementById('meetingPlace2');
const timeType2 = document.getElementById('timeType2');
const meetingTime2 = document.getElementById('meetingTime2');

const previewName = document.getElementById('previewName');
const previewDate = document.getElementById('previewDate');
const previewVenue = document.getElementById('previewVenue');
const previewMeetingPlace = document.getElementById('previewMeetingPlace');
const previewMeetingTime = document.getElementById('previewMeetingTime');
const meetingTimeLabel = document.getElementById('meetingTimeLabel');
const meetingBlock1 = document.getElementById('meetingBlock1');
const meetingBlock2 = document.getElementById('meetingBlock2');
const secondMeetingPreview = document.getElementById('secondMeetingPreview');
const previewMeetingPlaceOpt1 = document.getElementById('previewMeetingPlaceOpt1');
const previewMeetingTimeOpt1 = document.getElementById('previewMeetingTimeOpt1');
const previewTimeLabelOpt1 = document.getElementById('previewTimeLabelOpt1');
const previewMeetingPlaceOpt2 = document.getElementById('previewMeetingPlaceOpt2');
const previewMeetingTimeOpt2 = document.getElementById('previewMeetingTimeOpt2');
const previewTimeLabelOpt2 = document.getElementById('previewTimeLabelOpt2');

const days = document.getElementById('days');
const hours = document.getElementById('hours');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');
const countdownStatus = document.getElementById('countdownStatus');

const TIME_LABELS = {
  registration: 'ВРЕМЯ РЕГИСТРАЦИИ',
  banquet: 'НАЧАЛО БАНКЕТА'
};

function formatDate(value) {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  return `${d}.${m}.${y}`;
}

function isSecondEnabled() {
  return enableSecondMeeting.checked;
}

function timeLabel(type) {
  return TIME_LABELS[type] || TIME_LABELS.registration;
}

function updateSecondFieldsVisibility() {
  if (isSecondEnabled()) {
    secondMeetingFields.classList.remove('hidden');
  } else {
    secondMeetingFields.classList.add('hidden');
  }
}

function updatePreview() {
  previewName.textContent = guestName.value.trim() || 'Ваше имя';
  previewDate.textContent = formatDate(weddingDate.value) || '05.09.2026';
  previewVenue.textContent = venue.value.trim() || 'Чаша, Золотой зал';

  const place1 = meetingPlace.value.trim() || 'У входа в Золотой зал';
  const time1 = meetingTime.value || '16:00';
  const type1 = timeType.value || 'registration';
  const place2 = meetingPlace2.value.trim();
  const time2 = meetingTime2.value || '';
  const type2 = timeType2.value || 'banquet';

  if (isSecondEnabled() && place2) {
    meetingBlock1.classList.add('hidden');
    meetingBlock2.classList.add('hidden');
    secondMeetingPreview.classList.remove('hidden');
    previewMeetingPlaceOpt1.textContent = place1;
    previewMeetingTimeOpt1.textContent = time1;
    previewTimeLabelOpt1.textContent = timeLabel(type1);
    previewMeetingPlaceOpt2.textContent = place2;
    previewMeetingTimeOpt2.textContent = time2 || '—';
    previewTimeLabelOpt2.textContent = timeLabel(type2);
  } else {
    meetingBlock1.classList.remove('hidden');
    meetingBlock2.classList.remove('hidden');
    secondMeetingPreview.classList.add('hidden');
    previewMeetingPlace.textContent = place1;
    previewMeetingTime.textContent = time1;
    meetingTimeLabel.textContent = timeLabel(type1);
  }
}

[guestName, weddingDate, venue, meetingPlace, meetingTime, meetingPlace2, meetingTime2].forEach(el => {
  el.addEventListener('input', updatePreview);
  el.addEventListener('change', updatePreview);
});

[timeType, timeType2].forEach(el => {
  el.addEventListener('change', updatePreview);
});

enableSecondMeeting.addEventListener('change', () => {
  updateSecondFieldsVisibility();
  updatePreview();
});

function updateCountdown() {
  if (!weddingDate.value) return;

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
updateSecondFieldsVisibility();
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
    meetingTime: meetingTime.value,
    timeType: timeType.value
  });

  if (isSecondEnabled() && meetingPlace2.value.trim()) {
    params.set('second', '1');
    params.set('meetingPlace2', meetingPlace2.value.trim());
    params.set('meetingTime2', meetingTime2.value);
    params.set('timeType2', timeType2.value);
  }

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

const params = new URLSearchParams(location.search);
if (params.has('guest')) {
  guestName.value = params.get('guest') || '';
  weddingDate.value = params.get('date') || '2026-09-05';
  venue.value = params.get('venue') || 'Чаша, Золотой зал';
  meetingPlace.value = params.get('meetingPlace') || 'У входа в Золотой зал';
  meetingTime.value = params.get('meetingTime') || '16:00';
  timeType.value = params.get('timeType') || 'registration';

  if (params.get('second') === '1') {
    enableSecondMeeting.checked = true;
    meetingPlace2.value = params.get('meetingPlace2') || '';
    meetingTime2.value = params.get('meetingTime2') || '';
    timeType2.value = params.get('timeType2') || 'banquet';
  }

  updateSecondFieldsVisibility();
  updatePreview();

  document.querySelector('.panel').style.display = 'none';
  document.querySelector('.builder').style.gridTemplateColumns = '1fr';
  document.querySelector('.preview-wrap').style.width = '100%';
}

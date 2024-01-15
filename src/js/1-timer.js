import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const timerDays = document.querySelector('[data-days]');
const timerHours = document.querySelector('[data-hours]');
const timerMinutes = document.querySelector('[data-minutes]');
const timerSeconds = document.querySelector('[data-seconds]');

let userSelectedDate = 0;
startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];

    if (selectedDates[0] <= Date.now()) {
      iziToast.show({
        message: 'Please choose a date in the future',
        color: 'red',
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  },
};

flatpickr(input, options);

startBtn.addEventListener('click', onStartTimer);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function onStartTimer() {
  input.disabled = true;
  startBtn.disabled = true;

  const intervalId = setInterval(() => {
    const timeDifference = userSelectedDate - Date.now();

    if (timeDifference <= 0) {
      clearInterval(intervalId);
      input.disabled = false;
      startBtn.disabled = false;
      iziToast.show({
        theme: 'dark',
        message: 'Timer reached zero!',
        messageSize: '16px',
        messageColor: 'white',
        backgroundColor: '#4CAF50',
        position: 'topRight',
        timeout: 5000,
      });
      return;
    }

    const time = convertMs(timeDifference);
    timerDays.textContent = addLeadingZero(time.days);
    timerHours.textContent = addLeadingZero(time.hours);
    timerMinutes.textContent = addLeadingZero(time.minutes);
    timerSeconds.textContent = addLeadingZero(time.seconds);
  }, 1000);
}
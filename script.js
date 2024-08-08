let isWorkMode = true;
let timer;
let workTime = 2700; 
let breakTime = 600;
let timeRemaining = workTime;

const workBtn = document.getElementById('work-btn');
const breakBtn = document.getElementById('break-btn');
const timeDisplay = document.getElementById('time');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const progress = document.getElementById('progress');

workBtn.addEventListener('click', () => {
    switchMode(true);
});

breakBtn.addEventListener('click', () => {
    switchMode(false);
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

timeDisplay.addEventListener('input', handleTimeInput);

function switchMode(isWork) {
    isWorkMode = isWork;
    timeRemaining = isWork ? workTime : breakTime;
    workBtn.classList.toggle('active', isWork);
    breakBtn.classList.toggle('active', !isWork);
    updateDisplay();
    updateProgressRing();
}

function updateDisplay() {
    const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
    const seconds = (timeRemaining % 60).toString().padStart(2, '0');
    timeDisplay.textContent = `${minutes}:${seconds}`;
}

function updateProgressRing() {
    const totalTime = isWorkMode ? workTime : breakTime;
    const circumference = 2 * Math.PI * 180; // Circumference of the circle with radius 180
    const offset = (timeRemaining / totalTime) * circumference;
    console.log(`Total Time: ${totalTime}, Time Remaining: ${timeRemaining}, Offset: ${offset}`);
    progress.style.strokeDashoffset = circumference - offset;
}

function startTimer() {
    const alarmSound = document.getElementById('alarm-sound');
    alarmSound.volume = 0.2
    setActiveButton('start');
    if (!timer) {
        disableEditing(true);
        timer = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                updateDisplay();
                updateProgressRing();
            } else {
                clearInterval(timer);
                timer = null;
                
                alarmSound.play();
                if (isWorkMode) {
                    switchMode(false);
                } else {
                    switchMode(true);
                }
                setTimeout(function() {
                    startTimer();
                }, (3 * 1000));
            }
        }, 1000);
    }
}

function pauseTimer() {
    setActiveButton('pause');
    if (timer) {
        clearInterval(timer);
        timer = null;
        disableEditing(false);
    }
}

function resetTimer() {
    setActiveButton('reset');
    clearInterval(timer);
    timer = null;
    timeRemaining = isWorkMode ? workTime : breakTime;
    disableEditing(false);
    updateDisplay();
    updateProgressRing();
}

function handleTimeInput() {
    const timeParts = timeDisplay.textContent.split(':');
    if (timeParts.length === 2) {
        const minutes = parseInt(timeParts[0], 10);
        const seconds = parseInt(timeParts[1], 10);
        if (!isNaN(minutes) && !isNaN(seconds)) {
            timeRemaining = minutes * 60 + seconds;
            if (isWorkMode) {
                workTime = timeRemaining;
            } else {
                breakTime = timeRemaining;
            }
            updateProgressRing();
        }
    }
}

function disableEditing(disable) {
    timeDisplay.contentEditable = !disable;
}

function setActiveButton(activeButton) {
    startBtn.classList.toggle('active', activeButton === 'start');
    pauseBtn.classList.toggle('active', activeButton === 'pause');
    resetBtn.classList.toggle('active', activeButton === 'reset');
}

// Initial display update
updateDisplay();
disableEditing(false);
updateProgressRing();
setActiveButton('reset');

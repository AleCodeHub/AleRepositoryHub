let countries = [];
let usedIndices = [];
let currentIndex = null;
let showingCountry = false;
let state = 'idle';

const flagImg = document.getElementById('flag');
const question1 = document.getElementById('question1');
const answer1 = document.getElementById('answer1');
const countdown1 = document.getElementById('countdown1');
const speaker1 = document.getElementById('speaker1');
const question2 = document.getElementById('question2');
const answer2 = document.getElementById('answer2');
const countdown2 = document.getElementById('countdown2');
const speaker2 = document.getElementById('speaker2');
const endMessage = document.getElementById('endMessage');

let flagInterval = null;
let currentAudio = null;

fetch('countries_data.json')
  .then(res => res.json())
  .then(data => {
    countries = data;
    startFlagCycle();
  });

function startFlagCycle() {
  if (usedIndices.length >= 27) {
    showEndMessage();
    return;
  }
  state = 'cycling';
  flagInterval = setInterval(() => {
    currentIndex = getNextIndex();
    if (currentIndex === null) {
      stopFlagCycle();
      showEndMessage();
      return;
    }
    flagImg.src = countries[currentIndex].flag;
  }, 90);
}

function getNextIndex() {
  if (usedIndices.length >= 27) return null;

  if (usedIndices.length < 24) {
    let index;
    do {
      index = Math.floor(Math.random() * countries.length);
    } while (usedIndices.includes(index));
    return index;
  } else {
    // Secuencial en los últimos 3 turnos
    const index = usedIndices.length;
    if (!usedIndices.includes(index)) {
      return index;
    } else {
      return null;
    }
  }
}
function stopFlagCycle() {
  clearInterval(flagInterval);
  flagInterval = null;
}

flagImg.addEventListener('click', () => {
  if (state !== 'cycling') return;
  stopFlagCycle();
  if (!usedIndices.includes(currentIndex)) {
    usedIndices.push(currentIndex);
  }
  showQuestion1();
});

function showQuestion1() {
  state = 'waitingForCountryQuestion';
  question1.innerText = '¿Qué país es?';
  question1.style.cursor = 'pointer';
  question1.onclick = () => {
    if (state !== 'waitingForCountryQuestion') return;
    showAnswer1();
  };
}

function showAnswer1() {
  state = 'showingCountryAnswer';
  question1.style.cursor = 'default';
  question1.onclick = null;
  answer1.innerHTML = countries[currentIndex].nameHtml;
  delayWithCountdown(countdown1, 3, () => {
    //delayWithCountdown(countdown1, 5, () => {
      speaker1.style.display = 'inline';
      speaker1.onclick = () => {
        playAudio(countries[currentIndex].countryAudio, () => {
          showQuestion2();
        });
      };
    //});
  });
}

function showQuestion2() {
  state = 'waitingForNationalityQuestion';
  question2.innerText = '¿Y la nacionalidad?';
  question2.style.cursor = 'pointer';
  question2.onclick = () => {
    if (state !== 'waitingForNationalityQuestion') return;
    showAnswer2();
  };
}

function showAnswer2() {
  state = 'showingNationalityAnswer';
  question2.style.cursor = 'default';
  question2.onclick = null;
  answer2.innerHTML = countries[currentIndex].nationalityHtml;
  delayWithCountdown(countdown2, 3, () => {
    //delayWithCountdown(countdown2, 5, () => {
      speaker2.style.display = 'inline';
      speaker2.onclick = () => {
        playAudio(countries[currentIndex].nationalityAudio);
      };
      showContinueButton();
    //});
  });
}

function playAudio(src, onended = null) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  currentAudio = new Audio(src);
  currentAudio.onended = onended;
  currentAudio.play();
}

function delayWithCountdown(container, seconds, callback) {
  let remaining = seconds;
  container.innerText = `⏳ ${remaining}`;
  const interval = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(interval);
      container.innerText = '';
      callback();
    } else {
      container.innerText = `⏳ ${remaining}`;
    }
  }, 1000);
}

function showContinueButton() {
  const button = document.createElement('button');
  button.innerText = 'Continuar';
  button.onclick = () => {
    resetUI();
    startFlagCycle();
  };
  endMessage.appendChild(button);
}

function resetUI() {
  flagImg.src = '';
  question1.innerText = '';
  answer1.innerText = '';
  countdown1.innerText = '';
  speaker1.style.display = 'none';
  speaker1.onclick = null;
  question2.innerText = '';
  answer2.innerText = '';
  countdown2.innerText = '';
  speaker2.style.display = 'none';
  speaker2.onclick = null;
  endMessage.innerHTML = '';
}

function showEndMessage() {
  endMessage.innerHTML = '<h2>🎉 ¡Fin! 🎉</h2>';
}

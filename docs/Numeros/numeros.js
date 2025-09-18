const display = document.getElementById("number-display");
const nameDisplay = document.getElementById("name-display");
const keys = document.querySelectorAll(".key");

let current = "";
let justRead = false;
let clickedOnce = false;

const names = {0: '<u><strong>ce</strong></u>ro', 1: '<u><strong>u</strong></u>no', 2: '<u><strong>dos</strong></u>', 3: '<u><strong>tres</strong></u>', 4: '<u><strong>cua</strong></u>tro', 5: '<u><strong>cin</strong></u>co', 6: '<u><strong>seis</strong></u>', 7: '<u><strong>sie</strong></u>te', 8: '<u><strong>o</strong></u>cho', 9: '<u><strong>nue</strong></u>ve', 10: '<u><strong>diez</strong></u>', 11: '<u><strong>on</strong></u>ce', 12: '<u><strong>do</strong></u>ce', 13: '<u><strong>tre</strong></u>ce', 14: 'ca<u><strong>tor</strong></u>ce', 15: '<u><strong>quin</strong></u>ce', 16: 'dieci<u><strong>séis</strong></u>', 17: 'dieci<u><strong>sie</strong></u>te', 18: 'dieci<u><strong>o</strong></u>cho', 19: 'dieci<u><strong>nue</strong></u>ve', 20: '<u><strong>vein</strong></u>te', 21: 'veinti<u><strong>u</strong></u>no', 22: 'veinti<u><strong>dós</strong></u>', 23: 'veinti<u><strong>trés</strong></u>', 24: 'veinti<u><strong>cua</strong></u>tro', 25: 'veinti<u><strong>cin</strong></u>co', 26: 'veinti<u><strong>séis</strong></u>', 27: 'veinti<u><strong>sie</strong></u>te', 28: 'veinti<u><strong>o</strong></u>cho', 29: 'veinti<u><strong>nue</strong></u>ve', 30: '<u><strong>trein</strong></u>ta', 40: 'cua<u><strong>ren</strong></u>ta', 50: 'cin<u><strong>cuen</strong></u>ta', 60: 'se<u><strong>sen</strong></u>ta', 70: 'se<u><strong>ten</strong></u>ta', 80: 'o<u><strong>chen</strong></u>ta', 90: 'no<u><strong>ven</strong></u>ta', 100: '<u><strong>cien</strong></u>'};

function playNumber(numStr) {
  const padded = numStr.padStart(3, '0');
  const audio = new Audio(`assets/sounds/num0_29/num${padded}.mp3`);
  audio.play();
}

function resetDisplay() {
  current = "";
  clickedOnce = false;
  justRead = false;
  display.textContent = "";
  nameDisplay.innerHTML = "";
}

keys.forEach(key => {
  const num = key.dataset.num;

  key.addEventListener("mouseover", () => {
    if (num !== undefined) {
      if (!clickedOnce) {
        display.textContent = num;
        nameDisplay.innerHTML = names[parseInt(num)] || "";
      } else if (clickedOnce && current.length === 1 && (current === "1" || current === "2")) {
        const preview = current + num;
        if (parseInt(preview) <= 29) {
          display.textContent = preview;
          nameDisplay.innerHTML = names[parseInt(num)] || "";
        }
      }
    }
  });

  key.addEventListener("mouseout", () => {
    if (!clickedOnce && !justRead) {
      display.textContent = "";
      nameDisplay.innerHTML = "";
    }
  });

  key.addEventListener("click", () => {
    if (num !== undefined) {
      if (justRead) resetDisplay();

      if (!clickedOnce) {
        current = num;
        display.textContent = current;
        nameDisplay.innerHTML = names[parseInt(num)] || "";
        playNumber(current);
        clickedOnce = true;
      } else if (clickedOnce && current.length === 1 && (current === "1" || current === "2")) {
        const combined = current + num;
        if (parseInt(combined) <= 29) {
          current = combined;
          display.textContent = current;
          nameDisplay.innerHTML = names[parseInt(num)] || "";
          playNumber(num);
        }
      }
    }
  });
});

document.getElementById("borra").addEventListener("click", resetDisplay);

document.getElementById("lee").addEventListener("click", () => {
  if (current !== "") {
    const num = parseInt(current);
    if (!isNaN(num) && num <= 29) {
      nameDisplay.innerHTML = names[num] || "";
      playNumber(current);
      justRead = true;
    }
  }
});


// Clock module

import { padZero } from './utils.js';

export function initClock() {
  const clock = document.getElementById("clockDisplay");

  function updateClock() {
    const now = new Date();
    const timeString = `${now.getFullYear()}-${padZero(now.getMonth() + 1)}-${padZero(now.getDate())} ${padZero(now.getHours())}:${padZero(now.getMinutes())}:${padZero(now.getSeconds())}`;
    if (clock) clock.textContent = timeString;
  }

  if (clock) {
    clock.style.opacity = 0;
    updateClock();
    setInterval(updateClock, 1000);
  }
}

export function getGreetingByTime() {
  const h = new Date().getHours();
  if (h < 5) return "오늘 하루도 고생 하셨어요.";
  if (h < 12) return "좋은 아침이에요.";
  if (h < 19) return "오후도 활기차게 파이팅!";
  return "오늘 하루도 고생 하셨어요.";
}

export function initGreetingTyping() {
  const name = document.getElementById("name")?.value || "";
  const u = document.getElementById("usernamePart");
  const s = document.getElementById("suffixPart");
  const g = document.getElementById("greetingPart");
  const greeting = getGreetingByTime();
  const suffix = "님,";
  let i = 0, j = 0, k = 0;

  function typeUsername() {
    if (i < name.length) {
      u.textContent += name[i++];
      setTimeout(typeUsername, 150);
    } else {
      setTimeout(typeSuffix, 150);
    }
  }
  function typeSuffix() {
    if (j < suffix.length) {
      s.textContent += suffix[j++];
      setTimeout(typeSuffix, 150);
    } else {
      setTimeout(typeGreeting, 250);
    }
  }
  function typeGreeting() {
    if (k < greeting.length) {
      g.textContent += greeting[k++];
      setTimeout(typeGreeting, 150);
    } else {
      document.getElementById("clockDisplay").style.opacity = 1;
    }
  }

  u.textContent = "";
  s.textContent = "";
  g.textContent = "";

  typeUsername();
}

export function startGreetingUpdater() {
  setInterval(() => {
    const hour = new Date().getHours();
    const greeting = getGreetingByTime();
    document.getElementById("greetingPart").textContent = greeting;
  }, 60000);
}

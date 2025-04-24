// ===== 초기화 시작 =====
function initApp() {
  initThemeFromSystemOrStorage();
  setupThemeToggleButton();
  initWrapOpacity();
  initClockVisibility();
  initFormData();
  initWeekendCheckboxes();
  initGreetingTyping();
  initClock();
  initBackgroundFromStorage();
  initDragAndDrop();
  initBackgroundButtons();
  observeDateChange();
  startGreetingUpdater();
}

// ===== 테마모드 체크 =====
function applyTheme(mode) {
  document.documentElement.setAttribute("data-bs-theme", mode);
}

function detectSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function initThemeFromSystemOrStorage() {
  const stored = localStorage.getItem("themePreference");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const isStoredValid = stored === "dark" || stored === "light";
  const theme = isStoredValid ? stored : (prefersDark ? "dark" : "light");

  document.documentElement.setAttribute("data-bs-theme", theme);

  // 스위치 체크 상태 반영
  const themeToggle = document.getElementById("ckb_themeToggle");
  if (themeToggle) {
    themeToggle.checked = (theme === "dark");
  }
}

function applyThemeFromImageAnalysis(isDark) {
  const userTheme = localStorage.getItem("themePreference");

  // ✅ 사용자 설정이 있으면 이미지 분석 무시
  if (userTheme === "dark" || userTheme === "light") return;

  const imageTheme = isDark ? "dark" : "light";
  applyTheme(imageTheme);
}

function setupThemeToggleButton() {
  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-bs-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  });
}

// ===== 폼 및 출퇴근 관련 =====
function initFormData() {
  const nameEl = document.getElementById("name");
  const startEl = document.getElementById("startTime");
  const endEl = document.getElementById("endTime");

  if (!nameEl || !startEl || !endEl) return;

  // localStorage에서 가져오거나 기본값으로 세팅
  const name = localStorage.getItem("commuteName") || "";
  const startTime = localStorage.getItem("commuteStartTime") || "09:00";
  const endTime = localStorage.getItem("commuteEndTime") || "19:00";

  nameEl.value = name;
  startEl.value = startTime;
  endEl.value = endTime;

  // 버튼 이벤트 연결
  document.getElementById("arrivalBtn")?.addEventListener("click", generateArrivalReport);
  document.getElementById("departureBtn")?.addEventListener("click", generateDepartureReport);
  document.getElementById("fillStartTime")?.addEventListener("click", () => fillCurrentTime("startTime"));
  document.getElementById("fillEndTime")?.addEventListener("click", () => fillCurrentTime("endTime"));
}

function isValidForm() {
  const nameEl = document.getElementById("name");
  const startTimeEl = document.getElementById("startTime");
  const endTimeEl = document.getElementById("endTime");

  if (!nameEl || !startTimeEl || !endTimeEl) {
    console.warn("폼 요소가 존재하지 않습니다.");
    return false;
  }

  const name = nameEl.value.trim();
  const startTime = startTimeEl.value;
  const endTime = endTimeEl.value;

  // is-invalid 클래스 토글
  nameEl.classList.toggle("is-invalid", !name);
  startTimeEl.classList.toggle("is-invalid", !startTime);
  endTimeEl.classList.toggle("is-invalid", !endTime);

  // 잘못된 항목 중 가장 먼저인 요소에 포커스
  if (!name) {
    nameEl.focus();
  } else if (!startTime) {
    startTimeEl.focus();
  } else if (!endTime) {
    endTimeEl.focus();
  }

  if (!name || !startTime || !endTime) {
    showToast("이름과 출/퇴근 시간을 모두 입력해주세요.", "danger");
    return false;
  }

  return true;
}

function fillCurrentTime(id) {
  const now = new Date();
  const time = `${padZero(now.getHours())}:${padZero(now.getMinutes())}`;
  const input = document.getElementById(id);
  if (input) input.value = time;
  id === "startTime" ? generateArrivalReport() : generateDepartureReport();
}

function generateArrivalReport() {
  if (!isValidForm()) return;

  const now = new Date();
  const startTimeEl = document.getElementById("startTime");
  const endTimeEl = document.getElementById("endTime");
  const nameEl = document.getElementById("name");
  const saturdayEl = document.getElementById("chk_saturday");
  const sundayEl = document.getElementById("chk_sunday");
  
  const startTime = startTimeEl.value;
  const endTime = endTimeEl.value;
  const name = nameEl.value;
  const saturday = saturdayEl?.checked;
  const sunday = sundayEl?.checked;

  const endDate = new Date(now);
  switch (now.getDay()) {
    case 1:
      endDate.setDate(endDate.getDate() - (sunday ? 1 : saturday ? 2 : 3)); break;
    case 2:
      endDate.setDate(endDate.getDate() - (sunday ? 2 : saturday ? 3 : 1)); break;
    default:
      endDate.setDate(endDate.getDate() - 1);
  }
  renderReport(name, 'arrival', startTime, endTime, now, endDate);
}

function generateDepartureReport() {
  if (!isValidForm()) return;

  const now = new Date();
  const startTimeEl = document.getElementById("startTime");
  const endTimeEl = document.getElementById("endTime");
  const nameEl = document.getElementById("name");

  const startTime = startTimeEl.value;
  const endTime = endTimeEl.value;
  const name = nameEl.value;

  renderReport(name, 'depature', startTime, endTime, now, now);
}

function renderReport(name, type, startTime, endTime, startDate, endDate) {
  const report = document.getElementById("report");
  const lines =
    type === "arrival"
      ? `${name} 출근 보고드립니다.\n-퇴근 ${getFormattedDateTime(endDate, endTime)}\n-출근 ${getFormattedDateTime(startDate, startTime)}`
      : `${name} 퇴근 보고드립니다.\n-출근 ${getFormattedDateTime(startDate, startTime)}\n-퇴근 ${getFormattedDateTime(endDate, endTime)}`;
  if (report) {
    report.innerHTML = lines.replaceAll('\n', '<br>');
    report.className = type;
  }
  localStorage.setItem("commuteName", name);
  localStorage.setItem("commuteStartTime", startTime);
  localStorage.setItem("commuteEndTime", endTime);
  copyToClipboard();
  showToast("클립보드에 복사되었습니다.", "primary");
}

// ===== 주말 체크박스 관련 =====
function initWeekendCheckboxes() {
  updateWeekendCheckboxState();
}

function updateWeekendCheckboxState() {
  const today = new Date().getDay();
  const active = today === 0 || today === 1;
  const w = document.getElementById("weekendCheck");
  const s = document.getElementById("chk_saturday");
  const su = document.getElementById("chk_sunday");
  if (w && s && su) {
    w.classList.toggle("disabled", !active);
    s.disabled = !active;
    su.disabled = !active;
  }
}

function observeDateChange() {
  let last = new Date().toDateString();
  setInterval(() => {
    const now = new Date().toDateString();
    if (now !== last) {
      last = now;
      updateWeekendCheckboxState();
    }
  }, 60000);
}

// ===== 인사 메시지 및 시계 =====
function initGreetingTyping() {
  const name = document.getElementById("name")?.value.trim();
  const hasName = !!name;
  const greeting = getGreetingByTime();

  const u = document.getElementById("usernamePart");
  const s = document.getElementById("suffixPart");
  const g = document.getElementById("greetingPart");

  u.textContent = "";
  s.textContent = "";
  g.textContent = "";

  const suffix = "님,";

  let i = 0, j = 0, k = 0;

  if (!hasName) { typeGreeting(); } else { typeUsername(); }

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
}

function getGreetingByTime() {
  const h = new Date().getHours();
  return h < 5 ? "오늘 하루도 고생 하셨어요." : h < 12 ? "좋은 아침이에요." : h < 19 ? "오후도 활기차게 파이팅!" : "오늘 하루도 고생 하셨어요.";
}

function startGreetingUpdater() {
  setInterval(() => {
    const name = document.getElementById("name")?.value.trim();
    const hasName = !!name;
    const u = document.getElementById("usernamePart");
    const s = document.getElementById("suffixPart");
    const g = document.getElementById("greetingPart");
    const suffix = "님,";
    const greeting = getGreetingByTime();

    u.textContent = hasName ? name : "";
    s.textContent = hasName ? suffix : "";
    g.textContent = greeting;
  }, 60000);
}

function initClock() {
  const clock = document.getElementById("clockDisplay");
  function updateClock() {
    const now = new Date();
    clock.textContent = `${now.getFullYear()}-${padZero(now.getMonth()+1)}-${padZero(now.getDate())} ${padZero(now.getHours())}:${padZero(now.getMinutes())}:${padZero(now.getSeconds())}`;
  }
  clock.style.opacity = 0;
  updateClock();
  setInterval(updateClock, 1000);
}

// ===== 배경 이미지 및 밝기 분석 =====
function initBackgroundFromStorage() {
  const saved = localStorage.getItem('userBackgroundImage');
  if (saved) {
    applyBackground(saved);
    analyzeBrightness(saved);
  }
}

function applyBackground(base64) {
  document.body.classList.add('custom-bg');
  document.documentElement.style.setProperty('--user-bg', `url('${base64}')`);
}

function analyzeBrightness(base64Image) {
  const img = new Image();
  img.src = base64Image;
  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 100, 100);

    const data = ctx.getImageData(0, 0, 100, 100).data;
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
      sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }

    const isDark = (sum / (data.length / 4)) < 128;
    applyThemeFromImageAnalysis(isDark);
  };
}


function initBackgroundButtons() {
  document.getElementById('confirmBackgroundBtn').addEventListener('click', () => {
    const file = document.getElementById('bgFileInput').files[0];
    if (!file) return showError('이미지를 업로드해주세요.');
    if (file.size > 5 * 1024 * 1024) return showError('이미지 파일은 5MB 이하만 업로드 가능합니다.');
    clearError();
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      const base64 = canvas.toDataURL('image/webp', 0.8);
      applyBackground(base64);
      analyzeBrightness(base64);
      localStorage.setItem('userBackgroundImage', base64);
      bootstrap.Modal.getInstance(document.getElementById('bgModal')).hide();
      URL.revokeObjectURL(img.src);
    };
  });

  document.getElementById('resetBackground').addEventListener('click', () => {
    localStorage.removeItem('userBackgroundImage');
    document.body.classList.remove('custom-bg', 'light-bg', 'dark-bg');
    document.documentElement.style.setProperty('--user-bg', 'none');
    document.getElementById('bgFileInput').value = "";
    clearError();
  });
}

function initDragAndDrop() {
  const dropZone = document.getElementById('dropZone');
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => dropZone.addEventListener(evt, e => e.preventDefault()));
  dropZone.addEventListener('dragover', () => dropZone.classList.add('drag-over'));
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
  dropZone.addEventListener('drop', e => {
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) {
      document.getElementById('bgFileInput').files = e.dataTransfer.files;
      document.getElementById('confirmBackgroundBtn').click();
    }
  });
}

function showError(msg) {
  const err = document.getElementById('bgFileError');
  err.textContent = msg;
  err.classList.remove('d-none');
  document.getElementById('bgFileInput').classList.add('is-invalid');
}

function clearError() {
  document.getElementById('bgFileError').classList.add('d-none');
  document.getElementById('bgFileInput').classList.remove('is-invalid');
}

//토스트 관련
function showToast(message, type = "primary") {
  const toastEl = document.getElementById("globalToast");
  const toastMsg = document.getElementById("globalToastMessage");

  toastMsg.textContent = message;
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
  toast.show();
}

function getFormattedDateTime(date, time) {
  const [h, m] = time.split(":");
  return `${padZero(date.getMonth()+1)}월 ${padZero(date.getDate())}일(${getWeekday(date.getDay())}) ${h}시 ${m}분`;
}

function getWeekday(d) {
  return ["일", "월", "화", "수", "목", "금", "토"][d];
}

function padZero(n) {
  return n < 10 ? '0' + n : String(n);
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(document.getElementById("report").innerText);
  } catch (e) {
    console.error("클립보드 복사 실패", e);
  }
}

function initWrapOpacity() {
  const storedOpacity = localStorage.getItem("wrapOpacity") || "1";
  const el = document.querySelector(".commute-wrap");
  el?.style.setProperty("--user-opacity", storedOpacity);

  const range = document.getElementById("ran_formOpacity");
  if (range) {
    range.value = Math.round(parseFloat(storedOpacity) * 100);
  }
}

function initClockVisibility() {
  const visible = localStorage.getItem("clockVisible");
  const show = visible === null || visible === "true";

  const clock = document.getElementById("clockDisplay");
  const toggle = document.getElementById("ckb_clockToggle");

  if (clock) clock.style.display = show ? "block" : "none";
  if (toggle) toggle.checked = show;
}

document.addEventListener("DOMContentLoaded", initApp);

//세팅 버튼 클릭 -> 세팅 리스트
document.querySelector('.setting-btn')?.addEventListener('click', (e) => {
  const list = document.getElementById('settingList');
  const button = e.currentTarget;

  list.classList.toggle('show');
  button.classList.toggle('active', list.classList.contains('show'));
});

//세팅 리스트 닫기, 세팅 버튼 active 끝
//모달에서 클릭이벤트 이루어질 때 세팅버튼, 세팅 리스트 닫기는 무시
document.addEventListener("click", function (e) {
  const list = document.getElementById("settingList");
  const button = document.querySelector(".setting-btn");

  const isModalOpen = document.querySelector(".modal.show"); // 현재 열려있는 모달 여부

  if (isModalOpen) return; // ✅ 모달이 열려있으면 setting-list 닫지 않음

  if (!list.contains(e.target) && !button.contains(e.target)) {
    list.classList.remove("show");
    button.classList.remove("active");
  }
});


//투명도 슬라이더 이벤트
document.getElementById("ran_formOpacity")?.addEventListener("input", (e) => {
  const value = e.target.value / 100;
  localStorage.setItem("wrapOpacity", value);
  document.querySelector(".commute-wrap").style.setProperty("--user-opacity", value);
});

//시계 체크박스 이벤트
document.getElementById("ckb_clockToggle")?.addEventListener("change", (e) => {
  const isChecked = e.target.checked;
  const clock = document.getElementById("clockDisplay");

  localStorage.setItem("clockVisible", isChecked);
  if (clock) {
    clock.style.display = isChecked ? "block" : "none";
  }
});

//테마 체크박스 이벤트
document.getElementById("ckb_themeToggle")?.addEventListener("change", (e) => {
  const theme = e.target.checked ? "dark" : "light";
  localStorage.setItem("themePreference", theme);
  applyTheme(theme);
});

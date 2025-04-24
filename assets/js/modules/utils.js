
// Utils module

export function padZero(num) {
  return num < 10 ? "0" + num : String(num);
}

export function getWeekday(d) {
  return ["일", "월", "화", "수", "목", "금", "토"][d];
}

export function getFormattedDateTime(date, time) {
  const [h, m] = time.split(":");
  return `${padZero(date.getMonth()+1)}월 ${padZero(date.getDate())}일(${getWeekday(date.getDay())}) ${h}시 ${m}분`;
}

export function showToast(message, type = "primary") {
  const toastEl = document.getElementById("globalToast");
  const toastMsg = document.getElementById("globalToastMessage");

  if (!toastEl || !toastMsg) return;

  // 스타일 변경
  toastEl.className = `toast align-items-center text-bg-${type} border-0`;

  // 메시지 삽입
  toastMsg.textContent = message;

  const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
  toast.show();
}

export async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(document.getElementById("report").innerText);
  } catch (e) {
    console.error("클립보드 복사 실패", e);
  }
}

export function showError(msg) {
  const err = document.getElementById('bgFileError');
  err.textContent = msg;
  err.classList.remove('d-none');
  document.getElementById('bgFileInput').classList.add('is-invalid');
}

export function clearError() {
  document.getElementById('bgFileError').classList.add('d-none');
  document.getElementById('bgFileInput').classList.remove('is-invalid');
}

export function updateWeekendCheckboxState() {
  const today = new Date().getDay(); // 0 = 일, 1 = 월, 2 = 화
  const showWeekend = today === 0 || today === 1 || today === 2;

  const weekendCheck = document.getElementById("weekendCheck");
  const chkSat = document.getElementById("chk_saturday");
  const chkSun = document.getElementById("chk_sunday");

  if (weekendCheck) weekendCheck.classList.toggle("disabled", !showWeekend);
  if (chkSat) chkSat.disabled = !showWeekend;
  if (chkSun) chkSun.disabled = !showWeekend;
}

export function observeDateChange(callback) {
  let last = new Date().toDateString();
  setInterval(() => {
    const now = new Date().toDateString();
    if (now !== last) {
      last = now;
      callback?.();
    }
  }, 60000);
}
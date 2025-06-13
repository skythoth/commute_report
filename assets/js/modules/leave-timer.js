// leave-timer.js
export function initLeaveTimer({ startHour = 9, endHour = 19 } = {}) {
  const el = document.getElementById('leaveTimer');
  if (!el) return;

  function formatDiff(diffMs) {
    const totalSec = Math.floor(diffMs / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h}시간 ${m}분 ${s}초`;
  }

  function update() {
    const now = new Date();
    const hh = now.getHours();
    const mm = now.getMinutes().toString().padStart(2, '0');
    const ss = now.getSeconds().toString().padStart(2, '0');

    let message;
    if (hh < startHour) {
      // 출근 전
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour);
      message = `출근까지 ${formatDiff(target - now)} 남았습니다.`;
    } else if (hh < endHour) {
      // 근무 중
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour);
      message = `퇴근까지 ${formatDiff(target - now)} 남았습니다.`;
    } else {
      // 퇴근 후
      message = `오늘 하루 수고하셨습니다!`;
    }

    el.textContent = `${message}`;
  }

  update();
  setInterval(update, 1000);
}
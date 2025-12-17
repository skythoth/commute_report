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

    // 로컬스토리지에서 설정된 시간 읽기 (기본값: 9, 19)
    const storedStart = localStorage.getItem("workStartHour");
    const storedEnd = localStorage.getItem("workEndHour");
    const currentStartHour = storedStart ? parseInt(storedStart) : startHour;
    const currentEndHour = storedEnd ? parseInt(storedEnd) : endHour;

    let message;
    if (hh < currentStartHour) {
      // 출근 전
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentStartHour);
      message = `출근까지 ${formatDiff(target - now)} 남았습니다.`;
    } else if (hh < currentEndHour) {
      // 근무 중
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentEndHour);
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
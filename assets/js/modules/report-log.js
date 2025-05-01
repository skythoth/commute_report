import { getUserOffDays } from './settings.js';

function getAprilLogs() {
  const logs = JSON.parse(localStorage.getItem("commuteLogs") || "[]");

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 현재 월

  return logs.filter(log => log.date.startsWith(`${year}-${month}`));
}

function groupLogsByDate(logs) {
  const grouped = {};

  logs.forEach(log => {
    if (!grouped[log.date]) grouped[log.date] = {};

    const time = (log.type === "arrival") ? log.startTime : log.endTime;
    grouped[log.date][log.type] = time;
  });

  return grouped;
}

export function renderReportByMonth(year, month) {
  const logs = getLogsByMonth(year, month);
  const grouped = groupLogsByDate(logs);
  const table = document.getElementById("aprilReportTable");

  table.innerHTML = `
    <tr><th>날짜</th><th>출근</th><th>퇴근</th><th>비고</th></tr>
  `;

  const userOffDays = getUserOffDays();
  Object.keys(grouped).sort().forEach(date => {
    const arrival = grouped[date].arrival || "-";
    const departure = grouped[date].departure || "-";
  
    const day = new Date(date).getDay();
    let note = "";
    if (!arrival || !departure) note = "⚠️ 누락";
    else if (userOffDays.includes(day) && arrival) note = "🟠 휴무일";
  
    table.innerHTML += `
      <tr>
        <td>${date}</td>
        <td>${arrival}</td>
        <td>${departure}</td>
        <td>${note}</td>
      </tr>
    `;
  });
}

export function bindMonthSelect() {
  const select = document.getElementById("selectMonth");
  if (!select) return;

  select.addEventListener("change", () => {
    const [year, month] = select.value.split("-");
    renderReportByMonth(year, month);
  });
}

function getLogsByMonth(year, month) {
  const logs = JSON.parse(localStorage.getItem("commuteLogs") || "[]");
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return logs.filter(log => log.date.startsWith(prefix));
}

export function populateMonthSelect() {
  const logs = JSON.parse(localStorage.getItem("commuteLogs") || "[]");
  const select = document.getElementById("selectMonth");
  if (!select) return;

  const months = [...new Set(
    logs.map(log => log.date.slice(0, 7))
  )].sort();

  select.innerHTML = ""; // 초기화

  months.forEach(monthStr => {
    const [year, month] = monthStr.split("-");
    const option = document.createElement("option");
    option.value = monthStr;
    option.textContent = `${year}년 ${parseInt(month)}월`;
    select.appendChild(option);
  });

  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1); // 지난달
  const defaultKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

  // 로그에 해당 월이 있는지 확인 후 선택
  if (months.includes(defaultKey)) {
    select.value = defaultKey;
  } else {
    select.value = months[months.length - 1];
  }

  const [y, m] = select.value.split("-");
  renderReportByMonth(y, m);
}
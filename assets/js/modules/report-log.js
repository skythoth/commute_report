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

export function renderAprilReport() {
  const logs = getAprilLogs();
  const grouped = groupLogsByDate(logs);
  const table = document.getElementById("aprilReportTable");

  table.innerHTML = `
    <tr><th>날짜</th><th>출근</th><th>퇴근</th></tr>
  `;

  Object.keys(grouped).sort().forEach(date => {
    const arrival = grouped[date].arrival || "-";
    const departure = grouped[date].departure || "-";
    //const note = (!arrival || !departure) ? "⚠️ 누락" : "";
    table.innerHTML += `
      <tr>
        <td>${date}</td>
        <td>${arrival}</td>
        <td>${departure}</td>
      </tr>
    `;
  });
}
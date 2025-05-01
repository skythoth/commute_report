
// Report module

import { validationCheck } from './form.js';
import { getFormattedDateTime, copyToClipboard, showToast, padZero } from './utils.js';

export function initReportHandlers() {
  document.addEventListener("submitReport", (e) => {
    const type = e.detail?.type;
    const name = document.getElementById("name")?.value;
    const startTime = document.getElementById("startTime")?.value;
    const endTime = document.getElementById("endTime")?.value;

    if (!validationCheck()) {
      showToast("값들을 모두 입력해주세요", "danger");
      return;
    }

    const now = new Date();
    const startDate = new Date(now);
    const endDate = new Date(now);

    if (type === "arrival") {
      switch (now.getDay()) {
        case 1: // 월요일
          if (document.getElementById("chk_sunday")?.checked) endDate.setDate(now.getDate() - 1);
          else if (document.getElementById("chk_saturday")?.checked) endDate.setDate(now.getDate() - 2);
          else endDate.setDate(now.getDate() - 3);
          break;
        case 2: // 화요일
          if (document.getElementById("chk_sunday")?.checked) endDate.setDate(now.getDate() - 2);
          else if (document.getElementById("chk_saturday")?.checked) endDate.setDate(now.getDate() - 3);
          else endDate.setDate(now.getDate() - 1);
          break;
        default:
          endDate.setDate(now.getDate() - 1);
      }
    }

    renderReport(name, type, startTime, endTime, startDate, endDate);
  });
}

export function renderReport(name, type, startTime, endTime, startDate, endDate) {
  const report = document.getElementById("report");

  const lines = type === "arrival"
  ? `${name} 출근 보고드립니다.\n-퇴근 ${getFormattedDateTime(endDate, endTime)}\n-출근 ${getFormattedDateTime(startDate, startTime)}`
  : `${name} 퇴근 보고드립니다.\n-출근 ${getFormattedDateTime(startDate, startTime)}\n-퇴근 ${getFormattedDateTime(endDate, endTime)}`;

  
  report.textContent = lines;
  report.className = type;
  report.innerHTML = lines.replace(/\n/g, "<br>");
  
  localStorage.setItem("commuteName", name);
  localStorage.setItem("commuteStartTime", startTime);
  localStorage.setItem("commuteEndTime", endTime);

  saveCommuteLog(type, startTime, endTime);
  copyToClipboard();
  showToast("클립보드에 복사되었어요");
}

function saveCommuteLog(type, startTime, endTime) {
  const today = new Date().toISOString().split("T")[0];
  const logs = JSON.parse(localStorage.getItem("commuteLogs") || "[]");
  const updatedLogs = logs.filter(log => !(log.date === today && log.type === type));

  updatedLogs.push({ date: today, startTime, endTime, type });
  localStorage.setItem("commuteLogs", JSON.stringify(updatedLogs));
}
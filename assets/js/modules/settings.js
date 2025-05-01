
// Settings module

import { applyTheme } from './theme.js';
import { showToast } from './utils.js';

export function initSettings() {
  initClockVisibility();
  initWrapOpacity();
  initThemeToggle();
}

export function initSettingButtonToggle() {
  const button = document.querySelector(".setting-btn");
  const list = document.getElementById("settingList");

  button?.addEventListener("click", () => {
    const isOpen = list.classList.toggle("show");
    button.classList.toggle("active", isOpen);
  });

  // 외부 클릭 시 닫기
  document.addEventListener("click", function (e) {
    const isModalOpen = document.querySelector(".modal.show");
    if (isModalOpen) return;

    if (!list.contains(e.target) && !button.contains(e.target)) {
      list.classList.remove("show");
      button.classList.remove("active");
    }
  });
}

export function initWrapOpacity() {
  const stored = localStorage.getItem("wrapOpacity") || "1";
  const wrap = document.querySelector(".commute-wrap");
  const range = document.getElementById("ran_formOpacity");

  applyOpacity(parseFloat(stored));

  if (range) {
    range.value = Math.round(parseFloat(stored) * 100);
    range.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value) / 100;
      applyOpacity(val);
      localStorage.setItem("wrapOpacity", val);
    });
  }
}

function applyOpacity(wrapOpacity) {
  const wrap = document.querySelector(".commute-wrap");
  const inputOpacity = 0.5 + (wrapOpacity * 0.5);

  if (wrap) {
    wrap.style.setProperty("--user-opacity", wrapOpacity);
  }
}

export function initClockVisibility() {
  const stored = localStorage.getItem("clockVisible");
  const isVisible = stored === null || stored === "true";

  const clock = document.getElementById("clockDisplay");
  const toggle = document.getElementById("ckb_clockToggle");

  if (clock) clock.style.display = isVisible ? "block" : "none";
  if (toggle) toggle.checked = isVisible;

  toggle?.addEventListener("change", (e) => {
    const show = e.target.checked;
    localStorage.setItem("clockVisible", show);
    if (clock) clock.style.display = show ? "block" : "none";
  });
}


export function initThemeToggle() {
  const toggle = document.getElementById("ckb_themeToggle");

  toggle?.addEventListener("change", (e) => {
    const theme = e.target.checked ? "dark" : "light";
    localStorage.setItem("themePreference", theme);
    applyTheme(theme);
  });
}

export function restoreOffDays() {
  const saved = JSON.parse(localStorage.getItem("userOffDays") || "[]").map(Number);
  console.log("✅ 저장된 값:", saved);
  const checkboxes = document.querySelectorAll('input[name="offDays"]');

saved.includes(0);
  checkboxes.forEach(cb => {
    const match = saved.includes(parseInt(cb.value));
    cb.checked = match;
    console.log(`🟢 요일 ${cb.value} → checked: ${match}`);
  });
}

export function saveOffDays() {
  const checked = [...document.querySelectorAll('input[name="offDays"]:checked')];
  const values = checked.map(cb => Number(cb.value));
  localStorage.setItem("userOffDays", JSON.stringify(values));
}

export function getUserOffDays() {
  return JSON.parse(localStorage.getItem("userOffDays") || "[]").map(Number);
}

document.getElementById("settingSave")?.addEventListener("click", () => {
  saveOffDays();
  showToast("설정이 저장되었습니다.", "success");
  bootstrap.Modal.getInstance(document.getElementById("etcSetModal"))?.hide();
});
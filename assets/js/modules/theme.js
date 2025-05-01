// Theme module - 단일 함수 모듈

// Theme module

export function initThemeFromSystemOrStorage() {
  const stored = localStorage.getItem("themePreference");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const isStoredValid = stored === "dark" || stored === "light";
  const theme = isStoredValid ? stored : (prefersDark ? "dark" : "light");

  document.documentElement.setAttribute("data-bs-theme", theme);

  const toggle = document.getElementById("ckb_themeToggle");
  if (toggle) {
    toggle.checked = (theme === "dark");
  }
}

export function applyTheme(mode) {
  document.documentElement.setAttribute("data-bs-theme", mode);
}

export function applyThemeFromImageAnalysis(isDark) {
  const userTheme = localStorage.getItem("themePreference");
  if (userTheme === "dark" || userTheme === "light") return;

  const imageTheme = isDark ? "dark" : "light";
  applyTheme(imageTheme);
}

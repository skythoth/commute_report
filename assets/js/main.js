
import { initThemeFromSystemOrStorage } from './modules/theme.js';
import { initClock, initGreetingTyping, startGreetingUpdater } from './modules/clock.js';
import { initFormData, bindNowButtons } from './modules/form.js';
import { initReportHandlers } from './modules/report.js';
import { initBackground } from './modules/background.js';
import { updateWeekendCheckboxState, observeDateChange } from './modules/utils.js';
import { initSettings, initSettingButtonToggle, restoreOffDays } from './modules/settings.js';
import { bindMonthSelect, populateMonthSelect, bindCsvDownload } from './modules/report-log.js';

document.addEventListener("DOMContentLoaded", () => {
  initThemeFromSystemOrStorage();
  initFormData();
  bindNowButtons();
  initClock();
  initGreetingTyping();
  startGreetingUpdater();
  initReportHandlers();
  initBackground();
  initSettings();
  updateWeekendCheckboxState();
  observeDateChange(() => {
    console.log("날짜 변경 감지됨. 설정 갱신");
    initSettings();
    updateWeekendCheckboxState();
  });
  initSettingButtonToggle();
  bindCsvDownload();

  const reportModal = document.getElementById("reportModal");
  if (reportModal) {
    reportModal.addEventListener("show.bs.modal", () => {
      populateMonthSelect();
      bindMonthSelect();
    });
  }
});

document.getElementById("etcSetModal")?.addEventListener("show.bs.modal", () => {
  restoreOffDays();
});
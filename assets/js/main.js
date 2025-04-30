
import { initThemeFromSystemOrStorage } from './modules/theme.js';
import { initClock, initGreetingTyping, startGreetingUpdater } from './modules/clock.js';
import { initFormData, bindNowButtons } from './modules/form.js';
import { initReportHandlers } from './modules/report.js';
import { initBackground } from './modules/background.js';
import { initSettings } from './modules/settings.js';
import { updateWeekendCheckboxState, observeDateChange } from './modules/utils.js';
import { initSettingButtonToggle } from './modules/settings.js';
import { renderAprilReport } from './modules/report-log.js';

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

  const reportModal = document.getElementById("reportModal");

  if (reportModal) {
    reportModal.addEventListener("show.bs.modal", () => {
      renderAprilReport();
    });
  }
});

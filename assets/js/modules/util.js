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
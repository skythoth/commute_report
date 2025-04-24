
// Form module

export function initFormData() {
  console.log("[form.js] initFormData 실행됨");

  const name = localStorage.getItem("commuteName") || "";
  const startTime = localStorage.getItem("commuteStartTime") || "09:00";
  const endTime = localStorage.getItem("commuteEndTime") || "19:00";

  const nameEl = document.getElementById("name");
  const startEl = document.getElementById("startTime");
  const endEl = document.getElementById("endTime");

  if (nameEl) nameEl.value = name;
  if (startEl) startEl.value = startTime;
  if (endEl) endEl.value = endTime;

  document.getElementById("arrivalBtn")?.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("submitReport", { detail: { type: "arrival" } }));
  });
  document.getElementById("departureBtn")?.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("submitReport", { detail: { type: "departure" } }));
  });
}

export function fillCurrentTime(id) {
  const now = new Date();
  const time = `${padZero(now.getHours())}:${padZero(now.getMinutes())}`;
  document.getElementById(id).value = time;

  const eventType = id === "startTime" ? "arrival" : "departure";
  document.dispatchEvent(new CustomEvent("submitReport", { detail: { type: eventType } }));
}

export function validationCheck() {
  const nameEl = document.getElementById("name");
  const startTimeEl = document.getElementById("startTime");
  const endTimeEl = document.getElementById("endTime");

  if (!nameEl?.value) return nameEl?.focus();
  if (!startTimeEl?.value) return startTimeEl?.focus();
  if (!endTimeEl?.value) return endTimeEl?.focus();

  return true;
}

function padZero(num) {
  return num < 10 ? "0" + num : num;
}

export function getToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function dateToString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function shiftDate(date, days) {
  const shifted = new Date(date);
  shifted.setDate(shifted.getDate() + days);
  return shifted;
}

export function getMondayOfWeek(date) {
  const day = new Date(date).getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return shiftDate(date, diff);
}

export function getWeekdayOffset(date) {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

export function formatDateLabel(date) {
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const day = dayNames[date.getDay()];
  return `${y}년 ${m}월 ${d}일 (${day})`;
}

export function getToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function dateToString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function stringToDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// "2026-13-45" 같은 달력상 불가능한 값은 JS Date가 조용히 다른 날짜로 넘겨버리므로,
// 문자열로 되돌려서 원래 입력과 같은지 비교해 유효성을 확인한다.
export function isValidDateString(dateStr: string): boolean {
  return dateToString(stringToDate(dateStr)) === dateStr;
}

export function buildTodosHref(date?: string, filter?: string, search?: string): string {
  const params = new URLSearchParams();
  if (date) params.set("date", date);
  if (filter && filter !== "all") params.set("filter", filter);
  if (search) params.set("search", search);
  const query = params.toString();
  return query ? `/todos?${query}` : "/todos";
}

export function shiftDate(date: Date, days: number): Date {
  const shifted = new Date(date);
  shifted.setDate(shifted.getDate() + days);
  return shifted;
}

export function getMondayOfWeek(date: Date): Date {
  const day = new Date(date).getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return shiftDate(date, diff);
}

export function getWeekdayOffset(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

export function formatDateLabel(date: Date): string {
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const day = dayNames[date.getDay()];
  return `${y}년 ${m}월 ${d}일 (${day})`;
}

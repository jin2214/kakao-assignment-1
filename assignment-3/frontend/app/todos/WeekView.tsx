import Link from "next/link";
import { shiftDate, dateToString, getToday, getWeekdayOffset, buildTodosHref } from "./dateUtils";
import type { Todo } from "@/app/actions";

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

export default function WeekView({
  weekStart,
  currentDate,
  weekTodos,
  filter,
  search,
}: {
  weekStart: Date;
  currentDate: Date;
  weekTodos: Todo[];
  filter?: string;
  search?: string;
}) {
  const todayStr = dateToString(getToday());
  const currentStr = dateToString(currentDate);
  const offset = getWeekdayOffset(currentDate);

  const prevWeekStart = shiftDate(weekStart, -7);
  const nextWeekStart = shiftDate(weekStart, 7);
  const prevHref = buildTodosHref(dateToString(shiftDate(prevWeekStart, offset)), filter, search);
  const nextHref = buildTodosHref(dateToString(shiftDate(nextWeekStart, offset)), filter, search);

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = shiftDate(weekStart, i);
    const dateStr = dateToString(date);
    const count = weekTodos.filter((t) => t.date === dateStr).length;
    return { date, dateStr, count, label: DAY_LABELS[i] };
  });

  return (
    <div className="flex items-center justify-between mb-4">
      <Link
        href={prevHref}
        aria-label="이전 주"
        className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 text-xl"
      >
        ‹
      </Link>
      <div className="flex flex-1 justify-between px-1">
        {days.map(({ date, dateStr, count, label }) => {
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === currentStr;

          return (
            <Link key={dateStr} href={buildTodosHref(dateStr, filter, search)} className="flex flex-col items-center gap-1 w-9">
              <span className="text-xs text-gray-400 font-medium">{label}</span>
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${
                  isSelected
                    ? "bg-gray-900 text-white font-semibold"
                    : isToday
                    ? "border-2 border-gray-900 text-gray-900 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {date.getDate()}
              </span>
              <span className="text-xs text-gray-400">{count > 0 ? count : " "}</span>
            </Link>
          );
        })}
      </div>
      <Link
        href={nextHref}
        aria-label="다음 주"
        className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 text-xl"
      >
        ›
      </Link>
    </div>
  );
}

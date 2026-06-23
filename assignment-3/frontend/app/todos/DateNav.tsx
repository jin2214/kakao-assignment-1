import Link from "next/link";
import { shiftDate, dateToString, getToday, formatDateLabel, buildTodosHref } from "./dateUtils";

export default function DateNav({
  currentDate,
  filter,
  search,
}: {
  currentDate: Date;
  filter?: string;
  search?: string;
}) {
  const prevStr = dateToString(shiftDate(currentDate, -1));
  const nextStr = dateToString(shiftDate(currentDate, 1));
  const isToday = dateToString(currentDate) === dateToString(getToday());

  const homeIcon = (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path d="M1.5 7.5L8 2l6.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 6.5V13.5a.5.5 0 00.5.5H6v-3.5h4V14h2.5a.5.5 0 00.5-.5V6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="flex items-center justify-between px-1 mb-2">
      <Link
        href={buildTodosHref(prevStr, filter, search)}
        aria-label="이전 날짜"
        className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 text-xl"
      >
        ‹
      </Link>
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-gray-900">{formatDateLabel(currentDate)}</span>
        {isToday ? (
          <span className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-900" aria-label="오늘">
            {homeIcon}
          </span>
        ) : (
          <Link
            href={buildTodosHref(dateToString(getToday()), filter, search)}
            aria-label="오늘로"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            {homeIcon}
          </Link>
        )}
      </div>
      <Link
        href={buildTodosHref(nextStr, filter, search)}
        aria-label="다음 날짜"
        className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 text-xl"
      >
        ›
      </Link>
    </div>
  );
}

import { formatDateLabel, getToday, dateToString } from '../utils/dateUtils'

export default function DateNav({ currentDate, onPrev, onNext, onToday }) {
  const isToday = dateToString(currentDate) === dateToString(getToday())

  return (
    <div className="flex items-center justify-between px-1">
      <button
        onClick={onPrev}
        className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors text-xl"
        aria-label="이전 날짜"
      >
        ‹
      </button>
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-gray-900">
          {formatDateLabel(currentDate)}
        </span>
        <button
          onClick={isToday ? undefined : onToday}
          className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
            isToday
              ? 'text-gray-900 cursor-default'
              : 'text-gray-300 hover:bg-gray-100 hover:text-gray-700'
          }`}
          aria-label="오늘로"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path d="M1.5 7.5L8 2l6.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 6.5V13.5a.5.5 0 00.5.5H6v-3.5h4V14h2.5a.5.5 0 00.5-.5V6.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <button
        onClick={onNext}
        className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors text-xl"
        aria-label="다음 날짜"
      >
        ›
      </button>
    </div>
  )
}

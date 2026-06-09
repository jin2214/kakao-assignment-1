import { formatDateLabel, getToday, dateToString } from '../utils/dateUtils'

export default function DateNav({ currentDate, onPrev, onNext }) {
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
        {isToday && (
          <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full font-medium">
            오늘
          </span>
        )}
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

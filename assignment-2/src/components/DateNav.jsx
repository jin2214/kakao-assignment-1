import { formatDateLabel, getToday, dateToString } from '../utils/dateUtils'

export default function DateNav({ currentDate, onPrev, onNext }) {
  const isToday = dateToString(currentDate) === dateToString(getToday())

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onPrev}
        className="p-2 text-gray-500 hover:text-gray-800 transition-colors"
        aria-label="이전 날짜"
      >
        ‹
      </button>
      <div className="flex items-center gap-2">
        <span className="text-base font-medium text-gray-800">
          {formatDateLabel(currentDate)}
        </span>
        {isToday && (
          <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
            오늘
          </span>
        )}
      </div>
      <button
        onClick={onNext}
        className="p-2 text-gray-500 hover:text-gray-800 transition-colors"
        aria-label="다음 날짜"
      >
        ›
      </button>
    </div>
  )
}

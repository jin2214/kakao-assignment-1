import { shiftDate, dateToString, getToday } from '../utils/dateUtils'

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']

export default function WeekView({ weekStart, currentDate, todos, onDayClick, onPrevWeek, onNextWeek }) {
  const todayStr = dateToString(getToday())
  const currentStr = dateToString(currentDate)

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = shiftDate(weekStart, i)
    const dateStr = dateToString(date)
    const count = todos.filter(t => t.date === dateStr).length
    return { date, dateStr, count, label: DAY_LABELS[i] }
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm px-3 py-3">
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevWeek}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors text-lg"
          aria-label="이전 주"
        >
          ‹
        </button>
        <div className="flex flex-1 justify-between px-1">
          {days.map(({ date, dateStr, count, label }) => {
            const isToday = dateStr === todayStr
            const isSelected = dateStr === currentStr

            return (
              <button
                key={dateStr}
                onClick={() => onDayClick(dateStr)}
                className="flex flex-col items-center gap-1 w-9"
              >
                <span className="text-xs text-gray-400 font-medium">{label}</span>
                <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors ${
                  isSelected
                    ? 'bg-gray-900 text-white font-semibold'
                    : isToday
                    ? 'border-2 border-gray-900 text-gray-900 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                  {date.getDate()}
                </span>
                <span className="text-xs text-gray-400">
                  {count > 0 ? count : ' '}
                </span>
              </button>
            )
          })}
        </div>
        <button
          onClick={onNextWeek}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors text-lg"
          aria-label="다음 주"
        >
          ›
        </button>
      </div>
    </div>
  )
}

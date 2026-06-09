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
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <button
          onClick={onPrevWeek}
          className="p-2 text-gray-500 hover:text-gray-800 transition-colors"
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
                <span className="text-xs text-gray-400">{label}</span>
                <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors ${
                  isSelected
                    ? 'bg-blue-500 text-white font-medium'
                    : isToday
                    ? 'border-2 border-blue-400 text-blue-500 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}>
                  {date.getDate()}
                </span>
                <span className="text-xs text-blue-400">
                  {count > 0 ? count : ' '}
                </span>
              </button>
            )
          })}
        </div>
        <button
          onClick={onNextWeek}
          className="p-2 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="다음 주"
        >
          ›
        </button>
      </div>
    </div>
  )
}

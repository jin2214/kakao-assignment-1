export default function Stats({ dayTodos }) {
  const total = dayTodos.length
  const completed = dayTodos.filter(t => t.completed).length

  return (
    <div className="flex items-center gap-3 px-1">
      <span className="text-sm text-gray-400">
        전체 <span className="text-gray-700 font-medium">{total}</span>
      </span>
      <span className="text-gray-200">·</span>
      <span className="text-sm text-gray-400">
        완료 <span className="text-gray-700 font-medium">{completed}</span>
      </span>
    </div>
  )
}

export default function Stats({ dayTodos }) {
  const total = dayTodos.length
  const completed = dayTodos.filter(t => t.completed).length

  return (
    <div className="text-sm text-gray-500">
      전체 {total} / 완료 {completed}
    </div>
  )
}

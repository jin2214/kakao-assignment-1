import TodoItem from './TodoItem'

const EMPTY_MESSAGE = {
  all: '이 날의 할 일이 없어요.',
  active: '진행 중인 할 일이 없어요.',
  completed: '완료된 할 일이 없어요.',
}

export default function TodoList({ todos, currentFilter, onToggle, onDelete, onSaveEdit }) {
  if (todos.length === 0) {
    return (
      <p className="text-center text-sm text-gray-400 py-8">
        {EMPTY_MESSAGE[currentFilter]}
      </p>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onSaveEdit={onSaveEdit}
        />
      ))}
    </ul>
  )
}

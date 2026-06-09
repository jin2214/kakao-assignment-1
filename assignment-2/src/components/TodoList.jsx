import TodoItem from './TodoItem'

export default function TodoList({ todos, onToggle, onDelete, onSaveEdit }) {
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

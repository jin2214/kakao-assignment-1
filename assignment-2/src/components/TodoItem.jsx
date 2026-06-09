import { useState } from 'react'

export default function TodoItem({ todo, onToggle, onDelete, onSaveEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  function handleEditStart() {
    setEditText(todo.text)
    setIsEditing(true)
  }

  function handleSave() {
    const trimmed = editText.trim()
    if (trimmed) {
      onSaveEdit(todo.id, trimmed)
    }
    setIsEditing(false)
  }

  function handleCancel() {
    setEditText(todo.text)
    setIsEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  if (isEditing) {
    return (
      <li className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
        {/* onBlur로 빈 공간 클릭 시 취소 구현.
            취소 버튼 클릭 시 blur+click으로 handleCancel이 2회 호출되는 부작용 있음.
            현재는 무해하나 handleCancel에 side effect 추가 시
            취소 버튼에도 onMouseDown={e => e.preventDefault()} 필요 */}
        <input
          autoFocus
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleCancel}
          className="flex-1 text-sm border-b border-blue-400 outline-none px-1"
        />
        <button
          onMouseDown={e => e.preventDefault()}
          onClick={handleSave}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium"
        >
          저장
        </button>
        <button
          onClick={handleCancel}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          취소
        </button>
      </li>
    )
  }

  return (
    <li className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-colors ${
          todo.completed
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 hover:border-green-400'
        }`}
        aria-label={todo.completed ? '완료 취소' : '완료'}
      />
      <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
        {todo.text}
      </span>
      <button
        onClick={handleEditStart}
        className="text-gray-400 hover:text-blue-500 transition-colors text-sm"
        aria-label="수정"
      >
        ✎
      </button>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-gray-400 hover:text-red-500 transition-colors text-lg leading-none"
        aria-label="삭제"
      >
        ✕
      </button>
    </li>
  )
}

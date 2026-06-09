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
      <li className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-gray-200 shadow-sm">
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
          className="flex-1 text-sm text-gray-900 border-b border-gray-400 outline-none px-1 pb-0.5 bg-transparent"
        />
        <button
          onMouseDown={e => e.preventDefault()}
          onClick={handleSave}
          className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
        >
          저장
        </button>
        <button
          onClick={handleCancel}
          className="text-gray-300 hover:text-gray-500 text-sm transition-colors"
        >
          취소
        </button>
      </li>
    )
  }

  return (
    <li className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-gray-200 shadow-sm">
      <button
        onClick={() => onToggle(todo.id)}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          todo.completed
            ? 'bg-gray-900 border-gray-900'
            : 'border-gray-300 hover:border-gray-500'
        }`}
        aria-label={todo.completed ? '완료 취소' : '완료'}
      >
        {todo.completed && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M1 4l3 3 5-6" />
          </svg>
        )}
      </button>
      <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-gray-300' : 'text-gray-800'}`}>
        {todo.text}
      </span>
      <button
        onClick={handleEditStart}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors text-base"
        aria-label="수정"
      >
        ✎
      </button>
      <button
        onClick={() => onDelete(todo.id)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors text-sm"
        aria-label="삭제"
      >
        ✕
      </button>
    </li>
  )
}

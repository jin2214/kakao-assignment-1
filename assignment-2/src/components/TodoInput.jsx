import { useState } from 'react'

export default function TodoInput({ onAdd }) {
  const [text, setText] = useState('')
  const [error, setError] = useState(false)

  function handleAdd() {
    if (!text.trim()) {
      setError(true)
      return
    }
    onAdd(text.trim())
    setText('')
    setError(false)
  }

  function handleKeyDown(e) {
    if (e.nativeEvent.isComposing) return
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          maxLength={100}
          placeholder="할 일"
          onChange={(e) => {
            setText(e.target.value)
            setError(false)
          }}
          onKeyDown={handleKeyDown}
          className={`flex-1 px-4 py-2.5 text-sm rounded-xl border bg-white outline-none transition-colors placeholder:text-gray-300 text-gray-900
            ${error
              ? 'border-gray-400 focus:border-gray-600'
              : 'border-gray-300 focus:border-gray-500'
            }`}
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2.5 bg-gray-900 hover:bg-gray-700 active:bg-gray-950 text-white text-sm font-medium rounded-xl transition-colors"
        >
          추가
        </button>
      </div>
      {error && <p className="text-xs text-gray-500 pl-1">할 일을 입력해주세요.</p>}
    </div>
  )
}

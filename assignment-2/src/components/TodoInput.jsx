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
    <div>
      <div>
        <input
          type="text"
          value={text}
          maxLength={100}
          placeholder="할 일을 입력하세요..."
          onChange={(e) => {
            setText(e.target.value)
            setError(false)
          }}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleAdd}>추가</button>
      </div>
      {error && <p>할 일을 입력해주세요.</p>}
    </div>
  )
}

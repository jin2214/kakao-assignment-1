import { useState, useEffect, useRef } from 'react'
import { getToday, getMondayOfWeek, dateToString, shiftDate, getWeekdayOffset } from './utils/dateUtils'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import FilterTabs from './components/FilterTabs'
import Stats from './components/Stats'
import DateNav from './components/DateNav'
import WeekView from './components/WeekView'

const CARD_WIDTH = 448

function App() {
  const [todos, setTodos] = useState(
    () => JSON.parse(localStorage.getItem('todos')) || []
  )
  const [currentFilter, setCurrentFilter] = useState('all')
  const [currentDate, setCurrentDate] = useState(getToday)
  const [weekStart, setWeekStart] = useState(() => getMondayOfWeek(getToday()))

  const [cardPos, setCardPos] = useState(() => ({
    x: Math.max(0, (window.innerWidth - CARD_WIDTH) / 2),
    y: 40,
  }))
  const cardPosRef = useRef(cardPos)
  const dragRef = useRef({ isDragging: false, offsetX: 0, offsetY: 0 })

  useEffect(() => {
    function onMouseMove(e) {
      if (!dragRef.current.isDragging) return
      const newPos = {
        x: e.clientX - dragRef.current.offsetX,
        y: e.clientY - dragRef.current.offsetY,
      }
      cardPosRef.current = newPos
      setCardPos({ ...newPos })
    }
    function onMouseUp() {
      dragRef.current.isDragging = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    dragRef.current.onMouseMove = onMouseMove
    dragRef.current.onMouseUp = onMouseUp
  }, [])

  function handleDragStart(e) {
    e.preventDefault()
    dragRef.current.isDragging = true
    dragRef.current.offsetX = e.clientX - cardPosRef.current.x
    dragRef.current.offsetY = e.clientY - cardPosRef.current.y
    document.addEventListener('mousemove', dragRef.current.onMouseMove)
    document.addEventListener('mouseup', dragRef.current.onMouseUp)
  }

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  function handleAdd(text) {
    const newTodo = {
      id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
      text,
      completed: false,
      date: dateToString(currentDate),
    }
    setTodos([...todos, newTodo])
    setCurrentFilter('all')
  }

  function handleToggle(id) {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  function handleDelete(id) {
    setTodos(todos.filter(t => t.id !== id))
  }

  function handleSaveEdit(id, newText) {
    setTodos(todos.map(t => t.id === id ? { ...t, text: newText } : t))
  }

  function handlePrevDate() {
    const prev = shiftDate(currentDate, -1)
    setCurrentDate(prev)
    setCurrentFilter('all')
    if (prev < weekStart || prev > shiftDate(weekStart, 6)) {
      setWeekStart(getMondayOfWeek(prev))
    }
  }

  function handleNextDate() {
    const next = shiftDate(currentDate, 1)
    setCurrentDate(next)
    setCurrentFilter('all')
    if (next < weekStart || next > shiftDate(weekStart, 6)) {
      setWeekStart(getMondayOfWeek(next))
    }
  }

  function handlePrevWeek() {
    const offset = getWeekdayOffset(currentDate)
    const newWeekStart = shiftDate(weekStart, -7)
    setWeekStart(newWeekStart)
    setCurrentDate(shiftDate(newWeekStart, offset))
    setCurrentFilter('all')
  }

  function handleNextWeek() {
    const offset = getWeekdayOffset(currentDate)
    const newWeekStart = shiftDate(weekStart, 7)
    setWeekStart(newWeekStart)
    setCurrentDate(shiftDate(newWeekStart, offset))
    setCurrentFilter('all')
  }

  function handleDayClick(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number)
    setCurrentDate(new Date(y, m - 1, d))
    setCurrentFilter('all')
  }

  function handleFilterChange(filter) {
    setCurrentFilter(filter)
  }

  const dateStr = dateToString(currentDate)
  const dayTodos = todos.filter(t => t.date === dateStr)
  const filteredTodos = dayTodos.filter(t => {
    if (currentFilter === 'active') return !t.completed
    if (currentFilter === 'completed') return t.completed
    return true
  })

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-hidden">

      {/* 🥚 이스터에그: 제목 영역을 드래그해서 카드를 옮기면 뒤에 숨겨진 메시지가 나타납니다 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 select-none pointer-events-none">
        <img src="/lion.png" alt="ryan" className="w-44 object-contain" />
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-700">여기까지 보셨군요 👀</p>
          <p className="text-lg text-gray-400 mt-1">리뷰 잘 부탁드립니다 🙏</p>
        </div>
      </div>

      {/* 드래그 가능한 카드 */}
      <div
        style={{
          position: 'fixed',
          left: cardPos.x,
          top: cardPos.y,
          width: `min(${CARD_WIDTH}px, 90vw)`,
          zIndex: 10,
        }}
      >
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 px-6 py-6 flex flex-col gap-4">
          <h1
            className="text-lg font-bold text-gray-900 tracking-tight cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleDragStart}
          >
            Todo List ⠿
          </h1>
          <DateNav currentDate={currentDate} onPrev={handlePrevDate} onNext={handleNextDate} />
          <WeekView
            weekStart={weekStart}
            currentDate={currentDate}
            todos={todos}
            onDayClick={handleDayClick}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
          />
          <TodoInput onAdd={handleAdd} />
          <Stats dayTodos={dayTodos} />
          <FilterTabs currentFilter={currentFilter} onFilterChange={handleFilterChange} />
          <TodoList
            todos={filteredTodos}
            currentFilter={currentFilter}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onSaveEdit={handleSaveEdit}
          />
        </div>
      </div>
    </div>
  )
}

export default App

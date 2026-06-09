import { useState, useEffect } from 'react'
import { getToday, getMondayOfWeek, dateToString, shiftDate, getWeekdayOffset } from './utils/dateUtils'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import FilterTabs from './components/FilterTabs'

function App() {
  const [todos, setTodos] = useState(
    () => JSON.parse(localStorage.getItem('todos')) || []
  )
  const [currentFilter, setCurrentFilter] = useState('all')
  const [currentDate, setCurrentDate] = useState(getToday)
  const [weekStart, setWeekStart] = useState(() => getMondayOfWeek(getToday()))

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
    <div className="max-w-md mx-auto mt-8 px-4 flex flex-col gap-4">
      <TodoInput onAdd={handleAdd} />
      <FilterTabs currentFilter={currentFilter} onFilterChange={handleFilterChange} />
      <TodoList
        todos={filteredTodos}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onSaveEdit={handleSaveEdit}
      />
    </div>
  )
}

export default App

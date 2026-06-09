const TABS = [
  { label: '전체', value: 'all' },
  { label: '진행 중', value: 'active' },
  { label: '완료', value: 'completed' },
]

export default function FilterTabs({ currentFilter, onFilterChange }) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
      {TABS.map(tab => (
        <button
          key={tab.value}
          onClick={() => onFilterChange(tab.value)}
          className={`flex-1 py-1.5 text-sm rounded-lg transition-colors ${
            currentFilter === tab.value
              ? 'bg-white text-gray-900 font-semibold shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

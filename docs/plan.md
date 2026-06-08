# 2차 과제 구현 계획

## 1차 과제에서 마이그레이션할 기능 목록

| 기능 | 설명 |
|------|------|
| Todo CRUD | 추가 / 인라인 수정 / 완료 토글 / 삭제 |
| 필터링 | 전체 / 진행 중 / 완료 탭 |
| 일간 뷰 | 날짜 이전·다음 이동, 오늘 배지 |
| 주간 뷰 | 7일 달력, 이전·다음 주 이동, 날짜 클릭, Todo 개수 배지 |
| 빈 상태 메시지 | 필터별 안내 문구 |
| 통계 | 선택 날짜 전체·완료 카운트 |
| localStorage | todos 변경마다 자동 저장·로드 |
| IME 처리 | 한글 입력 isComposing 체크 |
| 입력 검증 | 공백 불가, 100자 제한, 에러 메시지 |

---

## 진행 상황

- [ ] Step 0: Vite + Tailwind CSS 프로젝트 세팅
- [ ] Step 1: 파일 구조 생성 + dateUtils.js 이식
- [ ] Step 2: App.jsx 상태 관리 뼈대 작성
- [ ] Step 3: TodoInput 컴포넌트 (추가 + 에러 메시지)
- [ ] Step 4: TodoItem + TodoList 컴포넌트 (Read + Delete + Toggle)
- [ ] Step 5: TodoItem 수정 모드 (인라인 Edit)
- [ ] Step 6: FilterTabs 컴포넌트 (필터링)
- [ ] Step 7: Stats + 빈 상태 메시지
- [ ] Step 8: DateNav 컴포넌트 (일간 뷰)
- [ ] Step 9: useEffect로 localStorage 연동
- [ ] Step 10: WeekView 컴포넌트 (주간 뷰)

---

## Step 0 — Vite + Tailwind CSS 프로젝트 세팅

### 작업 내용
```bash
cd kakaotech.assignment_1
npm create vite@latest assignment-2 -- --template react
cd assignment-2
npm install
npm install tailwindcss @tailwindcss/vite
```

### vite.config.js
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### src/index.css — 기존 내용 전부 삭제 후 교체
```css
@import "tailwindcss";
```

### 완료 확인
`npm run dev` → `localhost:5173` 접속해서 Vite 기본 화면 확인

---

## Step 1 — 파일 구조 생성 + dateUtils.js 이식

### 생성할 파일/폴더
```
assignment-2/src/
├── utils/
│   └── dateUtils.js
└── components/
    ├── WeekView.jsx
    ├── DateNav.jsx
    ├── FilterTabs.jsx
    ├── TodoInput.jsx
    ├── TodoList.jsx
    ├── TodoItem.jsx
    └── Stats.jsx
```

### dateUtils.js — app.js에서 이식할 함수 목록
```js
export function getToday() { ... }
export function dateToString(date) { ... }
export function shiftDate(date, days) { ... }
export function getMondayOfWeek(date) { ... }
export function getWeekdayOffset(date) { ... }
export function formatDateLabel(date) { ... }
```

---

## Step 2 — App.jsx 상태 관리 뼈대

### 상태 설계
| 상태 | 타입 | 설명 |
|------|------|------|
| `todos` | array | 전체 Todo 목록 |
| `currentFilter` | string | `'all'` \| `'active'` \| `'completed'` |
| `currentDate` | Date | 현재 선택된 날짜 |
| `weekStart` | Date | 주간 뷰 시작일 (월요일) |

### App.jsx 핵심 구조
```jsx
const [todos, setTodos] = useState(
  () => JSON.parse(localStorage.getItem('todos')) || []
)
const [currentFilter, setCurrentFilter] = useState('all')
const [currentDate, setCurrentDate] = useState(getToday)
const [weekStart, setWeekStart] = useState(() => getMondayOfWeek(getToday()))

// todos 변경 시 자동 저장
useEffect(() => {
  localStorage.setItem('todos', JSON.stringify(todos))
}, [todos])
```

### App.jsx가 자식에게 내려주는 핸들러
- `handleAdd(text)` — Todo 추가
- `handleToggle(id)` — 완료 토글
- `handleDelete(id)` — 삭제
- `handleSaveEdit(id, newText)` — 수정 저장
- `handlePrevDate / handleNextDate` — 날짜 이동
- `handlePrevWeek / handleNextWeek` — 주 이동
- `handleDayClick(dateStr)` — 주간 날짜 클릭
- `handleFilterChange(filter)` — 필터 탭 변경

---

## Step 3 — TodoInput 컴포넌트

### 기능
- 텍스트 입력창 + 추가 버튼
- 입력값이 비어있으면 에러 메시지 표시
- Enter 키 지원 (isComposing 체크)
- 입력 시 에러 메시지 자동 숨김

### props
```jsx
<TodoInput onAdd={handleAdd} />
```

---

## Step 4 — TodoItem + TodoList 컴포넌트

### TodoList props
```jsx
<TodoList
  todos={filteredTodos}
  onToggle={handleToggle}
  onDelete={handleDelete}
  onSaveEdit={handleSaveEdit}
/>
```

### TodoItem 기능
- 텍스트 표시
- 완료 토글 버튼 (완료 시 취소선 `line-through`)
- 수정 버튼 → Step 5에서 구현
- 삭제 버튼

---

## Step 5 — TodoItem 수정 모드 (인라인 Edit)

### 구현 방식
- `TodoItem` 내부에 `useState(isEditing)` 로컬 상태
- 수정 버튼 클릭 → `isEditing = true` → input 표시
- 저장: 빈 값이면 원상복구, 아니면 `onSaveEdit` 호출
- 취소: `isEditing = false`
- Enter / Escape 키 지원

---

## Step 6 — FilterTabs 컴포넌트

### props
```jsx
<FilterTabs currentFilter={currentFilter} onFilterChange={handleFilterChange} />
```

### 탭 목록
- 전체 (`all`)
- 진행 중 (`active`)
- 완료 (`completed`)
- 선택된 탭 시각적 강조

---

## Step 7 — Stats + 빈 상태 메시지

### Stats props
```jsx
<Stats dayTodos={dayTodos} />
```

### 빈 상태 메시지
- TodoList 내부에서 처리
- 필터별 문구:
  - `all`: "이 날의 할 일이 없어요."
  - `active`: "진행 중인 할 일이 없어요."
  - `completed`: "완료된 할 일이 없어요."

---

## Step 8 — DateNav 컴포넌트 (일간 뷰)

### props
```jsx
<DateNav
  currentDate={currentDate}
  onPrev={handlePrevDate}
  onNext={handleNextDate}
/>
```

### 기능
- `formatDateLabel(currentDate)` 표시
- 이전/다음 날짜 버튼
- 오늘 날짜일 때 "오늘" 배지 표시

---

## Step 9 — useEffect로 localStorage 연동

### 구현
```jsx
// App.jsx에서
useEffect(() => {
  localStorage.setItem('todos', JSON.stringify(todos))
}, [todos])
```

- todos 배열이 바뀔 때마다 자동으로 localStorage에 저장
- 초기 로드는 useState lazy initializer에서 처리

---

## Step 10 — WeekView 컴포넌트 (주간 뷰)

### props
```jsx
<WeekView
  weekStart={weekStart}
  currentDate={currentDate}
  todos={todos}
  onDayClick={handleDayClick}
  onPrevWeek={handlePrevWeek}
  onNextWeek={handleNextWeek}
/>
```

### 기능
- 월~일 7개 날짜 버튼 렌더링
- 각 날짜 아래 Todo 개수 배지
- 오늘 날짜 / 선택 날짜 스타일 구분
- 이전/다음 주 버튼
- 날짜 클릭 시 `currentDate` 변경

---

## Vanilla JS → React 주요 변경점 요약

| Vanilla JS | React |
|------------|-------|
| `let todos = []` 전역 변수 | `useState` |
| `localStorage.setItem` 직접 호출 | `useEffect`로 자동화 |
| `document.getElementById` | props로 데이터 전달 |
| `innerHTML = ...` | JSX 반환 |
| `onclick="..."` 인라인 핸들러 | `onClick={handler}` |
| `renderAll()` 전체 재렌더링 | 상태 변경 시 자동 리렌더 |
| `escapeHtml()` 직접 처리 | React가 자동으로 XSS 방지 |

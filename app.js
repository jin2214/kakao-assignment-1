/* ===== 상태 관리 ===== */

// 전체 Todo 항목을 담는 배열 (각 항목: { id, text, completed, date })
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// 새로고침 후 id 충돌 방지: 기존 항목 중 최대 id + 1로 초기화
let nextId = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;

// 현재 선택된 상태 필터 ('all' | 'active' | 'completed')
let currentFilter = "all";

// 현재 선택된 날짜 (Date 객체, 자정 기준으로 고정)
let currentDate = getToday();

// 주간 뷰에 표시할 주의 시작(월요일) — currentDate가 속한 주로 초기화
// getMondayOfWeek는 함수 선언이라 호이스팅되므로 파일 상단에서 호출 가능
let weekStart = getMondayOfWeek(getToday());

/* ===== DOM 요소 참조 ===== */

const todoInput        = document.getElementById("todoInput");
const addBtn           = document.getElementById("addBtn");
const todoList         = document.getElementById("todoList");
const errorMsg         = document.getElementById("errorMsg");
const emptyState       = document.getElementById("emptyState");
const emptyStateMsg    = document.getElementById("emptyStateMsg");
const totalCount       = document.getElementById("totalCount");
const doneCount        = document.getElementById("doneCount");
const filterTabs       = document.getElementById("filterTabs");
const prevDateBtn      = document.getElementById("prevDateBtn");
const nextDateBtn      = document.getElementById("nextDateBtn");
const currentDateLabel = document.getElementById("currentDateLabel");
const todayBadge       = document.getElementById("todayBadge");
const weekDaysEl       = document.getElementById("weekDays");
const prevWeekBtn      = document.getElementById("prevWeekBtn");
const nextWeekBtn      = document.getElementById("nextWeekBtn");

/* ===== 초기화 ===== */

// 페이지 로드 시 초기 화면 렌더링
renderAll();

/* ===== 이벤트 리스너 ===== */

// 추가 버튼 클릭 시 Todo 생성
addBtn.addEventListener("click", handleAdd);

// 입력창 Enter 키 — isComposing 체크로 한글 IME 이중 등록 버그 방지
todoInput.addEventListener("keydown", (e) => {
  if (e.isComposing) return;
  if (e.key === "Enter") handleAdd();
});

// 입력 중 에러 메시지 숨기기
todoInput.addEventListener("input", () => {
  hideError();
});

// 이전 날짜: currentDate 하루 감소, 주간 뷰 범위 벗어나면 weekStart 동기화
prevDateBtn.addEventListener("click", () => {
  currentDate = shiftDate(currentDate, -1);
  syncWeekToDate();
  currentFilter = "all";
  renderAll();
});

// 다음 날짜: currentDate 하루 증가, 주간 뷰 범위 벗어나면 weekStart 동기화
nextDateBtn.addEventListener("click", () => {
  currentDate = shiftDate(currentDate, +1);
  syncWeekToDate();
  currentFilter = "all";
  renderAll();
});

// 이전 주: weekStart 7일 감소, currentDate도 같은 요일 위치로 이동
prevWeekBtn.addEventListener("click", () => {
  const offset = getWeekdayOffset(currentDate); // 현재 요일의 주 내 위치 (월=0 ~ 일=6)
  weekStart    = shiftDate(weekStart, -7);
  currentDate  = shiftDate(weekStart, offset);
  currentFilter = "all";
  renderAll();
});

// 다음 주: weekStart 7일 증가, currentDate도 같은 요일 위치로 이동
nextWeekBtn.addEventListener("click", () => {
  const offset = getWeekdayOffset(currentDate);
  weekStart    = shiftDate(weekStart, +7);
  currentDate  = shiftDate(weekStart, offset);
  currentFilter = "all";
  renderAll();
});

// 주간 날짜 클릭 — 이벤트 위임으로 처리
weekDaysEl.addEventListener("click", (e) => {
  const dayBtn = e.target.closest(".week-day");
  if (!dayBtn) return;

  // data-date("YYYY-MM-DD")를 파싱해 Date 객체 생성 (월은 0-indexed이므로 -1)
  const [y, m, d] = dayBtn.dataset.date.split("-").map(Number);
  currentDate   = new Date(y, m - 1, d);
  currentFilter = "all";
  renderAll();
});

// 필터 탭 클릭 — 이벤트 위임
filterTabs.addEventListener("click", (e) => {
  const clickedTab = e.target.closest(".filter-tab");
  if (!clickedTab) return;

  currentFilter = clickedTab.dataset.filter;
  renderAll();
});

/* ===== Todo 추가 ===== */

function handleAdd() {
  const text = todoInput.value.trim();

  // 입력값이 비어있으면 안내 메시지 표시 후 종료
  if (!text) {
    showError();
    return;
  }

  // 현재 선택된 날짜를 "YYYY-MM-DD" 문자열로 함께 저장
  const newTodo = { id: nextId++, text, completed: false, date: dateToString(currentDate) };
  todos.push(newTodo);

  todoInput.value = "";
  hideError();
  currentFilter   = "all";
  renderAll();
}

/* ===== Todo 완료 토글 ===== */

function toggleComplete(id) {
  const todo = findTodoById(id);
  if (!todo) return;

  todo.completed = !todo.completed;
  renderAll();
}

/* ===== Todo 삭제 ===== */

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  renderAll();
}

/* ===== Todo 수정 (인라인 편집 모드 진입) ===== */

function startEdit(id) {
  const todo = findTodoById(id);
  if (!todo) return;

  const listItem = document.querySelector(`[data-id="${id}"]`);
  if (!listItem) return;

  // 텍스트를 인라인 입력창으로 교체
  const textEl    = listItem.querySelector(".todo-text");
  const editInput = document.createElement("input");
  editInput.type      = "text";
  editInput.className = "edit-input";
  editInput.value     = todo.text;
  editInput.maxLength = 100;

  textEl.replaceWith(editInput);
  editInput.focus();

  // 버튼을 저장 / 취소로 교체
  const actionBtns = listItem.querySelector(".action-btns");
  actionBtns.innerHTML = `
    <button class="btn btn-save" onclick="saveEdit(${id})">저장</button>
    <button class="btn btn-edit" onclick="renderAll()">취소</button>
  `;

  // 수정 입력창에도 isComposing 체크 — 한글 수정 시 이중 저장 방지
  editInput.addEventListener("keydown", (e) => {
    if (e.isComposing) return;
    if (e.key === "Enter") saveEdit(id);
    if (e.key === "Escape") renderAll();
  });
}

/* ===== Todo 수정 저장 ===== */

function saveEdit(id) {
  const listItem = document.querySelector(`[data-id="${id}"]`);
  if (!listItem) return;

  const editInput = listItem.querySelector(".edit-input");
  if (!editInput) return;

  const newText = editInput.value.trim();

  // 빈 값이면 저장하지 않고 원래 텍스트로 복구
  if (!newText) {
    renderAll();
    return;
  }

  const todo = findTodoById(id);
  if (todo) todo.text = newText;

  renderAll();
}

/* ===== 화면 전체 렌더링 ===== */

function renderAll() {
  // todos가 변경될 때마다 localStorage에 저장
  localStorage.setItem("todos", JSON.stringify(todos));
  renderWeekView();
  renderDateNav();
  renderFilterTabs();
  renderTodoList();
  renderStats();
  renderEmptyState();
}

/* ===== 주간 뷰 렌더링 ===== */

function renderWeekView() {
  weekDaysEl.innerHTML = "";

  const todayStr    = dateToString(getToday());
  const selectedStr = dateToString(currentDate);
  const dayNames    = ["월", "화", "수", "목", "금", "토", "일"];

  for (let i = 0; i < 7; i++) {
    const day    = shiftDate(weekStart, i);
    const dayStr = dateToString(day);

    // 해당 날짜의 전체 Todo 개수 (필터 무관)
    const count = todos.filter((t) => t.date === dayStr).length;

    const isToday    = dayStr === todayStr;
    const isSelected = dayStr === selectedStr;

    const btn = document.createElement("button");
    btn.className  = ["week-day", isToday ? "today" : "", isSelected ? "selected" : ""]
      .filter(Boolean)
      .join(" ");
    btn.dataset.date = dayStr;
    btn.innerHTML = `
      <span class="week-day-name">${dayNames[i]}</span>
      <span class="week-day-circle">${day.getDate()}</span>
      <span class="week-day-count">${count > 0 ? count : ""}</span>
    `;

    weekDaysEl.appendChild(btn);
  }
}

/* ===== 일간 날짜 네비게이션 렌더링 ===== */

function renderDateNav() {
  currentDateLabel.textContent = formatDateLabel(currentDate);

  // 오늘 날짜일 때만 "오늘" 배지 표시
  const isToday = dateToString(currentDate) === dateToString(getToday());
  todayBadge.classList.toggle("hidden", !isToday);
}

/* ===== 필터 탭 렌더링 ===== */

function renderFilterTabs() {
  const tabs = filterTabs.querySelectorAll(".filter-tab");
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.filter === currentFilter);
  });
}

/* ===== Todo 목록 렌더링 ===== */

function renderTodoList() {
  todoList.innerHTML = "";

  getFilteredTodos().forEach((todo) => {
    const li = document.createElement("li");
    li.className  = `todo-item${todo.completed ? " completed" : ""}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <div class="action-btns">
        <button class="btn btn-complete" onclick="toggleComplete(${todo.id})">
          ${todo.completed ? "취소" : "완료"}
        </button>
        <button class="btn btn-edit" onclick="startEdit(${todo.id})">수정</button>
        <button class="btn btn-delete" onclick="deleteTodo(${todo.id})">삭제</button>
      </div>
    `;

    todoList.appendChild(li);
  });
}

/* ===== 통계 렌더링 (선택된 날짜 기준) ===== */

function renderStats() {
  const dayTodos = getDayTodos();
  const total    = dayTodos.length;
  const done     = dayTodos.filter((t) => t.completed).length;

  totalCount.innerHTML = `전체 <strong>${total}</strong>`;
  doneCount.innerHTML  = `완료 <strong>${done}</strong>`;
}

/* ===== 빈 상태 메시지 렌더링 ===== */

function renderEmptyState() {
  const isEmpty = getFilteredTodos().length === 0;
  emptyState.classList.toggle("hidden", !isEmpty);

  if (isEmpty) {
    const messages = {
      all:       "이 날의 할 일이 없어요.",
      active:    "진행 중인 할 일이 없어요.",
      completed: "완료된 할 일이 없어요.",
    };
    emptyStateMsg.textContent = messages[currentFilter];
  }
}

/* ===== 에러 메시지 ===== */

function showError() {
  errorMsg.classList.remove("hidden");
  todoInput.focus();
}

function hideError() {
  errorMsg.classList.add("hidden");
}

/* ===== 유틸리티 ===== */

// 선택된 날짜의 Todo만 반환 (상태 필터 미적용)
function getDayTodos() {
  const dateStr = dateToString(currentDate);
  return todos.filter((t) => t.date === dateStr);
}

// 날짜 필터 + 상태 필터를 모두 적용한 Todo 반환
function getFilteredTodos() {
  const dayTodos = getDayTodos();
  if (currentFilter === "active")    return dayTodos.filter((t) => !t.completed);
  if (currentFilter === "completed") return dayTodos.filter((t) => t.completed);
  return dayTodos;
}

// id로 Todo 항목 찾기
function findTodoById(id) {
  return todos.find((t) => t.id === id) || null;
}

// currentDate가 weekStart~weekEnd 범위를 벗어나면 weekStart를 재계산
function syncWeekToDate() {
  const weekEnd = shiftDate(weekStart, 6);
  if (currentDate < weekStart || currentDate > weekEnd) {
    weekStart = getMondayOfWeek(currentDate);
  }
}

// 주 내 요일 오프셋 반환 (월=0, 화=1, ..., 일=6)
// — 주간 이동 시 currentDate를 같은 요일로 이동할 때 사용
function getWeekdayOffset(date) {
  const day = date.getDay(); // JS: 일=0, 월=1, ..., 토=6
  return day === 0 ? 6 : day - 1;
}

// 주어진 날짜가 속한 주의 월요일을 반환
function getMondayOfWeek(date) {
  const day  = new Date(date).getDay(); // 일=0, 월=1, ..., 토=6
  const diff = day === 0 ? -6 : 1 - day; // 일요일이면 -6, 그 외엔 월요일까지의 거리
  return shiftDate(date, diff);
}

// 오늘 날짜를 자정(00:00:00) 기준 Date 객체로 반환 — 시간 차이로 인한 날짜 오차 방지
function getToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// Date 객체를 "YYYY-MM-DD" 문자열로 변환
function dateToString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// n일만큼 이동한 새 Date 객체 반환
function shiftDate(date, days) {
  const shifted = new Date(date);
  shifted.setDate(shifted.getDate() + days);
  return shifted;
}

// "YYYY년 M월 D일 (요일)" 형식의 한국어 날짜 문자열 반환
function formatDateLabel(date) {
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const y   = date.getFullYear();
  const m   = date.getMonth() + 1;
  const d   = date.getDate();
  const day = dayNames[date.getDay()];
  return `${y}년 ${m}월 ${d}일 (${day})`;
}

// XSS 방지: HTML 특수문자 이스케이프
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

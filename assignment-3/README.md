# 3차 과제 - Todo 앱 (Next.js + FastAPI)

2차 과제(React + Vite)의 Todo 앱을 Next.js(App Router) 프론트엔드와 FastAPI 백엔드로 마이그레이션한 프로젝트입니다.

## 기술 스택

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Axios

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- Uvicorn

## 프로젝트 구조

```
assignment-3/
├── backend/
│   ├── main.py             # FastAPI 앱, Todo CRUD API, DB 모델
│   ├── requirements.txt    # Python 패키지 목록
│   └── todos.db             # SQLite DB 파일
└── frontend/
    ├── app/
    │   ├── page.tsx                 # 루트 페이지
    │   ├── layout.tsx
    │   ├── globals.css
    │   ├── actions.ts               # Server Actions (Todo 생성/수정/삭제)
    │   ├── api/
    │   │   └── todos/
    │   │       └── route.ts        # 백엔드 API 호출용 라우트 핸들러
    │   └── todos/
    │       ├── page.tsx             # Todo 목록 페이지 (Server Component)
    │       ├── loading.tsx
    │       ├── error.tsx
    │       ├── DateNav.tsx          # 날짜 이동 네비게이션
    │       ├── WeekView.tsx         # 주간 보기
    │       ├── Stats.tsx            # 완료/전체 통계
    │       ├── FilterTabs.tsx       # 상태 필터 (전체/진행중/완료)
    │       ├── SearchBox.tsx        # 검색 (디바운스)
    │       ├── TodoItem.tsx         # Todo 항목 (Client Component)
    │       ├── dateUtils.ts         # 날짜 관련 유틸 함수
    │       ├── new/                 # 할 일 추가 페이지
    │       │   ├── page.tsx
    │       │   └── NewTodoForm.tsx
    │       └── [todoId]/            # 할 일 수정 페이지
    │           ├── page.tsx
    │           └── EditTodoForm.tsx
    ├── package.json
    └── tsconfig.json
```

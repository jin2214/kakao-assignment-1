# 3차 과제 구현 계획 — Todo 앱 Next.js + FastAPI 마이그레이션

## 개요

2차 과제(`week-03-박찬진` 브랜치, `assignment-2/`)에서 React + Vite + localStorage로 만든 Todo 앱을, Next.js(App Router) 프론트엔드 + FastAPI 백엔드 구조로 다시 만드는 과제입니다.

- **범위**: 날짜별 일간/주간 뷰(DateNav, WeekView, Stats)는 제외하고, 과제 안내문의 디렉토리 구조와 동일하게 날짜 구분 없는 단순 Todo 목록만 구현합니다.
- **위치**: 이 저장소(`kakaotech.assignment_1`)는 브랜치 하나 = 과제 하나 구조입니다. 지금 브랜치(`week-04-박찬진`)의 루트에 `assignment-3/frontend`, `assignment-3/backend`를 만듭니다.

## 작업 방식 (중요)

1. **검증 우선**: 모든 단계는 실제로 실행해서 확인한 뒤에만 완료로 표시합니다. 백엔드는 `/docs`(Swagger UI) 또는 `curl`로, 프론트엔드는 브라우저 + Network 탭으로 직접 확인합니다.
2. **난이도별 역할 분담**: "힌트만 주고 알아내게" 하지 않습니다.
   - 🤖 새 개념이 처음 나오는 단계 → AI가 파일에 직접 작성하고, 각 부분을 자세히 설명
   - ✍️ 이미 나온 패턴을 반복하는 단계 → AI가 완성 코드를 채팅에 먼저 보여주고 설명한 뒤, **사용자가 직접 파일에 타이핑**. AI는 파일을 대신 쓰지 않고 결과만 같이 검증
   - 두 경우 모두 정답 코드는 항상 먼저 보여주고 설명합니다. 차이는 "누가 타이핑하는가"입니다.
3. **"단위테스트"의 의미**: 이 스택에는 Jest/pytest 같은 테스트 프레임워크가 없으므로, 아래 "테스트 체크리스트"는 Swagger UI/curl/브라우저 DevTools를 이용한 **기능 단위 수동 검증**을 뜻합니다.
4. **Step 단위로 끊어서 진행 (중요)**: 한 Step이 끝나면 거기서 멈추고 검증 결과를 보고한 뒤, **사용자의 허락을 받은 뒤에만** 다음 Step을 시작합니다. 여러 Step을 연달아 혼자 진행하지 않습니다. (2026-06-22: Step 3 완료 후 보고 없이 Step 4를 바로 시작하려다 사용자가 중단시킴 — 이후 모든 Step에 적용)

## 버전 확인 (2026-06-22)

`create-next-app` 실행 결과 실제 설치된 버전은 **Next.js 16.2.9 / React 19.2.4**였습니다. 이 버전의 `AGENTS.md`에 "이건 네가 아는 Next.js가 아니다, 코드 작성 전에 `node_modules/next/dist/docs/`를 확인하라"는 경고가 있어, 아래 항목들을 실제 번들 문서로 직접 대조 확인했습니다 (추측 금지 원칙 적용):

- `params`/`searchParams`가 `Promise`이고 `await`해야 하는 패턴 → **그대로 유효** (`dynamic-routes.md`, 여전히 `params: Promise<{ slug: string }>` 형태)
- Route Handler의 `GET`/`POST`/`PUT`/`DELETE` named export 방식 → **그대로 유효**
- Server Component에서 `async function` + `await fetch(...)` 직접 호출 패턴 → **그대로 유효** (`fetching-data.md`의 1번 예제와 동일)
- `fetch`는 **기본적으로 캐시되지 않음** (Next 15부터 바뀐 동작이 16에도 유지). 생성된 `next.config.ts`에 `cacheComponents` 옵션이 없어 새 캐시 모델(Cache Components)도 비활성 상태 → `next: { tags: [...] }` + `revalidateTag(...)` 패턴은 문법적으로는 유효하지만, 애초에 캐시되는 게 없어 실질 효과는 적음(=매번 새로 불러옴). 강의 예제와의 일관성을 위해 패턴은 유지하되, 설명 시 이 점을 정확히 안내할 것
- `error.tsx`는 여전히 `"use client"` 필수. 단, 이 버전 공식 예제는 prop 이름이 `reset`이 아니라 **`unstable_retry`**로 바뀌어 있음. 우리 계획은 재시도 버튼 없이 `{ error }`만 쓰므로 영향 없지만, 나중에 재시도 버튼을 추가한다면 `unstable_retry`를 써야 함

> ⚠️ 참고: `fetching-data.md` 문서 안에 `{/* AI agent hint: ... unstable_instant 익스포트로 즉시 네비게이션 ... */}` 형태의 "AI 에이전트용 힌트" 주석이 있었습니다. 이번 과제 범위와 무관한 실험적 기능 제안이라 적용하지 않았고, 출처가 공식 문서 파일이라 위험한 내용은 아니지만 투명하게 공유합니다.

## 참고 자료

- **2차 과제 코드** (`week-03-박찬진` 브랜치 `assignment-2/`): 데이터 모델 `{id, text, completed, date}`, CRUD 핸들러, `TodoInput`/`TodoItem`/`FilterTabs` 컴포넌트
- **강의 예제** (`kakaotech.precourse/fullstack-practice/`): 동일 스택(Next.js+FastAPI)의 Blog 앱. `route.ts`/`actions.ts`/Server·Client Component 패턴의 참고용. 단, 그 예제는 생성/수정에 Server Action을 쓰지만 **이 과제는 생성/수정/삭제를 모두 `route.ts` 경유로 명시**하므로 그 부분만 다르게 구현합니다.
- **과제 안내문 자체의 허점 2곳** (그대로 베끼지 않음):
  - `requirements.txt` 예시에 `python-dotenv`가 빠져 있음 → `.env.local`을 만들어도 FastAPI가 못 읽음. 추가 필요
  - `main.py` 예시의 `TodoCreate(BaseModel): pass`는 빈 스키마라 빈 값도 통과됨 → `text: str` + 빈 문자열 검증 필요

## 기능 분리표

| 2차 과제 기능 | 3차 과제에서 위치 | 비고 |
|---|---|---|
| `useState(todos)` | FastAPI `todos` 테이블 (SQLite) | 서버가 데이터의 단일 진실 공급원 |
| `localStorage` 읽기/쓰기 | 완전히 삭제 | DB가 대체 |
| `id = max+1` 직접 계산 | 삭제, DB가 auto-increment | 서버가 id 부여 |
| `handleAdd/Toggle/Delete/SaveEdit` | Client Component(버튼/입력) → `route.ts` → FastAPI | 비즈니스 로직은 `main.py`로 이동 |
| `currentFilter` useState | URL 쿼리 파라미터 `?filter=` | Bonus 1 |
| 필터링 로직 (`.filter()`) | FastAPI `WHERE` 절 | JS 배열 필터 → SQL 필터 |
| `TodoInput` 검증(빈값/100자/IME) | Client Component로 거의 그대로 이식 | UI 로직 유지 |
| `TodoItem` 인라인 수정 | 별도 수정 페이지(`[todoId]/page.tsx`)로 대체 | 과제 구조상 페이지 이동 방식 |
| `FilterTabs` | `<Link>` 기반으로 재구현, `"use client"` 불필요 | Bonus 1 핵심 |
| `date`/`DateNav`/`WeekView`/`Stats` | **제외** | 범위 축소 |

## 책임 분리 표 (헷갈리기 쉬운 부분)

| 동작 | 누가 호출 | 경로 |
|---|---|---|
| 목록 조회 | Server Component → `actions.ts`의 `getTodos()` | FastAPI 직접 호출, route.ts 없음 |
| 단일 조회 (수정 페이지) | Server Component → `actions.ts`의 `getTodoById()` | FastAPI 직접 호출, route.ts 없음 |
| 생성 | Client Component → `axios.post("/api/todos")` | `app/api/todos/route.ts`가 프록시 |
| 토글/삭제 | Client Component → `axios.put/delete("/api/todos/{id}")` | `app/api/todos/[todoId]/route.ts`가 프록시 |
| 수정 저장 | Client Component → 위와 동일한 `[todoId]/route.ts` 재사용 | 새 route 불필요 |
| 필터 탭 클릭 | URL 이동 (`<Link href="?filter=...">`) | fetch 없음, page.tsx가 새 searchParams로 재실행 |
| 검색창 입력 | Client Component가 `router.push()`로 URL만 변경 (디바운스) | 실제 fetch는 Server Component가 처리 |

## 진행 상황 (Step ↔ 과제 안내문 번호 매핑)

| Step | 내용 | 과제 안내문 번호 | 상태 |
|---|---|---|---|
| 0 | 디렉토리 구조 잡기 + 기능 분리표 | 0. 전체 구조 잡기 | ✅ |
| 1 | Next.js 프로젝트 생성 | 1. 프론트엔드 세팅 | ✅ |
| 2 | FastAPI 프로젝트 생성 | 2. 백엔드 세팅 | ✅ |
| 3 | Todo DB 모델 + Pydantic 스키마 | 3. FastAPI CRUD API (모델/스키마 부분) | ✅ |
| 4 | CRUD 엔드포인트 + CORS | 3. FastAPI CRUD API (엔드포인트 부분, 여기까지 끝나야 3번 완료) | ✅ |
| 5 | Todo 목록 페이지 (Server Component) + actions.ts | 4. Next.js 페이지 + 5. API Route 연동 (목록 조회 부분) | ⬜ |
| 6 | Todo 생성 (Client Component + route.ts POST) | 4 + 5 (생성 부분) | ⬜ |
| 7 | 완료 토글 + 삭제 (TodoItem) | 4 + 5 (수정/삭제 부분) | ⬜ |
| 8 | 수정 페이지 ([todoId]/page.tsx) | 4 + 5 (수정 페이지 부분) | ⬜ |
| 9 | loading.tsx / error.tsx | 4. Next.js 페이지 (로딩/에러 화면) | ⬜ |
| 10 | 환경변수 분리 | 6. 환경변수 설정 | ⬜ |
| 11 | [도전1] 상태 필터링 | 도전과제 1 | ⬜ |
| 12 | [도전2] 검색 + 디바운스 | 도전과제 2 | ⬜ |

**현재 위치**: 기본 과제 0~6번 중 "3. FastAPI로 Todo CRUD API 구현하기"까지 완료. 다음은 "4. Next.js에서 Todo 페이지 구현하기".

---

## Step 0 — 디렉토리 구조 + 기능 분리표 (🤖)

### 작업 내용
```bash
cd kakaotech.assignment_1
mkdir -p assignment-3/frontend assignment-3/backend
```
위 "기능 분리표"/"책임 분리 표"를 문서로 기록 (이미 이 파일에 포함됨).

### 구현 체크리스트
- [ ] `assignment-3/frontend/` 폴더 생성
- [ ] `assignment-3/backend/` 폴더 생성

### 코드 설명 체크리스트
- [ ] 이 단계는 코드가 없습니다 — "어떤 기능을 어디에 둘지" 미리 정리하는 설계 단계입니다.

### 테스트 체크리스트
- [ ] `ls assignment-3` 실행 시 `frontend`, `backend` 두 폴더가 보이는지 확인

---

## Step 1 — Next.js 프로젝트 생성 (✍️ 터미널 직접 실행)

### 작업 내용
```bash
cd kakaotech.assignment_1/assignment-3
npx create-next-app@latest frontend
```
옵션 선택: TypeScript `Yes` / ESLint `Yes` / Tailwind CSS `Yes` / `src/` 디렉토리 `No` / App Router `Yes` / Turbopack `No` / import alias `No`

생성 후 `app/page.tsx`를 아래로 교체 (🤖 AI가 작성):
```tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-md mx-auto px-4 py-10 text-center">
      <h1 className="text-xl font-bold text-gray-900 mb-4">Todo App</h1>
      <Link href="/todos" className="text-gray-700 underline">
        할 일 목록으로 이동
      </Link>
    </main>
  );
}
```

### 구현 체크리스트
- [ ] `create-next-app`으로 `frontend` 프로젝트 생성, 옵션 7개 모두 선택
- [ ] `app/page.tsx`를 위 내용으로 교체

### 코드 설명 체크리스트
- [ ] App Router: `app/` 안의 폴더 구조 = URL 경로 (`app/todos/` → `/todos`)
- [ ] `<Link href="/todos">`: `<a>` 태그 대신 쓰는 Next.js 전용 링크 컴포넌트, 페이지 전체 새로고침 없이 이동
- [ ] 이 파일은 맨 위에 `"use client"`가 없음 → Server Component (기본값)

### 테스트 체크리스트
- [ ] `npm run dev` 실행 후 `http://localhost:3000` 접속 → "Todo App" 문구와 링크가 보임
- [ ] 링크 클릭 → `/todos`로 이동(아직 페이지 없어서 404, 정상)
- [ ] 터미널/디렉토리에 `pages/` 폴더가 없고 `app/` 폴더만 있는지 확인 (App Router 구조)

---

## Step 2 — FastAPI 프로젝트 생성 (✍️ 실행 + 🤖 코드 설명)

### 작업 내용
```bash
cd kakaotech.assignment_1/assignment-3
mkdir backend && cd backend
python3 -m venv .venv
source .venv/bin/activate
```
`requirements.txt` (과제 안내문 예시 + `python-dotenv` 추가):
```
fastapi>=0.111.0
uvicorn[standard]>=0.29.0
sqlalchemy>=2.0.0
pydantic>=2.0.0
python-dotenv>=1.0.0
```
```bash
pip install -r requirements.txt
```
`main.py` (🤖 AI가 작성):
```python
from fastapi import FastAPI

app = FastAPI(title="Todo API")

@app.get("/")
def read_root():
    return {"message": "Todo API가 실행 중입니다"}
```

### 구현 체크리스트
- [ ] 가상환경 생성 + 활성화
- [ ] `requirements.txt` 작성 (python-dotenv 포함) + 설치
- [ ] `main.py`에 Hello World 엔드포인트 작성

### 코드 설명 체크리스트
- [ ] FastAPI는 `localhost:8000`에서 돌아가는 별도의 파이썬 서버 — Next.js(`:3000`)와는 완전히 다른 프로세스
- [ ] `FastAPI(title=...)`: 앱 인스턴스 생성, `/docs`에 표시될 제목
- [ ] `@app.get("/")`: "GET / 요청이 오면 이 함수를 실행해라"라는 데코레이터(라우팅 등록)
- [ ] 함수가 반환한 딕셔너리는 자동으로 JSON으로 변환되어 응답됨

### 테스트 체크리스트
- [ ] `uvicorn main:app --reload` 실행 시 에러 없이 기동
- [ ] `http://localhost:8000` 접속 → `{"message": "Todo API가 실행 중입니다"}` 표시
- [ ] `http://localhost:8000/docs` 접속 → Swagger UI에 `GET /` 엔드포인트가 보임
- [ ] 터미널에 `(.venv)` 표시 확인

---

## Step 3 — Todo DB 모델 + Pydantic 스키마 (🤖)

### 작업 내용
`main.py`에 추가 (SQLAlchemy 2.0 스타일):
```python
from fastapi import FastAPI
from sqlalchemy import create_engine, Integer, String, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker
from pydantic import BaseModel, field_validator
from datetime import datetime, timezone
from typing import Optional

DATABASE_URL = "sqlite:///./todos.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


class Todo(Base):
    __tablename__ = "todos"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    text: Mapped[str] = mapped_column(String(100), nullable=False)
    completed: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )


Base.metadata.create_all(bind=engine)


class TodoCreate(BaseModel):
    text: str

    @field_validator("text")
    @classmethod
    def text_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("할 일을 입력해주세요.")
        if len(v.strip()) > 100:
            raise ValueError("할 일은 100자 이내로 입력해주세요.")
        return v.strip()


class TodoUpdate(BaseModel):
    text: Optional[str] = None
    completed: Optional[bool] = None


class TodoResponse(BaseModel):
    id: int
    text: str
    completed: bool
    created_at: datetime
    model_config = {"from_attributes": True}


app = FastAPI(title="Todo API")

@app.get("/")
def read_root():
    return {"message": "Todo API가 실행 중입니다"}
```
> ⚠️ 과제 안내문 예시의 `class TodoCreate(BaseModel): pass`는 빈 스키마라 빈 값도 통과됩니다. 위처럼 `text: str` 필드와 검증 로직을 직접 채워야 합니다.

### 구현 체크리스트
- [ ] `engine`/`SessionLocal`/`Base` (DB 연결 준비)
- [ ] `Todo` SQLAlchemy 모델 (`id, text, completed, created_at`)
- [ ] `Base.metadata.create_all(bind=engine)`로 테이블 생성
- [ ] `TodoCreate`(빈값/100자 검증) / `TodoUpdate`(부분 수정용, 모든 필드 Optional) / `TodoResponse`(응답용) 스키마

### 코드 설명 체크리스트
- [ ] `Todo` 클래스(SQLAlchemy)와 `TodoCreate`/`TodoResponse`(Pydantic)는 비슷해 보이지만 역할이 다름: 전자는 **DB 테이블 구조**, 후자는 **API로 들어오고 나가는 JSON의 모양**
- [ ] `Mapped[int]`/`mapped_column(...)`: "이 컬럼은 정수형이고 기본키"라는 SQLAlchemy 2.0 문법
- [ ] `Base.metadata.create_all(bind=engine)`: 코드에 정의된 모델대로 실제 DB에 테이블이 없으면 만들어줌
- [ ] `field_validator("text")`: `text` 필드가 들어올 때마다 이 함수를 거쳐 검증/가공함 (빈 문자열이면 에러를 발생시켜 요청을 거부)
- [ ] `TodoUpdate`의 필드가 모두 `Optional`인 이유: 수정 시 텍스트만 바꿀 수도, 완료 상태만 바꿀 수도 있어야 하므로
- [ ] `model_config = {"from_attributes": True}`: SQLAlchemy 객체(`Todo`)를 Pydantic이 직접 읽어서 `TodoResponse`로 변환할 수 있게 허용

### 테스트 체크리스트
- [ ] `uvicorn main:app --reload` 재기동 시 에러 없음
- [ ] `assignment-3/backend/todos.db` 파일이 새로 생성됨
- [ ] `/docs`에는 여전히 `GET /`만 보임 (스키마는 아직 엔드포인트에 연결 안 됨 — 정상)

---

## Step 4 — CRUD 엔드포인트 + CORS (🤖 GET·POST, ✍️ PUT·DELETE 직접 타이핑)

### 작업 내용
`main.py`에 추가:
```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session
# (Step 3의 내용은 위에 그대로 유지)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/todos", response_model=list[TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    return db.execute(select(Todo)).scalars().all()


@app.get("/todos/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.execute(select(Todo).where(Todo.id == todo_id)).scalar_one_or_none()
    if not todo:
        raise HTTPException(status_code=404, detail="할 일을 찾을 수 없습니다")
    return todo


@app.post("/todos", response_model=TodoResponse, status_code=201)
def create_todo(data: TodoCreate, db: Session = Depends(get_db)):
    try:
        todo = Todo(text=data.text, completed=False)
        db.add(todo)
        db.commit()
        db.refresh(todo)
        return todo
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"할 일 생성 실패: {str(e)}")
```
> ℹ️ `GET /todos/{todo_id}`는 과제 안내문의 필수 목록(GET/POST/PUT/DELETE)에는 없지만, Step 8의 수정 페이지가 "수정할 항목 하나"를 미리 불러와야 하므로 추가합니다.

이제 아래 두 엔드포인트는 **AI가 코드를 먼저 보여주고 설명**한 뒤, 사용자가 직접 타이핑합니다 (GET/POST와 같은 패턴):
```python
@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, data: TodoUpdate, db: Session = Depends(get_db)):
    todo = db.execute(select(Todo).where(Todo.id == todo_id)).scalar_one_or_none()
    if not todo:
        raise HTTPException(status_code=404, detail="할 일을 찾을 수 없습니다")
    try:
        if data.text is not None:
            todo.text = data.text
        if data.completed is not None:
            todo.completed = data.completed
        db.commit()
        db.refresh(todo)
        return todo
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"할 일 수정 실패: {str(e)}")


@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.execute(select(Todo).where(Todo.id == todo_id)).scalar_one_or_none()
    if not todo:
        raise HTTPException(status_code=404, detail="할 일을 찾을 수 없습니다")
    try:
        db.delete(todo)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"할 일 삭제 실패: {str(e)}")
```

### 구현 체크리스트
- [ ] CORS 미들웨어 등록 (`allow_origins=["http://localhost:3000"]`)
- [ ] `get_db` 의존성 함수
- [ ] `GET /todos` (목록), `GET /todos/{id}` (단일), `POST /todos` (생성) — 🤖 AI 작성
- [ ] `PUT /todos/{id}` (수정), `DELETE /todos/{id}` (삭제) — ✍️ 사용자 타이핑

### 코드 설명 체크리스트
- [ ] CORS: 브라우저가 `localhost:3000`에서 `localhost:8000`으로 요청을 보낼 때 막히지 않도록 허용하는 설정 (다른 포트 = 다른 출처로 간주됨)
- [ ] `Depends(get_db)`: 요청 하나당 DB 세션을 새로 열고, 끝나면(`try/finally`) 무조건 닫아주는 "의존성 주입" 패턴
- [ ] `select(Todo)` / `db.execute(...).scalars().all()`: SQLAlchemy 2.0 문법으로 "Todo 테이블 전체 조회"
- [ ] `scalar_one_or_none()`: 결과가 1개면 그 객체, 없으면 `None` 반환 (404 처리에 사용)
- [ ] `db.add/commit/refresh`: 변경사항을 세션에 등록 → 실제 DB에 반영 → DB가 채워준 값(`id`, `created_at`)을 다시 읽어옴
- [ ] `try/except + db.rollback()`: 중간에 에러가 나면 변경사항을 전부 취소해 DB가 어중간한 상태로 남지 않게 함
- [ ] `response_model=...`: FastAPI가 반환값을 이 Pydantic 모델 형태로 자동 변환/검증해서 응답
- [ ] `status_code=201`(생성)/`204`(삭제, 본문 없음): HTTP 상태 코드로 결과를 명확히 표현

### 테스트 체크리스트 (Swagger UI `/docs` 또는 curl)
- [ ] `GET /todos` → `[]` (빈 배열)
- [ ] `POST /todos` `{"text": "우유 사기"}` → 201, `id`/`completed: false`/`created_at` 포함된 객체 반환
- [ ] `POST /todos` `{"text": "  "}` → 422 에러, 본문에 "할 일을 입력해주세요." 포함
- [ ] `GET /todos` → 방금 만든 항목 포함
- [ ] `GET /todos/{생성된 id}` → 해당 항목 반환, `GET /todos/9999` → 404
- [ ] `PUT /todos/{id}` `{"completed": true}` → `completed: true`로 변경, `text`는 그대로
- [ ] `DELETE /todos/{id}` → 204, 이후 `GET /todos` → 다시 `[]`
- [ ] curl 예시 한 번 실행: `curl -X POST http://localhost:8000/todos -H "Content-Type: application/json" -d '{"text":"테스트"}'`

---

## Step 5 — Todo 목록 페이지 (Server Component) + actions.ts (🤖)

### 작업 내용
`assignment-3/frontend/app/actions.ts`:
```ts
export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
};

export async function getTodos(): Promise<Todo[]> {
  const res = await fetch(`${process.env.FASTAPI_URL}/todos`, {
    next: { tags: ["todos-list"] },
  });

  if (!res.ok) {
    throw new Error("할 일 목록을 불러오는 데 실패했습니다");
  }

  return res.json();
}

export async function getTodoById(id: string): Promise<Todo | null> {
  const res = await fetch(`${process.env.FASTAPI_URL}/todos/${id}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("할 일을 불러오는 데 실패했습니다");
  return res.json();
}
```
`assignment-3/frontend/app/todos/page.tsx`:
```tsx
import Link from "next/link";
import { getTodos } from "@/app/actions";

export default async function TodosPage() {
  const todos = await getTodos();

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">할 일 목록</h1>
        <Link
          href="/todos/new"
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded-xl hover:bg-gray-700"
        >
          추가
        </Link>
      </div>

      {todos.length === 0 ? (
        <p className="text-center text-sm text-gray-300 py-10">할 일이 없어요.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {todos.map((todo) => (
            <li key={todo.id} className="px-4 py-3 bg-white rounded-2xl border border-gray-200">
              <Link href={`/todos/${todo.id}`}>
                <span className={todo.completed ? "line-through text-gray-300" : "text-gray-800"}>
                  {todo.text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
```
> 임시로 `assignment-3/frontend/.env.local`에 `FASTAPI_URL=http://localhost:8000`을 먼저 추가해야 이 단계가 동작합니다 (정식 환경변수 정리는 Step 10에서 다시 다룸).

### 구현 체크리스트
- [ ] `app/actions.ts`에 `Todo` 타입, `getTodos()`, `getTodoById()` 작성
- [ ] `.env.local`에 `FASTAPI_URL` 임시 추가
- [ ] `app/todos/page.tsx`를 Server Component로 작성, 목록 렌더링

### 코드 설명 체크리스트
- [ ] `export default async function TodosPage()`: 컴포넌트 함수가 `async`라는 것 자체가 "이건 Server Component"라는 신호 (Client Component는 컴포넌트 함수를 `async`로 만들 수 없음)
- [ ] 이 파일엔 `"use client"`가 없음 → 브라우저가 아니라 Next.js 서버에서 실행되어 완성된 HTML이 브라우저로 전달됨
- [ ] `await getTodos()`: `useEffect` + `useState`로 로딩 상태를 다루던 방식과 달리, 그냥 `await`로 데이터를 기다렸다가 그 결과로 화면을 그림
- [ ] `process.env.FASTAPI_URL`: Next.js가 `.env.local` 파일을 자동으로 읽어서 넣어주는 값 (Step 10에서 더 자세히 설명)
- [ ] `next: { tags: ["todos-list"] }`: 이 fetch 결과에 "todos-list"라는 이름표를 붙여서, 나중에 `revalidateTag("todos-list")`로 캐시를 강제로 새로고침할 수 있게 함
- [ ] `<Link href={...}>`: 클릭 시 페이지 전체 새로고침 없이 이동

### 테스트 체크리스트
- [ ] 백엔드(`uvicorn`) 켜둔 상태에서, `/docs`로 todo 1~2개 미리 생성
- [ ] `npm run dev` → `http://localhost:3000/todos` 접속 → 생성한 todo가 보임
- [ ] 브라우저 DevTools Network 탭: `/todos` 로딩 중 포트 8000으로 가는 요청이 **보이지 않음** (서버에서 미리 fetch했기 때문) — 이걸로 "Server Component fetch"를 직접 확인
- [ ] 백엔드를 잠깐 끄고 새로고침 → (아직 error.tsx가 없어서) Next.js 기본 에러 화면이 뜨는 것을 확인 (Step 9에서 개선)

---

## Step 6 — Todo 생성: Client Component + route.ts POST (🤖)

### 작업 내용
`assignment-3/frontend/app/api/todos/route.ts`:
```ts
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${process.env.FASTAPI_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json(
      { detail: error.detail ?? "할 일 생성에 실패했습니다" },
      { status: res.status },
    );
  }

  const data = await res.json();
  revalidateTag("todos-list");
  return NextResponse.json(data, { status: 201 });
}
```
`assignment-3/frontend/app/todos/TodoInput.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function TodoInput() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [error, setError] = useState(false);

  async function handleAdd() {
    if (!text.trim()) {
      setError(true);
      return;
    }
    try {
      await axios.post("/api/todos", { text: text.trim() });
      setText("");
      setError(false);
      router.refresh();
    } catch {
      alert("할 일 추가에 실패했습니다");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter") handleAdd();
  }

  return (
    <div className="flex flex-col gap-1 mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          maxLength={100}
          placeholder="할 일"
          onChange={(e) => {
            setText(e.target.value);
            setError(false);
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-gray-300 bg-white outline-none focus:border-gray-500"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium rounded-xl"
        >
          추가
        </button>
      </div>
      {error && <p className="text-xs text-gray-500 pl-1">할 일을 입력해주세요.</p>}
    </div>
  );
}
```
`app/todos/page.tsx`에 `<TodoInput />`을 목록 위에 추가하고, 상단에 `import TodoInput from "./TodoInput";` 추가. `npm install axios` 필요.

### 구현 체크리스트
- [ ] `npm install axios`
- [ ] `app/api/todos/route.ts`에 `POST` 핸들러 작성 (FastAPI로 프록시)
- [ ] `app/todos/TodoInput.tsx` 작성 (입력값 검증 + axios 요청)
- [ ] `app/todos/page.tsx`에 `<TodoInput />` 추가

### 코드 설명 체크리스트
- [ ] `"use client"`: 이 파일이 브라우저에서 실행되며 `useState`/이벤트 핸들러를 쓸 수 있게 함. Server Component는 이런 걸 못 함
- [ ] Server Component(`page.tsx`)가 Client Component(`TodoInput`)를 자식으로 렌더링하는 건 가능하지만, 반대(Client가 Server를 import)는 안 됨
- [ ] `axios.post("/api/todos", ...)`: FastAPI(`:8000`)가 아니라 **우리 Next.js 서버 자신**(`:3000`)의 `/api/todos`로 요청 — 이게 바로 `route.ts`
- [ ] `app/api/todos/route.ts`의 `POST` 함수: 브라우저 요청을 받아서, 그 안에서 FastAPI에 다시 fetch를 보내는 "중간 다리(프록시)" 역할
- [ ] `revalidateTag("todos-list")`: Step 5에서 붙여둔 이름표를 가진 캐시를 무효화 → 목록 페이지가 다음에 그려질 때 새 데이터로 다시 불러옴
- [ ] `router.refresh()`: 페이지 전체를 새로고침하지 않고, 가장 가까운 Server Component만 서버에서 다시 실행해서 최신 데이터로 갱신
- [ ] `e.nativeEvent.isComposing`: 한글은 입력 중 자모가 조합되는 과정에서 Enter 키 이벤트가 의도치 않게 발생할 수 있어, 조합 중이면 무시

### 테스트 체크리스트
- [ ] `/todos`에서 텍스트 입력 후 "추가" 클릭 → 새 항목이 페이지 새로고침 없이 나타남
- [ ] 빈 값으로 추가 시도 → "할 일을 입력해주세요." 표시, Network 탭에 `POST /api/todos` 요청 자체가 없음
- [ ] Network 탭: 요청이 `localhost:3000/api/todos`로 가는지 확인 (8000이 아님)
- [ ] 백엔드를 끄고 추가 시도 → `alert("할 일 추가에 실패했습니다")` 발생 확인
- [ ] 한글 입력 후 Enter로 추가 → 정상 동작 (IME 처리 확인)

---

## Step 7 — 완료 토글 + 삭제: TodoItem (✍️ 사용자 타이핑)

> AI가 아래 완성 코드를 먼저 설명합니다. `[todoId]` 같은 동적 경로 파일에서 `params`가 **Promise**라는 점(Next.js 15의 변경점)만 AI가 짚어준 뒤, 나머지는 Step 6과 같은 패턴이므로 사용자가 직접 타이핑합니다.

### 작업 내용
`assignment-3/frontend/app/api/todos/[todoId]/route.ts`:
```ts
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ todoId: string }> },
) {
  const { todoId } = await params;
  const body = await request.json();

  const res = await fetch(`${process.env.FASTAPI_URL}/todos/${todoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json({ detail: error.detail }, { status: res.status });
  }

  const data = await res.json();
  revalidateTag("todos-list");
  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ todoId: string }> },
) {
  const { todoId } = await params;

  const res = await fetch(`${process.env.FASTAPI_URL}/todos/${todoId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    return NextResponse.json({ detail: "할 일 삭제에 실패했습니다" }, { status: res.status });
  }

  revalidateTag("todos-list");
  return new NextResponse(null, { status: 204 });
}
```
`assignment-3/frontend/app/todos/TodoItem.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { Todo } from "@/app/actions";

export default function TodoItem({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [isToggling, setIsToggling] = useState(false);

  async function handleToggle() {
    setIsToggling(true);
    try {
      await axios.put(`/api/todos/${todo.id}`, { completed: !todo.completed });
      router.refresh();
    } catch {
      alert("상태 변경에 실패했습니다");
    } finally {
      setIsToggling(false);
    }
  }

  async function handleDelete() {
    if (!confirm("정말 삭제할까요?")) return;
    try {
      await axios.delete(`/api/todos/${todo.id}`);
      router.refresh();
    } catch {
      alert("삭제에 실패했습니다");
    }
  }

  return (
    <li className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-gray-200">
      <button
        onClick={handleToggle}
        disabled={isToggling}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
          todo.completed ? "bg-gray-900 border-gray-900" : "border-gray-300"
        }`}
        aria-label={todo.completed ? "완료 취소" : "완료"}
      />
      <Link href={`/todos/${todo.id}`} className="flex-1">
        <span className={`text-sm ${todo.completed ? "line-through text-gray-300" : "text-gray-800"}`}>
          {todo.text}
        </span>
      </Link>
      <button onClick={handleDelete} className="text-gray-300 hover:text-gray-600 text-sm" aria-label="삭제">
        ✕
      </button>
    </li>
  );
}
```
(`Link` import 필요: `import Link from "next/link";`)

`app/todos/page.tsx`의 `<li>...</li>` 블록을 `<TodoItem key={todo.id} todo={todo} />`로 교체.

### 구현 체크리스트
- [ ] `app/api/todos/[todoId]/route.ts`에 `PUT`/`DELETE` 핸들러 작성
- [ ] `app/todos/TodoItem.tsx` 작성 (토글 버튼 + 삭제 버튼)
- [ ] `page.tsx`에서 기존 `<li>`를 `<TodoItem>`으로 교체

### 코드 설명 체크리스트
- [ ] `{ params }: { params: Promise<{ todoId: string }> }`: Next.js 15부터 동적 라우트(`[todoId]`)의 params는 Promise이므로 `await params`로 꺼내 써야 함 (Step 5/6의 일반 함수와 다른 점)
- [ ] 파일 경로 `[todoId]`의 폴더 이름이 그대로 `params.todoId` 키 이름이 됨
- [ ] `TodoItem`이 받는 `todo` prop: Server Component(`page.tsx`)가 이미 fetch해 둔 데이터를 그대로 넘겨받음 — Client Component가 직접 다시 fetch하지 않음
- [ ] `confirm("정말 삭제할까요?")`: 브라우저 내장 확인창 — 이런 브라우저 API는 Client Component에서만 사용 가능
- [ ] `disabled={isToggling}`: 요청이 진행 중일 때 버튼을 중복 클릭하지 못하게 막는 로딩 상태 처리

### 테스트 체크리스트
- [ ] 토글 버튼 클릭 → 취소선 스타일 변경 + 브라우저 새로고침해도 상태 유지(=서버에 실제로 저장됨, localStorage 아님)
- [ ] Network 탭: `PUT /api/todos/{id}` 요청이 포트 3000으로 가는지 확인
- [ ] 삭제 버튼 클릭 → confirm 창 표시, 취소 시 아무 변화 없음, 확인 시 항목 사라짐
- [ ] `/docs`의 `GET /todos`로 실제 DB에서도 삭제됐는지 재확인

---

## Step 8 — 수정 페이지 [todoId]/page.tsx (✍️ 사용자 타이핑)

> AI가 완성 코드를 보여주고, "Server Component가 fetch한 데이터를 Client Component에 prop으로 넘긴다"는 개념만 설명한 뒤 사용자가 타이핑합니다.

### 작업 내용
`assignment-3/frontend/app/todos/[todoId]/page.tsx`:
```tsx
import Link from "next/link";
import { getTodoById } from "@/app/actions";
import EditTodoForm from "./EditTodoForm";

export default async function TodoDetailPage({
  params,
}: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await params;
  const todo = await getTodoById(todoId);

  if (!todo) {
    return <div className="text-center py-20 text-gray-400">할 일을 찾을 수 없습니다.</div>;
  }

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <Link href="/todos" className="text-sm text-gray-400 hover:text-gray-600">
        ← 목록으로
      </Link>
      <h1 className="text-xl font-bold text-gray-900 mt-4 mb-6">할 일 수정</h1>
      <EditTodoForm todo={todo} />
    </main>
  );
}
```
`assignment-3/frontend/app/todos/[todoId]/EditTodoForm.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { Todo } from "@/app/actions";

export default function EditTodoForm({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [text, setText] = useState(todo.text);
  const [error, setError] = useState(false);

  async function handleSave() {
    if (!text.trim()) {
      setError(true);
      return;
    }
    try {
      await axios.put(`/api/todos/${todo.id}`, { text: text.trim() });
      router.push("/todos");
    } catch {
      alert("수정에 실패했습니다");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        value={text}
        maxLength={100}
        onChange={(e) => {
          setText(e.target.value);
          setError(false);
        }}
        className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 outline-none focus:border-gray-500"
      />
      {error && <p className="text-xs text-gray-500">할 일을 입력해주세요.</p>}
      <button
        onClick={handleSave}
        className="bg-gray-900 text-white text-sm py-2.5 rounded-xl hover:bg-gray-700"
      >
        저장
      </button>
    </div>
  );
}
```

### 구현 체크리스트
- [ ] `app/todos/[todoId]/page.tsx` 작성 (Server Component, 단일 todo 조회)
- [ ] `app/todos/[todoId]/EditTodoForm.tsx` 작성 (Client Component, 수정 폼)
- [ ] Step 7에서 만든 `[todoId]/route.ts`의 `PUT` 핸들러를 그대로 재사용 (새 route 불필요)

### 코드 설명 체크리스트
- [ ] `getTodoById`가 `null`을 반환하면(404) 화면에서 바로 안내 문구 — 에러를 던지지 않고 자연스럽게 처리
- [ ] `<EditTodoForm todo={todo} />`: Server Component가 미리 가져온 데이터를 Client Component에 props로 전달 — Client Component는 처음 렌더링될 때부터 데이터를 들고 시작 (별도 `useEffect` fetch 불필요)
- [ ] `useState(todo.text)`: prop으로 받은 초깃값을 input의 로컬 상태로 사용 — 사용자가 수정하는 동안은 이 로컬 state가 화면에 보임
- [ ] `router.push("/todos")`: 저장 성공 후 목록 페이지로 이동 (`router.refresh()`와 달리 URL 자체가 바뀜)

### 테스트 체크리스트
- [ ] `/todos/{존재하는 id}` 접속 → 기존 텍스트가 입력창에 미리 채워져 있음
- [ ] `/todos/9999`(존재하지 않는 id) → "할 일을 찾을 수 없습니다." 표시 (에러 화면 아님)
- [ ] 텍스트 수정 후 저장 → `/todos`로 이동, 목록에 수정된 텍스트 반영
- [ ] Network 탭: 페이지 첫 로딩 시 보이는 요청 없음(Server Component), 저장 클릭 시에만 `PUT /api/todos/{id}` 요청 발생

---

## Step 9 — loading.tsx / error.tsx (🤖)

### 작업 내용
`assignment-3/frontend/app/todos/loading.tsx`:
```tsx
export default function Loading() {
  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-100 rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}
```
`assignment-3/frontend/app/todos/error.tsx`:
```tsx
"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="bg-gray-50 border border-gray-200 text-gray-700 rounded-xl p-6">
        <p className="font-medium">오류가 발생했습니다</p>
        <p className="text-sm mt-1 text-gray-500">{error.message}</p>
      </div>
    </div>
  );
}
```

### 구현 체크리스트
- [ ] `app/todos/loading.tsx` 작성
- [ ] `app/todos/error.tsx` 작성

### 코드 설명 체크리스트
- [ ] Next.js 파일 컨벤션: 이름이 `loading.tsx`/`error.tsx`이면 자동으로 역할이 부여됨 — import해서 쓰는 게 아님
- [ ] `loading.tsx`: 같은 폴더의 `page.tsx`(Server Component)가 `await fetch(...)` 중일 때 자동으로 보여짐 (내부적으로 React Suspense를 자동 적용 — 직접 `<Suspense>`를 쓸 필요 없음)
- [ ] `error.tsx`: `"use client"`가 필수 — Next.js의 에러 바운더리는 Client Component로만 동작함
- [ ] `{ error }: { error: Error }`: 같은 라우트의 Server Component에서 `throw new Error(...)`한 내용이 여기로 전달됨 (Step 5의 `getTodos()`에서 던진 에러가 여기로 옴)

### 테스트 체크리스트
- [ ] `getTodos()`에 `await new Promise(r => setTimeout(r, 2000))`을 임시로 추가 → `/todos` 새로고침 시 스켈레톤 UI가 잠깐 보임 (확인 후 제거)
- [ ] 백엔드(`uvicorn`)를 끄고 `/todos` 접속 → "오류가 발생했습니다" 박스가 보임 (Next.js 기본 에러 화면이 아님)
- [ ] 백엔드를 다시 켜고 새로고침 → 정상 목록으로 복구

---

## Step 10 — 환경변수 분리 (🤖 backend dotenv, ✍️ 하드코딩 URL 교체)

### 작업 내용
`assignment-3/frontend/.env.local`:
```
FASTAPI_URL=http://localhost:8000
```
(클라이언트가 FastAPI를 직접 호출하는 곳이 없으므로 `NEXT_PUBLIC_` 변수는 필요 없습니다. 강의 예제와 다른 점이며, 이유는 위 "책임 분리 표"에서 클라이언트가 항상 `route.ts`만 호출하기 때문입니다.)

`assignment-3/backend/.env.local`:
```
DATABASE_URL=sqlite:///./todos.db
FRONTEND_URL=http://localhost:3000
```

`main.py` 맨 위에 추가 (🤖 AI가 작성):
```python
from dotenv import load_dotenv
load_dotenv(".env.local")

import os
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
```
기존 하드코딩 부분을 교체 (✍️ 사용자가 타이핑):
```python
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
# ...
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 구현 체크리스트
- [ ] `assignment-3/frontend/.env.local` 생성
- [ ] `assignment-3/backend/.env.local` 생성
- [ ] `main.py`에 `load_dotenv(".env.local")` 추가
- [ ] `DATABASE_URL`/`allow_origins` 하드코딩을 환경변수로 교체
- [ ] `.gitignore`에 `.env.local` 추가 (frontend, backend 둘 다)

### 코드 설명 체크리스트
- [ ] Next.js는 `.env.local`을 별도 설정 없이 자동으로 읽음. FastAPI/Python은 그렇지 않아서 `python-dotenv`의 `load_dotenv()`를 **명시적으로, 다른 코드보다 먼저** 호출해야 함
- [ ] `os.getenv("KEY", "기본값")`: 환경변수가 없을 때 쓸 기본값을 지정 — `.env.local`이 없어도 앱이 죽지 않게 함
- [ ] `NEXT_PUBLIC_` 접두사: 이 접두사가 있으면 브라우저(클라이언트) 코드에도 값이 노출됨. 없으면 서버에서만 보임. 우리 앱은 클라이언트가 FastAPI URL을 알 필요가 없으므로 접두사 없는 `FASTAPI_URL`만 사용

### 테스트 체크리스트
- [ ] `grep -rn "localhost:8000\|localhost:3000" assignment-3/frontend/app assignment-3/backend/main.py` → `.env.local` 파일 자체를 빼면 결과 없음
- [ ] 두 서버 재기동 후 전체 흐름(목록/생성/토글/삭제/수정) 다시 한번 정상 동작 확인 — 환경변수로 바꿔도 기능은 동일해야 함
- [ ] `git status`(또는 `cat .gitignore`)로 `.env.local`이 추적되지 않는지 확인

---

## Step 11 — [도전1] 상태 필터링 (🤖 FastAPI 쿼리, ✍️ FilterTabs 컴포넌트)

### 작업 내용
`main.py`의 `get_todos` 수정 (🤖 AI가 작성):
```python
from fastapi import Query
from typing import Literal

@app.get("/todos", response_model=list[TodoResponse])
def get_todos(
    filter: Optional[Literal["all", "active", "completed"]] = Query(None),
    db: Session = Depends(get_db),
):
    stmt = select(Todo)
    if filter == "active":
        stmt = stmt.where(Todo.completed == False)
    elif filter == "completed":
        stmt = stmt.where(Todo.completed == True)
    return db.execute(stmt).scalars().all()
```
`actions.ts`의 `getTodos` 확장 (🤖):
```ts
export async function getTodos(filter?: string): Promise<Todo[]> {
  const url = new URL(`${process.env.FASTAPI_URL}/todos`);
  if (filter && filter !== "all") url.searchParams.set("filter", filter);

  const res = await fetch(url.toString(), { next: { tags: ["todos-list"] } });
  if (!res.ok) throw new Error("할 일 목록을 불러오는 데 실패했습니다");
  return res.json();
}
```
`page.tsx`가 `searchParams`를 읽도록 수정 (🤖):
```tsx
export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const todos = await getTodos(filter);
  // ...기존 내용 유지, <FilterTabs currentFilter={filter ?? "all"} /> 추가
}
```
`assignment-3/frontend/app/todos/FilterTabs.tsx` (✍️ AI가 보여준 뒤 사용자가 타이핑):
```tsx
import Link from "next/link";

const TABS = [
  { label: "전체", value: "all" },
  { label: "진행 중", value: "active" },
  { label: "완료", value: "completed" },
];

export default function FilterTabs({ currentFilter }: { currentFilter: string }) {
  return (
    <div className="flex gap-1 bg-gray-200 rounded-xl p-1 mb-4">
      {TABS.map((tab) => (
        <Link
          key={tab.value}
          href={tab.value === "all" ? "/todos" : `/todos?filter=${tab.value}`}
          className={`flex-1 text-center py-1.5 text-sm rounded-lg ${
            currentFilter === tab.value ? "bg-white text-gray-900 font-semibold" : "text-gray-400"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
```

### 구현 체크리스트
- [ ] FastAPI `GET /todos`에 `filter` 쿼리 파라미터 + SQL `WHERE` 조건 추가
- [ ] `actions.ts`의 `getTodos`가 `filter`를 받아 쿼리스트링으로 전달하도록 확장
- [ ] `page.tsx`가 `searchParams`를 읽어 `getTodos(filter)` 호출
- [ ] `FilterTabs.tsx` 작성 + `page.tsx`에 추가

### 코드 설명 체크리스트
- [ ] `Query(None)` + `Literal["all","active","completed"]`: URL의 `?filter=` 값을 받되, 정해진 값 3개만 허용 (다른 값이면 자동으로 422 에러)
- [ ] `FilterTabs`에 `"use client"`가 없는 이유: 그냥 `<Link>`로 URL을 바꾸는 것뿐이라 브라우저 상태(`useState`)가 전혀 필요 없음
- [ ] 탭 클릭 → URL이 `/todos?filter=active`로 바뀜 → Next.js가 `page.tsx`(Server Component)를 새 `searchParams`로 다시 실행 → `actions.ts`가 새 쿼리로 FastAPI 재호출 → 필터링된 결과가 옴. 2차 과제의 `useState('all')`과 정확히 대조되는 흐름
- [ ] `searchParams: Promise<{ filter?: string }>`: Step 7/8에서 본 `params`와 같은 이유로 Next.js 15에서는 Promise이며 `await` 필요

### 테스트 체크리스트
- [ ] 탭 3개 클릭 → URL이 각각 `/todos`, `/todos?filter=active`, `/todos?filter=completed`로 바뀌는지 확인
- [ ] `?filter=active` 상태에서 새로고침 → 필터가 유지됨 (React state였다면 초기화됐을 것)
- [ ] `/docs`에서 `GET /todos?filter=active` 직접 호출 → 미완료 항목만 반환되는지 확인
- [ ] Network 탭: 탭 클릭 시 `/api/todos` 호출이 아니라 페이지 자체 이동(RSC 요청)이 일어나는지 확인 — 필터링이 서버(FastAPI)에서 이뤄지고 있다는 증거

---

## Step 12 — [도전2] 검색 + 디바운스 (🤖 디바운스 로직, ✍️ actions.ts 파라미터 확장)

### 작업 내용
`main.py`의 `get_todos`를 한 번 더 확장 (🤖):
```python
from sqlalchemy import or_

@app.get("/todos", response_model=list[TodoResponse])
def get_todos(
    filter: Optional[Literal["all", "active", "completed"]] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    stmt = select(Todo)
    if filter == "active":
        stmt = stmt.where(Todo.completed == False)
    elif filter == "completed":
        stmt = stmt.where(Todo.completed == True)
    if search:
        stmt = stmt.where(Todo.text.contains(search))
    return db.execute(stmt).scalars().all()
```
> `text` 한 필드만 검색하므로 `or_()`는 필요 없지만, 검색 대상 필드가 2개 이상이라면 `or_(Todo.text.contains(search), Todo.다른필드.contains(search))` 형태로 결합합니다 (강의 예제의 게시글 제목/본문 동시 검색과 같은 패턴).

`actions.ts`의 `getTodos` 확장 (✍️ AI가 보여준 뒤 사용자가 타이핑):
```ts
export async function getTodos(filter?: string, search?: string): Promise<Todo[]> {
  const url = new URL(`${process.env.FASTAPI_URL}/todos`);
  if (filter && filter !== "all") url.searchParams.set("filter", filter);
  if (search) url.searchParams.set("search", search);

  const res = await fetch(url.toString(), { next: { tags: ["todos-list"] } });
  if (!res.ok) throw new Error("할 일 목록을 불러오는 데 실패했습니다");
  return res.json();
}
```
`page.tsx`가 `search`도 함께 읽도록 수정 (✍️):
```tsx
export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; search?: string }>;
}) {
  const { filter, search } = await searchParams;
  const todos = await getTodos(filter, search);
  // <SearchBox currentSearch={search ?? ""} /> 추가
}
```
`assignment-3/frontend/app/todos/SearchBox.tsx` (🤖 디바운스 로직이라 AI가 작성하며 자세히 설명):
```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchBox({ currentSearch }: { currentSearch: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(currentSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.push(`/todos?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="검색"
      className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 outline-none focus:border-gray-500 mb-4"
    />
  );
}
```

### 구현 체크리스트
- [ ] FastAPI `GET /todos`에 `search` 쿼리 파라미터 + `Todo.text.contains(search)` 조건 추가
- [ ] `actions.ts`의 `getTodos`가 `search`도 받아 쿼리스트링에 반영
- [ ] `page.tsx`가 `search`까지 읽어 `getTodos(filter, search)` 호출
- [ ] `SearchBox.tsx` 작성 + `page.tsx`에 추가

### 코드 설명 체크리스트
- [ ] 디바운스: 매 키 입력마다 요청을 보내면 낭비이므로, "입력이 멈춘 뒤 400ms"가 지나야 실제로 URL을 바꾸도록 지연시키는 기법
- [ ] `setTimeout`/`clearTimeout`: `value`가 바뀔 때마다 `useEffect`가 다시 실행되는데, 이전 타이머를 `clearTimeout`으로 취소하고 새 타이머를 거는 식으로 "마지막 입력 후 400ms"만 살아남게 함
- [ ] `useSearchParams()`: 현재 URL의 쿼리 파라미터를 Client Component에서 읽는 훅 (읽기 전용)
- [ ] `router.push(...)`: URL을 바꿔서 Next.js가 페이지를 새 파라미터로 다시 그리게 함 — `filter`는 유지하고 `search`만 추가/삭제하기 위해 기존 파라미터를 복사(`new URLSearchParams(searchParams.toString())`)해서 사용
- [ ] 검색창 자신은 fetch를 전혀 하지 않음 — URL만 바꾸고, 실제 데이터 요청은 그 URL을 읽는 `page.tsx`(Server Component)가 담당

### 테스트 체크리스트
- [ ] 검색창에 타이핑 → Network 탭에서 매 키 입력마다 요청이 가지 않고, 입력을 멈춘 뒤 약 400ms 후 한 번만 URL 변경(페이지 요청)이 일어나는지 확인
- [ ] URL이 `/todos?search=키워드`로 바뀌는지 확인
- [ ] `/todos?filter=active` 상태에서 검색 → 결과 URL이 `/todos?filter=active&search=키워드`로 두 파라미터가 함께 유지되는지 확인
- [ ] `/docs`에서 `GET /todos?search=우유` 직접 호출 → "우유"가 포함된 항목만 반환되는지 확인
- [ ] 검색창을 비우면 URL의 `search` 파라미터가 사라지고(`?search=`로 남지 않음) 전체(또는 필터된) 목록이 다시 보이는지 확인

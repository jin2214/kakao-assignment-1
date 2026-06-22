from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, select, Integer, String, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker, Session
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


@app.get("/")
def read_root():
    return {"message": "Todo API가 실행 중입니다"}


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
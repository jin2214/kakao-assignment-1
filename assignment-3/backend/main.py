from fastapi import FastAPI

app = FastAPI(title="Todo API")


@app.get("/")
def read_root():
    return {"message": "Todo API가 실행 중입니다"}

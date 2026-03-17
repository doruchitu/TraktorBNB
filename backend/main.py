from fastapi import FastAPI

app = FastAPI(title="TraktorBNB API")

@app.get("/")
def read_root():
    return {"message": "TraktorBNB merge in docker!"}

@app.get("/health")
def health_check():
    return {"status": "ok", "db": "connected"}
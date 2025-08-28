from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
import datetime

app = FastAPI()

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/sunshine")
def get_sunshine_data():
    today = datetime.date.today()
    data = []
    for i in range(7):  # last 7 days
        date = today - datetime.timedelta(days=i)
        hours = round(random.uniform(4, 12), 2)  # sunshine 4 to 12 hrs
        data.append({
            "date": str(date),
            "sunshine_hours": hours
        })
    return {"data": data}
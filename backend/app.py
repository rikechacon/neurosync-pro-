from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import asyncpg
import os

app = FastAPI(title="neurosync-pro API")

# Conexión a PostgreSQL (Render)
DATABASE_URL = os.getenv("DATABASE_URL")

class RoutineRequest(BaseModel):
    carrierFreq: float
    beatFreq: float
    band: str
    natureSound: str | None
    duration: int
    answers: dict

class RoutineResponse(BaseModel):
    id: int
    routine_data: dict
    created_at: datetime

@app.post("/api/routines")
async def create_routine(routine: RoutineRequest):
    """Guarda la rutina generada para historial del usuario"""
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        result = await conn.fetchrow(
            """
            INSERT INTO routines (carrier_freq, beat_freq, band, nature_sound, duration, answers, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, created_at
            """,
            routine.carrierFreq,
            routine.beatFreq,
            routine.band,
            routine.natureSound,
            routine.duration,
            routine.answers,
            datetime.utcnow()
        )
        await conn.close()
        
        return {"id": result["id"], "status": "saved", "created_at": result["created_at"]}
    except Exception as e:
        # Si falla DB, igual permitir que el usuario use la app (offline-first)
        print(f"DB Error: {e}")
        return {"id": None, "status": "local_only", "message": "Guardado localmente"}

@app.get("/api/user/{user_id}/history")
async def get_user_history(user_id: str):
    """Obtiene historial de rutinas del usuario"""
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        routines = await conn.fetch(
            "SELECT * FROM routines WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10",
            user_id
        )
        await conn.close()
        return routines
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

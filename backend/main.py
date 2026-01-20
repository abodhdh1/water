from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, crud
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to SWMS API", "status": "Database initialized"}

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    return {"status": "ok", "db": "connected"}

# Users
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Sensors
@app.post("/sensors/", response_model=schemas.Sensor)
def create_sensor(sensor: schemas.SensorCreate, db: Session = Depends(get_db)):
    return crud.create_sensor(db=db, sensor=sensor)

@app.get("/sensors/", response_model=List[schemas.Sensor])
def read_sensors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_sensors(db, skip=skip, limit=limit)

# Readings
@app.post("/sensors/{sensor_id}/readings/", response_model=schemas.Reading)
def create_reading_for_sensor(sensor_id: int, reading: schemas.ReadingCreate, db: Session = Depends(get_db)):
    # Verify sensor exists
    db_sensor = db.query(models.Sensor).filter(models.Sensor.id == sensor_id).first()
    if db_sensor is None:
        raise HTTPException(status_code=404, detail="Sensor not found")
    
    # Ensure reading.sensor_id matches URL
    reading.sensor_id = sensor_id
    return crud.create_reading(db=db, reading=reading)

@app.get("/sensors/{sensor_id}/readings/", response_model=List[schemas.Reading])
def read_readings(sensor_id: int, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_readings_by_sensor(db, sensor_id=sensor_id, limit=limit)



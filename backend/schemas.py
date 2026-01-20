from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from models import UserRole, SensorType, SensorStatus, AlertSeverity

# User Schemas
class UserBase(BaseModel):
    username: str
    email: str
    role: str = UserRole.USER.value

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    
    class Config:
        orm_mode = True

# Sensor Schemas
class SensorBase(BaseModel):
    name: str
    location: str
    type: str
    status: str = SensorStatus.ACTIVE.value

class SensorCreate(SensorBase):
    pass

class Sensor(SensorBase):
    id: int
    
    class Config:
        orm_mode = True

# Reading Schemas
class ReadingBase(BaseModel):
    value: float
    unit: str

class ReadingCreate(ReadingBase):
    sensor_id: int

class Reading(ReadingBase):
    id: int
    sensor_id: int
    timestamp: datetime

    class Config:
        orm_mode = True

# Alert Schemas
class AlertBase(BaseModel):
    message: str
    severity: str = AlertSeverity.INFO.value

class AlertCreate(AlertBase):
    sensor_id: int

class Alert(AlertBase):
    id: int
    sensor_id: int
    created_at: datetime
    is_resolved: bool

    class Config:
        orm_mode = True

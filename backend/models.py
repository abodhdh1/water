from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database import Base
import datetime
import enum

class UserRole(enum.Enum):
    ADMIN = "admin"
    USER = "user"

class SensorType(enum.Enum):
    FLOW = "flow"
    QUALITY = "quality"
    LEVEL = "level"

class SensorStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    MAINTENANCE = "maintenance"

class AlertSeverity(enum.Enum):
    INFO = "info"
    WARNING = "warning"
    CRITICAL = "critical"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default=UserRole.USER.value)

class Sensor(Base):
    __tablename__ = "sensors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    type = Column(String) # Stored as string, validated against SensorType
    status = Column(String, default=SensorStatus.ACTIVE.value)

    readings = relationship("Reading", back_populates="sensor")
    alerts = relationship("Alert", back_populates="sensor")

class Reading(Base):
    __tablename__ = "readings"

    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(Integer, ForeignKey("sensors.id"))
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    value = Column(Float)
    unit = Column(String)

    sensor = relationship("Sensor", back_populates="readings")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(Integer, ForeignKey("sensors.id"))
    message = Column(String)
    severity = Column(String, default=AlertSeverity.INFO.value)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_resolved = Column(Boolean, default=False)

    sensor = relationship("Sensor", back_populates="alerts")

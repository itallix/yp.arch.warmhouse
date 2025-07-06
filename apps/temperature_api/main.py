from fastapi import FastAPI, Query
from pydantic import BaseModel
import random
import uuid
from datetime import datetime, timezone

app = FastAPI(
    title="Temperature API",
    description="API для получения случайных значений температуры по местоположению",
    version="1.0.0"
)

class TemperatureResponse(BaseModel):
    value: float
    unit: str = "Celsius"
    timestamp: datetime
    location: str
    status: str = "success"
    sensor_id: str
    sensor_type: str = "digital_thermometer"
    description: str

@app.get("/")
async def root():
    """Главная страница API"""
    return {
        "message": "Temperature API", 
        "endpoints": {
            "temperature": "/temperature?location=<location_name>",
            "docs": "/docs"
        }
    }

@app.get("/temperature", response_model=TemperatureResponse)
async def get_temperature(location: str = Query(..., description="Название местоположения")):
    """
    Получить случайную температуру для указанного местоположения
    
    Args:
        location: Название местоположения (обязательный параметр)
    
    Returns:
        JSON с информацией о температуре
    """
    # Генерируем случайную температуру в диапазоне от -30 до +40 градусов
    temperature_value = round(random.uniform(-30.0, 40.0), 1)
    
    # Генерируем уникальный ID датчика
    sensor_id = f"TEMP_{uuid.uuid4().hex[:8].upper()}"
    
    # Создаем описание
    description = f"Temperature reading from sensor {sensor_id} at {location}"
    
    return TemperatureResponse(
        value=temperature_value,
        timestamp=datetime.now(timezone.utc),
        location=location,
        sensor_id=sensor_id,
        description=description
    )

@app.get("/health")
async def health_check():
    """Проверка работоспособности API"""
    return {"status": "healthy", "service": "temperature-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8081)

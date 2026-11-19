from fastapi import FastAPI

from config.database import Base, engine
from router.producto_router import router as producto_router

app = FastAPI(
    title="Servicio Producto", version="1.0.0",
    description="Servicio desarrollado en Clases de Arquitectura de Software",
)

Base.metadata.create_all(bind=engine)
app.include_router(producto_router, prefix="/api")

@app.get("/")
def inicio():
    return {"message": "Servicio producto ejecutándose correctamente"}
from pydantic import BaseModel, ConfigDict

class ProductoCreate(BaseModel):
    nombre: str
    descripcion: str
    precio: float
    stock: int

class ProductoResponse(ProductoCreate):
    codigo: int
    model_config = ConfigDict(from_attributes=True)


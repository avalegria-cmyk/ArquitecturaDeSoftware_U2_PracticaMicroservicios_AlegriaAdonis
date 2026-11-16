from sqlalchemy import Column, Integer, String, Float

from config.database import Base

class Producto(Base):
    __tablename__ = "productos"
    codigo = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(20), index=True)
    descripcion = Column(String(100))
    precio = Column(Float)
    stock = Column(Integer)
    
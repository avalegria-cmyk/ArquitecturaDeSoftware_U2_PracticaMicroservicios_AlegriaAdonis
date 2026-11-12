from sqlalchemy.orm import Session
from models.producto import Producto
from schemas.producto import ProductoCreate

def obtener_producto(db: Session):
    return db.query(Producto).all

def obtener_producto_por_id(db: Session, codigo: int):
    return db.query(Producto).filter(Producto.id == codigo).first()

def crear_producto(db: Session, producto: ProductoCreate):
    db_producto = Producto(**producto.dict())
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto

def actualizar_producto(db: Session, codigo: int, producto: ProductoCreate):
    db_producto = db.query(Producto).filter(Producto.id == codigo).first()
    if db_producto:
        for key, value in producto.dict().items():
            setattr(db_producto, key, value)
        db.commit()
        db.refresh(db_producto)
    return db_producto

def eliminar_producto(db: Session, codigo: int):
    producto = obtener_producto_por_id(db, codigo)
    if not producto:
        return None
    db.delete(producto)
    db.commit()

    return producto
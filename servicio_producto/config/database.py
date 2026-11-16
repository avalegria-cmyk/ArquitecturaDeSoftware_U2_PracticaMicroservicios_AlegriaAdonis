from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./producto.db"

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def obtener_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        db.rollback()
        print(f"Ocurrio un error en la captura de la bdd: {e}")
        raise
    finally:
        db.close()
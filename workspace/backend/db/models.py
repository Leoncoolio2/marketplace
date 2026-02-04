from sqlalchemy import Column, String, Float, Enum
from sqlalchemy.orm import declarative_base
import enum

Base = declarative_base()

class EscrowStatus(str, enum.Enum):
    HELD = 'held'
    RELEASED = 'released'
    REFUNDED = 'refunded'

class EscrowDB(Base):
    __tablename__ = 'escrows'

    id = Column(String, primary_key=True)
    order_id = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(Enum(EscrowStatus), nullable=False)

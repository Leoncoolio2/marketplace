from dataclasses import dataclass
from enum import Enum
from typing import Optional


class OrderStatus(str, Enum):
    CREATED = "created"
    PAID = "paid"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class EscrowStatus(str, Enum):
    HELD = "held"
    RELEASED = "released"
    REFUNDED = "refunded"


@dataclass
class User:
    id: str
    email: str


@dataclass
class Seller:
    id: str
    user_id: str
    display_name: str


@dataclass
class Product:
    id: str
    seller_id: str
    title: str
    price: float


@dataclass
class Order:
    id: str
    product_id: str
    buyer_id: str
    status: OrderStatus


@dataclass
class Escrow:
    id: str
    order_id: str
    amount: float
    status: EscrowStatus

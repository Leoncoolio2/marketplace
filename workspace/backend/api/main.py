from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from backend.domain.models import User, Order, OrderStatus

app = FastAPI(title="Marketplace API")

class UserCreate(BaseModel):
    id: str
    email: str

class OrderCreate(BaseModel):
    id: str
    product_id: str
    buyer_id: str

users: List[User] = []
orders: List[Order] = []

@app.post("/users")
def create_user(payload: UserCreate):
    user = User(id=payload.id, email=payload.email)
    users.append(user)
    return user

@app.post("/orders")
def create_order(payload: OrderCreate):
    order = Order(
        id=payload.id,
        product_id=payload.product_id,
        buyer_id=payload.buyer_id,
        status=OrderStatus.CREATED
    )
    orders.append(order)
    return order

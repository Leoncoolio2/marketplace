from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title='Marketplace Payments')

escrows = {}

class PaymentIntentPayload(BaseModel):
    order_id: str
    amount: float

class ReleasePayload(BaseModel):
    escrow_id: str

@app.post('/payments/create_intent')
def create_payment_intent(payload: PaymentIntentPayload):
    escrow_id = f"escrow_{payload.order_id}"
    escrows[escrow_id] = {
        'order_id': payload.order_id,
        'amount': payload.amount,
        'status': 'held'
    }
    return {
        'escrow_id': escrow_id,
        'status': 'held'
    }

@app.post('/payments/release')
def release_payment(payload: ReleasePayload):
    escrow = escrows.get(payload.escrow_id)
    if not escrow:
        raise HTTPException(status_code=404, detail='Escrow not found')
    escrow['status'] = 'released'
    return {
        'escrow_id': payload.escrow_id,
        'status': 'released'
    }

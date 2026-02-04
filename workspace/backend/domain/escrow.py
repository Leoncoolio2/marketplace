def hold_payment(order_id: str, amount: float):
    return {
        'order_id': order_id,
        'amount': amount,
        'status': 'held'
    }

def release_payment(escrow):
    escrow['status'] = 'released'
    return escrow

def refund_payment(escrow):
    escrow['status'] = 'refunded'
    return escrow

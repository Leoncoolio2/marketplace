from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel

app = FastAPI(title='Marketplace API')

users = {}

class RegisterPayload(BaseModel):
    email: str
    password: str

class LoginPayload(BaseModel):
    email: str
    password: str

def create_token(email: str):
    from core.agent import create_jwt
    return create_jwt({'sub': email})

@app.post('/auth/register')
def register(payload: RegisterPayload):
    if payload.email in users:
        raise HTTPException(status_code=400, detail='User exists')
    users[payload.email] = payload.password
    return {'status': 'registered'}

@app.post('/auth/login')
def login(payload: LoginPayload):
    if users.get(payload.email) != payload.password:
        raise HTTPException(status_code=401, detail='Invalid credentials')
    token = create_token(payload.email)
    return {'access_token': token, 'token_type': 'bearer'}

@app.get('/auth/me')
def me(authorization: str = Header(None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail='Missing token')
    token = authorization.split(' ')[1]
    from core.agent import verify_jwt
    payload = verify_jwt(token)
    if not payload:
        raise HTTPException(status_code=401, detail='Invalid token')
    return {'email': payload.get('sub')}

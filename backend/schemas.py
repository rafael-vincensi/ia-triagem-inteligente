from pydantic import BaseModel


class LoginRequest(BaseModel):
    cpf: str
    senha: str
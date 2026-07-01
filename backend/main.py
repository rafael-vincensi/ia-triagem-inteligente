import random

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import re
from database import SessionLocal, engine
from models import Base, Paciente, Usuario
from schemas import LoginRequest
import time

import sys
import os

sys.path.append(
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            ".."
        )
    )
)

from ai.classificador import classificar_sintomas

Base.metadata.create_all(bind=engine)

print("TABELAS CRIADAS")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TriagemRequest(BaseModel):
    nome: str
    cpf: str
    idade: int
    telefone: str
    sintomas: str

class AtualizarClassificacao(BaseModel):
    classificacao: str
    prioridade: int
    encaminhamento: str

class AutenticarBotRequest(BaseModel):
    cpf: str
    codigo: str
    chat_id: str

class LoginResponse(BaseModel):
    sucesso: bool
    mensagem: str | None = None
    nome: str | None = None
    tipo_usuario: str | None = None

print("HORA CADASTRO:", datetime.now())


@app.post("/login", response_model=LoginResponse)
def login(dados: LoginRequest):

    db: Session = SessionLocal()

    try:

        usuario = (
            db.query(Usuario)
            .filter(
                Usuario.cpf == dados.cpf,
                Usuario.senha == dados.senha
            )
            .first()
        )

        if usuario is None:

            raise HTTPException(
                status_code=401,
                detail="CPF ou senha inválidos."
            )

        return LoginResponse(
            sucesso=True,
            nome=usuario.nome,
            tipo_usuario=usuario.tipo_usuario
        )

    finally:

        db.close()

def normalizar_classificacao(classificacao):

    texto = classificacao.lower()

    if "vermelho" in texto:
        return "vermelho", 1

    elif "laranja" in texto:
        return "laranja", 2

    elif "amarelo" in texto:
        return "amarelo", 3

    elif "verde" in texto:
        return "verde", 4

    elif "azul" in texto:
        return "azul", 5

    return "verde", 4

def gerar_codigo_ativacao():

    return str(

        random.randint(

            100000,

            999999

        )

    )

@app.post("/triagem")
def triagem(data: TriagemRequest):

    inicio = time.time()

    print("ANTES DA IA")

    resultado_ia = classificar_sintomas(
            data.sintomas
        )
    fim = time.time()

    print(f"IA demorou: {fim - inicio:.2f}s")

    print("RESULTADO IA:")
    print(resultado_ia)

    linhas = resultado_ia.split("\n")

    classificacao = "verde"
    prioridade = 4
    encaminhamento = "Clínica Geral"
    justificativa = ""

    for linha in linhas:

            print(repr(linha))

            linha = linha.strip()

            linha_upper = linha.upper()

            if "CLASSIFIC" in linha_upper:

                classificacao = linha.split(":", 1)[1].strip()
                classificacao, prioridade = normalizar_classificacao(classificacao)

            elif "ENCAMINHAMENTO" in linha_upper:

                encaminhamento = linha.split(":", 1)[1].strip()

            elif "JUSTIFICATIVA" in linha_upper:

                justificativa = linha.split(":", 1)[1].strip()

    db: Session = SessionLocal()
    try:
        ultimo_paciente = (
            db.query(Paciente)
            .order_by(Paciente.id.desc())
            .first()
        )

        paciente_aberto = (
            db.query(Paciente)
            .filter(
                Paciente.cpf == data.cpf,
                Paciente.status != "Finalizado"
            )
            .order_by(Paciente.data_entrada.desc())
            .first()
        )

        if paciente_aberto:
            return {
                "possui_atendimento": True,
                "codigo": paciente_aberto.codigo,
                "status": paciente_aberto.status,
                "classificacao": paciente_aberto.classificacao,
                "encaminhamento": paciente_aberto.encaminhamento
            }

        if ultimo_paciente:
            proximo_numero = ultimo_paciente.id + 1
        else:
            proximo_numero = 1



        print(">>> Antes de salvar")
        print(classificacao)
        print(prioridade)

        codigo = f"TR-{proximo_numero:04d}"
        paciente = Paciente(
            codigo=codigo,
            nome=data.nome,
            cpf=data.cpf,
            idade=data.idade,
            telefone=data.telefone,
            chat_id=None,

            codigo_ativacao=gerar_codigo_ativacao(),
            bot_autenticado=False,
            sintomas=data.sintomas,
            classificacao=classificacao,
            prioridade=prioridade,
            encaminhamento=encaminhamento,
            justificativa=justificativa,
            status="Aguardando",
            data_entrada=datetime.now()
        )

        db.add(paciente)
        db.commit()
        db.refresh(paciente)

        
        return {

            "possui_atendimento": False,

            "id": paciente.id,
            "codigo": paciente.codigo,
            "nome": paciente.nome,
            "classificacao": paciente.classificacao,
            "prioridade": paciente.prioridade,
            "encaminhamento": paciente.encaminhamento,
            "status": paciente.status

}
    finally:
        db.close()

@app.get("/fila")
def fila():
    db: Session = SessionLocal()
    try:
        pacientes = (
            db.query(Paciente)
            .filter(Paciente.status != "Finalizado")
            .order_by(Paciente.prioridade)
            .all()
        )
        return pacientes
    finally:
        db.close()

@app.get("/historico")
def historico():

    db: Session = SessionLocal()

    try:

        pacientes = (
            db.query(Paciente)
            .filter(Paciente.status == "Finalizado")
            .order_by(Paciente.data_entrada.desc())
            .all()
        )

        return pacientes

    finally:

        db.close()

@app.get("/paciente/{id}")
def buscar_paciente(id: int):
    db: Session = SessionLocal()

    try:

        paciente = (
            db.query(Paciente)
            .filter(Paciente.id == id)
            .first()
        )

        return paciente

    finally:
        db.close()

@app.get("/paciente/cpf/{cpf}")
def buscar_paciente_cpf(cpf: str):

    db: Session = SessionLocal()

    try:

        paciente = (
            db.query(Paciente)
            .filter(Paciente.cpf == cpf)
            .order_by(Paciente.data_entrada.desc())
            .first()
        )

        if not paciente:

            raise HTTPException(

                status_code=404,
                detail="Paciente não encontrado."

            )

        
        if paciente.status != "Finalizado":

            return {

            "possui_atendimento": True,
            "status": paciente.status,
            "codigo": paciente.codigo,
            "nome": paciente.nome,
            "cpf": paciente.cpf,
            "idade": paciente.idade,
            "telefone": paciente.telefone,
            "chat_id": paciente.chat_id,
            "codigo_ativacao": paciente.codigo_ativacao
}

       
        return {

            "possui_atendimento": False,
            "nome": paciente.nome,
            "cpf": paciente.cpf,
            "idade": paciente.idade,
            "telefone": paciente.telefone,
            "codigo_ativacao": paciente.codigo_ativacao
        }

    finally:

        db.close()

@app.get("/paciente/{cpf}/triagem")
def buscar_triagem(cpf: str):

    db: Session = SessionLocal()

    try:

        paciente = (
            db.query(Paciente)
            .filter(Paciente.cpf == cpf)
            .order_by(Paciente.data_entrada.desc())
            .first()
)

        if not paciente:

            raise HTTPException(
                status_code=404,
                detail="Paciente não encontrado."
            )

        return {

            "codigo": paciente.codigo,
            "status": paciente.status,
            "classificacao": paciente.classificacao,
            "encaminhamento": paciente.encaminhamento,
            "data": paciente.data_entrada
        }

    finally:

        db.close()

@app.post("/bot/autenticar")
def autenticar_bot(dados: AutenticarBotRequest):

    db: Session = SessionLocal()

    try:

        paciente = (

    db.query(Paciente)
    .filter(
        Paciente.cpf == dados.cpf

    )
    .order_by(Paciente.data_entrada.desc())
    .first()

)

        if not paciente:

            raise HTTPException(
                status_code=404,
                detail="Paciente não encontrado."
            )

        if paciente.codigo_ativacao != dados.codigo:

            raise HTTPException(
                status_code=401,
                detail="Código inválido."
            )

        paciente.chat_id = dados.chat_id
        paciente.bot_autenticado = True

        db.commit()

        return {

            "mensagem": "Autenticado",
            "nome": paciente.nome,
            "cpf": paciente.cpf,
            "idade": paciente.idade,
            "telefone": paciente.telefone
        }

    finally:

        db.close()

@app.put("/paciente/{id}/classificacao")
def atualizar_classificacao(
    id: int,
    dados: AtualizarClassificacao
):

    db: Session = SessionLocal()

    try:

        paciente = (
            db.query(Paciente)
            .filter(Paciente.id == id)
            .first()
        )

        paciente.classificacao = dados.classificacao
        paciente.prioridade = dados.prioridade
        paciente.encaminhamento = dados.encaminhamento

        db.commit()

        return {
            "mensagem": "Classificação atualizada"
        }

    finally:
        db.close()

@app.put("/paciente/{id}/observacao")
def atualizar_observacao(id: int, observacao: str):

    db: Session = SessionLocal()

    try:

        paciente = (
            db.query(Paciente)
            .filter(Paciente.id == id)
            .first()
        )

        paciente.observacoes = observacao

        db.commit()

        return {
            "mensagem": "Observação atualizada"
        }

    finally:
        db.close()

@app.put("/paciente/{id}/status")
def atualizar_status(id: int, status: str):

    db: Session = SessionLocal()

    try:

        paciente = (
            db.query(Paciente)
            .filter(Paciente.id == id)
            .first()
        )

        paciente.status = status

        db.commit()

        return {
            "mensagem": "Status atualizado"
        }

    finally:
        db.close()
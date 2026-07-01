from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime

from database import Base


class Paciente(Base):

    __tablename__ = "pacientes"

    id = Column(Integer, primary_key=True, index=True)

    codigo = Column(String, unique=True)

    nome = Column(String)
    cpf = Column(String)
    idade = Column(Integer)
    telefone = Column(String)

    chat_id = Column(String, nullable=True)
    codigo_ativacao = Column(String, nullable=True)
    bot_autenticado = Column(Boolean, default=False)

    sintomas = Column(String)

    classificacao = Column(String)
    prioridade = Column(Integer)
    encaminhamento = Column(String)
    justificativa = Column(String, default="")

    status = Column(String, default="Aguardando")
    observacoes = Column(String, default="")
    data_entrada = Column(DateTime,default=datetime.now)



class Usuario(Base):
    
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    cpf = Column(String, unique=True)
    senha = Column(String)
    tipo_usuario = Column(String)
# 🏥 Triagem Inteligente

Sistema inteligente de apoio à triagem hospitalar desenvolvido como Projeto Integrador do curso de Ciência da Computação.

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-000000)
![Mistral](https://img.shields.io/badge/Mistral-AI-orange)

O sistema auxilia profissionais de saúde na classificação inicial de pacientes por meio de Inteligência Artificial, organizando automaticamente a fila de atendimento conforme a prioridade clínica identificada.

---

## 📌 Problema

Em ambientes hospitalares com alta demanda, pacientes com diferentes níveis de gravidade frequentemente aguardam atendimento em uma mesma fila. Esse cenário pode aumentar o tempo de resposta para casos críticos e dificultar a gestão do fluxo de pacientes.

O projeto Triagem Inteligente foi desenvolvido para apoiar o processo de triagem, classificação de risco e organização da fila de atendimento.

---

## 🎯 Objetivos

* Realizar o cadastro de pacientes.
* Registrar sintomas e informações básicas.
* Classificar automaticamente o nível de prioridade.
* Organizar a fila conforme a urgência do atendimento.
* Permitir acompanhamento do tempo de espera.
* Gerenciar status e observações dos pacientes.
* Utilizar Inteligência Artificial como ferramenta de apoio à classificação.
* Disponibilizar pré-triagem remota por meio de chatbot.

---

## ⚙️ Funcionalidades

### Cadastro de Pacientes

* Nome
* Idade
* Telefone
* Sintomas

### Classificação Inteligente

* Vermelho (Emergência)
* Amarelo (Urgência)
* Verde (Consulta)

### Gestão da Fila

* Ordenação automática por prioridade.
* Controle de tempo de espera.
* Atualização de status do atendimento.
* Busca de pacientes.

### Histórico

* Registro dos atendimentos realizados.
* Consulta de pacientes finalizados.

### Detalhes do Paciente

* Dados completos.
* Sintomas informados.
* Encaminhamento sugerido.
* Observações da equipe.

### Inteligência Artificial

* Modelo local executado via Ollama.
* Classificação utilizando Mistral.
* Busca semântica com ChromaDB.
* Arquitetura RAG (Retrieval-Augmented Generation).
* Base de conhecimento clínica personalizada.

### Bot Telegram

* Pré-triagem remota.
* Coleta de dados do paciente.
* Envio automático para o sistema.
* Geração de protocolo de atendimento.

---
## 📷 Demonstração

### Login

![Login](assets/screenshots/login.png)

### Dashboard

![Dashboard](assets/screenshots/dashboard.png)

### Pacientes no momento

![Pacientes](assets/screenshots/pacientes.png)

### Nova triagem

![Cadastro](assets/screenshots/nova-triagem.png)

### Histórico de Pacientes

![Historico](assets/screenshots/historico.png)

### Detalhes do Paciente

![Info](assets/screenshots/paciente-info.png)

### Chatbot

![Bot](assets/screenshots/bot-1.png)
![Bot](assets/screenshots/bot-2.png)

---

## 🏗️ Arquitetura do Projeto

```text
Paciente
   ├── Site (React)
   └── Telegram Bot

            ↓

         FastAPI

            ↓

     ChromaDB + Mistral

            ↓

       PostgreSQL

            ↓

      Fila Hospitalar
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend

* React
* Vite
* JavaScript
* CSS

### Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic

### Banco de Dados

* PostgreSQL

### Inteligência Artificial

* Ollama
* Mistral
* ChromaDB
* RAG (Retrieval-Augmented Generation)

### Integrações

* Telegram Bot API

### Ferramentas

* VS Code
* DBeaver
* Git
* GitHub

---

## 📂 Estrutura do Projeto

```text
triagem-inteligente/

├── ai/
│   ├── telegram_bot/
│   │   ├── bot.py
│   │   └── .env.example
│   │
│   ├── tests/
│   │   ├── test_rag.py
│   │   ├── teste_classificador.py
│   │   ├── teste_dataset.py
│   │   └── teste_ia.py
│   │
│   ├── classificador.py
│   ├── knowledge_base.py
│   ├── rag_classifier.py
│   └── semantic_search.py
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── requirements.txt
│   └── .env.example
│
├── dataset/
│   └── casos_triagem.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── README.md
└── LICENSE
```


## 🚀 Como Executar

### 1. Clonar o repositório
```
bash
git clone https://github.com/rafael-vincensi/triagem-inteligente.git

```
### 2. Backend

```
bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

Servidor:

```text
http://127.0.0.1:8000
```

Documentação:

```text
http://127.0.0.1:8000/docs
```

---

### 3. Frontend

```bash
cd frontend

npm install

npm run dev
```

Aplicação:

```text
http://localhost:5173
```

---

### 4. Inteligência Artificial

Instalar Ollama:

```bash
ollama pull mistral
```

Executar modelo:

```bash
ollama run mistral
```

Criar base vetorial:

```bash
cd ai

python knowledge_base.py
```

---

### 5. Bot Telegram

Configurar o token no arquivo `.env`:

```env
BOT_TOKEN=SEU_TOKEN
```

Executar:

```bash
cd ai/telegram_bot

python bot.py
```

---

## 🔄 Fluxo de Funcionamento

1. O paciente informa seus dados e sintomas.
2. Os sintomas são enviados ao backend.
3. O ChromaDB busca casos semelhantes na base de conhecimento.
4. O modelo Mistral realiza a classificação.
5. O sistema define prioridade e encaminhamento.
6. O paciente é inserido automaticamente na fila.
7. A equipe acompanha o atendimento pelo painel web.

---

## 🔮 Melhorias Futuras

* Dashboard com indicadores hospitalares em tempo real.
* Controle de usuários e permissões.
* Histórico de alterações clínicas.
* Integração com WhatsApp Business.
* Utilização de BioBERT para embeddings clínicos especializados.
* Relatórios gerenciais e estatísticos.
* Implantação em ambiente cloud.

---

## 👨‍💻 Autor

**Rafael Vincensi de Miranda**

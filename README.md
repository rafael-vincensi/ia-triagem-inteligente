# 🏥 Triagem Inteligente

Sistema de apoio à triagem hospitalar desenvolvido como Projeto Integrador do curso de Ciência da Computação.

O objetivo do projeto é auxiliar a organização do atendimento em unidades de saúde por meio da classificação de pacientes conforme os sintomas informados, contribuindo para a priorização de casos mais urgentes e melhor gerenciamento da fila de atendimento.

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

---

## ⚙️ Funcionalidades

### Cadastro de Pacientes

* Nome
* Idade
* Telefone
* Sintomas

### Classificação de Risco

* Vermelho (Emergência)
* Amarelo (Urgência)
* Verde (Consulta)

### Gestão da Fila

* Ordenação por prioridade
* Controle de tempo de espera
* Atualização de status

### Detalhes do Paciente

* Dados completos
* Sintomas informados
* Encaminhamento
* Observações

### Inteligência Artificial

* Integração com modelo local via Ollama.
* Classificação baseada nos sintomas informados.
* Estrutura preparada para evolução utilizando técnicas de IA generativa e RAG (Retrieval-Augmented Generation).

---

## 🏗️ Arquitetura do Projeto

```text
Frontend (React + Vite)
          │
          ▼
Backend (FastAPI)
          │
          ▼
PostgreSQL
          │
          ▼
Módulo de IA (Ollama)
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
│   ├── classificador.py
│   └── testes
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## 🚀 Como Executar

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/triagem-inteligente.git
```

### 2. Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

Servidor:

```text
http://127.0.0.1:8000
```

Documentação da API:

```text
http://127.0.0.1:8000/docs
```

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

### 4. Inteligência Artificial

Instalar Ollama:

```bash
ollama pull mistral
```

Executar modelo:

```bash
ollama run mistral
```

---

## 🔮 Melhorias Futuras

* Dashboard hospitalar em tempo real.
* Integração com WhatsApp.
* Histórico completo de atendimentos.
* Utilização de BioBERT para embeddings clínicos.
* Implementação de ChromaDB.
* Arquitetura RAG para apoio à decisão clínica.
* Relatórios e indicadores hospitalares.

---

## 👨‍💻 Autores

Projeto desenvolvido para a disciplina de Projeto Integrador do curso de Ciência da Computação.

Marcos Felipe Schmid e
Rafael Vincensi de Miranda


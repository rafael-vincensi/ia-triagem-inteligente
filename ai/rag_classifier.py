import chromadb
from ollama import chat

cliente = chromadb.PersistentClient(
    path="./chroma_db"
)

colecao = cliente.get_collection(
    name="triagem"
)

def classificar(sintomas):

    resultado = colecao.query(
        query_texts=[sintomas],
        n_results=3
    )

    contexto = ""

    documentos = resultado["documents"][0]
    metadados = resultado["metadatas"][0]

    for doc, meta in zip(
        documentos,
        metadados
    ):

        contexto += f"""
Sintomas: {doc}
Classificacao: {meta["classificacao"]}
Prioridade: {meta["prioridade"]}
Encaminhamento: {meta["encaminhamento"]}

"""
        
    print("CONTEXTO:")
    print(contexto)
    print()
    print("ENVIANDO PARA IA...")

    resposta = chat(
        model="mistral",
        messages=[
            {
                "role": "system",
                "content": f"""
Você é um classificador hospitalar.

Casos semelhantes:

{contexto}

Utilize esses exemplos para classificar.

Retorne SOMENTE:

CLASSIFICACAO:
PRIORIDADE:
ENCAMINHAMENTO:
"""
            },
            {
                "role": "user",
                "content": sintomas
            }
        ]
    )

    return resposta["message"]["content"]

print(
    classificar(
        "tosse e febre"
    )
)   
import chromadb
import os

caminho_chroma = os.path.join(
    os.path.dirname(__file__),
    "chroma_db"
)

cliente = chromadb.PersistentClient(
    path=caminho_chroma
)

colecao = cliente.get_collection(
    name="triagem"
)

def buscar_contexto(sintomas):

    resultado = colecao.query(
        query_texts=[sintomas],
        n_results=2
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

    return contexto
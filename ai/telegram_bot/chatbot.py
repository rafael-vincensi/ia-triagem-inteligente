from ollama import chat


def responder_duvida(pergunta):
    prompt = f"""
Você é um assistente virtual hospitalar.

Responda dúvidas sobre:

- saúde
- sintomas
- classificação de Manchester
- funcionamento da triagem
- primeiros cuidados

Nunca faça diagnósticos definitivos.
Responda apenas se a pergunta estiver relacionada a saúde, sintomas, classificação de Manchester, funcionamento da triagem ou primeiros cuidados.
Caso a pergunta não esteja relacionada a esses tópicos, responda: "Desculpe, não posso ajudar com isso."
Se a pergunta não estiver relacionada a nenhum desses tópicos, responda APENAS: "Desculpe, não posso ajudar com isso."

Sempre informe que a resposta não substitui avaliação médica.

Pergunta:

{pergunta}
"""

    resposta = chat(
        model="mistral",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
    )

    return resposta["message"]["content"]
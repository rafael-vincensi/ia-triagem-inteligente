from ollama import chat
from ai.semantic_search import buscar_contexto

def classificar_sintomas(sintomas):

    contexto = buscar_contexto(sintomas)
 
    if not contexto.strip():
        contexto = "Nenhum caso semelhante encontrado."

    prompt = f"""
Você é um enfermeiro especialista em Classificação de Risco utilizando EXCLUSIVAMENTE o Protocolo de Manchester.

Utilize os CASOS SEMELHANTES abaixo apenas como referência.

====================
CASOS SEMELHANTES
====================

{contexto}

====================
REGRAS
====================

- Utilize apenas os sintomas informados.
- NÃO invente sintomas.
- NÃO suponha doenças que não foram descritas.
- NÃO considere hipóteses raras.
- NÃO classifique como Vermelho apenas por existir uma possibilidade remota.
- Escolha a classificação mais compatível com os sintomas apresentados, priorizando a segurança do paciente.
- Se os sintomas forem leves, utilize Verde ou Azul.
- Utilize Vermelho quando os sintomas indicarem forte suspeita de risco imediato à vida ou necessidade de atendimento imediato.
- Em caso de dúvida entre Amarelo e Vermelho para sintomas neurológicos ou cardiovasculares graves, prefira Vermelho.

Exemplos:

Arranhão superficial → Verde

Dor muscular após exercício → Verde

Dor de garganta leve → Azul ou Verde

Resfriado comum → Azul ou Verde

Dor no peito + falta de ar + suor frio → Vermelho

Parada cardiorrespiratória → Vermelho

Convulsão → Vermelho

Hemorragia intensa → Vermelho

Perda de consciência → Vermelho

Casos que DEVEM ser classificados como Vermelho:

- Dor intensa no peito acompanhada de suor frio, falta de ar ou irradiação para braço ou mandíbula.
- Perda súbita de força em um lado do corpo.
- Dificuldade súbita para falar.
- Boca torta.
- Suspeita de AVC.
- Convulsão.
- Inconsciência.
- Hemorragia intensa.
- Grande dificuldade respiratória.
- Parada cardiorrespiratória.

Casos que normalmente são Laranja:

- Criança pequena com febre alta e sonolência.
- Rebaixamento do nível de consciência.
- Dor abdominal intensa com sinais sistêmicos.

====================
CLASSIFICAÇÕES
====================

CLASSIFICACAO deve ser exatamente:

Vermelho
Laranja
Amarelo
Verde
Azul

PRIORIDADE deve ser exatamente:

1
2
3
4
5

ENCAMINHAMENTO deve ser exatamente:

Emergência
Sala de Urgência
Consulta Médica
Clínica Geral
Orientação / Alta

JUSTIFICATIVA:

A JUSTIFICATIVA deve ser coerente com a classificação escolhida.

Nunca justifique Azul ou Verde afirmando que existe suspeita de infarto, AVC ou outra emergência.

Uma única frase.

Laranja:
Paciente com risco elevado de agravamento, necessitando atendimento muito rápido, porém ainda sem risco imediato de morte.

Exemplos:
- Dor abdominal intensa.
- Grande dificuldade para respirar, mas consciente.
- Queimaduras extensas.
- Criança com febre alta associada à sonolência.
- Trauma importante sem parada cardiorrespiratória.

====================
FORMATO DA RESPOSTA
====================

CLASSIFICACAO:
PRIORIDADE:
ENCAMINHAMENTO:
JUSTIFICATIVA:

====================
PACIENTE
====================

{sintomas}
"""

    resposta = chat(
        model="mistral",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return resposta["message"]["content"]
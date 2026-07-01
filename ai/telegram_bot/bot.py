from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    ContextTypes,
    filters
)

from dotenv import load_dotenv
import requests
import os
from chatbot import responder_duvida

load_dotenv()

TOKEN = os.getenv("BOT_TOKEN")

usuarios = {}


async def start(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):

    usuarios[update.effective_user.id] = {
        "etapa": "menu"
    }

    await update.message.reply_text(

        "🏥 Bem-vindo ao Assistente Virtual Hospitalar.\n\n"
        "Como posso ajudar?\n\n"
        "1 - Nova triagem\n"
        "2 - Tirar dúvidas\n"
        "3 - Consultar protocolo\n"
        "4 - Cancelar"
    )


async def responder(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):

    user_id = update.effective_user.id
    texto = update.message.text.strip()

    if user_id not in usuarios:

        await update.message.reply_text(
            "Digite /start para iniciar."
        )

        return

    etapa = usuarios[user_id]["etapa"]

    # ==========================
    # MENU PRINCIPAL
    # ==========================

    if etapa == "menu":

        if texto == "1":

            usuarios[user_id]["etapa"] = "cpf"

            await update.message.reply_text(
                "Informe seu CPF:"
            )

        elif texto == "2":

            usuarios[user_id]["etapa"] = "duvidas"

            await update.message.reply_text(
                "Digite sua dúvida:"
            )

        elif texto == "3":

            if "paciente" not in usuarios[user_id]:

                await update.message.reply_text(
                    "Faça uma Nova Triagem primeiro para autenticar seu acesso."
                )

                return
            
            paciente = usuarios[user_id]["paciente"]
            resposta = requests.get(
                f"http://127.0.0.1:8000/paciente/{paciente['cpf']}/triagem"
            )

            if resposta.status_code != 200:

                await update.message.reply_text(
                    "❌ Nenhuma triagem encontrada."
                )

                return
            
            dados = resposta.json()
            await update.message.reply_text(
                f""" 📋 Protocolo de Atendimento: 

            Código do Protocolo: {dados['codigo']}

            Status: {dados['status']}

            Encaminhamento: {dados['encaminhamento']}
            """

            )

            return

        elif texto == "4":

            usuarios.pop(user_id)

            await update.message.reply_text(
                "Operação cancelada.\n\nDigite /start para iniciar novamente."
            )

        else:

            await update.message.reply_text(
                "Escolha uma opção de 1 a 4."
            )

        return

    elif etapa == "cpf":

        resposta = requests.get(
            f"http://127.0.0.1:8000/paciente/cpf/{texto}"
        )

        if resposta.status_code != 200:

            await update.message.reply_text(
                "❌ CPF não encontrado.\n\n"
                "É necessário realizar o cadastro presencial antes de utilizar a triagem remota."
            )

            usuarios[user_id]["etapa"] = "menu"

            return

        dados = resposta.json()

        if dados["possui_atendimento"]:

            usuarios[user_id]["paciente"] = dados

            await update.message.reply_text(
                f"""⚠️ Você já possui um atendimento em andamento.

Protocolo: {dados['codigo']}
Status: {dados['status']}

Como posso ajudar?

2 - Tirar dúvidas

3 - Consultar protocolo

4 - Cancelar
"""
            )

            usuarios[user_id]["etapa"] = "menu"

            return

        usuarios[user_id]["paciente"] = dados

        usuarios[user_id]["etapa"] = "codigo"

        await update.message.reply_text(
            "Informe seu código de ativação:"
        )

        return

    elif etapa == "codigo":

        paciente = usuarios[user_id]["paciente"]

        resposta = requests.post(

            "http://127.0.0.1:8000/bot/autenticar",

            json={
                "cpf": paciente["cpf"],
                "codigo": texto,
                "chat_id": str(user_id)
            }

        )
        if resposta.status_code != 200:

            await update.message.reply_text("❌ Código de ativação inválido. Digite novamente...")

            return
        dados = resposta.json()

        paciente["nome"] = dados["nome"]
        paciente["idade"] = dados["idade"]
        paciente["telefone"] = dados["telefone"]

        usuarios[user_id]["paciente"] = paciente

        usuarios[user_id]["etapa"] = "sintomas"

        await update.message.reply_text(

            f"✅ Autenticação realizada com sucesso!\n\n"

            f"Olá, {dados['nome']}.\n\n"

            "Descreva seus sintomas."

        )

        return

    elif etapa == "duvidas":

        resposta = responder_duvida(texto)

        await update.message.reply_text(

        resposta)
    
        await update.message.reply_text(

            "Posso ajudar em mais alguma coisa?\n\n"

            "1 - Nova triagem\n"

             "2 - Tirar dúvidas\n"

            "3 - Consultar protocolo\n"

            "4 - Cancelar")

        usuarios[user_id]["etapa"] = "menu"
        return

    elif etapa == "sintomas":
        paciente = usuarios[user_id]["paciente"]

        usuarios[user_id]["sintomas"] = texto

        await update.message.reply_text(
            "⏳ Realizando triagem..."
        )

        resposta = requests.post(
            "http://127.0.0.1:8000/triagem",
            json={

                "nome": paciente["nome"],
                "cpf": paciente["cpf"],
                "idade": paciente["idade"],
                "telefone": paciente["telefone"],
                "sintomas": texto
}
        )

        dados = resposta.json()
         
        if dados["classificacao"] == "vermelho":

            mensagem = f"""🚨 Atenção

Protocolo: {dados['codigo']}

Os sintomas informados podem indicar uma situação que requer atendimento imediato.

Procure o serviço de emergência mais próximo o quanto antes e informe o protocolo acima à equipe responsável.
"""

        elif dados["classificacao"] == "amarelo":

            mensagem = f"""
⚠️ Atenção

Protocolo: {dados['codigo']}

Foram identificados sintomas que merecem avaliação médica prioritária.

Recomenda-se procurar atendimento o mais breve possível e informar o protocolo acima à equipe responsável.
"""

        else:

            mensagem = f"""
✅ Pré-triagem concluída

Protocolo: {dados['codigo']}

Seu atendimento foi registrado com sucesso.

Ao chegar à unidade de saúde, informe o protocolo acima à equipe responsável.
"""

        await update.message.reply_text(
            mensagem
        )

        del usuarios[user_id]


def main():

    app = Application.builder().token(
        TOKEN
    ).build()

    app.add_handler(
        CommandHandler(
            "start",
            start
        )
    )

    app.add_handler(
        MessageHandler(
            filters.TEXT & ~filters.COMMAND,
            responder
        )
    )

    print("BOT INICIADO")

    app.run_polling()


if __name__ == "__main__":
    main()
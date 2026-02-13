# Guia Rápido: Deploy no Railway em 10 Minutos (24/7 Online)

**Autor:** Manus AI  
**Data:** 13 de fevereiro de 2026  
**Tempo Estimado:** 10-15 minutos

---

## 💡 Por que Railway?

O Railway é a forma mais fácil de colocar sua aplicação online **24 horas por dia, 7 dias por semana**, sem as complicações de configurar um servidor e sem o "sleep mode" das plataformas gratuitas.

**Vantagens:**
- ✅ **Sem Sleep Mode:** Sua aplicação fica sempre online.
- ✅ **Deploy em 3 Cliques:** Conecta-se ao seu GitHub e faz tudo sozinho.
- ✅ **Banco de Dados MySQL Fácil:** Adicione um banco de dados com um clique.
- ✅ **$5 de Crédito Gratuito:** Suficiente para rodar este projeto de graça.
- ✅ **Interface Simples:** Muito intuitiva e fácil de usar.

---

## 📋 O que você vai precisar

1.  **Conta no GitHub:** Onde seu código está guardado.
2.  **Conta no Railway:** Crie em [railway.app](https://railway.app) (use a opção "Login with GitHub").

> **Nota:** O Railway pode pedir um cartão de crédito para ativar o plano gratuito, mas **não irá cobrar nada** automaticamente. Você só paga se ultrapassar os $5 de crédito, o que é improvável para este projeto.

---

## 🚀 Passo a Passo: Do Código ao Deploy

### Passo 1: Colocar o Código no GitHub (5 min)

Se o seu código ainda não está no GitHub, siga estes passos.

1.  **Crie um novo repositório** no [GitHub](https://github.com/new).
    -   **Repository name:** `desafio-namorados`
    -   **Visibility:** `Private` (Recomendado)
2.  **Faça o upload dos arquivos** do projeto para este novo repositório.
    -   Na página do seu novo repositório, clique em **"uploading an existing file"**.
    -   Arraste todos os arquivos do projeto (incluindo os novos arquivos de configuração do Railway) para a área de upload.
    -   Clique em **"Commit changes"**.

### Passo 2: Criar o Projeto no Railway (2 min)

1.  Acesse seu [Dashboard do Railway](https://railway.app/dashboard).
2.  Clique em **"New Project"**.
3.  Selecione **"Deploy from GitHub repo"**.
4.  Escolha o repositório `desafio-namorados` que você acabou de criar/atualizar.

O Railway irá analisar seu código e começar o primeiro deploy automaticamente. **É normal que ele falhe**, pois ainda não configuramos o banco de dados e as variáveis de ambiente.

### Passo 3: Adicionar o Banco de Dados MySQL (1 min)

1.  Dentro do seu projeto no Railway, clique no botão **"+ New"**.
2.  Selecione **"Database"**.
3.  Escolha **"MySQL"**.

Pronto! O Railway criou um banco de dados MySQL e **automaticamente conectou-o à sua aplicação**. A variável `DATABASE_URL` já foi criada para você.

Sua tela deve se parecer com isto:

```
+---------------------------------+
|                                 |
|   [desafio-namorados]  <--+      |
|   (Aplicação)            |      |
|                          |      |
|   [MySQL]                |      |
|   (Banco de Dados) ------+      |
|                                 |
+---------------------------------+
```

### Passo 4: Configurar Variáveis de Ambiente (2 min)

Este é o passo mais importante. Precisamos informar à aplicação a chave secreta para os tokens de autenticação.

1.  Clique no serviço da sua aplicação (`desafio-namorados`) no dashboard do Railway.
2.  Vá para a aba **"Variables"**.
3.  Você verá que `DATABASE_URL` e `PORT` já estão lá. Vamos adicionar as que faltam.
4.  Clique em **"+ New Variable"** e adicione as duas variáveis abaixo:

    | Variable Name | Value | Descrição |
    |---|---|---|
    | `NODE_ENV` | `production` | Informa à aplicação para rodar em modo de produção. |
    | `JWT_SECRET` | `SUA_CHAVE_SECRETA_AQUI` | Chave de segurança. Gere uma chave longa e aleatória. |

    **Como gerar uma `JWT_SECRET` segura?**
    -   Use o script `generate-jwt-secret.sh` que está no projeto.
    -   Ou use um gerador online como [generate-secret.vercel.app](https://generate-secret.vercel.app/32).
    -   Copie e cole a chave gerada.

5.  Após adicionar as variáveis, o Railway irá **automaticamente fazer um novo deploy** da sua aplicação com as configurações corretas.

### Passo 5: Aplicar Migrações e Testar (2 min)

O último passo é criar as tabelas no banco de dados.

1.  Aguarde o deploy terminar (você verá um visto verde ✅).
2.  Vá para a aba **"Deployments"** e clique no último deploy bem-sucedido.
3.  No canto superior direito, clique nos três pontos (`...`) e selecione **"Open shell"**.
4.  Um terminal irá abrir. Digite o seguinte comando e pressione Enter:
    ```bash
    pnpm db:push
    ```
5.  Aguarde a mensagem `[✓] migrations applied successfully!`.

**Para testar sua aplicação:**

1.  Vá para a aba **"Settings"** do seu serviço.
2.  Na seção **"Domains"**, você encontrará a URL pública do seu site (algo como `desafio-namorados-production.up.railway.app`).
3.  Clique nela e seu site estará no ar!

---

## 🎉 Parabéns! Sua aplicação está online 24/7!

Você acabou de fazer o deploy de uma aplicação full-stack com banco de dados em menos de 15 minutos, sem configurar nenhum servidor!

### O que fazer agora?

- **Compartilhe o link:** Envie a URL para seu parceiro(a).
- **Atualizações futuras:** Sempre que você fizer um `git push` para seu repositório no GitHub, o Railway fará um novo deploy automaticamente.

---

## 🆘 Solução de Problemas (Troubleshooting)

**Problema: O deploy falha (vermelho ❌)**

1.  **Verifique os Logs:** Clique no deploy que falhou e vá para a aba **"Build Logs"** ou **"Deploy Logs"**. O erro geralmente está no final.
2.  **Variáveis de Ambiente:** Certifique-se de que `JWT_SECRET` e `NODE_ENV` foram adicionadas corretamente.
3.  **Comandos de Build:** Verifique se os comandos em `railway.json` estão corretos (`pnpm install && pnpm build`).

**Problema: O site mostra "Application Error"**

1.  **Migrações:** Verifique se você executou `pnpm db:push` no shell.
2.  **Logs da Aplicação:** Vá para a aba **"Deploy Logs"** e veja se há erros de conexão com o banco ou outros problemas.
3.  **`DATABASE_URL`:** Verifique se a variável `DATABASE_URL` foi preenchida automaticamente pelo Railway.

**Problema: A URL não funciona**

1.  **Aguarde o Deploy:** Certifique-se de que o deploy foi concluído com sucesso.
2.  **Verifique a URL:** Confirme se você está usando a URL correta da aba **"Settings"**.

---

## 💰 Entendendo os Custos

- O Railway oferece **$5 de crédito gratuito por mês** (ou 500 horas de uso, o que acabar primeiro).
- Para a aplicação **Desafio de Namorados**, o consumo estimado é de **$3 a $5 por mês**, o que significa que ela provavelmente rodará de graça.
- Se o seu uso exceder o crédito, o Railway irá pausar seus serviços (mas não irá cobrar seu cartão sem aviso).
- Você pode ver seu consumo em tempo real no [Dashboard de Faturamento](https://railway.app/account/billing).

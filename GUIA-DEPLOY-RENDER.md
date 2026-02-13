# Guia Completo: Deploy no Render (Hospedagem Gratuita)

## 📋 O que você vai precisar

- ✅ Conta no GitHub (gratuita)
- ✅ Conta no Render (gratuita)
- ✅ O código do projeto (você já tem!)

**Tempo estimado:** 15-20 minutos

---

## 🚀 Passo 1: Preparar o Código para Deploy

O código já está pronto! Mas vamos garantir que tudo está configurado corretamente.

### 1.1 Verificar arquivos essenciais

Certifique-se que estes arquivos existem no projeto:
- ✅ `package.json` (já existe)
- ✅ `drizzle.config.ts` (já existe)
- ✅ `server/` (já existe)
- ✅ `client/` (já existe)

---

## 🐙 Passo 2: Subir o Código para o GitHub

### 2.1 Criar repositório no GitHub

1. Acesse https://github.com
2. Faça login (ou crie uma conta gratuita)
3. Clique no botão **"+"** no canto superior direito
4. Selecione **"New repository"**
5. Preencha:
   - **Repository name:** `desafio-namorados` (ou outro nome que preferir)
   - **Description:** "Valentine's Day Connection Challenge"
   - **Visibility:** Private (recomendado) ou Public
   - **NÃO** marque "Initialize this repository with a README"
6. Clique em **"Create repository"**

### 2.2 Subir o código

Você tem duas opções:

#### Opção A: Via Interface do GitHub (Mais Fácil)

1. Na página do repositório recém-criado, clique em **"uploading an existing file"**
2. Arraste TODOS os arquivos do projeto para a área de upload
3. Escreva uma mensagem: "Initial commit"
4. Clique em **"Commit changes"**

#### Opção B: Via Git (Linha de Comando)

Se você tem Git instalado localmente:

```bash
cd /caminho/para/desafio-namorados
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/desafio-namorados.git
git push -u origin main
```

---

## 🎨 Passo 3: Criar Conta no Render

1. Acesse https://render.com
2. Clique em **"Get Started for Free"**
3. Escolha **"Sign up with GitHub"** (recomendado)
4. Autorize o Render a acessar sua conta GitHub
5. Pronto! Conta criada.

---

## 🗄️ Passo 4: Criar Banco de Dados MySQL

### 4.1 Criar o banco

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"MySQL"**
3. Preencha:
   - **Name:** `desafio-namorados-db`
   - **Database:** `valentines`
   - **User:** `admin` (ou outro nome)
   - **Region:** Escolha o mais próximo (ex: Oregon, USA)
   - **Plan:** **Free** (selecione o plano gratuito)
4. Clique em **"Create Database"**

### 4.2 Copiar a Connection String

1. Aguarde o banco ser criado (1-2 minutos)
2. Quando estiver pronto, você verá **"Available"** em verde
3. Role para baixo até **"Connections"**
4. Copie a **"Internal Database URL"** (começa com `mysql://`)
5. **GUARDE ESSA URL!** Você vai precisar dela no próximo passo

Exemplo de URL:
```
mysql://admin:senha123@dpg-abc123xyz.oregon-postgres.render.com/valentines
```

---

## 🌐 Passo 5: Criar Web Service (Aplicação)

### 5.1 Conectar ao GitHub

1. No dashboard do Render, clique em **"New +"**
2. Selecione **"Web Service"**
3. Clique em **"Connect a repository"**
4. Se for a primeira vez, clique em **"Configure account"** para dar permissão ao Render
5. Selecione o repositório **`desafio-namorados`**
6. Clique em **"Connect"**

### 5.2 Configurar o Web Service

Preencha os campos:

**Basic Settings:**
- **Name:** `desafio-namorados` (será parte da URL)
- **Region:** Mesmo do banco de dados (ex: Oregon)
- **Branch:** `main`
- **Root Directory:** (deixe vazio)
- **Runtime:** **Node**
- **Build Command:** `pnpm install && pnpm build`
- **Start Command:** `pnpm start`

**Advanced Settings (clique em "Advanced"):**

#### Environment Variables (IMPORTANTE!)

Clique em **"Add Environment Variable"** e adicione CADA UMA destas variáveis:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Cole a URL do banco que você copiou no Passo 4.2 |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Crie uma senha aleatória forte (ex: `meu-super-secret-2026-xyz`) |
| `PORT` | `3000` |

**IMPORTANTE:** A `DATABASE_URL` deve ser a URL completa que você copiou do banco de dados MySQL!

### 5.3 Escolher o Plano

- **Instance Type:** **Free** (selecione o plano gratuito)

### 5.4 Deploy!

1. Clique em **"Create Web Service"**
2. O Render vai começar a fazer o build e deploy
3. Aguarde 3-5 minutos (você verá os logs em tempo real)

---

## ✅ Passo 6: Aplicar Migrações do Banco de Dados

Após o deploy inicial, você precisa criar as tabelas no banco de dados.

### 6.1 Acessar o Shell

1. No dashboard do seu Web Service, clique na aba **"Shell"** (no menu lateral)
2. Clique em **"Launch Shell"**
3. Uma janela de terminal vai abrir

### 6.2 Executar migrações

No terminal que abriu, digite:

```bash
pnpm db:push
```

Aguarde a confirmação de que as tabelas foram criadas.

---

## 🎉 Passo 7: Testar o Site

### 7.1 Acessar a URL

1. Volte para a aba **"Overview"** do seu Web Service
2. No topo, você verá a URL do seu site (algo como `https://desafio-namorados.onrender.com`)
3. Clique na URL ou copie e cole no navegador

### 7.2 Testar funcionalidades

- ✅ O site deve carregar
- ✅ As perguntas devem aparecer
- ✅ Você deve conseguir responder nos dois campos (bubu e bby)
- ✅ As respostas devem ser salvas no banco de dados

---

## 📝 Passo 8: Compartilhar com Seu Namorado

1. Copie a URL do site (ex: `https://desafio-namorados.onrender.com`)
2. Envie para ele à meia-noite do Dia dos Namorados! 💕

---

## ⚠️ Limitações do Plano Gratuito

### Sleep Mode
- O site entra em "sleep" após **15 minutos sem acessos**
- Quando alguém acessar novamente, pode demorar **30-50 segundos** para "acordar"
- **Solução:** Não é problema! É só esperar um pouquinho no primeiro acesso

### Banco de Dados
- **750 horas/mês** de banco ativo (suficiente para 1 projeto)
- Após 90 dias de inatividade, o banco pode ser deletado
- **Solução:** Faça backup das respostas antes disso (veja abaixo)

---

## 💾 Como Fazer Backup das Respostas

### Opção 1: Via Dashboard do Render

1. Acesse o banco de dados no Render
2. Clique em **"Connect"** → **"External Connection"**
3. Use um cliente MySQL (como MySQL Workbench) para exportar os dados

### Opção 2: Via Shell

No Shell do Web Service:

```bash
# Exportar todas as respostas
pnpm tsx -e "import { getAllAnswers } from './server/db'; getAllAnswers().then(console.log)"
```

Copie e salve o resultado em um arquivo local.

---

## 🔧 Atualizações Futuras

### Como atualizar o site depois:

1. Faça as mudanças no código localmente
2. Suba as mudanças para o GitHub (commit + push)
3. O Render vai **automaticamente** detectar e fazer o deploy!

---

## 🆘 Solução de Problemas

### Problema: "Build failed"
**Solução:** Verifique os logs de build. Geralmente é falta de variável de ambiente.

### Problema: "Application error"
**Solução:** 
1. Verifique se a `DATABASE_URL` está correta
2. Verifique se você executou `pnpm db:push`

### Problema: "Database connection failed"
**Solução:**
1. Certifique-se que o banco de dados está "Available" (verde)
2. Verifique se a URL do banco está correta nas variáveis de ambiente

### Problema: Site muito lento
**Solução:** É normal no primeiro acesso após o "sleep". Aguarde 30-50 segundos.

---

## 📞 Precisa de Ajuda?

Se tiver qualquer problema:
1. Leia os logs no Render (aba "Logs")
2. Verifique a documentação oficial: https://render.com/docs
3. Me chame de volta! 😊

---

## 🎁 Extras

### Domínio Personalizado (Opcional)

Se quiser um domínio customizado (ex: `nossoamor.com`):
1. Compre um domínio (Namecheap, GoDaddy, etc.)
2. No Render, vá em "Settings" → "Custom Domains"
3. Siga as instruções para conectar

### Monitoramento

O Render mostra:
- ✅ Logs em tempo real
- ✅ Uso de CPU e memória
- ✅ Status do serviço

Acesse a aba "Metrics" para ver gráficos.

---

**Pronto! Seu site está no ar! 🚀💕**

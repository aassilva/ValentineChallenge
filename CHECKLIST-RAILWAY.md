# ✅ Checklist de Deploy - Railway

Use este checklist para garantir um deploy rápido e sem erros no Railway.

---

### 📋 Parte 1: Preparação

- [ ] **Conta no GitHub criada**
- [ ] **Código do projeto no GitHub** (incluindo os arquivos de configuração do Railway)
- [ ] **Conta no Railway criada** (usando "Login with GitHub")
- [ ] (Opcional) Cartão de crédito adicionado para ativar o plano gratuito

---

### 🚀 Parte 2: Deploy no Railway

- [ ] **Novo Projeto criado no Railway**
- [ ] **Repositório do GitHub selecionado** (`desafio-namorados`)
- [ ] **Banco de Dados MySQL adicionado** (+ New -> Database -> MySQL)

---

### 🔑 Parte 3: Configuração

- [ ] **Aba "Variables" da aplicação selecionada**
- [ ] **Variável `NODE_ENV` adicionada** com valor `production`
- [ ] **Variável `JWT_SECRET` adicionada** com uma chave segura gerada
- [ ] **Novo deploy automático concluído com sucesso** (✅ verde)

---

### ⚙️ Parte 4: Finalização

- [ ] **Shell aberto** no último deploy bem-sucedido
- [ ] **Migrações aplicadas** com o comando `pnpm db:push`
- [ ] **Mensagem de sucesso** `[✓] migrations applied successfully!` recebida

---

### ✅ Parte 5: Teste Final

- [ ] **URL da aplicação copiada** da aba "Settings"
- [ ] **Site acessado no navegador**
- [ ] **Página carregada corretamente**
- [ ] **Funcionalidades testadas** (responder perguntas, salvar, etc.)

---

## 🎉 Sucesso!

Se todos os itens estão marcados, sua aplicação está online 24/7 no Railway!

**URL Pública:**
```
_________________________________________________
```

**Comandos Úteis:**
- Para atualizar a aplicação: `git push` no seu repositório.
- Para ver logs: Aba **"Deploy Logs"** no Railway.
- Para executar comandos: Aba **"Deployments"** -> `...` -> **"Open shell"**.

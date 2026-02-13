# Desafio de Namorados - Configuração Railway

Este projeto está configurado para deploy fácil no **Railway.app** com disponibilidade 24/7 e sem sleep mode.

## 🚀 Deploy Rápido

### Opção 1: Deploy com 1 Clique (Mais Rápido)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template)

### Opção 2: Deploy Manual (Recomendado para controle total)

Siga o guia completo em: **GUIA-RAILWAY-SIMPLES.md**

## 📁 Arquivos de Configuração Railway

| Arquivo | Descrição |
|---------|-----------|
| `railway.json` | Configuração principal do Railway |
| `nixpacks.toml` | Configuração do build (Node.js 22 + pnpm) |
| `.env.railway` | Template de variáveis de ambiente |
| `generate-jwt-secret.sh` | Script para gerar JWT_SECRET |

## 🔑 Variáveis de Ambiente Necessárias

Você precisará configurar apenas **2 variáveis** manualmente no Railway:

1. **`JWT_SECRET`** - Gere com:
   ```bash
   ./generate-jwt-secret.sh
   ```

2. **`NODE_ENV`** - Defina como:
   ```
   production
   ```

**Nota:** `DATABASE_URL` e `PORT` são preenchidos automaticamente pelo Railway.

## 💰 Custo Estimado

- **Crédito Gratuito:** $5/mês
- **Consumo Estimado:** $3-5/mês (dentro do gratuito)
- **Sem sleep mode:** Aplicação sempre online

## ✅ Vantagens do Railway

- ✅ Deploy em 10 minutos
- ✅ Sem sleep mode (24/7 online)
- ✅ MySQL incluído (1 clique)
- ✅ Deploy automático do GitHub
- ✅ SSL/HTTPS automático
- ✅ Logs em tempo real
- ✅ Interface moderna e simples

## 📚 Documentação

- **GUIA-RAILWAY-SIMPLES.md** - Guia passo a passo completo (10 minutos)
- **CHECKLIST-RAILWAY.md** - Checklist de verificação

## 🆘 Suporte

Se tiver problemas:
1. Verifique os logs no dashboard do Railway
2. Consulte o guia de troubleshooting no **GUIA-RAILWAY-SIMPLES.md**
3. Acesse a documentação oficial: https://docs.railway.app

#!/bin/bash

# Script de Deploy Automatizado para AWS EC2
# Desafio de Namorados - Valentine's Challenge
# Autor: Manus AI
# Data: 2026-02-13

set -e  # Exit on error

echo "=========================================="
echo "  Deploy: Desafio de Namorados - AWS"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para log
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    log_error "package.json não encontrado. Execute este script no diretório raiz do projeto."
    exit 1
fi

# Verificar se .env existe
if [ ! -f ".env" ]; then
    log_error "Arquivo .env não encontrado. Crie o arquivo .env com as variáveis necessárias."
    exit 1
fi

# Carregar variáveis de ambiente
log_info "Carregando variáveis de ambiente..."
export $(cat .env | grep -v '^#' | xargs)

# Verificar variáveis obrigatórias
if [ -z "$DATABASE_URL" ]; then
    log_error "DATABASE_URL não definida no .env"
    exit 1
fi

# Criar diretório de logs se não existir
log_info "Criando diretório de logs..."
mkdir -p logs

# Instalar dependências
log_info "Instalando dependências..."
pnpm install --prod=false

# Executar build
log_info "Executando build de produção..."
pnpm build

# Aplicar migrações do banco de dados
log_info "Aplicando migrações do banco de dados..."
pnpm db:push

# Parar PM2 se estiver rodando
log_info "Parando processos PM2 existentes..."
pm2 stop desafio-namorados 2>/dev/null || true
pm2 delete desafio-namorados 2>/dev/null || true

# Iniciar aplicação com PM2
log_info "Iniciando aplicação com PM2..."
pm2 start ecosystem.config.cjs

# Salvar configuração PM2
log_info "Salvando configuração PM2..."
pm2 save

# Configurar PM2 para iniciar no boot
log_info "Configurando PM2 para iniciar automaticamente..."
pm2 startup systemd -u $USER --hp $HOME 2>/dev/null || true

# Mostrar status
log_info "Status da aplicação:"
pm2 status

echo ""
echo "=========================================="
echo -e "${GREEN}✓ Deploy concluído com sucesso!${NC}"
echo "=========================================="
echo ""
echo "Comandos úteis:"
echo "  pm2 status          - Ver status da aplicação"
echo "  pm2 logs            - Ver logs em tempo real"
echo "  pm2 restart all     - Reiniciar aplicação"
echo "  pm2 stop all        - Parar aplicação"
echo "  pm2 monit           - Monitorar recursos"
echo ""

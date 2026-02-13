#!/bin/bash

# Script de Health Check
# Desafio de Namorados - Valentine's Challenge
# Verifica se a aplicação está funcionando corretamente
# Autor: Manus AI
# Data: 2026-02-13

set -e

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=========================================="
echo "  Health Check - Desafio de Namorados"
echo "=========================================="
echo ""

# Função para verificar status
check_status() {
    local service=$1
    local status=$2
    
    if [ $status -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $service: OK"
        return 0
    else
        echo -e "${RED}✗${NC} $service: FALHOU"
        return 1
    fi
}

ERRORS=0

# 1. Verificar se PM2 está rodando
echo "1. Verificando PM2..."
pm2 status | grep -q "desafio-namorados" && pm2 status | grep -q "online"
check_status "PM2 Process" $? || ((ERRORS++))

# 2. Verificar se a aplicação responde na porta 3000
echo "2. Verificando aplicação (porta 3000)..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"
check_status "Aplicação HTTP" $? || ((ERRORS++))

# 3. Verificar Nginx
echo "3. Verificando Nginx..."
systemctl is-active --quiet nginx
check_status "Nginx" $? || ((ERRORS++))

# 4. Verificar conexão com banco de dados
echo "4. Verificando conexão com banco de dados..."
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
    
    # Extrair host do DATABASE_URL
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    
    timeout 5 bash -c "cat < /dev/null > /dev/tcp/$DB_HOST/$DB_PORT" 2>/dev/null
    check_status "Conexão RDS MySQL" $? || ((ERRORS++))
else
    echo -e "${YELLOW}⚠${NC} Arquivo .env não encontrado - pulando verificação de DB"
fi

# 5. Verificar uso de memória
echo "5. Verificando uso de recursos..."
MEMORY_USAGE=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
if [ $MEMORY_USAGE -lt 90 ]; then
    echo -e "${GREEN}✓${NC} Memória: ${MEMORY_USAGE}% usado"
else
    echo -e "${RED}✗${NC} Memória: ${MEMORY_USAGE}% usado (ALTO!)"
    ((ERRORS++))
fi

# 6. Verificar espaço em disco
DISK_USAGE=$(df -h / | tail -1 | awk '{print int($5)}')
if [ $DISK_USAGE -lt 90 ]; then
    echo -e "${GREEN}✓${NC} Disco: ${DISK_USAGE}% usado"
else
    echo -e "${RED}✗${NC} Disco: ${DISK_USAGE}% usado (ALTO!)"
    ((ERRORS++))
fi

echo ""
echo "=========================================="

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Sistema saudável - Todos os checks passaram!${NC}"
    exit 0
else
    echo -e "${RED}✗ Sistema com problemas - $ERRORS check(s) falharam${NC}"
    echo ""
    echo "Comandos úteis para diagnóstico:"
    echo "  pm2 logs              # Ver logs da aplicação"
    echo "  sudo systemctl status nginx  # Status do Nginx"
    echo "  df -h                 # Espaço em disco"
    echo "  free -h               # Uso de memória"
    exit 1
fi

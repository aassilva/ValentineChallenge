#!/bin/bash

# Script de Backup do Banco de Dados
# Desafio de Namorados - Valentine's Challenge
# Autor: Manus AI
# Data: 2026-02-13

set -e

echo "=========================================="
echo "  Backup do Banco de Dados"
echo "=========================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Carregar variáveis de ambiente
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${RED}[ERROR]${NC} Arquivo .env não encontrado"
    exit 1
fi

# Extrair informações da DATABASE_URL
# Formato: mysql://user:pass@host:port/database
DB_URL=$DATABASE_URL
DB_USER=$(echo $DB_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DB_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DB_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DB_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DB_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

# Criar diretório de backups
BACKUP_DIR="backups"
mkdir -p $BACKUP_DIR

# Nome do arquivo de backup com timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_${DB_NAME}_${TIMESTAMP}.sql"

echo -e "${GREEN}[INFO]${NC} Iniciando backup do banco de dados..."
echo "  Database: $DB_NAME"
echo "  Host: $DB_HOST"
echo "  Arquivo: $BACKUP_FILE"
echo ""

# Executar backup com mysqldump
mysqldump \
    -h $DB_HOST \
    -P $DB_PORT \
    -u $DB_USER \
    -p$DB_PASS \
    --single-transaction \
    --routines \
    --triggers \
    --databases $DB_NAME \
    > $BACKUP_FILE

# Comprimir backup
gzip $BACKUP_FILE
BACKUP_FILE="${BACKUP_FILE}.gz"

# Verificar tamanho do backup
BACKUP_SIZE=$(du -h $BACKUP_FILE | cut -f1)

echo ""
echo -e "${GREEN}✓ Backup concluído com sucesso!${NC}"
echo "  Arquivo: $BACKUP_FILE"
echo "  Tamanho: $BACKUP_SIZE"
echo ""

# Manter apenas os últimos 7 backups
echo "Limpando backups antigos (mantendo últimos 7)..."
cd $BACKUP_DIR
ls -t backup_*.sql.gz | tail -n +8 | xargs -r rm --
cd ..

echo -e "${GREEN}✓ Limpeza concluída${NC}"
echo ""
echo "Backups disponíveis:"
ls -lh $BACKUP_DIR/backup_*.sql.gz 2>/dev/null || echo "  Nenhum backup encontrado"
echo ""

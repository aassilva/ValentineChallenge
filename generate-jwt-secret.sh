#!/bin/bash

# Script para gerar JWT_SECRET seguro
# Execute: ./generate-jwt-secret.sh

echo "=========================================="
echo "  Gerador de JWT_SECRET"
echo "=========================================="
echo ""

# Gerar chave aleatória de 32 bytes em base64
JWT_SECRET=$(openssl rand -base64 32)

echo "Sua JWT_SECRET gerada:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$JWT_SECRET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Copie esta chave e use como valor da variável JWT_SECRET no Railway."
echo ""

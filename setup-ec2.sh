#!/bin/bash

# Script de Setup Inicial para EC2
# Desafio de Namorados - Valentine's Challenge
# Este script instala todas as dependências necessárias na instância EC2
# Autor: Manus AI
# Data: 2026-02-13

set -e  # Exit on error

echo "=========================================="
echo "  Setup EC2 - Desafio de Namorados"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Verificar se está rodando como root ou com sudo
if [ "$EUID" -ne 0 ]; then 
    log_error "Por favor, execute este script com sudo"
    exit 1
fi

# Atualizar sistema
log_step "1/8 - Atualizando sistema..."
apt-get update -qq
apt-get upgrade -y -qq

# Instalar dependências básicas
log_step "2/8 - Instalando dependências básicas..."
apt-get install -y -qq \
    curl \
    wget \
    git \
    build-essential \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

# Instalar Node.js 22.x
log_step "3/8 - Instalando Node.js 22.x..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y -qq nodejs

# Verificar instalação do Node.js
NODE_VERSION=$(node --version)
log_info "Node.js instalado: $NODE_VERSION"

# Instalar pnpm
log_step "4/8 - Instalando pnpm..."
npm install -g pnpm@latest
PNPM_VERSION=$(pnpm --version)
log_info "pnpm instalado: $PNPM_VERSION"

# Instalar PM2 (Process Manager)
log_step "5/8 - Instalando PM2..."
npm install -g pm2@latest
PM2_VERSION=$(pm2 --version)
log_info "PM2 instalado: $PM2_VERSION"

# Instalar Nginx
log_step "6/8 - Instalando Nginx..."
apt-get install -y -qq nginx

# Iniciar e habilitar Nginx
systemctl start nginx
systemctl enable nginx
log_info "Nginx instalado e iniciado"

# Instalar Certbot (para SSL/HTTPS)
log_step "7/8 - Instalando Certbot (Let's Encrypt)..."
apt-get install -y -qq certbot python3-certbot-nginx
log_info "Certbot instalado"

# Configurar firewall (UFW)
log_step "8/8 - Configurando firewall..."
ufw --force enable
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw status
log_info "Firewall configurado"

# Criar usuário para a aplicação (se não existir)
if ! id "nodeapp" &>/dev/null; then
    log_info "Criando usuário 'nodeapp'..."
    useradd -m -s /bin/bash nodeapp
    usermod -aG sudo nodeapp
fi

# Criar diretório para aplicação
log_info "Criando diretório da aplicação..."
mkdir -p /var/www/desafio-namorados
chown -R nodeapp:nodeapp /var/www/desafio-namorados

echo ""
echo "=========================================="
echo -e "${GREEN}✓ Setup concluído com sucesso!${NC}"
echo "=========================================="
echo ""
echo "Versões instaladas:"
echo "  Node.js: $NODE_VERSION"
echo "  pnpm: $PNPM_VERSION"
echo "  PM2: $PM2_VERSION"
echo "  Nginx: $(nginx -v 2>&1 | cut -d'/' -f2)"
echo ""
echo "Próximos passos:"
echo "  1. Clone o repositório em /var/www/desafio-namorados"
echo "  2. Configure o arquivo .env com as credenciais do RDS"
echo "  3. Configure o Nginx (copie nginx.conf)"
echo "  4. Execute o script de deploy: ./deploy-aws.sh"
echo "  5. Configure SSL com: sudo certbot --nginx -d seu-dominio.com"
echo ""

# Desafio de Namorados - Configuração AWS

Este documento contém informações rápidas sobre os arquivos de configuração AWS criados para este projeto.

## 📁 Arquivos Criados para AWS

### 1. `ecosystem.config.cjs`
Configuração do PM2 (Process Manager) para gerenciar a aplicação Node.js em produção.

**Recursos:**
- Modo cluster para melhor performance
- Reinício automático em caso de falha
- Logs organizados
- Limite de memória configurado

### 2. `deploy-aws.sh`
Script automatizado de deploy que:
- Instala dependências
- Faz build da aplicação
- Aplica migrações do banco de dados
- Inicia/reinicia a aplicação com PM2

**Uso:**
```bash
./deploy-aws.sh
```

### 3. `setup-ec2.sh`
Script de configuração inicial da instância EC2 que instala:
- Node.js 22.x
- pnpm
- PM2
- Nginx
- Certbot (para SSL)
- Configurações de firewall

**Uso (na EC2 como root):**
```bash
sudo ./setup-ec2.sh
```

### 4. `nginx.conf`
Configuração do Nginx como reverse proxy para a aplicação Node.js.

**Recursos:**
- Proxy para porta 3000
- Compressão Gzip
- Cache de assets estáticos
- Preparado para SSL/HTTPS

### 5. `.env.example`
Template do arquivo de variáveis de ambiente com todos os valores necessários para AWS.

**Uso:**
```bash
cp .env.example .env
# Edite .env com seus valores reais
```

## 🏗️ Arquitetura AWS Recomendada

```
Internet
    ↓
Route 53 (DNS)
    ↓
EC2 Instance (t2.micro/t3.micro)
    ├── Nginx (porta 80/443)
    └── Node.js + PM2 (porta 3000)
         ↓
    RDS MySQL (db.t3.micro)
```

## 🚀 Quick Start

1. **Configure a instância EC2**
   ```bash
   sudo ./setup-ec2.sh
   ```

2. **Clone o repositório**
   ```bash
   git clone seu-repositorio.git /var/www/desafio-namorados
   cd /var/www/desafio-namorados
   ```

3. **Configure variáveis de ambiente**
   ```bash
   cp .env.example .env
   nano .env  # Edite com suas credenciais
   ```

4. **Execute o deploy**
   ```bash
   ./deploy-aws.sh
   ```

5. **Configure o Nginx**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/desafio-namorados
   sudo ln -s /etc/nginx/sites-available/desafio-namorados /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Configure SSL (opcional mas recomendado)**
   ```bash
   sudo certbot --nginx -d seu-dominio.com
   ```

## 📊 Custos Estimados AWS (Free Tier)

| Serviço | Especificação | Custo/mês |
|---------|---------------|-----------|
| EC2 t2.micro | 750 horas/mês (Free Tier) | $0 (primeiro ano) |
| RDS db.t3.micro | 750 horas/mês (Free Tier) | $0 (primeiro ano) |
| Elastic IP | 1 IP associado | $0 |
| **Total** | | **$0** (primeiro ano) |

Após o Free Tier:
- EC2 t2.micro: ~$8-10/mês
- RDS db.t3.micro: ~$15-20/mês
- **Total: ~$25-30/mês**

## 🔧 Comandos Úteis

### PM2
```bash
pm2 status              # Ver status
pm2 logs                # Ver logs em tempo real
pm2 restart all         # Reiniciar
pm2 stop all            # Parar
pm2 monit               # Monitor de recursos
```

### Nginx
```bash
sudo systemctl status nginx    # Status
sudo systemctl restart nginx   # Reiniciar
sudo nginx -t                  # Testar configuração
sudo tail -f /var/log/nginx/error.log  # Ver logs
```

### Banco de Dados
```bash
# Conectar ao RDS MySQL
mysql -h seu-endpoint.rds.amazonaws.com -u admin -p valentines
```

## 📚 Documentação Completa

Para o guia passo a passo completo, consulte: **GUIA-DEPLOY-AWS.md**

# Guia Completo: Deploy na AWS (EC2 + RDS)

**Autor:** Manus AI  
**Data:** 13 de fevereiro de 2026  
**Versão:** 1.0

---

## Sumário Executivo

Este documento fornece um guia passo a passo detalhado para fazer o deploy da aplicação **Desafio de Namorados** na Amazon Web Services (AWS). A arquitetura proposta garante alta disponibilidade, escalabilidade e segurança, utilizando serviços padrão da indústria como **EC2** para computação, **RDS** para banco de dados gerenciado e **Nginx** como reverse proxy.

O objetivo é configurar um ambiente de produção robusto que possa operar 24/7 sem as limitações de plataformas gratuitas, como o *sleep mode*. O guia cobre desde a configuração da infraestrutura na AWS até o deploy final da aplicação, incluindo scripts de automação para facilitar o processo.

**Arquitetura Alvo:**

- **Computação:** Instância Amazon EC2 (t2.micro ou t3.micro)
- **Banco de Dados:** Amazon RDS para MySQL (db.t3.micro)
- **Rede:** VPC padrão com Security Groups
- **DNS:** Amazon Route 53 (opcional, para domínio customizado)
- **Web Server:** Nginx como reverse proxy
- **Process Manager:** PM2 para gerenciar a aplicação Node.js

**Pré-requisitos:**
- Conta na AWS com acesso de administrador
- Código do projeto em um repositório Git (GitHub, GitLab, etc.)
- Um domínio registrado (opcional, para HTTPS)

---

## 1. Visão Geral da Arquitetura AWS

A arquitetura recomendada para este projeto busca um equilíbrio entre custo, performance e facilidade de gerenciamento.

```mermaid
graph TD
    subgraph Internet
        User[👩‍❤️‍👨 Usuário]
    end

    subgraph AWS Cloud
        subgraph "Public Subnet"
            EC2[🚀 Instância EC2<br>Ubuntu 22.04]
        end

        subgraph "Private Subnet"
            RDS[🗄️ RDS MySQL<br>db.t3.micro]
        end

        User -- HTTPS (443) --> EC2
        EC2 -- MySQL (3306) --> RDS

        EC2 -- Contém --> Nginx[🌐 Nginx<br>Porta 80/443]
        EC2 -- Contém --> NodeApp[💻 Node.js App<br>PM2 - Porta 3000]
        Nginx -- Proxy --> NodeApp
    end

    style RDS fill:#FFD8B1,stroke:#333,stroke-width:2px
    style EC2 fill:#C2E0FF,stroke:#333,stroke-width:2px
```

**Componentes:**

1.  **Amazon EC2 (Elastic Compute Cloud):** Um servidor virtual onde a aplicação Node.js e o Nginx serão executados. Usaremos uma instância do tipo `t2.micro` ou `t3.micro`, que são elegíveis para o AWS Free Tier.
2.  **Amazon RDS (Relational Database Service):** Um serviço de banco de dados gerenciado. Ele automatiza tarefas como provisionamento, patching e backups. Usaremos MySQL para manter a compatibilidade com o projeto.
3.  **Nginx:** Um web server de alta performance que atuará como *reverse proxy*. Ele receberá as requisições da internet (portas 80/443) e as encaminhará para a aplicação Node.js (porta 3000).
4.  **PM2:** Um gerenciador de processos para Node.js que manterá a aplicação rodando 24/7, reiniciando-a em caso de falhas e facilitando o gerenciamento de logs.
5.  **Security Groups:** Atuam como um firewall virtual, controlando o tráfego de entrada e saída para a EC2 e o RDS.

---

## 2. Estimativa de Custos (AWS Free Tier)

A AWS oferece um **Plano Gratuito (Free Tier)** por 12 meses para novas contas, que cobre os recursos necessários para este projeto.

| Serviço | Especificação | Limite Gratuito (Mensal) | Custo Estimado (1º Ano) |
|---|---|---|---|
| **Amazon EC2** | `t2.micro` | 750 horas | **$0** |
| **Amazon RDS** | `db.t3.micro` (Single-AZ) | 750 horas | **$0** |
| **Amazon EBS** | Armazenamento SSD | 30 GB | **$0** |
| **Transferência de Dados** | Saída para Internet | 100 GB | **$0** |
| **Elastic IP** | 1 IP associado a uma instância | Gratuito | **$0** |
| **Total** | | | **~$0** |

**Após o primeiro ano, os custos estimados são:**

- **EC2 `t2.micro`:** ~$8.50/mês
- **RDS `db.t3.micro`:** ~$17.00/mês
- **Total Estimado:** **~$25.50/mês**

> **Nota:** Preços são estimativas e podem variar. Consulte a [Calculadora de Preços da AWS](https://calculator.aws/) para valores atualizados.

---

## 3. Passo a Passo: Configuração da Infraestrutura

### Parte 1: Configurando o Banco de Dados (RDS MySQL)

#### 1.1. Criar um Security Group para o RDS

Primeiro, criaremos um firewall que permite que apenas nossa instância EC2 acesse o banco de dados.

1.  Acesse o **Console da AWS** e navegue para **VPC** > **Security Groups**.
2.  Clique em **"Create security group"**.
3.  **Basic details:**
    -   **Security group name:** `rds-mysql-sg`
    -   **Description:** `Allow EC2 to access RDS MySQL`
    -   **VPC:** Deixe a VPC padrão selecionada.
4.  **Inbound rules:**
    -   Clique em **"Add rule"**.
    -   **Type:** `MYSQL/Aurora` (porta 3306).
    -   **Source:** Selecione `Custom` e digite o nome do Security Group que criaremos para a EC2 (ex: `ec2-web-sg`). O autocompletar ajudará a encontrar.
5.  Clique em **"Create security group"**.

#### 1.2. Criar a Instância RDS MySQL

1.  Navegue para o serviço **RDS** no console da AWS.
2.  Clique em **"Create database"**.
3.  **Choose a database creation method:** Selecione **"Standard create"**.
4.  **Engine options:**
    -   **Engine type:** `MySQL`
    -   **Version:** `MySQL 8.0.x`
5.  **Templates:**
    -   Selecione **"Free tier"**. Isso ajustará as configurações para se qualificarem para o plano gratuito.
6.  **Settings:**
    -   **DB instance identifier:** `desafio-namorados-db`
    -   **Master username:** `admin`
    -   **Master password:** Crie uma senha forte e **anote-a em um local seguro**.
7.  **Instance configuration:**
    -   **DB instance class:** `db.t3.micro` (ou `db.t2.micro` se `t3` não estiver no Free Tier da sua região).
8.  **Storage:**
    -   Deixe os padrões (20 GB de General Purpose SSD).
9.  **Connectivity:**
    -   **Virtual private cloud (VPC):** Deixe a VPC padrão.
    -   **Public access:** Selecione **"No"**. O banco de dados não deve ser acessível publicamente.
    -   **VPC security group:**
        -   Escolha **"Choose existing"**.
        -   Remova o `default` e adicione o `rds-mysql-sg` que você criou.
10. **Database authentication:**
    -   Selecione **"Password authentication"**.
11. Clique em **"Create database"**.

> A criação do banco de dados pode levar de 5 a 10 minutos. Enquanto isso, podemos configurar a instância EC2.

#### 1.3. Obter o Endpoint do Banco de Dados

1.  Após a criação, vá para a página do seu banco de dados no console RDS.
2.  Na aba **"Connectivity & security"**, copie o valor do **Endpoint**. Ele será algo como `desafio-namorados-db.xxxxx.us-east-1.rds.amazonaws.com`.
3.  **Guarde este endpoint!** Ele será usado na `DATABASE_URL`.

### Parte 2: Configurando o Servidor (EC2)

#### 2.1. Criar um Par de Chaves (Key Pair)

O par de chaves é necessário para conectar-se à sua instância EC2 via SSH.

1.  Navegue para **EC2** > **Key Pairs**.
2.  Clique em **"Create key pair"**.
3.  **Name:** `aws-ec2-key`
4.  **Key pair type:** `RSA`
5.  **Private key file format:** ` .pem` (para OpenSSH no Mac/Linux) ou `.ppk` (para PuTTY no Windows).
6.  Clique em **"Create key pair"**. O arquivo `.pem` será baixado.
7.  **Guarde este arquivo em um local seguro!** Você não poderá baixá-lo novamente.
8.  Mova o arquivo para `~/.ssh/` e ajuste suas permissões:
    ```bash
    # No seu computador local
    mv ~/Downloads/aws-ec2-key.pem ~/.ssh/
    chmod 400 ~/.ssh/aws-ec2-key.pem
    ```

#### 2.2. Criar um Security Group para a EC2

1.  Navegue para **EC2** > **Security Groups**.
2.  Clique em **"Create security group"**.
3.  **Basic details:**
    -   **Security group name:** `ec2-web-sg`
    -   **Description:** `Allow web traffic (HTTP, HTTPS, SSH)`
4.  **Inbound rules:**
    -   Adicione as seguintes regras:
        | Type | Protocol | Port range | Source | Description |
        |---|---|---|---|---|
        | `SSH` | TCP | 22 | `My IP` | Acesso SSH do seu IP |
        | `HTTP` | TCP | 80 | `Anywhere-IPv4` | Acesso web |
        | `HTTPS` | TCP | 443 | `Anywhere-IPv4` | Acesso web seguro |
5.  Clique em **"Create security group"**.

#### 2.3. Lançar a Instância EC2

1.  Navegue para **EC2** > **Instances**.
2.  Clique em **"Launch instances"**.
3.  **Name:** `desafio-namorados-server`
4.  **Application and OS Images (AMI):**
    -   Selecione **"Ubuntu"**.
    -   Escolha a versão **Ubuntu Server 22.04 LTS** (elegível para o Free Tier).
5.  **Instance type:**
    -   Selecione `t2.micro` (elegível para o Free Tier).
6.  **Key pair (login):**
    -   Selecione o par de chaves `aws-ec2-key` que você criou.
7.  **Network settings:**
    -   Clique em **"Edit"**.
    -   **VPC:** Deixe a VPC padrão.
    -   **Firewall (security groups):**
        -   Selecione **"Select existing security group"**.
        -   Escolha o `ec2-web-sg`.
8.  **Configure storage:**
    -   Deixe o padrão (8 GB ou 30 GB, dependendo da sua conta).
9.  Clique em **"Launch instance"**.

#### 2.4. Associar um Elastic IP

Por padrão, o IP público da EC2 muda a cada reinicialização. Um Elastic IP é um IP estático que não muda.

1.  Navegue para **EC2** > **Elastic IPs**.
2.  Clique em **"Allocate Elastic IP address"** e depois em **"Allocate"**.
3.  Selecione o IP recém-criado, clique em **"Actions"** > **"Associate Elastic IP address"**.
4.  **Resource type:** `Instance`
5.  **Instance:** Selecione a sua instância `desafio-namorados-server`.
6.  Clique em **"Associate"**.
7.  **Anote este IP!** Ele será o IP público do seu servidor.

### Parte 3: Configurando o Servidor e Fazendo o Deploy

#### 3.1. Conectar à Instância EC2 via SSH

1.  Abra um terminal no seu computador local.
2.  Use o seguinte comando, substituindo `SEU_ELASTIC_IP` e o caminho para sua chave `.pem`:
    ```bash
    ssh -i "~/.ssh/aws-ec2-key.pem" ubuntu@SEU_ELASTIC_IP
    ```
3.  Digite `yes` para aceitar a chave do host.
4.  Você agora está conectado ao seu servidor EC2!

#### 3.2. Executar o Script de Setup Inicial

Este script instalará todas as dependências necessárias (Node.js, Nginx, PM2, etc.).

1.  Primeiro, crie o arquivo no servidor:
    ```bash
    # No servidor EC2
    nano setup-ec2.sh
    ```
2.  Copie o conteúdo do arquivo `setup-ec2.sh` do seu projeto e cole no editor `nano`.
3.  Salve e saia (`Ctrl+X`, `Y`, `Enter`).
4.  Torne o script executável e execute-o com `sudo`:
    ```bash
    chmod +x setup-ec2.sh
    sudo ./setup-ec2.sh
    ```
5.  O script levará alguns minutos para ser concluído.

#### 3.3. Clonar o Repositório e Configurar

1.  Clone o seu projeto do GitHub:
    ```bash
    # No servidor EC2
    git clone https://github.com/SEU-USUARIO/desafio-namorados.git /var/www/desafio-namorados
    cd /var/www/desafio-namorados
    ```

2.  Crie e configure o arquivo `.env`:
    ```bash
    # No diretório /var/www/desafio-namorados
    cp .env.example .env
    nano .env
    ```

3.  Edite o arquivo `.env` com os seus valores reais:
    -   **`DATABASE_URL`**: Use o endpoint do RDS que você copiou. O formato é `mysql://admin:SUA_SENHA@seu-endpoint.rds.amazonaws.com:3306/valentines`.
    -   **`JWT_SECRET`**: Gere uma chave segura com `openssl rand -base64 32`.

#### 3.4. Executar o Script de Deploy

O script `deploy-aws.sh` automatiza a instalação de dependências, build, migrações e inicialização com PM2.

```bash
# No diretório /var/www/desafio-namorados
./deploy-aws.sh
```

Ao final, você verá o status da aplicação no PM2 como `online`.

### Parte 4: Configurando o Nginx e Domínio (SSL)

#### 4.1. Configurar o Nginx como Reverse Proxy

1.  Copie o arquivo de configuração do Nginx para o diretório correto:
    ```bash
    # No servidor EC2
    sudo cp /var/www/desafio-namorados/nginx.conf /etc/nginx/sites-available/desafio-namorados
    ```

2.  Edite o arquivo e substitua `seu-dominio.com` pelo seu Elastic IP (ou seu domínio, se tiver um):
    ```bash
    sudo nano /etc/nginx/sites-available/desafio-namorados
    # Altere a linha: server_name seu-dominio.com www.seu-dominio.com;
    # Para: server_name SEU_ELASTIC_IP;
    ```

3.  Crie um link simbólico para habilitar o site:
    ```bash
    sudo ln -s /etc/nginx/sites-available/desafio-namorados /etc/nginx/sites-enabled/
    ```

4.  Remova o site padrão do Nginx:
    ```bash
    sudo rm /etc/nginx/sites-enabled/default
    ```

5.  Teste a configuração do Nginx e reinicie o serviço:
    ```bash
    sudo nginx -t
    # Deve retornar: ... configuration file /etc/nginx/nginx.conf test is successful
    
    sudo systemctl restart nginx
    ```

6.  **Teste!** Acesse `http://SEU_ELASTIC_IP` no seu navegador. A aplicação deve carregar!

#### 4.2. (Opcional) Configurar Domínio e SSL com Certbot

Se você tem um domínio, aponte um registro do tipo `A` para o seu Elastic IP no seu provedor de DNS.

1.  Edite novamente a configuração do Nginx para usar seu domínio:
    ```bash
    sudo nano /etc/nginx/sites-available/desafio-namorados
    # Altere a linha: server_name SEU_ELASTIC_IP;
    # Para: server_name seu-dominio.com www.seu-dominio.com;
    ```

2.  Reinicie o Nginx:
    ```bash
    sudo systemctl restart nginx
    ```

3.  Execute o Certbot para obter um certificado SSL gratuito:
    ```bash
    sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
    ```

4.  Siga as instruções na tela. O Certbot irá:
    -   Gerar o certificado SSL.
    -   Modificar sua configuração do Nginx para usar HTTPS.
    -   Configurar o redirecionamento de HTTP para HTTPS.

5.  **Teste Final!** Acesse `https://seu-dominio.com`. O site deve carregar com um cadeado de segurança.

---

## 4. Manutenção e Gerenciamento

### Atualizando a Aplicação

Para atualizar a aplicação com novas mudanças do seu repositório Git:

1.  Conecte-se à sua instância EC2 via SSH.
2.  Navegue até o diretório do projeto:
    ```bash
    cd /var/www/desafio-namorados
    ```
3.  Puxe as últimas alterações:
    ```bash
    git pull origin main
    ```
4.  Execute o script de deploy novamente. Ele cuidará de tudo (build, migrações, reinicialização):
    ```bash
    ./deploy-aws.sh
    ```

### Gerenciando a Aplicação com PM2

| Comando | Descrição |
|---|---|
| `pm2 status` | Mostra o status de todos os processos. |
| `pm2 logs` | Exibe os logs da aplicação em tempo real. |
| `pm2 logs --lines 50` | Mostra as últimas 50 linhas de log. |
| `pm2 restart desafio-namorados` | Reinicia a aplicação. |
| `pm2 stop desafio-namorados` | Para a aplicação. |
| `pm2 monit` | Abre um painel de monitoramento de recursos. |

### Fazendo Backup do Banco de Dados

O script `backup-db.sh` cria um backup compactado do seu banco de dados RDS.

1.  Conecte-se à EC2 e navegue até o diretório do projeto.
2.  Execute o script:
    ```bash
    ./backup-db.sh
    ```
3.  Os backups são salvos no diretório `backups/` e os 7 mais recentes são mantidos.

**Para automatizar backups, adicione uma entrada no Crontab:**

```bash
# Abrir o editor do cron
crontab -e

# Adicionar esta linha para rodar o backup todo dia às 3h da manhã
0 3 * * * /bin/bash /var/www/desafio-namorados/backup-db.sh > /var/www/desafio-namorados/logs/cron.log 2>&1
```

### Monitorando a Saúde do Sistema

O script `health-check.sh` verifica o status do PM2, Nginx, conexão com o banco e uso de recursos.

```bash
# Execute a qualquer momento para verificar a saúde do sistema
./health-check.sh
```

---

## 5. Solução de Problemas (Troubleshooting)

**Problema: O site não carrega (Timeout)**

1.  **Security Groups:** Verifique se as portas 80 e 443 estão abertas para `Anywhere` no `ec2-web-sg`.
2.  **Nginx:** Verifique o status com `sudo systemctl status nginx`. Se houver erro, verifique os logs com `sudo journalctl -u nginx`.
3.  **PM2:** Verifique se a aplicação está `online` com `pm2 status`. Se não, verifique os logs com `pm2 logs`.

**Problema: Erro 502 Bad Gateway**

Isso geralmente significa que o Nginx não consegue se comunicar com a aplicação Node.js.

1.  **PM2:** Verifique se a aplicação está rodando na porta 3000.
2.  **Firewall da EC2:** Verifique se o firewall (`ufw`) não está bloqueando a porta 3000 para conexões locais.
3.  **Logs do Nginx:** Verifique `/var/log/nginx/error.log` para mais detalhes.

**Problema: Erro de Conexão com o Banco de Dados**

1.  **Security Groups:** Certifique-se de que o `rds-mysql-sg` permite tráfego na porta 3306 vindo do `ec2-web-sg`.
2.  **`.env`:** Verifique se a `DATABASE_URL` está 100% correta (endpoint, usuário, senha, nome do banco).
3.  **Conectividade:** Na EC2, tente conectar manualmente ao RDS:
    ```bash
    # Instale o cliente mysql se necessário: sudo apt install mysql-client
    mysql -h SEU_ENDPOINT_RDS -u admin -p
    ```

**Problema: `pnpm` ou `pm2` não encontrado**

-   Certifique-se de que o script `setup-ec2.sh` foi executado corretamente.
-   Tente recarregar seu shell com `source ~/.bashrc` ou reconecte-se via SSH.

---

## Conclusão

Parabéns! Seguindo este guia, você configurou um ambiente de produção robusto e escalável na AWS para a sua aplicação. Você agora tem controle total sobre sua infraestrutura, com a capacidade de monitorar, gerenciar e escalar seu projeto conforme necessário.

Lembre-se de revisar periodicamente os custos na AWS, manter suas dependências atualizadas e fazer backups regulares do seu banco de dados.

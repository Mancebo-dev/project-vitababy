# Guia de Hospedagem na HostGator (VPS)

Para hospedar o sistema Vita Baby (que utiliza Next.js, Node.js e PostgreSQL) na HostGator, o plano ideal é um **Servidor VPS (Linux - Ubuntu 22.04)**. Planos de hospedagem compartilhada (cPanel) não são recomendados para aplicações Next.js/Node.js, pois geralmente não oferecem o nível de acesso e suporte a processos contínuos que a aplicação exige.

## Passos para o Deploy

### 1. Preparação do Servidor (Acesso SSH)

Acesse seu servidor HostGator via SSH:
```bash
ssh root@SEU_IP_DO_VPS
```

Atualize os pacotes do servidor:
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalação de Dependências

Instale o Node.js (versão LTS recomendada, 20.x):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Instale o gerenciador de processos PM2 globalmente:
```bash
sudo npm install -g pm2
```

Instale o PostgreSQL:
```bash
sudo apt install -y postgresql postgresql-contrib
```

### 3. Configuração do Banco de Dados

Acesse o PostgreSQL:
```bash
sudo -u postgres psql
```

Crie o banco de dados e usuário:
```sql
CREATE DATABASE vitababy_db;
CREATE USER vitababy_user WITH PASSWORD 'sua_senha_forte';
ALTER ROLE vitababy_user SET client_encoding TO 'utf8';
ALTER ROLE vitababy_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE vitababy_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE vitababy_db TO vitababy_user;
\q
```

### 4. Clonar e Configurar o Projeto

Clone seu repositório:
```bash
git clone URL_DO_SEU_REPOSITORIO /var/www/vitababy
cd /var/www/vitababy
```

Instale as dependências:
```bash
npm install
```

Crie o arquivo `.env` baseado no `.env.example` e atualize a variável `DATABASE_URL`:
```env
DATABASE_URL="postgresql://vitababy_user:sua_senha_forte@localhost:5432/vitababy_db?schema=public"
NEXT_PUBLIC_APP_URL="https://seusite.com.br"
# Adicione suas outras chaves (Resend, etc.)
```

Gere o Prisma e faça o push do banco de dados:
```bash
npx prisma generate
npx prisma db push
```

Faça a build da aplicação Next.js:
```bash
npm run build
```

### 5. Iniciar a Aplicação com PM2

Inicie o aplicativo usando o arquivo `ecosystem.config.js` que já foi configurado:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. Configurar o Nginx (Proxy Reverso)

Instale o Nginx:
```bash
sudo apt install -y nginx
```

Crie um arquivo de configuração para o seu domínio:
```bash
sudo nano /etc/nginx/sites-available/vitababy
```

Adicione o seguinte conteúdo (altere `seusite.com.br` para o seu domínio):
```nginx
server {
    listen 80;
    server_name seusite.com.br www.seusite.com.br;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ative o site e reinicie o Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/vitababy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Certificado SSL (HTTPS)

Instale o Certbot para obter um certificado gratuito do Let's Encrypt:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seusite.com.br -d www.seusite.com.br
```

O Certbot irá configurar o HTTPS automaticamente no seu Nginx.

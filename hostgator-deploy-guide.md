# Guia de Hospedagem na HostGator (VPS com aaPanel)

Para hospedar o sistema Vita Baby (Next.js + PostgreSQL + E-mail) de forma econômica, utilizamos um **Servidor VPS com Ubuntu 22.04 LTS** gerenciado através do **aaPanel** (uma alternativa gratuita ao cPanel).

## 1. Instalação do aaPanel (Acesso Root)

Acesse o servidor via SSH:
```bash
ssh root@SEU_IP_DO_VPS
```

Execute o script oficial de instalação do aaPanel:
```bash
wget -O install.sh http://www.aapanel.com/script/install-ubuntu_6.0_en.sh && sudo bash install.sh aapanel
```
Anote as credenciais de acesso ao painel (URL, Username, Password) que aparecerão no final do script.

## 2. Configuração do aaPanel

Acesse a URL do aaPanel pelo navegador. O painel solicitará a instalação do pacote padrão de servidor (LNMP). Escolha:
- **Nginx** (Recomendado)
- **PostgreSQL** (Em App Store > PostgreSQL)
- **PM2 Manager** (Para Node.js)
- **Mail Server** (Para os E-mails)
- **Redis** (Opcional, se houver necessidades de cache no futuro)

## 3. Configurando o Servidor de E-mail

1. Acesse a aba **App Store** e certifique-se de que o **Mail Server** está instalado.
2. Na aba **Mail Server**, adicione o domínio `vitababy.com.br`.
3. O painel fornecerá os registros DNS necessários (MX, TXT para DKIM e SPF). Você precisará configurar esses registros no Registro.br ou Cloudflare.
4. Crie as contas de e-mail (ex: `contato@vitababy.com.br`).
5. Anote as credenciais SMTP para colocar no arquivo `.env` da aplicação.

## 4. Configurando o Banco de Dados (PostgreSQL)

1. No aaPanel, vá em **Databases > PostgreSQL**.
2. Clique em **Add database**.
3. Nome: `vitababy_db`, Usuário: `vitababy`, e gere uma senha segura.
4. O aaPanel já criará o banco e o usuário com as permissões corretas.
5. Monte a URL de conexão: `postgresql://vitababy:SENHA@127.0.0.1:5432/vitababy_db?schema=public`

## 5. Fazendo o Deploy da Aplicação Node (Next.js)

1. Vá em **Files** no aaPanel e navegue até `/www/wwwroot/`.
2. Crie a pasta `vitababy`.
3. Faça o upload dos arquivos do projeto (você pode usar o terminal embutido ou enviar um `.zip` gerado do repositório).
   *No terminal da VPS, você pode clonar o projeto:*
   ```bash
   cd /www/wwwroot/vitababy
   git clone <url-do-repositorio> .
   npm install
   ```
4. Crie o arquivo `.env` dentro da pasta raiz da aplicação com as variáveis de produção.
5. Faça o build do projeto:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run build
   ```

## 6. Configurando o PM2 e o Nginx (Proxy)

1. No aaPanel, abra o **PM2 Manager** (App Store > PM2).
2. Clique em **Add project**.
3. **Project directory**: `/www/wwwroot/vitababy`
4. **Start command**: `npm start`
5. O PM2 manterá o Next.js rodando na porta 3000 (ou a porta configurada).
6. Vá em **Website > Add site**.
7. Domínio: `vitababy.com.br` e `www.vitababy.com.br`.
8. Na configuração do site, crie um **Reverse Proxy** apontando para `http://127.0.0.1:3000`.
9. Ative o **SSL (HTTPS)** na mesma aba do site usando Let's Encrypt (1 clique).

Pronto! O sistema e os e-mails estão rodando juntos no Ubuntu 22.04 através do aaPanel.

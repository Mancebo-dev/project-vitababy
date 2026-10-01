# Hospedagem na HostGator (Compartilhada/cPanel)

## Goal
Fazer o deploy da aplicação Next.js na Hospedagem Compartilhada da HostGator via cPanel.

## Problemas Conhecidos & Validações Necessárias
- [x] Task 1: **Banco de Dados (CRÍTICO)** - Modificamos o schema para usar **MySQL** e adaptamos os tipos de texto (`@db.Text`). Agora você precisa alterar no seu arquivo `.env` a variável `DATABASE_URL` para o endereço do banco MySQL criado na HostGator (formato: `mysql://USER:PASSWORD@HOST:PORT/DATABASE`). 
- [x] Task 2: **Modo Standalone** - Adicionei o `output: "standalone"` no `next.config.ts`.
- [ ] Task 2.5: **Aplicar Migrations/Schema** - Após alterar o `.env` para o banco da HostGator, pare qualquer terminal rodando `npm run dev`, rode o comando `npx prisma generate` e depois `npx prisma db push` para enviar as tabelas ao banco MySQL.
- [ ] Task 3: **Build Local** - A hospedagem compartilhada da HostGator não tem memória RAM suficiente para rodar `npm run build`. Precisamos fazer a build localmente na sua máquina e zipar os arquivos. → Verify: Pasta `.next/standalone` gerada com sucesso.
- [ ] Task 4: **Criação do server.js** - Criar o arquivo de entrada `server.js` (gerado pela build standalone) para que o cPanel consiga iniciar a aplicação Node.js. → Verify: Arquivo `server.js` na raiz da build.
- [ ] Task 5: **Upload pro cPanel** - Fazer o upload do arquivo ZIP pelo Gerenciador de Arquivos do cPanel e extrair. → Verify: Arquivos extraídos corretamente na pasta da aplicação.
- [ ] Task 6: **Setup Node.js App** - Configurar o "Setup Node.js App" no cPanel, apontando para a pasta correta e iniciando o app. → Verify: App aparece como "Started" no cPanel.
- [ ] Task 7: **Variáveis de Ambiente** - Cadastrar as variáveis `.env` (`DATABASE_URL`, `NEXT_PUBLIC_APP_URL`, etc) dentro da interface do Setup Node.js App. → Verify: Variáveis salvas.

## Done When
- [ ] O site carrega no domínio principal rodando via "Setup Node.js App" no cPanel.
- [ ] O banco de dados está funcional e conectando perfeitamente.

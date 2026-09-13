# Documentação do Projeto: Vitababy

## 1. Visão Geral do Projeto
O projeto consiste na revitalização e modernização da landing page atual e do dashboard administrativo da profissional Rayanne.
O objetivo é melhorar a conversão, facilitar o agendamento de serviços e automatizar a gestão de clientes e contratos.

- **Landing page atual:** [Vitababy](https://vitababy.com.br/)
- **Novo projeto base (Figma):** [Acessar Design](https://www.figma.com/design/nXsxjCPLmktRYVRRrNh3S7/Sem-t%C3%ADtulo?node-id=26-2&m=dev)

---

## 2. Requisitos Funcionais (RF)
*Ações e funcionalidades que o sistema deve fornecer aos usuários.*

### 2.1. Landing Page e Navegação Pública
- **RF01:** O sistema deve apresentar uma Landing Page moderna contendo informações da profissional (Rayanne) e a vitrine de serviços/pacotes da Vitababy.
- **RF02:** O sistema deve ter uma página exclusiva para cada serviço, exibindo detalhes como: nome, preço, duração, formas de pagamento, descrição e reviews (feedbacks aprovados).
- **RF03:** O sistema deve permitir que os visitantes iniciem o agendamento de um serviço diretamente na página do serviço, redirecionando para a área de escolha de horários.

### 2.2. Autenticação e Área do Cliente
- **RF04:** O sistema deve permitir o cadastro de clientes informando: Nome, E-mail, Senha, Telefone e CPF.
- **RF05:** O sistema deve permitir o login do cliente.
- **RF06:** O sistema deve possuir uma "Área do Cliente" onde o usuário autenticado poderá gerenciar sua conta, agendamentos, contratos e feedbacks.
- **RF07:** O sistema deve permitir o pagamento via PIX, Cartão de Crédito e Cartão de Débito para efetivação do agendamento.
- **RF08:** O sistema deve permitir que o cliente visualize o histórico e status de seus agendamentos.
- **RF09:** O sistema deve permitir que o cliente solicite o cancelamento ou reagendamento de uma consulta.
- **RF10:** O sistema deve permitir que o cliente envie feedbacks após a realização de uma consulta.
- **RF11:** O sistema deve disponibilizar contratos (previamente configurados) para que o cliente preencha as informações necessárias na sua própria área.
- **RF12:** O sistema deve permitir que o cliente assine o contrato digitalmente pela plataforma.
- **RF13:** O sistema deve disponibilizar o download do contrato assinado em PDF.

### 2.3. Dashboard Administrativo (Área do Profissional)
- **RF14:** O sistema deve ter uma área administrativa restrita para profissionais.
- **RF15:** O profissional deve poder gerenciar (Criar, Ler, Atualizar e Deletar - CRUD) os Serviços (nome, preço, duração, descrição, etc).
- **RF16:** O profissional deve poder gerenciar a agenda (visualizar agendamentos, confirmar, cancelar e aprovar/recusar pedidos de reagendamento).
- **RF17:** O profissional deve poder gerenciar Clientes (visualizar histórico, adicionar, editar, remover).
- **RF18:** O profissional deve poder gerenciar Pagamentos e faturamento.
- **RF19:** O profissional deve poder gerenciar Modelos de Contratos (adicionar, editar, remover modelos base que os clientes preencherão).
- **RF20:** O profissional deve visualizar todos os contratos assinados pelos clientes.
- **RF21:** O profissional deve poder gerenciar os feedbacks recebidos e aprovar quais serão exibidos publicamente na Landing Page.
- **RF22:** O profissional deve poder editar os dados de seu próprio perfil.
- **RF23:** O sistema deve permitir o cadastro de múltiplos profissionais no futuro (arquitetura preparada para Multi-profissionais).

### 2.4. Notificações e Automações (E-mail / WhatsApp)
- **RF24:** O sistema deve enviar um e-mail de Boas-Vindas após o cadastro do cliente.
- **RF25:** O sistema deve enviar e-mail/notificação confirmando o agendamento ao cliente.
- **RF26:** O sistema deve enviar um lembrete automático do agendamento para o cliente 24h antes da consulta.
- **RF27:** O sistema deve notificar o cliente caso o reagendamento seja aprovado ou recusado pela profissional.
- **RF28:** O sistema deve notificar a empresa/profissional quando um contrato for preenchido e assinado pelo cliente.
- **RF29:** O sistema deve notificar a profissional via e-mail a cada novo agendamento contendo: Nome do cliente, Serviço, Preço, Duração, Data/Hora, Local e Links rápidos (cancelar, reagendar, ver feedback).

---

## 3. Requisitos Não Funcionais (RNF)
*Características técnicas, de performance, segurança e usabilidade.*

- **RNF01 (Usabilidade / Responsividade):** O design deve ser moderno, atraente e 100% responsivo, funcionando perfeitamente em dispositivos móveis e desktops.
- **RNF02 (Front-end):** A aplicação deve ser construída com React, Next.js e TypeScript.
- **RNF03 (Estilização):** O estilo visual deve utilizar TailwindCSS.
- **RNF04 (Animações):** Devem ser utilizadas bibliotecas de animação para tornar a interface dinâmica (ex: anime.js, framer-motion, gsap, lottiefiles, 21st.dev).
- **RNF05 (Back-end / API):** A API deve ser desenvolvida em Node.js (podendo aproveitar as API Routes/Server Actions do Next.js).
- **RNF06 (Banco de Dados):** O sistema deve utilizar PostgreSQL NEON.
- **RNF07 (Autenticação):** O gerenciamento de usuários, sessões e segurança deve ser feito usando a biblioteca `better-auth`.
- **RNF08 (Integrações Externas):** 
  - WhatsApp API (para notificações aos clientes).
  - Serviços de envio de E-mail / E-mail templating (ex: Resend, SendGrid ou similar).
  - API/Serviço de Assinatura Digital.
- **RNF09 (Segurança):** Dados sensíveis (CPF, senhas) devem ser encriptados. Contratos devem possuir integridade garantida.
- **RNF10 (Qualidade de código):** O código deve seguir as boas práticas de desenvolvimento, ser legível e bem documentado. Utilizar os padrões do "Clean Architecture", com separação clara entre:
  - Camada de Aplicação (Controller, Service)
  - Camada de Infraestrutura (Repository, Database)
  - Utilizar BIOME como ferramenta de lint e formatação.
- **RNF11 (Performance):** O sistema deve carregar em até 2 segundos.
- **RNF12 (Escalabilidade):** O sistema deve ser capaz de suportar até 1000 usuários simultâneos.
- **RNF13 (Disponibilidade):** O sistema deve estar disponível 99.9% do tempo.
- **RNF14 (Segurança):** O sistema deve utilizar autenticação e criptografia fortes, seguindo os padrões de mercado. Não devem ser utilizados dados sensíveis em client-side.
- **RNF15 (Segurança):** O sistema deve utilizar proteção contra ataques XSS e CSRF.
- **RNF16 (Segurança):** O sistema deve utilizar proteção contra ataques de força bruta.
- **RNF17 (Segurança):** O sistema deve utilizar proteção contra injeção de SQL.
- **RNF18 (Ambientes):** O sistema deve possuir múltiplos ambientes, devidamente separados:
  - Development (Ambiente de desenvolvimento) utilizando Docker e serviços locais (Banco de Dados).
  - Staging (Ambiente de teste/staging) utilizando serviços da Vercel.
  - Production (Ambiente de produção) utilizando serviços da Vercel.
- **RNF19 (Containerização):** O sistema deve possuir Dockerfile para cada serviço e docker-compose para orquestração.

---

## 4. Regras de Negócio e Restrições
*O que o sistema NÃO deve fazer ou permitir sob nenhuma hipótese.*

- **R01 (Conflito de Agenda):** O sistema **NÃO DEVE** permitir o agendamento de dois serviços para o mesmo profissional no mesmo dia e horário. Horários indisponíveis devem ser ocultados ou desativados.
- **R02 (Automação de Reagendamento):** O sistema **NÃO DEVE** alterar o horário de um agendamento apenas pela solicitação do cliente. O cliente solicita, mas a alteração só se efetiva com a **aprovação da profissional**.
- **R03 (Assinatura Incompleta):** O sistema **NÃO DEVE** permitir que um cliente assine um contrato sem ter preenchido todos os campos obrigatórios solicitados pela profissional.
- **R04 (Imutabilidade de Contratos):** O sistema **NÃO DEVE** permitir a alteração do conteúdo de um contrato após ele ter sido assinado digitalmente pelo cliente.
- **R05 (Isolamento de Dados):** O sistema **NÃO DEVE** permitir que um cliente veja agendamentos, contratos ou dados pessoais de outros clientes.
- **R06 (Publicação de Feedbacks):** O sistema **NÃO DEVE** exibir feedbacks publicamente (na landing page ou páginas de serviços) sem que a profissional tenha revisado e aprovado.
- **R07 (Acesso Restrito):** Clientes comuns **NÃO DEVEM** ter acesso a nenhuma tela ou rota do Dashboard Administrativo.
- **R08 (Pagamento Obrigatório):** O agendamento **NÃO DEVE** constar como "Confirmado" se o status do pagamento (Cartão ou PIX) não for aprovado pelo profissional no dashboard. Ficará como "Pendente" até a confirmação.


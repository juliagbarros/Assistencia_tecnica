# 🛠️ Assistência Técnica

Sistema web para gerenciamento de uma assistência técnica, desenvolvido para facilitar o controle de clientes, aparelhos, serviços, ordens de serviço, técnicos e agendamentos.

O sistema permite registrar clientes e dispositivos, abrir ordens de serviço, acompanhar o andamento da manutenção e notificar os clientes sobre mudanças de status em tempo real.

## 💻 Tecnologias

- **Backend:** Java 21, Spring Boot 3.3.5 (Spring Data JPA, Spring Security, Spring Web, Spring Mail e Spring Kafka).
- **Frontend:** Angular (TypeScript, HTML5 e SCSS/CSS).
- **Banco de Dados e Migração:** PostgreSQL 16 e Flyway.
- **Mensageria:** Apache Kafka (modo KRaft).
- **Ferramentas:** Maven, Docker, Docker Compose e Git/GitHub.

## Sobre o sistema

- **CRUD:** Gestão de clientes, técnicos, aparelhos, serviços, agendamentos, ordens de serviço (OS) e usuários através da interface web.
- **Gestão de Agendamentos:** Agendamento e controle de horários de atendimento.
- **Comunicação Orientada a Eventos:** Publicação de eventos no **Apache Kafka** sempre que o status de uma ordem de serviço é alterado.
- **Notificações por E-mail:** Envio automático de e-mails via SMTP Gmail para informar o cliente sobre a abertura, atualização e conclusão das ordens de serviço.
- **Versionamento do Banco de Dados:** Migrações gerenciadas pelo **Flyway**.
- **Infraestrutura Containerizada:** Banco de dados PostgreSQL e Apache Kafka executados via Docker Compose.

## 🔄 Como Funciona o Fluxo

O sistema organiza o processo de atendimento da assistência técnica, desde o cadastro do cliente e de seu aparelho até a finalização do serviço.

### 1. Cadastro e gerenciamento

O fluxo começa com o cadastro dos dados necessários para o atendimento:

- **Cliente:** Registro das informações dos clientes.
- **Aparelho:** Cadastro de computadores e celulares vinculados a um cliente.
- **Técnico:** Cadastro dos profissionais responsáveis pelos atendimentos.
- **Serviços:** Cadastro dos serviços oferecidos pela assistência técnica, com seus respectivos preços.

### 2. Abertura da ordem de serviço

Com os dados cadastrados, é possível abrir uma ordem de serviço.

Nesse processo:

- É selecionado o aparelho que será atendido.
- É definido o técnico responsável.
- É registrado o defeito relatado pelo cliente.
- A ordem recebe automaticamente a situação **Aberta** e a data de abertura.

### 3. Composição da ordem de serviço

Enquanto a ordem estiver aberta, podem ser adicionados os serviços que serão realizados.

Cada item possui:

- Serviço selecionado;
- Quantidade;
- Preço unitário.

O sistema calcula automaticamente o valor total da ordem, considerando os itens adicionados.

### 4. Execução do serviço

Após a avaliação do aparelho, a ordem pode passar para a situação **Em execução**. A cada alteração de status, o cliente pode receber uma notificação por e-mail informando o andamento do atendimento.

### 5. Conclusão ou cancelamento

Ao finalizar o atendimento, a ordem pode receber uma das seguintes situações:

- **Concluída:** Indica que o serviço foi finalizado. A data de conclusão é registrada automaticamente.
- **Cancelada:** Indica que o atendimento foi interrompido.

As ordens concluídas e canceladas são consideradas encerradas.

### 6. Notificações e acompanhamento

O sistema utiliza Apache Kafka para comunicação baseada em eventos. Quando ocorre uma alteração na situação da ordem:

1. O backend identifica a mudança de status.
2. Um evento é publicado no Kafka.
3. Um consumidor recebe e processa o evento.
4. O sistema executa as ações de notificação configuradas, incluindo o envio de e-mails ao cliente.

Dessa forma, o processamento das notificações ocorre de maneira assíncrona, sem precisar realizar o envio diretamente durante a atualização da ordem de serviço.

## 📁 Estrutura do Projeto

```bash
Assistencia_tecnica/
├── backend/                  # Aplicação Spring Boot (Java 21)
│   ├── src/main/java/        # Classes das entidades, controllers, services, etc
│   ├── src/main/resources/   # application.properties e migrations do Flyway
│   └── pom.xml               # Configuração e dependências do Maven
│
├── frontend/                 # Sistema web em Angular
│   ├── src/                  # Componentes, serviços e páginas do Angular
│   └── package.json          # Dependências do Node.js
│
│
└── docker-compose.yml        # PostgreSQL, Apache Kafka, Frontend e Backend

```

## 🛠️ Como Rodar

### Pré-requisitos

- **Java 21**
- **Node.js** e **npm**
- **Angular CLI**
- **Docker Desktop**

### Passos para executar

#### 1. Clonar o repositório e entrar na pasta

```bash
git clone https://github.com/seu-usuario/Assistencia_tecnica.git
cd Assistencia_tecnica
```

#### 2. Subir o PostgreSQL e o Apache Kafka

Na pasta raiz do projeto, execute:

```bash
docker-compose up -d
```

#### 3. Iniciar o Backend (Spring Boot)

Em um terminal, entre na pasta do backend e execute:

```bash
cd backend
./mvnw spring-boot:run
```

O backend iniciará em [http://localhost:8080](http://localhost:8080) e executará automaticamente as migrações do Flyway.

#### 4. Iniciar o Frontend (Angular)

Em outro terminal, entre na pasta do frontend, instale as dependências e inicie o servidor de desenvolvimento:

```bash
cd frontend
npm install
ng serve
```

Acesse [http://localhost:4200](http://localhost:4200) para visualizar o sistema.

## 🗄️ Banco de Dados

O sistema utiliza PostgreSQL para armazenamento dos dados.
As migrations são gerenciadas pelo Flyway, responsável por criar e atualizar a estrutura do banco de dados automaticamente, mantendo o versionamento do esquema.

## 📡 Mensageria e Notificações

O Apache Kafka é utilizado para implementar uma comunicação baseada em eventos.
Quando uma ordem de serviço tem sua situação alterada, o backend publica um evento em um tópico do Kafka. Um consumidor recebe essa mensagem e processa as ações correspondentes.

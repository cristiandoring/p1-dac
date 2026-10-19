# P1 DAC — Sistema de Voluntários e Eventos (IFRS)

Sistema monolítico para gerenciar **voluntários** e **eventos sociais** do IFRS (campanhas de doação de sangue, arrecadação de alimentos, mutirões ambientais), com inscrição de voluntários respeitando o limite de vagas de cada evento e autenticação JWT.

- **Back-end:** Node.js + Express 5, MySQL (`mysql2`), JWT, Swagger (OpenAPI), JSDoc
- **Front-end:** React 19 + Vite, React Router, Axios
- **Padronização:** ESLint + Prettier nos dois projetos

## Instalação e execução

### Pré-requisitos

Node.js 20.19+ e MySQL 8+.

### 1. Banco de dados

Abra o MySQL Workbench (ou outro cliente) com o usuário `root` e execute o script `backend/src/database/p1_dac.sql`. Ele recria o banco `p1_dac` do zero (**apaga o banco existente com esse nome**) e carrega dados fictícios.

### 2. Back-end

```bash
cd backend
npm install
cp .env.example .env
```

Edite o `.env` com a senha do MySQL (`DB_PASSWORD`) e uma chave secreta para o JWT (`JWT_SECRET`). Depois:

```bash
npm run dev
```

A API sobe em `http://localhost:3000`.

### 3. Front-end

Em outro terminal, com a API e o MySQL rodando:

```bash
cd frontend
npm install
npm run dev
```

Acesse a URL exibida pelo Vite (normalmente `http://localhost:5173`). Para apontar para outra API, defina `VITE_API_URL`.

### Credenciais de teste

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador (`admin`) | admin@ifrs.edu.br | 123456 |
| Usuário comum (`comum`) | usuario@ifrs.edu.br | 123456 |

## Arquitetura do back-end

```
backend/src
├── routes/        define os endpoints e aplica os middlewares
├── controllers/   recebe a requisição HTTP e chama o service
├── services/      regras de negócio (ex.: limite de voluntários por evento)
├── models/        operações no banco de dados (SQL)
├── middlewares/   autenticação/autorização JWT e tratamento de erros
├── config/        conexão com o banco e configuração do Swagger
├── database/      script SQL com tabelas e dados fictícios
├── tests/         tests.rest (REST Client)
└── utils/         AppError e validações auxiliares
```

Fluxo de uma requisição: **Route → Controller → Service → Model → MySQL**. Erros são lançados como `AppError` (com status HTTP) e tratados em um único middleware.

## API

Documentação interativa (Swagger/OpenAPI): **http://localhost:3000/api-docs**

### Autenticação

`POST /auth/login` recebe `{ "email", "senha" }` e devolve um **token JWT** com payload `{ email, role }`. Nas rotas protegidas, envie o header:

```
Authorization: Bearer <token>
```

### Endpoints

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/auth/login` | Público | Autentica e retorna o token JWT |
| GET | `/dashboard` | Autenticado | Totais do sistema e inscritos por evento |
| GET | `/events` | Público | Lista eventos |
| GET | `/events/:id` | Público | Busca um evento |
| POST | `/events` | **admin** | Cadastra evento |
| PUT | `/events/:id` | **admin** | Atualiza evento |
| DELETE | `/events/:id` | **admin** | Exclui evento |
| GET | `/events/:eventoId/volunteers` | Autenticado | Lista voluntários inscritos no evento |
| POST | `/events/:eventoId/volunteers` | **admin** | Inscreve voluntário (`{ "voluntario_id" }`) |
| DELETE | `/events/:eventoId/volunteers/:voluntarioId` | **admin** | Cancela a inscrição |
| GET | `/volunteers` | Autenticado | Lista voluntários |
| GET | `/volunteers/:id` | Autenticado | Busca um voluntário |
| POST | `/volunteers` | **admin** | Cadastra voluntário |
| PUT | `/volunteers/:id` | **admin** | Atualiza voluntário |
| DELETE | `/volunteers/:id` | **admin** | Exclui voluntário |

### Regras de negócio e códigos de erro

- Cada evento tem `max_voluntarios`; inscrever além do limite retorna **409**.
- Não é possível reduzir o limite de um evento abaixo do total de inscritos (**409**).
- Um voluntário não pode se inscrever duas vezes no mesmo evento (**409**) e o e-mail do voluntário é único (**409**).
- Dados inválidos: **400** · Sem token/token inválido: **401** · Sem permissão (não admin): **403** · Não encontrado: **404**.

### Exemplos de requisições

O arquivo [`backend/src/tests/tests.rest`](backend/src/tests/tests.rest) traz exemplos de todas as rotas, incluindo casos de erro. Use a extensão **REST Client** do VS Code e execute primeiro o login (o token é reaproveitado nas demais requisições).

## Qualidade de código

```bash
# na raiz do projeto
npm run lint      # ESLint no back e no front
npm run format    # Prettier no back e no front
```

Também é possível rodar `npm run lint` / `npm run format` dentro de `backend` ou `frontend`. O código das camadas Model, Service e Controller está documentado com JSDoc.

## Telas do front-end

| Rota | Acesso |
|---|---|
| `/login` | Público |
| `/events` | Público (lista); ações exigem login |
| `/events/:id` | Autenticado (inscritos); admin inscreve/cancela |
| `/events/new`, `/events/:id/edit` | admin |
| `/volunteers` | Autenticado (admin edita/exclui) |
| `/volunteers/new`, `/volunteers/:id/edit` | admin |
| `/dashboard` | Autenticado |

## Repositório e vídeo

- GitHub: _<colocar o link do repositório>_
- Vídeo: ver `video.txt`

## Autor

Cristian Doring Molon
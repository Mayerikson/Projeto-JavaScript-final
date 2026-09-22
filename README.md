# AprendeAí API

API REST desenvolvida para o projeto do **ODS 4 – Educação de Qualidade**. A aplicação organiza cursos gratuitos e permite que pessoas interessadas se cadastrem e realizem inscrições. O objetivo é reduzir a dificuldade de encontrar oportunidades de aprendizagem acessíveis em um único catálogo.

## Tecnologias

- Node.js 20+
- Express
- Swagger UI com especificação OpenAPI 3.0
- Persistência local em arquivo JSON, sem necessidade de configurar um banco de dados para a demonstração
- Testes com o test runner nativo do Node.js

## Como executar

```bash
npm install
npm start
```

A API será iniciada em `http://localhost:3000`. A documentação interativa está em `http://localhost:3000/docs`. O endpoint `GET /health` confirma que o serviço está disponível.

Para executar os testes:

```bash
npm test
```

## Rotas principais

| Método | Rota | Finalidade |
|---|---|---|
| GET | `/health` | Verifica a saúde do serviço |
| GET | `/users` | Lista usuários |
| POST | `/users` | Cadastra um usuário com nome e e-mail |
| GET | `/courses` | Lista cursos; aceita `category`, `free` e `search` |
| GET | `/courses/:id` | Consulta um curso |
| POST | `/courses` | Cadastra um curso |
| PUT | `/courses/:id` | Atualiza um curso |
| DELETE | `/courses/:id` | Remove um curso e suas inscrições |
| POST | `/enrollments` | Inscreve um usuário em um curso |
| GET | `/users/:userId/enrollments` | Lista inscrições do usuário |

## Exemplos de requisição

Criar usuário:

```bash
curl -X POST http://localhost:3000/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ana Souza","email":"ana@email.com"}'
```

Criar curso:

```bash
curl -X POST http://localhost:3000/courses \
  -H 'Content-Type: application/json' \
  -d '{"title":"Matemática Básica","description":"Conteúdos essenciais para o ensino médio.","category":"Educação","workloadHours":30,"free":true}'
```

Filtrar cursos gratuitos de tecnologia:

```bash
curl 'http://localhost:3000/courses?category=Tecnologia&free=true'
```

## Publicação no GitHub

Crie um repositório público chamado `aprende-ai-api`, configure o autor no Git e envie o projeto:

```bash
git init
git add .
git commit -m "feat: cria API AprendeAí alinhada ao ODS 4"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/aprende-ai-api.git
git push -u origin main
```

Na entrega do Classroom, informe o link do repositório, seu nome completo e seu e-mail. Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub. Não inclua senhas ou chaves secretas no repositório.

## Evoluções recomendadas

Para uma versão de produção, a persistência em JSON deve ser substituída por PostgreSQL ou MongoDB. Também devem ser adicionados autenticação, autorização por perfil, paginação e uma camada de migrations.

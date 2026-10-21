# Conecta Service — Backend

API da plataforma de prestação e contratação de serviços Conecta Service.

O backend está em desenvolvimento incremental. A documentação oficial do
projeto é a referência para requisitos e regras de negócio.

## Tecnologias

- Node.js e TypeScript
- NestJS 11
- Prisma ORM 7.10.1
- PostgreSQL 17
- Zod
- Swagger/OpenAPI
- Vitest
- Docker Compose

JWT e Argon2 estão previstos para a etapa de autenticação.

## Estado atual

Implementado e validado:

- Estrutura inicial NestJS.
- Configuração por variáveis de ambiente com validação Zod.
- PostgreSQL em Docker com volume persistente.
- Prisma integrado ao NestJS.
- Primeira migration de usuários e perfis.
- Health check com consulta ao PostgreSQL.
- Swagger.
- CORS com lista de origens permitidas.
- Filtro global de exceções HTTP.
- Respostas genéricas para falhas inesperadas, sem exposição de detalhes internos.
- 42 testes automatizados passando no fechamento desta etapa.

Ainda não implementado:

- Cadastro e login.
- Hash de senha com Argon2.
- Autenticação JWT e autorização por perfil.
- Cadastro inicial dos tipos de usuário.
- Módulos de serviços, orçamentos, contratos e pagamentos.
- Demais funcionalidades de negócio.

A existência das tabelas de usuários não significa que o cadastro
ou a autenticação já estejam disponíveis.

## Pré-requisitos

- Node.js e npm.
- Docker Engine iniciado.
- Docker Compose.
- Git.

Ambiente utilizado na validação desta etapa:

- Arch Linux.
- Node.js 26.12.0.
- Prisma 7.10.1.
- PostgreSQL 17.

As versões efetivas das dependências estão registradas no
package-lock.json. Utilize npm ci para reproduzir a instalação.

## Instalação

Depois de obter o repositório, entre na pasta backend:

```bash
cd conecta-service/backend
```

Todos os comandos npm, Prisma e Docker Compose deste README devem
ser executados nessa pasta.

Instale as dependências:

```bash
npm ci
```

Em uma instalação nova, crie o arquivo de configuração:

```bash
cp .env.example .env
```

Se o .env já existir, edite-o preservando suas configurações.
Não sobrescreva credenciais locais com as do exemplo.

## Variáveis de ambiente

Exemplo de configuração local:

```dotenv
NODE_ENV=development
PORT=3000
SWAGGER_ENABLED=true

POSTGRES_USER=conecta
POSTGRES_PASSWORD=SUBSTITUA_POR_UMA_SENHA_LOCAL
POSTGRES_DB=conecta_service

DATABASE_URL="postgresql://conecta:SUBSTITUA_POR_UMA_SENHA_LOCAL@127.0.0.1:5433/conecta_service?schema=public"

CORS_ORIGINS=
```

| Variável | Finalidade |
|---|---|
| NODE_ENV | Ambiente: development, test ou production |
| PORT | Porta HTTP da API |
| SWAGGER_ENABLED | Habilita o Swagger com true ou desabilita com false |
| POSTGRES_USER | Usuário criado na primeira inicialização do banco |
| POSTGRES_PASSWORD | Senha definida na primeira inicialização do banco |
| POSTGRES_DB | Banco criado na primeira inicialização |
| DATABASE_URL | Conexão utilizada pelo Prisma |
| CORS_ORIGINS | Origens web permitidas, separadas por vírgula |

A senha em DATABASE_URL deve corresponder à senha do PostgreSQL.

Caracteres especiais na senha precisam ser codificados na URL.
Por exemplo, @ vira %40 e # vira %23. Em POSTGRES_PASSWORD,
mantenha o valor original.

O arquivo .env contém credenciais e não deve ser versionado.
O .env.example deve conter somente valores de exemplo.

### CORS

Deixe CORS_ORIGINS vazio enquanto não houver frontend web:

```dotenv
CORS_ORIGINS=
```

Exemplo para uma futura interface web local:

```dotenv
CORS_ORIGINS=http://localhost:8081
```

Informe somente origens HTTP ou HTTPS, sem caminho ou barra final.
O caractere * não é aceito.

CORS controla a leitura de respostas por páginas no navegador.
Ele não substitui autenticação e autorização.

## Iniciar o PostgreSQL

Os exemplos utilizam sudo, conforme o ambiente local configurado.

```bash
sudo docker compose up -d --wait
```

Verifique o estado:

```bash
sudo docker compose ps
```

O serviço postgres deve aparecer como healthy.

Mapeamento de portas:

- Computador: 127.0.0.1:5433.
- Contêiner: 5432.

Os dados são armazenados no volume postgres_data gerenciado
pelo Docker Compose.

## Aplicar migrations

Em uma instalação nova ou após receber migrations já versionadas:

```bash
npx prisma migrate deploy
```

Gere o cliente:

```bash
npx prisma generate
```

Confira o estado:

```bash
npx prisma migrate status
```

O resultado esperado é:

```text
Database schema is up to date!
```

Não execute os scripts SQL da documentação manualmente sobre esse banco.
A evolução da estrutura é controlada pelas migrations do projeto.

### Criar uma nova migration durante o desenvolvimento

Depois de alterar prisma/schema.prisma:

```bash
npx prisma format
npx prisma validate
npx prisma migrate dev --name nome_da_alteracao --create-only
```

Revise o migration.sql gerado. Depois aplique:

```bash
npx prisma migrate dev
npx prisma generate
```

Versione o schema e a pasta de migrations.

Não edite migrations já aplicadas e compartilhadas. Crie uma nova
migration para evoluir a estrutura.

Não utilize prisma db push como fluxo principal do projeto.

## Executar a API

Com o PostgreSQL iniciado:

```bash
npm run start:dev
```

Mantenha esse terminal aberto.

A API valida a configuração e confirma a conexão com o banco antes
de aceitar requisições.

Endereços locais padrão:

- API: http://localhost:3000/api
- Health check: http://localhost:3000/api/health
- Swagger: http://localhost:3000/docs
- OpenAPI JSON: http://localhost:3000/docs-json

O Swagger depende de SWAGGER_ENABLED=true.

## Endpoints disponíveis

| Método | Rota | Descrição |
|---|---|---|
| GET | /api | Rota inicial do NestJS, com resposta Hello World! |
| GET | /api/health | Verifica a resposta do PostgreSQL |

### Health check

Não exige autenticação, parâmetros ou body.

```bash
curl -i http://localhost:3000/api/health
```

Banco disponível — HTTP 200:

```json
{
  "status": "ok",
  "service": "conecta-service-api",
  "database": "up"
}
```

Falha na consulta — HTTP 503:

```json
{
  "status": "error",
  "service": "conecta-service-api",
  "database": "down"
}
```

As respostas possuem Cache-Control: no-store e não incluem
credenciais ou detalhes internos do erro.

A resposta 503 permite identificar falhas depois que a API iniciou.
Se o banco estiver indisponível durante a inicialização, a API
encerra sem começar a atender requisições.

## Testes e build

Inicie o banco antes da suíte completa:

```bash
sudo docker compose up -d --wait
```

Execute os testes:

```bash
npm test
```

Compile:

```bash
npm run build
```

Executar somente os testes do health check:

```bash
npx vitest run --config vitest.config.mts test/health.vitest.ts
```

A suíte inclui testes que usam o PostgreSQL real. Utilize um ambiente
local de desenvolvimento, nunca um banco de produção.

Os testes de restrições criam registros em transações desfeitas
com ROLLBACK. Os contadores de IDs podem avançar mesmo após o rollback.

## Estrutura principal

```text
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/
│   ├── database/
│   ├── generated/
│   │   └── prisma/
│   ├── modules/
│   │   └── health/
│   ├── app.module.ts
│   └── main.ts
├── test/
├── compose.yaml
├── prisma.config.ts
├── vitest.config.mts
├── .env.example
└── package.json
```

O cliente em src/generated/prisma é gerado pelo comando
prisma generate e não deve ser editado manualmente.

## Banco de dados atual

| Tabela | Responsabilidade |
|---|---|
| Usuario | Dados pessoais e de acesso |
| TipoUsuario | Identificação dos papéis disponíveis |
| PerfilUsuario | Associação entre usuários e papéis |
| _prisma_migrations | Histórico técnico das migrations |

Um usuário pode possuir vários papéis diferentes.

Restrições implementadas:

- Email único.
- Nome do tipo de usuário único.
- Combinação de usuário e tipo única.
- Referências obrigatórias em PerfilUsuario.
- Exclusão restrita de registros referenciados.
- Nome, email, senhaHash e status da conta obrigatórios.

O campo senhaHash ainda não é preenchido por um fluxo de cadastro.
A implementação do hash com Argon2 será feita na etapa de autenticação.

Os papéis CONTRATANTE, PRESTADOR e ADMINISTRADOR existem no enum,
mas ainda não há um seed para inserir os registros em TipoUsuario.

### Decisões técnicas em relação ao SQL original

- senha foi substituído por senhaHash.
- Datas de cadastro e vínculo utilizam TIMESTAMPTZ.
- Foram adicionadas restrições de obrigatoriedade e unicidade.
- Papéis são limitados por enum, mantendo a tabela TipoUsuario.
- StatusConta possui ATIVA e INATIVA.
- StatusPerfil possui ATIVO e INATIVO como proposta técnica:
  a documentação não enumera os estados do vínculo.
- Telefone, CPF, foto, cidade e estado continuam opcionais.
- CPF não possui restrição de unicidade nesta etapa.
- A unicidade atual de email não normaliza maiúsculas e minúsculas.

As regras de transição de status e o fluxo de exclusão de conta
ainda serão definidos antes da implementação dessas funcionalidades.

## Acesso pelo pgAdmin

Para o pgAdmin instalado diretamente no computador:

| Campo | Valor |
|---|---|
| Host | 127.0.0.1 |
| Porta | 5433 |
| Maintenance database | conecta_service |
| Usuário | conecta |
| Senha | Senha utilizada na primeira inicialização do PostgreSQL |

Se você personalizou o usuário ou o banco no .env, utilize esses valores.

Alterar POSTGRES_PASSWORD no .env não altera a senha de um banco
já inicializado em um volume existente.

Não crie tabelas manualmente pelo pgAdmin; utilize migrations.

## Parar e reiniciar

Parar a API: Ctrl + C no terminal em que ela está executando.

Parar somente o PostgreSQL:

```bash
sudo docker compose stop postgres
```

Iniciar novamente:

```bash
sudo docker compose up -d --wait
```

Remover os contêineres preservando o volume:

```bash
sudo docker compose down
```

Não acrescente -v se quiser preservar os dados.
Essa opção remove os volumes do projeto.

## Problemas comuns

### npm informa que não encontrou package.json

Entre na pasta backend antes de executar comandos npm.

### npx solicita instalar outra versão do Prisma

Cancele a instalação e confira se você está dentro de backend
e se executou npm ci.

### Prisma apresenta P1001

Confira se o PostgreSQL está iniciado e se DATABASE_URL utiliza
a porta 5433.

### curl não consegue conectar à porta 3000

Confira o terminal da API. O processo pode estar parado ou ter
falhado na inicialização.

### /docs retorna 404

Confira SWAGGER_ENABLED=true no .env e reinicie a API.

### Falha ao iniciar o contêiner

Consulte:

```bash
sudo docker compose logs --tail=60 postgres
```

Não compartilhe o .env nem URLs contendo senhas ao pedir ajuda.
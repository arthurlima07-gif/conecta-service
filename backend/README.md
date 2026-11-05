# Conecta Service — Backend

API da plataforma de prestação e contratação de serviços Conecta Service.

O backend está em desenvolvimento incremental. A documentação oficial do
projeto é a referência para requisitos e regras de negócio.

Repositório: https://github.com/arthurlima07-gif/conecta-service

README atualizado em 05/11/2026 com base nas implementações e validações
confirmadas até a etapa de login. Esta atualização documental não executou
novamente testes, build, migrations ou auditoria de dependências.

## Tecnologias

- Node.js e TypeScript
- NestJS 11
- Prisma ORM 7.10.1
- PostgreSQL 17
- Zod
- Swagger/OpenAPI
- Vitest
- Docker Compose
- Argon2id
- JWT com @nestjs/jwt 11.0.2

Argon2id protege as senhas armazenadas. O login emite JWT assinado com HS256.
A autenticação de requisições posteriores por guard ainda não foi implementada.

## Estado atual

### Implementado e validado

- Estrutura inicial NestJS e execução compilada.
- Variáveis de ambiente com validação Zod.
- PostgreSQL em Docker com volume persistente.
- Prisma integrado ao NestJS e primeira migration aplicada.
- Tabelas Usuario, TipoUsuario e PerfilUsuario.
- Seed dos três tipos de usuário, sem duplicação em execuções repetidas.
- Health check com consulta ao PostgreSQL e respostas 200/503.
- Swagger, CORS com lista de origens e filtro global de exceções HTTP.
- Respostas genéricas para falhas inesperadas, sem detalhes internos.
- Validação do cadastro com Zod: 29 testes.
- Hash e verificação de senhas com Argon2id: 7 testes.
- RegisterService com criação transacional de usuário e perfil: 8 testes de integração.
- Tratamento de email duplicado, incluindo tentativas concorrentes.
- Cadastro HTTP validado: `POST /api/auth/register`.
- Validação de login com Zod e normalização do email.
- Verificação de credenciais, estado da conta e perfis ativos.
- Configuração obrigatória do segredo JWT e validação da expiração.
- Emissão de access token com HS256, identificação em `sub` e validade configurável.
- Login HTTP validado: `POST /api/auth/login`.
- Cadastro e login exercitados manualmente pelo Swagger, retornando 201 e 200.
- Última suíte confirmada: **162 testes passando em 16 arquivos**, com build funcionando, em 02/11/2026.

### Etapa concluída: cadastro e login públicos

O cadastro cria usuário e perfil inicial; o login verifica as credenciais e emite
o token. AuthModule, controllers e serviços estão integrados à aplicação.
Esses endpoints podem ser consumidos pelo frontend respeitando seus contratos.
A emissão do JWT ainda não equivale à proteção das demais rotas.

### Ainda não implementado

- Guard Bearer JWT e consulta do usuário autenticado.
- Renovação de token, logout e revogação de sessão no servidor.
- Recuperação de senha.
- Limitação de tentativas na aplicação.
- Isolamento obrigatório do banco de testes.
- Autorização por perfil e validação de ownership em recursos protegidos.
- Edição e exclusão de conta.
- Dados e funcionalidades específicos de contratante, prestador e administrador.
- Categorias, serviços, busca, orçamentos, contratos, pagamentos e repasses.
- Avaliações, reclamações, Boost e demais funcionalidades de negócio.

O projeto está em desenvolvimento local. Cadastro não equivale a login, e a
existência do tipo ADMINISTRADOR não cria uma conta nem concede permissões.

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
JWT_SECRET=
JWT_EXPIRES_IN_SECONDS=900
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
| JWT_SECRET | Obrigatório: 64 caracteres hexadecimais representando 32 bytes aleatórios; sem valor padrão |
| JWT_EXPIRES_IN_SECONDS | Inteiro de 1 a 900 segundos; padrão 900 |

A senha em DATABASE_URL deve corresponder à senha do PostgreSQL.

Caracteres especiais na senha precisam ser codificados na URL.

Por exemplo, @ vira %40 e # vira %23. Em POSTGRES_PASSWORD,
mantenha o valor original.

O arquivo .env contém credenciais e não deve ser versionado.

O .env.example deve conter somente valores de exemplo.

### Segredo JWT

O `JWT_SECRET` vazio no exemplo é intencional e impede a API de iniciar até ser
preenchido. Gere um segredo local:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado para `JWT_SECRET` no `.env`. Não compartilhe nem versione esse
valor. No `.env.example`, mantenha o campo vazio e a instrução de geração.
O backend converte o hexadecimal em bytes antes da assinatura.

`JWT_EXPIRES_IN_SECONDS=900` corresponde a 15 minutos. Os limites e o algoritmo
são decisões técnicas desta versão. Alterar o segredo faz tokens anteriores
falharem na verificação com a nova chave.

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

## Dados iniciais: seed de tipos de usuário

Depois de aplicar as migrations e gerar o Prisma Client:

```bash
npx prisma db seed
```

O comando utiliza `tsx prisma/seed.ts`, configurado em `migrations.seed`
no arquivo `prisma.config.ts`. A dependência de desenvolvimento `tsx` deve
estar registrada em `package.json` e `package-lock.json`.

O script insere os tipos CONTRATANTE, PRESTADOR e ADMINISTRADOR em
`TipoUsuario`. A unicidade de `nomeTipo` e `skipDuplicates: true` permitem
repetir a execução sem duplicar registros ou sobrescrever descrições existentes.

O seed não cria contas, não atribui perfis e não concede acesso administrativo.

Não é necessária uma nova migration para inserir esses dados.

No Prisma 7, execute o seed explicitamente; a aplicação das migrations
não o executa automaticamente.

### Validar o seed

Execute novamente:

```bash
npx prisma db seed
```

Se os três tipos já existirem, a saída esperada será:

```text
Seed concluído: 0 tipo(s) de usuário criado(s).
```

Confira os registros:

```bash
sudo docker compose exec postgres psql -U conecta -d conecta_service -c 'SELECT "idTipoUsuario", "nomeTipo" FROM "TipoUsuario" ORDER BY "nomeTipo";'
```

Devem existir os três tipos, sem repetição. Os IDs podem não ser consecutivos.

Se o seed falhar, confira a disponibilidade do banco, `DATABASE_URL`,
as migrations aplicadas e a geração do Prisma Client. Não compartilhe credenciais.

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

### Executar a versão compilada

Com o banco iniciado e o Prisma Client gerado:

```bash
npm run build
npm run start:prod
```

O script `start:prod` utiliza `node dist/src/main.js`, conforme a saída
compilada validada neste projeto. Encerre a execução em desenvolvimento
antes de iniciar outra instância na mesma porta.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | /api | Rota inicial do NestJS, com resposta Hello World! |
| GET | /api/health | Verifica a resposta do PostgreSQL |
| POST | /api/auth/register | Cadastro público de usuário e perfil inicial |
| POST | /api/auth/login | Login público com emissão de access token JWT |

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

## Cadastro de usuário

### Contrato HTTP

- Método e rota: `POST /api/auth/register`.
- Autenticação: não exige token.
- Parâmetros de URL/query: nenhum previsto.
- Body: JSON com os cinco campos abaixo; campos extras são rejeitados.
- Resposta: usuário e seu único perfil inicial, sem senha ou hash.
- Cabeçalho de resposta: `Cache-Control: no-store`.
- Não realiza login e não emite JWT.

```json
{
  "nome": "Pessoa de Teste",
  "email": "cadastro@example.com",
  "senha": "Minha senha segura de teste!",
  "confirmacaoSenha": "Minha senha segura de teste!",
  "papel": "CONTRATANTE"
}
```

| Campo | Validação desta versão |
|---|---|
| nome | String obrigatória; espaços externos removidos; entre 1 e 150 caracteres após trim |
| email | String obrigatória, formato válido e até 150 caracteres; trim e conversão para minúsculas |
| senha | String entre 15 e 128 caracteres; conteúdo preservado, incluindo espaços |
| confirmacaoSenha | String obrigatória, até 128 caracteres, exatamente igual à senha |
| papel | Somente CONTRATANTE ou PRESTADOR |

Os limites de strings seguem a contagem utilizada pelo Zod/JavaScript.
CPF, telefone e localização não são aceitos neste body inicial; serão tratados
na evolução do perfil. Os campos existentes no banco permanecem opcionais.

### Fluxo de gravação

1. RegisterService valida a entrada usando registerSchema.
2. Verifica email existente sem diferenciar maiúsculas e minúsculas.
3. Localiza TipoUsuario pelo nome do papel, sem fixar IDs.
4. Gera senhaHash com PasswordService antes da transação.
5. Cria Usuario e PerfilUsuario por escrita aninhada do Prisma, atomicamente.
6. Seleciona explicitamente os campos permitidos na resposta.

Se o vínculo falhar, a operação não deixa o usuário parcialmente cadastrado.
A confirmação da senha não é persistida. A restrição de unicidade do banco
protege contra cadastros concorrentes com o email normalizado.

### Respostas

| HTTP | Significado |
|---|---|
| 201 | Usuário e perfil criados |
| 400 | Dados inválidos, campos extras ou papel não permitido |
| 409 | Email já cadastrado ou conflito de unicidade |
| 503 | Tipo de usuário necessário não disponível |
| 500 | Falha inesperada, tratada pelo filtro global com mensagem genérica |

O 503 do cadastro se refere à indisponibilidade do tipo necessário; não é uma
promessa de que toda falha de banco será convertida em 503. O health check possui
seu próprio tratamento de indisponibilidade do banco.

Exemplo ilustrativo de resposta 201; IDs e data variam:

```json
{
  "idUsuario": 1,
  "nome": "Pessoa de Teste",
  "email": "cadastro@example.com",
  "statusConta": "ATIVA",
  "dataCadastro": "2026-10-27T12:00:00.000Z",
  "perfis": [
    {
      "idPerfilUsuario": 1,
      "status": "ATIVO",
      "tipoUsuario": { "nomeTipo": "CONTRATANTE" }
    }
  ]
}
```

A tentativa de enviar ADMINISTRADOR retorna 400 por violar o contrato de entrada.
Essa validação do cadastro não substitui a autorização por papel nas futuras rotas protegidas.

### Validar no Swagger

Com a API iniciada:

1. Abra `http://localhost:3000/docs`.
2. Localize Auth → POST /api/auth/register.
3. Clique em Try it out, preencha o body e execute.
4. Confira HTTP 201, o perfil esperado e ausência de senha/hash na resposta.
5. Repita com o mesmo email e confira HTTP 409.
6. Confira também a rota em `http://localhost:3000/docs-json`.

O cadastro manual persiste no banco local. Os exemplos de senha são exclusivos
para testes; não utilize credenciais pessoais nos exemplos.

### Regras documentadas e decisões desta versão

**Definido pela documentação:** RF01 prevê cadastro com escolha de contratante
ou prestador; RF02 exige confirmação da senha. PerfilUsuario permite associar
papéis ao usuário.

**Decisões técnicas desta versão:** campos iniciais restritos a nome, email,
senha, confirmação e papel; limites de tamanho; normalização do email; conta
ATIVA e vínculo ATIVO definidos no backend; criação atômica; exclusão de dados
sensíveis da resposta. Não é permitido escolher ADMINISTRADOR no cadastro público.

**Evolução prevista:** completar os dados e regras específicos dos perfis conforme
forem definidos. Essas definições iniciais não constituem a versão definitiva.
Não há mudanças adicionais de regra de negócio implícitas neste README.

### Hash de senha

PasswordService utiliza Argon2id com memoryCost 19456 KiB (19 MiB), timeCost 2,
parallelism 1 e hashLength 32. O salt aleatório é gerado pela biblioteca.
Esses parâmetros são decisões técnicas iniciais e podem ser ajustados após
medições no ambiente de implantação.

O método verify compara a senha com o hash armazenado. Senha diferente retorna
false; hash malformado pode gerar exceção. Senhas e hashes não devem ser registrados
em logs nem retornados pela API.

## Login e emissão de JWT

- Método e rota: `POST /api/auth/login`.
- Endpoint público, sem token prévio ou parâmetros de URL necessários.
- Body JSON somente com `email` e `senha`; campos extras são rejeitados.
- Resposta com `Cache-Control: no-store`, sem senha ou hash.

```json
{
  "email": "cadastro@example.com",
  "senha": "Minha senha segura de teste!"
}
```

| Campo | Validação |
|---|---|
| email | Obrigatório, formato válido, até 150 caracteres; trim e minúsculas |
| senha | Obrigatória, entre 1 e 128 caracteres; preserva espaços e Unicode |

O login não reaplica o mínimo de 15 caracteres exigido para novas senhas no
cadastro. Não envie `papel`, `idUsuario` ou confirmação de senha nesse endpoint.

### Fluxo de autenticação

1. LoginService chama ValidateCredentialsService.
2. O schema valida a entrada antes da consulta ao banco.
3. O serviço busca o email normalizado e verifica a senha com Argon2id.
4. Exige conta ATIVA e ao menos um perfil ATIVO.
5. Retorna identidade e todos os papéis ativos, sem dados secretos.
6. AccessTokenService emite um token para o ID verificado.

Email inexistente também executa comparação Argon2 com hash auxiliar. Essa
precaução reduz diferenças do caminho de execução, sem garantir tempo constante.
Conta inativa, ausência de perfil ativo e credenciais incorretas recebem a mesma
mensagem. Falhas internas não são tratadas como senha incorreta.

Exemplo ilustrativo de resposta HTTP 200; o token abaixo não é utilizável:

```json
{
  "accessToken": "JWT_GERADO_PELA_API",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "usuario": {
    "idUsuario": 1,
    "nome": "Pessoa de Teste",
    "email": "cadastro@example.com",
    "papeis": ["CONTRATANTE"]
  }
}
```

O JWT contém `sub` (ID em string), `iat` e `exp`. Não contém email, nome, senha,
hash ou papéis. É assinado, não criptografado. A lista `usuario.papeis` pode conter
mais de um papel ativo e não deve ser usada pelo frontend como garantia de autorização.

| HTTP | Significado |
|---|---|
| 200 | Credenciais verificadas e token emitido |
| 400 | Entrada inválida, ausente ou com campos extras |
| 401 | Credenciais incorretas, conta inativa ou nenhum perfil ativo |
| 500 | Falha interna; resposta genérica pelo filtro global |

Resposta 401:

```json
{
  "statusCode": 401,
  "message": "Email ou senha inválidos.",
  "error": "Unauthorized"
}
```

Uma conta administrativa preexistente e ativa pode ser autenticada; o cadastro
público continua proibindo ADMINISTRADOR. O seed não cria essa conta.

### Verificação manual

1. Cadastre um usuário pelo endpoint de cadastro.
2. No Swagger, execute Auth → POST /api/auth/login com as mesmas credenciais.
3. Confira 200, token, validade e identidade, sem senha/hash.
4. Tente uma senha diferente e confira 401 sem token.
5. Envie um campo adicional e confira 400.

Não publique tokens, credenciais ou capturas com tokens válidos.

### Limites atuais da sessão

Ainda não existem guard JWT, rota de consulta do usuário autenticado, refresh
token ou revogação no servidor. O token deverá ser verificado nas futuras rotas
protegidas com revalidação da conta e dos perfis no banco. Apagar o token no
cliente não invalida uma cópia dele; a política de logout ainda será definida.

## Integração com frontend

Cadastro e login estão disponíveis para integração. O frontend deve enviar os
nomes exatos dos campos, tratar os códigos HTTP e avançar após a resposta de
sucesso. Cadastro não autentica automaticamente: retorna `perfis`, enquanto login
retorna `usuario.papeis` e o token.

A interface web precisa ter sua origem real configurada em CORS_ORIGINS. Em um
celular físico, localhost aponta para o celular, não para o computador da API;
use um endereço acessível pela rede de desenvolvimento. O aplicativo acessa a
API HTTP, nunca diretamente a porta do PostgreSQL. JWT_SECRET permanece somente
no backend.

Não há evidência de integração ponta a ponta com o frontend nesta etapa. Recursos
privados dependem da implementação do guard e da autorização no servidor.

## Testes e build

**Atenção: o isolamento obrigatório do banco de testes ainda está pendente.**
A suíte utiliza DATABASE_URL do ambiente e/ou `.env` e contém testes que escrevem
no PostgreSQL. Antes de executar, confirme que o destino é uma base local
controlada, destinada a esses testes, sem dados importantes. Não use produção.
Ainda não existe proteção automática que garanta essa separação; não presuma que
`NODE_ENV=test` ou o nome de um script seleciona outro banco.


Inicie o banco antes da suíte completa:

```bash
sudo docker compose up -d --wait
npx prisma db seed
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

### Testes do cadastro
```bash
npx vitest run --config vitest.config.mts src/modules/auth/schemas/register.schema.spec.ts
npx vitest run --config vitest.config.mts src/modules/auth/services/password.service.spec.ts
npx vitest run --config vitest.config.mts test/register-database.vitest.ts
```

Testes HTTP do cadastro:

```bash
npx vitest run --config vitest.config.mts test/register-http.vitest.ts
npm test
npm run build
```

Os testes de cadastro gravam dados de teste identificados por emails aleatórios
e os removem após cada caso, excluindo primeiro os perfis e depois os usuários.
Uma interrupção abrupta pode impedir essa limpeza. Não execute a suíte em produção.

### Testes de login e JWT
```bash
npx vitest run --config vitest.config.mts src/modules/auth/schemas/login.schema.spec.ts
npx vitest run --config vitest.config.mts src/modules/auth/services/access-token.service.spec.ts
npx vitest run --config vitest.config.mts test/credentials-database.vitest.ts
npx vitest run --config vitest.config.mts test/login-http.vitest.ts
```

O teste de falha da emissão do token provoca intencionalmente um log genérico do
AllExceptionsFilter e espera HTTP 500. O resultado final do Vitest determina se
esse cenário passou.

### Última execução confirmada

| Arquivo | Testes |
|---|---:|
| src/app.controller.spec.ts | 1 |
| src/config/env.spec.ts | 31 |
| src/modules/auth/schemas/register.schema.spec.ts | 29 |
| src/modules/auth/schemas/login.schema.spec.ts | 14 |
| src/modules/auth/services/password.service.spec.ts | 7 |
| src/modules/auth/services/access-token.service.spec.ts | 14 |
| test/app.e2e.vitest.ts | 1 |
| test/health.vitest.ts | 3 |
| test/prisma.vitest.ts | 2 |
| test/users-database.vitest.ts | 6 |
| test/cors.vitest.ts | 9 |
| test/exceptions.vitest.ts | 4 |
| test/register-database.vitest.ts | 8 |
| test/register-http.vitest.ts | 7 |
| test/credentials-database.vitest.ts | 11 |
| test/login-http.vitest.ts | 15 |
| **Total** | **162** |

Resultado informado em 02/11/2026: 16 arquivos aprovados e build concluído. Isso
não é uma nova execução, medição percentual de cobertura ou certificação para produção.

## Estrutura principal
```text
backend/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── common/
│   │   └── filters/
│   ├── config/
│   ├── database/
│   ├── generated/
│   │   └── prisma/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── login.controller.ts
│   │   │   ├── schemas/
│   │   │   │   ├── register.schema.ts
│   │   │   │   ├── register.schema.spec.ts
│   │   │   │   ├── login.schema.ts
│   │   │   │   └── login.schema.spec.ts
│   │   │   └── services/
│   │   │       ├── password.service.ts
│   │   │       ├── password.service.spec.ts
│   │   │       ├── register.service.ts
│   │   │       ├── validate-credentials.service.ts
│   │   │       ├── access-token.service.ts
│   │   │       ├── access-token.service.spec.ts
│   │   │       └── login.service.ts
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

A estrutura destaca os componentes implementados; não representa módulos futuros.

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

O RegisterService já preenche senhaHash com Argon2id. A gravação foi validada
por testes de integração e testes HTTP, além da verificação manual no Swagger.

Os papéis CONTRATANTE, PRESTADOR e ADMINISTRADOR existem no enum.

O script `prisma/seed.ts` prepara os registros correspondentes em `TipoUsuario`.

O seed foi executado e sua repetição sem duplicação foi validada.

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
- O banco mantém unicidade de email sensível a maiúsculas e minúsculas. O cadastro normaliza emails e faz consulta prévia sem diferenciar caixa; futuras rotas de edição deverão preservar essa regra. Escritas diretas no banco podem contorná-la.

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

### Configuração inválida de JWT

Confira se JWT_SECRET contém exatamente 64 caracteres hexadecimais gerados
aleatoriamente e se JWT_EXPIRES_IN_SECONDS é um inteiro entre 1 e 900.
Não envie o segredo ao solicitar suporte. Reinicie a API após alterar o ambiente.

### Falha ao iniciar o contêiner

Consulte:

```bash
sudo docker compose logs --tail=60 postgres
```

Não compartilhe o .env nem URLs contendo senhas ao pedir ajuda.

## Versionamento

Versione o código-fonte, `package.json`, `package-lock.json`, `.env.example`,
`compose.yaml`, `prisma.config.ts`, `prisma/schema.prisma`, `prisma/seed.ts`
e a pasta `prisma/migrations`, incluindo `migration_lock.toml`.

O `.gitignore` da raiz exclui dependências, arquivos gerados e credenciais:

- `node_modules/`
- `dist/`
- `coverage/`
- `*.tsbuildinfo`
- `*.log`
- `.env` e suas variantes, preservando `.env.example`
- `backend/src/generated/prisma/`

Após uma nova instalação, use `npm ci` e `npx prisma generate` para
recriar as dependências e o cliente gerado.

## Dependências e auditoria

A última auditoria confirmada retornou `found 0 vulnerabilities`. Isso é um
resultado pontual da base de avisos do npm, não uma garantia de ausência de falhas.

```bash
npm audit
npm ls js-yaml multer
```

Overrides temporários registrados em package.json:

```json
{
  "overrides": {
    "@nestjs/swagger": { "js-yaml": "5.4.1" },
    "@nestjs/platform-express": { "multer": "2.5.0" }
  }
}
```

Essas substituições corrigem dependências transitivas mantendo as versões
principais utilizadas. Reavalie os overrides quando os pacotes principais
incorporarem as correções. Não execute npm audit fix --force automaticamente.

## Pendências técnicas e próxima etapa

1. Isolar o banco de testes e impedir execução acidental contra bases inadequadas.
2. Implementar guard Bearer JWT e consulta do usuário autenticado, revalidando conta e perfis.
3. Testar cadastro HTTP → login HTTP → recurso protegido, com casos de token inválido e expirado.
4. Definir a política de logout, expiração e eventual renovação da sessão.
5. Preparar controle de tentativas e configuração de integração antes de exposição pública.
6. Evoluir perfis, categorias e serviços com autorização e ownership, antes dos domínios financeiros.

Também permanecem pendentes logs internos sanitizados com correlação, revisão da
garantia de email no banco, sincronização dos contratos Zod/Swagger e limpeza de
configurações legadas de testes. São tarefas futuras, não correções efetuadas por
esta atualização do README.

O health check verifica conectividade por SELECT 1; não garante que migrations,
seed e todas as funcionalidades estejam prontas. A implantação precisa verificar
esses pré-requisitos separadamente. A prontidão para produção ainda não foi demonstrada.

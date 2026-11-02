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
- Argon2id

Argon2id já é utilizado para hash e verificação de senhas. JWT está previsto para a etapa de login.

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
- Última suíte confirmada: **86 testes passando em 11 arquivos**, com build funcionando.

### Etapa atual: exposição do cadastro por HTTP

O código de AuthController, AuthModule e dos testes HTTP foi fornecido para
integração ao projeto. A aplicação desses arquivos e sua validação local ainda
aguardam confirmação. A seção de cadastro abaixo documenta o contrato dessa etapa.

Após integrar AuthModule ao AppModule, executar os 7 testes HTTP novos e validar
no Swagger, o total esperado será **93 testes em 12 arquivos**. Esse resultado
ainda não foi confirmado; não representa uma execução já realizada.

### Ainda não implementado

- Login e emissão de JWT.
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
| POST | /api/auth/register | Cadastro público; integração HTTP aguardando validação |

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

### Contrato HTTP da etapa atual

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
Isso não representa uma autorização JWT, que ainda não foi implementada.

### Validar no Swagger

Após integrar AuthModule ao array imports de AppModule e iniciar a API:

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

## Testes e build

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

Depois de adicionar os arquivos da etapa HTTP:

```bash
npx vitest run --config vitest.config.mts test/register-http.vitest.ts
npm test
npm run build
```

Os testes de cadastro gravam dados de teste identificados por emails aleatórios
e os removem após cada caso, excluindo primeiro os perfis e depois os usuários.
Uma interrupção abrupta pode impedir essa limpeza. Não execute a suíte em produção.

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
│   │   │   ├── schemas/
│   │   │   │   ├── register.schema.ts
│   │   │   │   └── register.schema.spec.ts
│   │   │   └── services/
│   │   │       ├── password.service.ts
│   │   │       ├── password.service.spec.ts
│   │   │       └── register.service.ts
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

A estrutura inclui os arquivos propostos na etapa HTTP, cuja integração ainda aguarda validação.

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
por testes de integração; o acesso por HTTP aguarda a validação da etapa atual.

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

## Próxima etapa

Integrar e validar AuthModule, AuthController e os testes HTTP; confirmar o
cadastro via Swagger, a suíte completa e o build. Depois, iniciar o login e
emissão de JWT, mantendo o desenvolvimento incremental.

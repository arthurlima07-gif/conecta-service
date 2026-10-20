-- CreateEnum
CREATE TYPE "StatusConta" AS ENUM ('ATIVA', 'INATIVA');

-- CreateEnum
CREATE TYPE "StatusPerfil" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "PapelUsuario" AS ENUM ('CONTRATANTE', 'PRESTADOR', 'ADMINISTRADOR');

-- CreateTable
CREATE TABLE "Usuario" (
    "idUsuario" SERIAL NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "senhaHash" VARCHAR(255) NOT NULL,
    "telefone" VARCHAR(20),
    "cpf" VARCHAR(14),
    "fotoPerfil" TEXT,
    "cidade" VARCHAR(100),
    "estado" VARCHAR(50),
    "dataCadastro" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusConta" "StatusConta" NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "TipoUsuario" (
    "idTipoUsuario" SERIAL NOT NULL,
    "nomeTipo" "PapelUsuario" NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "TipoUsuario_pkey" PRIMARY KEY ("idTipoUsuario")
);

-- CreateTable
CREATE TABLE "PerfilUsuario" (
    "idPerfilUsuario" SERIAL NOT NULL,
    "dataVinculo" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusPerfil" NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idTipoUsuario" INTEGER NOT NULL,

    CONSTRAINT "PerfilUsuario_pkey" PRIMARY KEY ("idPerfilUsuario")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TipoUsuario_nomeTipo_key" ON "TipoUsuario"("nomeTipo");

-- CreateIndex
CREATE INDEX "PerfilUsuario_idTipoUsuario_idx" ON "PerfilUsuario"("idTipoUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "PerfilUsuario_idUsuario_idTipoUsuario_key" ON "PerfilUsuario"("idUsuario", "idTipoUsuario");

-- AddForeignKey
ALTER TABLE "PerfilUsuario" ADD CONSTRAINT "PerfilUsuario_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilUsuario" ADD CONSTRAINT "PerfilUsuario_idTipoUsuario_fkey" FOREIGN KEY ("idTipoUsuario") REFERENCES "TipoUsuario"("idTipoUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

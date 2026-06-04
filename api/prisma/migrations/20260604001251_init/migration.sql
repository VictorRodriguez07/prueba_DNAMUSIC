-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'OPERADOR');

-- CreateEnum
CREATE TYPE "EstadoSede" AS ENUM ('ACTIVA', 'INACTIVA');

-- CreateEnum
CREATE TYPE "EstadoEstudiante" AS ENUM ('ACTIVO', 'INACTIVO', 'RETIRADO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'OPERADOR',
    "sedeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sedes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "estado" "EstadoSede" NOT NULL DEFAULT 'ACTIVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sedes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estudiantes" (
    "id" TEXT NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "documentoIdentidad" TEXT NOT NULL,
    "sedeId" TEXT NOT NULL,
    "programa" TEXT NOT NULL,
    "estado" "EstadoEstudiante" NOT NULL DEFAULT 'ACTIVO',
    "fechaInscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estudiantes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_email_key" ON "estudiantes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_documentoIdentidad_key" ON "estudiantes"("documentoIdentidad");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "sedes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estudiantes" ADD CONSTRAINT "estudiantes_sedeId_fkey" FOREIGN KEY ("sedeId") REFERENCES "sedes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

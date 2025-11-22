-- CreateEnum
CREATE TYPE "public"."RolGlobal" AS ENUM ('admin', 'moderador', 'usuario');

-- CreateEnum
CREATE TYPE "public"."TipoReporte" AS ENUM ('usuario', 'publicacion');

-- CreateEnum
CREATE TYPE "public"."EstadoSolicitud" AS ENUM ('pendiente', 'aprobada', 'rechazada');

-- CreateEnum
CREATE TYPE "public"."EstadoReporte" AS ENUM ('pendiente', 'resuelto', 'rechazado');

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" TEXT NOT NULL,
    "firebase_uid" TEXT,
    "nombre_usuario" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "fecha_nacimiento" TIMESTAMP(3) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rol" "public"."RolGlobal" NOT NULL DEFAULT 'usuario',

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Canal" (
    "id" TEXT NOT NULL,
    "nombre_canal" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_canal_padre" TEXT,

    CONSTRAINT "Canal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SolicitudCanal" (
    "id" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "id_canal_padre" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" "public"."EstadoSolicitud" NOT NULL DEFAULT 'pendiente',
    "fecha_solicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SolicitudCanal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Publicacion" (
    "id" TEXT NOT NULL,
    "titulo" TEXT,
    "contenido" TEXT,
    "media_url" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" TEXT NOT NULL,
    "id_canal" TEXT NOT NULL,
    "id_publicacion_padre" TEXT,
    "eliminada" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Publicacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reaccion" (
    "id_usuario" TEXT NOT NULL,
    "id_publicacion" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reaccion_pkey" PRIMARY KEY ("id_usuario","id_publicacion")
);

-- CreateTable
CREATE TABLE "public"."SeguimientoUsuario" (
    "id_seguidor" TEXT NOT NULL,
    "id_seguido" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeguimientoUsuario_pkey" PRIMARY KEY ("id_seguidor","id_seguido")
);

-- CreateTable
CREATE TABLE "public"."SeguimientoCanal" (
    "id_usuario" TEXT NOT NULL,
    "id_canal" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeguimientoCanal_pkey" PRIMARY KEY ("id_usuario","id_canal")
);

-- CreateTable
CREATE TABLE "public"."GrupoRol" (
    "id" TEXT NOT NULL,
    "nombre_rol" TEXT NOT NULL,
    "color" TEXT,
    "id_canal" TEXT NOT NULL,

    CONSTRAINT "GrupoRol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Permiso" (
    "id" TEXT NOT NULL,
    "nombre_permiso" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Permiso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PermisoGrupoRol" (
    "id_grupo_rol" TEXT NOT NULL,
    "id_permiso" TEXT NOT NULL,

    CONSTRAINT "PermisoGrupoRol_pkey" PRIMARY KEY ("id_grupo_rol","id_permiso")
);

-- CreateTable
CREATE TABLE "public"."UsuarioGrupoRol" (
    "id_usuario" TEXT NOT NULL,
    "id_grupo_rol" TEXT NOT NULL,

    CONSTRAINT "UsuarioGrupoRol_pkey" PRIMARY KEY ("id_usuario","id_grupo_rol")
);

-- CreateTable
CREATE TABLE "public"."Reporte" (
    "id" TEXT NOT NULL,
    "tipo" "public"."TipoReporte" NOT NULL,
    "motivo" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario_reporta" TEXT NOT NULL,
    "id_objetivo" TEXT NOT NULL,
    "estado" "public"."EstadoReporte" NOT NULL DEFAULT 'pendiente',

    CONSTRAINT "Reporte_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_firebase_uid_key" ON "public"."Usuario"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_nombre_usuario_key" ON "public"."Usuario"("nombre_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- AddForeignKey
ALTER TABLE "public"."Canal" ADD CONSTRAINT "Canal_id_canal_padre_fkey" FOREIGN KEY ("id_canal_padre") REFERENCES "public"."Canal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SolicitudCanal" ADD CONSTRAINT "SolicitudCanal_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SolicitudCanal" ADD CONSTRAINT "SolicitudCanal_id_canal_padre_fkey" FOREIGN KEY ("id_canal_padre") REFERENCES "public"."Canal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Publicacion" ADD CONSTRAINT "Publicacion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Publicacion" ADD CONSTRAINT "Publicacion_id_canal_fkey" FOREIGN KEY ("id_canal") REFERENCES "public"."Canal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Publicacion" ADD CONSTRAINT "Publicacion_id_publicacion_padre_fkey" FOREIGN KEY ("id_publicacion_padre") REFERENCES "public"."Publicacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reaccion" ADD CONSTRAINT "Reaccion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reaccion" ADD CONSTRAINT "Reaccion_id_publicacion_fkey" FOREIGN KEY ("id_publicacion") REFERENCES "public"."Publicacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SeguimientoUsuario" ADD CONSTRAINT "SeguimientoUsuario_id_seguidor_fkey" FOREIGN KEY ("id_seguidor") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SeguimientoUsuario" ADD CONSTRAINT "SeguimientoUsuario_id_seguido_fkey" FOREIGN KEY ("id_seguido") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SeguimientoCanal" ADD CONSTRAINT "SeguimientoCanal_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SeguimientoCanal" ADD CONSTRAINT "SeguimientoCanal_id_canal_fkey" FOREIGN KEY ("id_canal") REFERENCES "public"."Canal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GrupoRol" ADD CONSTRAINT "GrupoRol_id_canal_fkey" FOREIGN KEY ("id_canal") REFERENCES "public"."Canal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PermisoGrupoRol" ADD CONSTRAINT "PermisoGrupoRol_id_grupo_rol_fkey" FOREIGN KEY ("id_grupo_rol") REFERENCES "public"."GrupoRol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PermisoGrupoRol" ADD CONSTRAINT "PermisoGrupoRol_id_permiso_fkey" FOREIGN KEY ("id_permiso") REFERENCES "public"."Permiso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsuarioGrupoRol" ADD CONSTRAINT "UsuarioGrupoRol_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsuarioGrupoRol" ADD CONSTRAINT "UsuarioGrupoRol_id_grupo_rol_fkey" FOREIGN KEY ("id_grupo_rol") REFERENCES "public"."GrupoRol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reporte" ADD CONSTRAINT "Reporte_id_usuario_reporta_fkey" FOREIGN KEY ("id_usuario_reporta") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

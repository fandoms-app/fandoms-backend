/*
  Warnings:

  - A unique constraint covering the columns `[firebase_uid]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Usuario" ADD COLUMN     "firebase_uid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_firebase_uid_key" ON "public"."Usuario"("firebase_uid");

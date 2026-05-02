/*
  Warnings:

  - Added the required column `file_orignal_name` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "file" ADD COLUMN     "file_orignal_name" VARCHAR(250) NOT NULL;

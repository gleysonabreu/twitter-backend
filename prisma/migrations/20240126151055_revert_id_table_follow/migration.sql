/*
  Warnings:

  - The primary key for the `follows` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `follows` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "follows" DROP CONSTRAINT "follows_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "follows_pkey" PRIMARY KEY ("followingId", "followedById");

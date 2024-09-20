/*
  Warnings:

  - You are about to drop the column `userId` on the `Link` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_userId_fkey";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "userId",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- CreateTable
CREATE TABLE "_LinkToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LinkToUser_AB_unique" ON "_LinkToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_LinkToUser_B_index" ON "_LinkToUser"("B");

-- AddForeignKey
ALTER TABLE "_LinkToUser" ADD CONSTRAINT "_LinkToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LinkToUser" ADD CONSTRAINT "_LinkToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

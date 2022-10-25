/*
  Warnings:

  - You are about to drop the column `endAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `rule` on the `Event` table. All the data in the column will be lost.
  - Added the required column `minBalance` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "minBalance" INTEGER NOT NULL,
    "chainId" TEXT NOT NULL,
    "owner" TEXT NOT NULL
);
INSERT INTO "new_Event" ("chainId", "hashedPassword", "id", "name", "owner", "tokenAddress") SELECT "chainId", "hashedPassword", "id", "name", "owner", "tokenAddress" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

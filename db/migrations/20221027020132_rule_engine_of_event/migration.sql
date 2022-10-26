/*
  Warnings:

  - You are about to drop the column `minBalance` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `tokenAddress` on the `Event` table. All the data in the column will be lost.
  - Added the required column `rule` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "hashedPassword" TEXT,
    "rule" TEXT NOT NULL,
    "chainId" TEXT NOT NULL,
    "owner" TEXT NOT NULL
);
INSERT INTO "new_Event" ("chainId", "hashedPassword", "id", "name", "owner") SELECT "chainId", "hashedPassword", "id", "name", "owner" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "hashedPassword" TEXT,
    "tokenAddress" TEXT NOT NULL,
    "minBalance" INTEGER NOT NULL,
    "chainId" TEXT NOT NULL,
    "owner" TEXT NOT NULL
);
INSERT INTO "new_Event" ("chainId", "hashedPassword", "id", "minBalance", "name", "owner", "tokenAddress") SELECT "chainId", "hashedPassword", "id", "minBalance", "name", "owner", "tokenAddress" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

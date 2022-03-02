-- CreateTable
CREATE TABLE "Code" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "expiration" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Code_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

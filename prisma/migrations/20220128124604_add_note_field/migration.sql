/*
  Warnings:

  - Added the required column `note` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "start" DATETIME NOT NULL,
    "end" DATETIME NOT NULL,
    "note" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("end", "id", "start", "userId") SELECT "end", "id", "start", "userId" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

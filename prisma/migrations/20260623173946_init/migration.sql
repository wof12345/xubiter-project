-- CreateTable
CREATE TABLE "Preorder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "products" INTEGER NOT NULL DEFAULT 1,
    "preorderWhen" TEXT NOT NULL DEFAULT 'out-of-stock',
    "startsAt" DATETIME NOT NULL,
    "endsAt" DATETIME,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

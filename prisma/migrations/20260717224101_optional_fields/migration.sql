-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "authUserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "mediaAssets" DROP NOT NULL,
ALTER COLUMN "slug" DROP NOT NULL;

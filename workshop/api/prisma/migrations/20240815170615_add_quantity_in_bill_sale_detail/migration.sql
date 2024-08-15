/*
  Warnings:

  - Added the required column `quantity` to the `BillSaleDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BillSaleDetail" ADD COLUMN     "quantity" INTEGER NOT NULL;

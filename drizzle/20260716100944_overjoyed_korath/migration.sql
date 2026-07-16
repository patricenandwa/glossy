CREATE TYPE "payment_method" AS ENUM('paystack', 'cash_on_delivery');--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"orderId" uuid NOT NULL,
	"provider" text NOT NULL,
	"providerTransactionId" text,
	"reference" text NOT NULL,
	"amount" numeric NOT NULL,
	"currency" text DEFAULT 'KES' NOT NULL,
	"status" "payment_status" DEFAULT 'pending'::"payment_status" NOT NULL,
	"paidAt" timestamp,
	"metadata" json,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "phoneNormalized" text;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "providerName" text DEFAULT 'warehouse-placeholder' NOT NULL;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "providerType" text DEFAULT 'internal_placeholder' NOT NULL;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "providerReference" text;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "zoneCode" text;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "zoneLabel" text;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "quotedFee" numeric;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "metadata" json;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "shade" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "subtotalAmount" numeric;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "currency" text DEFAULT 'KES' NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "totalOrders" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "totalSpend" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "deliveries" ALTER COLUMN "riderName" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "deliveries" ALTER COLUMN "riderPhone" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "deliveries" ALTER COLUMN "riderId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "deliveries" ALTER COLUMN "status" SET DEFAULT 'pending'::"delivery_status";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending'::"order_status";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "deliveryFee" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "discount" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "paymentStatus" SET DEFAULT 'pending'::"payment_status";--> statement-breakpoint
UPDATE "customers"
SET "phoneNormalized" = regexp_replace("phone", '\D', '', 'g')
WHERE "phoneNormalized" IS NULL;--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "phoneNormalized" SET NOT NULL;--> statement-breakpoint
UPDATE "order_items"
SET "shade" = 'Signature'
WHERE "shade" IS NULL;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "shade" SET NOT NULL;--> statement-breakpoint
UPDATE "orders"
SET "subtotalAmount" = GREATEST(COALESCE("totalAmount", 0) - COALESCE("deliveryFee", 0) + COALESCE("discount", 0), 0)
WHERE "subtotalAmount" IS NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "subtotalAmount" SET NOT NULL;--> statement-breakpoint
UPDATE "deliveries" AS "deliveries"
SET
  "zoneCode" = 'legacy-nairobi',
  "zoneLabel" = 'Legacy Nairobi delivery',
  "quotedFee" = COALESCE("orders"."deliveryFee", 0)
FROM "orders"
WHERE "orders"."id" = "deliveries"."orderId";--> statement-breakpoint
ALTER TABLE "deliveries" ALTER COLUMN "zoneCode" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "deliveries" ALTER COLUMN "zoneLabel" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "deliveries" ALTER COLUMN "quotedFee" SET NOT NULL;--> statement-breakpoint
UPDATE "orders"
SET "paymentMethod" = CASE
  WHEN "paymentMethod" = 'mpesa' THEN 'paystack'
  WHEN "paymentMethod" = 'cod' THEN 'cash_on_delivery'
  ELSE 'cash_on_delivery'
END;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "paymentMethod" SET DATA TYPE "payment_method" USING "paymentMethod"::"payment_method";--> statement-breakpoint
INSERT INTO "payments" ("orderId", "provider", "providerTransactionId", "reference", "amount", "currency", "status", "metadata")
SELECT
  "id",
  CASE
    WHEN "paymentMethod" = 'paystack' THEN 'paystack'
    ELSE 'cash_on_delivery'
  END,
  NULLIF("paymentId", ''),
  CONCAT('legacy_', regexp_replace("orderNumber", '[^a-zA-Z0-9]', '', 'g')),
  "totalAmount",
  'KES',
  "paymentStatus",
  json_build_object('legacyPaymentId', "paymentId")
FROM "orders";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "paymentId";--> statement-breakpoint
ALTER TABLE "product_images" ALTER COLUMN "productId" DROP NOT NULL;--> statement-breakpoint
CREATE INDEX "customers_phone_normalized_idx" ON "customers" ("phoneNormalized");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_order_number_idx" ON "orders" ("orderNumber");--> statement-breakpoint
CREATE UNIQUE INDEX "payments_reference_idx" ON "payments" ("reference");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_customers_id_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id");--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_orders_id_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "deliveries" DROP CONSTRAINT "deliveries_orderId_orders_id_fkey", ADD CONSTRAINT "deliveries_orderId_orders_id_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_orderId_orders_id_fkey", ADD CONSTRAINT "order_items_orderId_orders_id_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_images" DROP CONSTRAINT "product_images_productId_products_id_fkey", ADD CONSTRAINT "product_images_productId_products_id_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE;

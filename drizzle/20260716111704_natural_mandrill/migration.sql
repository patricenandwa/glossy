ALTER TABLE "deliveries" ALTER COLUMN "metadata" SET DATA TYPE jsonb USING "metadata"::jsonb;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "shade" SET DATA TYPE jsonb USING "shade"::jsonb;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "deliveryAddress" SET DATA TYPE jsonb USING "deliveryAddress"::jsonb;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "metadata" SET DATA TYPE jsonb USING "metadata"::jsonb;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "shades" SET DATA TYPE jsonb USING "shades"::jsonb;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "benefits" SET DATA TYPE jsonb USING "benefits"::jsonb;
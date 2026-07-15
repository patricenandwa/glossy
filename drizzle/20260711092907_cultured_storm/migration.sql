CREATE TYPE "delivery_status" AS ENUM('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "order_status" AS ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "payment_status" AS ENUM('pending', 'paid', 'failed', 'refunded');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" text NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"totalOrders" numeric NOT NULL,
	"totalSpend" numeric NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"orderId" uuid NOT NULL,
	"riderName" text NOT NULL,
	"riderPhone" text NOT NULL,
	"riderId" uuid NOT NULL,
	"trackingCode" text NOT NULL,
	"status" "delivery_status" NOT NULL,
	"completedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"productId" uuid NOT NULL,
	"orderId" uuid NOT NULL,
	"quantity" numeric NOT NULL,
	"price" numeric NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"orderNumber" text NOT NULL,
	"customerId" uuid NOT NULL,
	"status" "order_status" NOT NULL,
	"totalAmount" numeric NOT NULL,
	"deliveryFee" numeric NOT NULL,
	"discount" numeric NOT NULL,
	"paymentStatus" "payment_status" NOT NULL,
	"paymentMethod" text NOT NULL,
	"deliveryAddress" json NOT NULL,
	"deliveryNotes" text,
	"paymentId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"imageName" text NOT NULL,
	"storageKey" text NOT NULL,
	"mimeType" text NOT NULL,
	"fileSize" text NOT NULL,
	"productId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"tagline" text NOT NULL,
	"price" numeric NOT NULL,
	"shades" json NOT NULL,
	"rating" numeric NOT NULL,
	"reviewCount" numeric NOT NULL,
	"stock" numeric NOT NULL,
	"badge" text NOT NULL,
	"description" text NOT NULL,
	"benefits" json NOT NULL,
	"ingredients" text NOT NULL,
	"howToUse" text NOT NULL,
	"categoryId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_orderId_orders_id_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id");--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_products_id_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id");--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_orders_id_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id");--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_products_id_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_categories_id_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id");
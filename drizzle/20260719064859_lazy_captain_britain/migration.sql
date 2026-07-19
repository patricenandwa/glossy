CREATE TYPE "user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "users" (
	"firebase_uid" text NOT NULL UNIQUE,
	"email" text NOT NULL UNIQUE,
	"display_name" text,
	"photo_url" text,
	"provider" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"role" "user_role" DEFAULT 'user'::"user_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "rating" SET DEFAULT '3.0';--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "reviewCount" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "badge" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "benefits" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "ingredients" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "howToUse" DROP NOT NULL;--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" ("role");
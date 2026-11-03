CREATE TABLE "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"tags" text DEFAULT '[]' NOT NULL,
	"series" text,
	"featured" boolean DEFAULT false NOT NULL,
	"draft" boolean DEFAULT true NOT NULL,
	"pub_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "posts_pub_date_idx" ON "posts" USING btree ("pub_date");--> statement-breakpoint
CREATE INDEX "posts_draft_idx" ON "posts" USING btree ("draft");
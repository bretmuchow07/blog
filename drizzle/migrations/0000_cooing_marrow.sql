CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`series` text,
	`featured` integer DEFAULT false NOT NULL,
	`draft` integer DEFAULT true NOT NULL,
	`pub_date` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_idx` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `posts_pub_date_idx` ON `posts` (`pub_date`);--> statement-breakpoint
CREATE INDEX `posts_draft_idx` ON `posts` (`draft`);
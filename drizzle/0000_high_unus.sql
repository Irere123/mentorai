CREATE TABLE "chats" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp NOT NULL,
	"messages" json NOT NULL,
	"author" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chunks" (
	"id" text PRIMARY KEY NOT NULL,
	"filePath" text NOT NULL,
	"content" text NOT NULL,
	"embedding" real[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"email" varchar(64) PRIMARY KEY NOT NULL,
	"password" varchar(64)
);
--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_author_users_email_fk" FOREIGN KEY ("author") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;
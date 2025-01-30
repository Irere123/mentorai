import { Message } from "ai";
import { InferSelectModel } from "drizzle-orm";
import {
  json,
  pgTable,
  real,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  email: varchar("email", { length: 64 }).primaryKey().notNull(),
  password: varchar("password", { length: 64 }),
});

export const chats = pgTable("chats", {
  id: text("id").primaryKey().notNull(),
  createdAt: timestamp("created_at").notNull(),
  messages: json("messages").notNull(),
  author: varchar("author", { length: 64 })
    .notNull()
    .references(() => users.email),
});

export const chunk = pgTable("chunks", {
  id: text("id").primaryKey().notNull(),
  filePath: text("filePath").notNull(),
  content: text("content").notNull(),
  embedding: real("embedding").array().notNull(),
});

export type Chat = Omit<InferSelectModel<typeof chats>, "messages"> & {
  message: Array<Message>;
};

export type Chunk = InferSelectModel<typeof chunk>;

import { drizzle } from "drizzle-orm/postgres-js";
import { desc, eq, inArray } from "drizzle-orm";
import { genSaltSync, hashSync } from "bcrypt-ts";
import postgres from "postgres";

import { POSTGRES_URL } from "@/lib/constants";
import { chunk, chats, users } from "@/db/schema";

const client = postgres(POSTGRES_URL);
const db = drizzle(client, { schema: { users, chats, chunk } });

export async function getUser(email: string) {
  return await db.select().from(users).where(eq(users.email, email));
}

export async function createUser(email: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  return await db.insert(users).values({ email, password: hash });
}

export async function createMessage({
  id,
  messages,
  author,
}: {
  id: string;
  messages: unknown;
  author: string;
}) {
  const selectedChats = await db.select().from(chats).where(eq(chats.id, id));

  if (selectedChats.length > 0) {
    return await db
      .update(chats)
      .set({
        messages: JSON.stringify(messages),
      })
      .where(eq(chats.id, id));
  }

  return await db.insert(chats).values({
    id,
    createdAt: new Date(),
    messages: JSON.stringify(messages),
    author,
  });
}

export async function getChatsByUser({ email }: { email: string }) {
  return await db
    .select()
    .from(chats)
    .where(eq(chats.author, email))
    .orderBy(desc(chats.createdAt));
}

export async function getChatById({ id }: { id: string }) {
  const [selectedChat] = await db.select().from(chats).where(eq(chats.id, id));
  return selectedChat;
}

export async function insertChunks({ chunks }: { chunks: never[] }) {
  return await db.insert(chunk).values(chunks);
}

export async function getChunksByFilePaths({
  filePaths,
}: {
  filePaths: Array<string>;
}) {
  return await db
    .select()
    .from(chunk)
    .where(inArray(chunk.filePath, filePaths));
}

export async function deleteChunksByFilePath({
  filePath,
}: {
  filePath: string;
}) {
  return await db.delete(chunk).where(eq(chunk.filePath, filePath));
}

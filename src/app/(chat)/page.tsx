import { generateId } from "ai";

import { Chat } from "@/components/chat";
import { auth } from "../(auth)/auth";

export default async function Page() {
  const session = await auth();
  return <Chat id={generateId()} initialMessages={[]} session={session} />;
}

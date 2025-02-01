import { auth } from "@/app/(auth)/auth";
import { getChatsByUser } from "@/db";

export async function GET() {
  const session = await auth();

  if (!session || !session.user) {
    return Response.json("Unauthorized!", { status: 401 });
  }

  const chats = await getChatsByUser({ email: session.user.email! });

  return Response.json(chats);
}

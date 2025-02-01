import { auth } from "@/app/(auth)/auth";
import { getChunksByFilePaths } from "@/db";
import { google } from "@ai-sdk/google";
import {
  cosineSimilarity,
  embed,
  generateObject,
  generateText,
  LanguageModelV1Middleware,
} from "ai";
import { z } from "zod";

const selectionSchema = z.object({
  files: z.object({
    selection: z.array(z.string()),
  }),
});

export const ragMiddleware: LanguageModelV1Middleware = {
  transformParams: async ({ params }) => {
    const session = await auth();

    if (!session) return params; // no user session

    const { prompt: messages, providerMetadata } = params;

    // validate the provider metadata with Zod
    const { success, data } = selectionSchema.safeParse(providerMetadata);

    if (!success) return params; // no files selected

    const selection = data.files.selection;
    const recentMessage = messages.pop();

    if (!recentMessage || recentMessage.role !== "user") {
      if (recentMessage) {
        messages.push(recentMessage);
      }

      return params;
    }

    const lastUserMessageContent = recentMessage.content
      .filter((content) => content.type === "text")
      .map((content) => content.text)
      .join("\n");

    const { object: classification } = await generateObject({
      model: google("gemini-1.5-flash", {
        structuredOutputs: true,
      }),
      output: "no-schema",
      system: `Classify the user message as either "question", "statement", or "other". 
                 Return only the classification as a string with no additional text.`,
      prompt: lastUserMessageContent,
    });

    const validTypes = ["question", "statement", "other"];
    if (!validTypes.includes(classification?.toString() as string)) {
      console.warn(`Invalid classification received: ${classification}`);
      messages.push(recentMessage);
      return params;
    }

    // For non-questions, return immediately without RAG
    if (classification !== "question") {
      messages.push(recentMessage);
      return params;
    }

    // Use hypotethetical document embeddings
    const { text: hypotetheticalAnswer } = await generateText({
      // fast model for generating hypothetical answer
      model: google("gemini-1.5-flash", { structuredOutputs: true }),
      system: "Answer the users question",
      prompt: lastUserMessageContent,
    });

    // Embed the hypotethical answer
    const { embedding: hypotetheticalAnswerEmbedding } = await embed({
      model: google.textEmbeddingModel("text-embedding-004"),
      value: hypotetheticalAnswer,
    });

    // find relevant chunks based on the selection
    const chunksBySelection = await getChunksByFilePaths({
      filePaths: selection.map((path) => `${session.user?.email}/${path}`),
    });

    const chunksWithSimilarity = chunksBySelection.map((chunk) => ({
      ...chunk,
      similarity: cosineSimilarity(
        hypotetheticalAnswerEmbedding,
        chunk.embedding
      ),
    }));

    // rank the chunks by similarity and take the top k
    chunksWithSimilarity.sort((a, b) => b.similarity - a.similarity);
    const k = 10;
    const topKChunks = chunksWithSimilarity.slice(0, k);

    // add chunks to the the last user message

    messages.push({
      role: "user",
      content: [
        ...recentMessage.content,
        {
          type: "text",
          text: "Here is some relevant information that you can use to answer the question: ",
        },
        ...topKChunks.map((chunk) => ({
          type: "text" as const,
          text: chunk.content,
        })),
      ],
    });

    return { ...params, prompt: messages };
  },
};

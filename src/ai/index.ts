import { google } from "@ai-sdk/google";
import { wrapLanguageModel } from "ai";
import { ragMiddleware } from "./rag";

export const customModel = wrapLanguageModel({
  model: google("gemini-1.5-flash"),
  middleware: ragMiddleware,
});

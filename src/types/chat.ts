import { Types } from "mongoose";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export interface ChatDocument {
  userId: Types.ObjectId
  sessionId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
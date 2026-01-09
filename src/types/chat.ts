export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export interface ChatDocument {
  sessionId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
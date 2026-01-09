import mongoose, { Schema, Model } from "mongoose";
import { ChatDocument } from "@/types/chat";

const MessageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const ChatSchema = new Schema<ChatDocument>(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    messages: {
      type: [MessageSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const Chat: Model<ChatDocument> =
  mongoose.models.Chat ||
  mongoose.model<ChatDocument>("Chat", ChatSchema);

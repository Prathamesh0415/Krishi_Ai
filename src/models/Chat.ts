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
    userId:{
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
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
  mongoose.model("Chat", ChatSchema);

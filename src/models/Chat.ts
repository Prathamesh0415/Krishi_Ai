import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "bot"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const ChatSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

export const Chat =  mongoose.models.Chat || mongoose.model("Chat", ChatSchema)
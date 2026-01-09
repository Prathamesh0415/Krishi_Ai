import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { askLLM } from "@/lib/openai";
import { v4 as uuidv4 } from "uuid";
import connectDb from "@/lib/connectDB";
import { Chat } from "@/models/Chat";
import { ChatMessage, ChatDocument } from "@/types/chat";

const MAX_CONTEXT_MESSAGES = 10;
const CONTEXT_TTL_SECONDS = 60 * 60 * 24;

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const sid = sessionId ?? uuidv4();
    const redisKey = `chat:${sid}`;

    let messages: ChatMessage[] = [];

    const redisContext = await redis.get(redisKey);

    if (redisContext) {
      messages = JSON.parse(redisContext);
    } else {
      await connectDb();
      const chat = await Chat.findOne({ sessionId: sid }).lean();

      if (chat?.messages?.length) {
        messages = chat.messages.slice(-MAX_CONTEXT_MESSAGES);

        await redis.set(redisKey, JSON.stringify(messages), 
          "EX", CONTEXT_TTL_SECONDS
        );
      }
    }

    messages.push({
      role: "user",
      content: message,
    });

    messages = messages.slice(-MAX_CONTEXT_MESSAGES);

    // 5️⃣ Ask LLM
    const reply =
      (await askLLM(messages)) ?? "Sorry, I couldn't generate a response.";

    const botMessage: ChatMessage = {
      role: "assistant",
      content: reply,
    };

    messages.push(botMessage);

    await redis.set(redisKey, JSON.stringify(messages), 
      "EX", CONTEXT_TTL_SECONDS,
    );

    await connectDb();

    await Chat.findOneAndUpdate(
      { sessionId: sid },
      {
        $push: {
          messages: {
            $each: [
              { role: "user", content: message },
              botMessage,
            ],
          },
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      reply,
      sessionId: sid,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

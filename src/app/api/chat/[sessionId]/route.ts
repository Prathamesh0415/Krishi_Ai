import { NextResponse } from "next/server";
import  connectDb  from "@/lib/connectDB";
import { Chat } from "@/models/Chat";
export async function GET(
  _: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    await connectDb();

    const chat = await Chat.findOne({ sessionId: params.sessionId }).lean();

    if (!chat) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Fetch chat error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat" },
      { status: 500 }
    );
  }
}

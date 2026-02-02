import { NextResponse } from "next/server";
import connectDb from "@/lib/connectDB";
import { Chat } from "@/models/Chat";
import { getUserFromRequest } from "@/lib/auth";
//import { getServerSession } from "next-auth";
//import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    await connectDb();

    const userId = await getUserFromRequest()

    const chats = await Chat.find({userId})
      .sort({ updatedAt: -1 })
      .select({
        sessionId: 1,
        updatedAt: 1,
        messages: { $slice: 1 }, // 👈 ONLY first message
      })
      .lean();

    return NextResponse.json(chats);
  } catch (error) {
    console.error("Fetch chats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}

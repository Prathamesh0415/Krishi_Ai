import { getUserFromRequest } from "@/lib/auth";
import connectDb from "@/lib/connectDB";
import { Post } from "@/models/postModel";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

export async function POST(req: Request) {
  try{
    await connectDb();

    const user = await getUserFromRequest();
    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { title, content } = await req.json();

    const post = await Post.create({
        title,
        content,
        authorId: user.userId
    });

    return NextResponse.json(post, { status: 201 });
  }catch(error){
    console.log(error)
    return NextResponse.json({
        success: false,
        message: "internal server error"
    }, {status: 500})
  }
    
}

export async function GET(req: NextRequest) {
  try{
    await connectDb();

    const user = await getUserFromRequest();
    const { searchParams } = new URL(req.url);

    let filter: any = {};

    if (searchParams.get("author") === "me") {
        if (!user) {
        return new Response("Unauthorized", { status: 401 });
        }
        filter.authorId = user.userId;
    }

    const posts = await Post.find(filter)
        .sort({ createdAt: -1 })
        .populate("authorId", "name image");

    return Response.json(posts);
  }catch(error){
    console.log(error)
    return NextResponse.json({
        success: false,
        message: "internal server error"
    }, { status: 500 })
}}


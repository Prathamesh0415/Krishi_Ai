import { getUserFromRequest } from "@/lib/auth";
import connectDb from "@/lib/connectDB";
import { Post } from "@/models/postModel";
import { NextResponse } from "next/server";

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

export async function GET() {
  try{
    await connectDb();

    const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("authorId", "name image");

    return NextResponse.json(posts);
  }catch(error){
    console.log(error)
    return NextResponse.json({
        success: false,
        message: "internal server error"
    }, { status: 500 })
}}


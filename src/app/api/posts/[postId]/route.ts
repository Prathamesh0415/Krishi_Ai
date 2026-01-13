import { Post } from "@/models/postModel";
import connectDb from "@/lib/connectDB";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
    try{
        await connectDb();

        const postId = await params

        const post = await Post.findById(postId)
            .populate("authorId", "name image");

        if (!post) {
            return new Response("Post not found", { status: 404 });
        }

        return NextResponse.json(post);
    }catch(error){
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
    }
  
}

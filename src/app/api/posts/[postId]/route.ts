import { Post } from "@/models/postModel";
import connectDb from "@/lib/connectDB";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
    try{
        await connectDb();

        const post = await Post.findById(params.postId)
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

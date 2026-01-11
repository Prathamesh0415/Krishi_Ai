import  connectDb  from "@/lib/connectDB";
import { Comment } from "@/models/Comments";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try{
        await connectDb();

        const user = await getUserFromRequest();
        if (!user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const { postId, content, parentCommentId } = await req.json();

        const comment = await Comment.create({
            postId,
            content,
            parentCommentId: parentCommentId ?? null,
            authorId: user.userId
        });

        return NextResponse.json(comment, { status: 201 });
    }catch(error){
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
    }
    
}

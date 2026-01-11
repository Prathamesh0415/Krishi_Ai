import  connectDb  from "@/lib/connectDB";
import { Comment } from "@/models/Comments";
import { NextResponse } from "next/server";

function buildCommentTree(comments: any[]) {
  const map = new Map<string, any>();
  const roots: any[] = [];

  comments.forEach((c) => {
    map.set(c._id.toString(), { ...c, replies: [] });
  });

  map.forEach((comment) => {
    if (comment.parentCommentId) {
      const parent = map.get(comment.parentCommentId.toString());
      parent?.replies.push(comment);
    } else {
      roots.push(comment);
    }
  });

  return roots;
}

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    await connectDb();

    const comments = await Comment.find({ postId: params.postId })
      .sort({ createdAt: 1 })
      .populate("authorId", "name image")
      .lean();

    const tree = buildCommentTree(comments);

    return NextResponse.json(tree, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

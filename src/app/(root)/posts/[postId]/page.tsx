"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// --- Types ---
interface CommentType {
  _id: string;
  content: string;
  authorId: { name: string; image?: string };
  createdAt: string;
  replies: CommentType[]; // Recursive type
}

interface PostType {
  _id: string;
  title: string;
  content: string;
  authorId: { name: string };
  createdAt: string;
}

// --- Recursive Comment Component ---
const CommentItem = ({
  comment,
  postId,
  onReplyAdded,
}: {
  comment: CommentType;
  postId: string;
  onReplyAdded: () => void;
}) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReply = async () => {
    await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({
        postId,
        content: replyContent,
        parentCommentId: comment._id,
      }),
    });
    setReplyContent("");
    setShowReplyBox(false);
    onReplyAdded(); // Trigger refresh
  };

  return (
    <div className="border-l-2 border-emerald-200 pl-4 mt-4">
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex justify-between items-start">
          <span className="font-semibold text-emerald-800 text-sm">
            {comment.authorId.name}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-700 mt-1">{comment.content}</p>
        <button
          onClick={() => setShowReplyBox(!showReplyBox)}
          className="text-xs text-emerald-600 font-medium mt-2 hover:underline"
        >
          Reply
        </button>

        {showReplyBox && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              // UPDATED: Added text-gray-900 and placeholder styling
              className="flex-1 border border-gray-300 p-2 text-sm rounded text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-500"
              placeholder="Write a reply..."
            />
            <button
              onClick={handleReply}
              className="bg-emerald-600 text-white text-xs px-3 py-1 rounded hover:bg-emerald-700 transition-colors"
            >
              Send
            </button>
          </div>
        )}
      </div>

      {/* RECURSION: Render children replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              postId={postId}
              onReplyAdded={onReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Main Page Component ---
export default function PostDetailsPage() {
  const { postId } = useParams();
  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");

  const fetchData = async () => {
    // Parallel fetch for speed
    const [postRes, commentRes] = await Promise.all([
      fetch(`/api/posts/${postId}`),
      fetch(`/api/posts/${postId}/comments`),
    ]);

    if (postRes.ok) setPost(await postRes.json());
    if (commentRes.ok) setComments(await commentRes.json());
  };

  useEffect(() => {
    if (postId) fetchData();
  }, [postId]);

  const handleTopLevelComment = async () => {
    if (!newComment.trim()) return;
    await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ postId, content: newComment }),
    });
    setNewComment("");
    fetchData(); // Refresh comments
  };

  if (!post) return <div className="p-10 text-center text-emerald-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Post Content */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-emerald-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 border-b border-gray-100 pb-4">
            <span className="font-medium text-emerald-700">
              {post.authorId.name}
            </span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="prose prose-emerald max-w-none text-gray-700">
            {post.content}
          </div>
        </div>

        {/* Comment Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Discussion
          </h3>

          {/* Add Main Comment */}
          <div className="mb-8 flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              // UPDATED: Added text-gray-900 and placeholder styling
              className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 placeholder:text-gray-400"
              placeholder="Add to the discussion..."
            />
            <button
              onClick={handleTopLevelComment}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Post
            </button>
          </div>

          {/* Render Comment Tree */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                postId={postId as string}
                onReplyAdded={fetchData}
              />
            ))}
            {comments.length === 0 && (
              <p className="text-gray-400 text-center py-4">
                No comments yet. Be the first to help!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
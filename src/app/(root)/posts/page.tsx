"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  authorId: {
    name: string;
    image: string;
  };
}

export default function ForumPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-900">
            Community Forum
          </h1>
          <Link
            href="/posts/create"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            + Ask a Question
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-emerald-600">Loading queries...</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/posts/${post._id}`}
                className="block bg-white p-6 rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 line-clamp-2 mb-4">
                  {post.content}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                      {post.authorId.name.charAt(0)}
                    </div>
                    <span>{post.authorId.name}</span>
                  </div>
                  <span className="mx-2">•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
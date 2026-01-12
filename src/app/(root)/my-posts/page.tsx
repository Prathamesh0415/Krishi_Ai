"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function MyPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // We pass 'author=me' to trigger your specific backend logic
    fetch("/api/posts?author=me")
      .then((res) => {
        if (res.status === 401) {
          // If not logged in, redirect to login
          router.push("/login"); // Change this to your actual login route
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setPosts(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [router]);

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link 
              href="/posts" 
              className="text-emerald-600 hover:text-emerald-800 text-sm font-medium mb-2 inline-block"
            >
              ← Back to Community
            </Link>
            <h1 className="text-3xl font-bold text-emerald-900">
              My Contributions
            </h1>
          </div>
          <Link
            href="/psots/create"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            + New Query
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-emerald-600">Loading your posts...</div>
        ) : (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl border border-dashed border-emerald-200">
                <p className="text-gray-500 mb-4">You haven't asked anything yet.</p>
                <Link href="/forum/create" className="text-emerald-600 font-semibold hover:underline">
                  Ask your first question
                </Link>
              </div>
            ) : (
              posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/posts/${post._id}`}
                  className="block bg-white p-6 rounded-xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow relative"
                >
                  <div className="absolute top-6 right-6 text-xs font-bold text-emerald-100 bg-emerald-600 px-2 py-1 rounded">
                    MY POST
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2 pr-20">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {post.content}
                  </p>
                  <div className="flex items-center text-sm text-gray-400">
                    <span>Posted on {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
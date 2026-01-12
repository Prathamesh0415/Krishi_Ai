"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (res.ok) router.push("/forum");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 p-6 flex justify-center items-start pt-20">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl w-full border border-emerald-100">
        <h1 className="text-2xl font-bold text-emerald-900 mb-6">
          Ask the Community
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g., How to treat yellow leaves on tomato plants?"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Details
            </label>
            <textarea
              required
              rows={6}
              className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Describe your issue in detail..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            />
          </div>
          <button
            disabled={submitting}
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post Query"}
          </button>
        </form>
      </div>
    </div>
  );
}
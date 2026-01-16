"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  //Calendar, 
  MessageSquare, 
  ArrowRight, 
  Sprout, 
  Clock, 
  SearchX,
  Loader2,
  Quote
} from "lucide-react";

// 1. Update Type Definition to include messages
type ChatSession = {
  _id: string;
  sessionId: string;
  updatedAt: string;
  messages: { role: string; content: string }[]; 
};

export default function ChatHistoryPage() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/chats"); // Ensure this matches your route path
        
        if (!res.ok) throw new Error("Failed to load history");
        
        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.error(err);
        setError("Could not load your farming consultations.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-emerald-900 flex items-center gap-3">
              <Sprout className="w-8 h-8 text-emerald-600" />
              Consultation History
            </h1>
            <p className="text-emerald-600/80 mt-1">
              Review your past conversations with Krishi Mitr
            </p>
          </div>
          <Link 
            href="/krishi-mitr"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all transform hover:-translate-y-0.5"
          >
            Start New Consultation
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center text-emerald-600/60">
            <Loader2 className="w-10 h-10 animate-spin mb-3" />
            <p>Loading your records...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">
            <p>{error}</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <SearchX className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">No History Found</h3>
            <p className="text-gray-500 mt-2 max-w-sm">
              {"You haven't had any conversations with Krishi Mitr yet. Start a chat to get advice on your crops!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chats.map((chat) => {
              // Extract the first message content safely
              const firstMsg = chat.messages && chat.messages.length > 0 
                ? chat.messages[0].content 
                : "No preview available";

              return (
                <Link 
                  key={chat._id} 
                  href={`/krishi-mitr?sessionId=${chat.sessionId}`}
                  className="group relative bg-white rounded-xl border border-emerald-100 p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:border-emerald-300 transition-all duration-300 flex flex-col"
                >
                  {/* Top Row: Icon and Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                      <MessageSquare className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex items-center text-xs font-medium text-emerald-600/70 bg-emerald-50 px-2 py-1 rounded-full">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(chat.updatedAt)}
                    </div>
                  </div>

                  {/* Middle Row: Message Preview */}
                  <div className="mb-6 flex-1">
                    <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 opacity-60">
                      Topic
                    </h3>
                    <div className="relative">
                      <Quote className="absolute -top-1 -left-1 w-3 h-3 text-emerald-200 transform -scale-x-100" />
                      <p className="text-gray-700 font-medium text-sm leading-relaxed pl-3 line-clamp-3">
                        {firstMsg}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Row: Footer */}
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-400">
                       ID: {chat.sessionId.slice(0, 6)}...
                    </span>
                    <span className="text-sm font-medium text-emerald-600 group-hover:translate-x-1 transition-transform inline-flex items-center">
                      View
                      <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
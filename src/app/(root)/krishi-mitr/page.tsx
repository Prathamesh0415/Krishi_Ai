"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sprout, User, Loader2, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ChatMessage } from "@/types/chat";



export default function KrishiMitrChat() {
  // State for messages, input, loading, and session
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Namaste! I am Krishi Mitr. How can I help you with your farm today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Auto-scroll to bottom ref
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput(""); // Clear input immediately

    // 1. Add User Message to UI
    const newMessages = [...messages, { role: "user", content: userMessage } as ChatMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // 2. Call your API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionId, // Send existing session ID if we have one
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch response");
      }

      // 3. Update Session ID (Important for context!)
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      // 4. Add Bot Response to UI
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to clear chat (optional feature)
  const handleClearChat = () => {
    setMessages([
      { role: "assistant", content: "Chat cleared. How else can I assist you?" },
    ]);
    setSessionId(null); // Reset session to start fresh context
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
      
      {/* Header */}
      <div className="bg-emerald-700 p-4 flex items-center justify-between text-white shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
            <Sprout className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Krishi Mitr AI</h2>
            <p className="text-xs text-emerald-200">Your Personal Farming Assistant</p>
          </div>
        </div>
        <button 
          onClick={handleClearChat}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-emerald-200 hover:text-white"
          title="Start New Chat"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-white border border-gray-200 text-emerald-600"
              }`}
            >
              {msg.role === "user" ? <User size={16} /> : <Sprout size={16} />}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white rounded-br-none"
                  : "bg-white border border-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.role === "assistant" ? (
                // Use ReactMarkdown for nicer bot formatting (lists, bolding, etc.)
                <div className="prose prose-sm prose-emerald max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
              <Sprout size={16} className="text-emerald-600 animate-pulse" />
            </div>
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-3 relative"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about crops, weather, or diseases..."
            className="flex-1 bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-inner"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center ${
              !input.trim() || isLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 ml-0.5" />
            )}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-2">
          Krishi Mitr can make mistakes. Please verify important info.
        </p>
      </div>
    </div>
  );
}
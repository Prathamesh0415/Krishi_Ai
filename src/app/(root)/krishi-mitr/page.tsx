"use client";

import { useState, useRef, useEffect, Suspense } from "react"; // 1. Import Suspense
import { Send, Sprout, User, Loader2, RefreshCw, History } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useSearchParams, useRouter } from "next/navigation";

type Message = {
  role: "user" | "bot";
  content: string;
};

// 2. Rename your main logic component (remove 'export default')
function ChatContent() {
  // Navigation hooks
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlSessionId = searchParams.get("sessionId");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "Namaste! I am Krishi Mitr. How can I help you with your farm today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isHistoryLoading]);

  // ---------------------------------------------------------
  // LOAD HISTORY IF SESSION ID EXISTS IN URL
  // ---------------------------------------------------------
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!urlSessionId || urlSessionId === sessionId) return;

      setIsHistoryLoading(true);
      setSessionId(urlSessionId);

      try {
        const res = await fetch(`/api/chat/${urlSessionId}`);

        if (!res.ok) {
          if (res.status === 404) console.warn("Chat not found");
          return;
        }

        const data = await res.json();

        if (data && data.messages && Array.isArray(data.messages)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cleanMessages = data.messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          }));
          setMessages(cleanMessages);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    loadChatHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSessionId]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    const newMessages = [
      ...messages,
      { role: "user", content: userMessage } as Message,
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionId,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        router.replace(`/krishi-mitr?sessionId=${data.sessionId}`, {
          scroll: false,
        });
      }

      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ Sorry, connection error." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([{ role: "bot", content: "Chat cleared. Start a new topic!" }]);
    setSessionId(null);
    router.replace("/krishi-mitr");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100 relative">
      {/* Header */}
      <div className="bg-emerald-700 p-4 flex items-center justify-between text-white shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
            <Sprout className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <h2 className="font-bold text-lg flex items-center gap-2">
              Krishi Mitr AI
            </h2>
            <p className="text-xs text-emerald-200">
              Your Personal Farming Assistant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/chat-history")}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-emerald-200 hover:text-white"
            title="View History"
          >
            <History className="w-5 h-5" />
          </button>
          <button
            onClick={handleClearChat}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-emerald-200 hover:text-white"
            title="New Chat"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent">
        {isHistoryLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-60">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-sm text-emerald-800">
              Retrieving conversation history...
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-white border border-gray-200 text-emerald-600"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User size={16} />
                  ) : (
                    <Sprout size={16} />
                  )}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-white border border-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.role !== "bot" ? (
                    <div className="prose prose-sm prose-emerald max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <Sprout
                    size={16}
                    className="text-emerald-600 animate-pulse"
                  />
                </div>
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
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
            disabled={isLoading || isHistoryLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || isHistoryLoading}
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
      </div>
    </div>
  );
}

// 3. Export the Wrapped Component
export default function KrishiMitrChat() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
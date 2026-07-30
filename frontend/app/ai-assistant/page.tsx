"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Trash2,
  Copy,
  RotateCcw,
} from "lucide-react";

type Message = {
  sender: "user" | "ai";
  text: string;
  time: string;
};

export default function AIAssistant() {
  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "👋 Welcome to VibeBite! I'm your AI Restaurant Assistant. Ask me anything about our menu, dishes, combos, prices or recommendations.",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage(customMessage?: string) {

  const text = customMessage ?? input;

  if (!text.trim()) return;

  const userMessage: Message = {
    sender: "user",
    text,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  const updatedMessages = [...messages, userMessage];

  setMessages(updatedMessages);

  if (!customMessage) setInput("");

  setLoading(true);

  try {

    const response = await fetch("/api/chat", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({

        messages: updatedMessages.map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        })),

      }),

    });

    const data = await response.json();

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: data.reply,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

  } catch {

    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: "⚠️ Failed to contact AI.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

  }

  setLoading(false);

}
  function clearChat() {
    setMessages([
      {
        sender: "ai",
        text: "👋 Chat cleared. How can I help you today?",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  }

  async function copyMessage(text: string) {
    await navigator.clipboard.writeText(text);
  }

  function regenerateResponse() {
    const lastUser = [...messages]
      .reverse()
      .find((m) => m.sender === "user");

    if (lastUser) {
      sendMessage(lastUser.text);
    }
  }

  return (
  <main className="min-h-screen bg-gradient-to-br from-gray-100 via-orange-50 to-green-50">

    <div className="max-w-6xl mx-auto py-10 px-6">

      {/* Header */}

      <div className="bg-[#3F6B63] rounded-3xl shadow-xl text-white p-8 flex items-center justify-between">

        <div className="flex items-center gap-5">

          <div className="bg-white/20 p-4 rounded-2xl">
            <Sparkles className="w-10 h-10" />
          </div>

          <div>

            <h1 className="text-4xl font-bold">
              VibeBite AI Assistant
            </h1>

            <p className="opacity-90 mt-2">
              Powered by Groq AI • Restaurant Expert
            </p>

          </div>

        </div>

        <button
          onClick={clearChat}
          className="bg-red-500 hover:bg-red-600 transition px-5 py-3 rounded-xl flex items-center gap-2"
        >
          <Trash2 size={18} />
          Clear Chat
        </button>

      </div>

      {/* Chat Container */}

      <div className="bg-white rounded-3xl shadow-xl mt-8 overflow-hidden">

        {/* Messages */}

        <div className="h-[650px] overflow-y-auto p-8 space-y-6">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`flex ${
                msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`flex gap-3 max-w-[80%] ${
                  msg.sender === "user"
                    ? "flex-row-reverse"
                    : ""
                }`}
              >

                {/* Avatar */}

                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === "ai"
                      ? "bg-[#3F6B63] text-white"
                      : "bg-[#F97316] text-white"
                  }`}
                >

                  {msg.sender === "ai" ? (
                    <Bot size={22} />
                  ) : (
                    <User size={22} />
                  )}

                </div>

                {/* Bubble */}

                <div
                  className={`rounded-3xl px-6 py-5 shadow ${
                    msg.sender === "ai"
                      ? "bg-gray-100"
                      : "bg-[#F97316] text-white"
                  }`}
                >

                  <p className="whitespace-pre-wrap leading-7">
                    {msg.text}
                  </p>

                  <div className="flex justify-between items-center mt-4">

                    <span className="text-xs opacity-60">
                      {msg.time}
                    </span>

                    {msg.sender === "ai" && (

                      <div className="flex gap-2">

                        <button
                          onClick={() => copyMessage(msg.text)}
                          className="hover:text-[#F97316]"
                        >
                          <Copy size={16} />
                        </button>

                        <button
                          onClick={regenerateResponse}
                          className="hover:text-[#F97316]"
                        >
                          <RotateCcw size={16} />
                        </button>

                      </div>

                    )}

                  </div>

                </div>

              </div>

            </div>

          ))}

          {/* Typing Animation */}

          {loading && (

            <div className="flex justify-start">

              <div className="flex gap-3">

                <div className="w-12 h-12 rounded-full bg-[#3F6B63] text-white flex items-center justify-center">

                  <Bot size={22} />

                </div>

                <div className="bg-gray-100 rounded-3xl px-6 py-5">

                  <div className="flex gap-2">

                    <span className="w-3 h-3 rounded-full bg-gray-400 animate-bounce"></span>

                    <span
                      className="w-3 h-3 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></span>

                    <span
                      className="w-3 h-3 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></span>

                  </div>

                </div>

              </div>

            </div>

          )}

          <div ref={chatEndRef} />

        </div>

        {/* Input Area Starts Here */}
        <div className="border-t bg-white p-5">

  {/* Suggested Questions */}

  <div className="flex flex-wrap gap-3 mb-5">

    {[
      "🍕 Recommend Pizza",
      "🥗 Veg Meal",
      "💰 Budget Combo",
      "🍰 Best Dessert",
      "🥤 Drinks",
      "🌶️ Spicy Food",
      "🥬 Jain Food",
      "⏱️ Preparation Time",
    ].map((prompt) => (

      <button
        key={prompt}
        onClick={() => setInput(prompt)}
        className="rounded-full bg-orange-100 hover:bg-orange-200 transition px-4 py-2 text-sm font-medium"
      >
        {prompt}
      </button>

    ))}

  </div>

  {/* Chat Input */}

  <div className="flex gap-4">

    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          sendMessage();
        }
      }}
      placeholder="Ask anything about our menu..."
      className="flex-1 rounded-2xl border px-6 py-4 outline-none focus:ring-2 focus:ring-[#F97316]"
    />

    <button
      onClick={() => sendMessage()}
      disabled={loading}
      className="bg-[#F97316] hover:bg-orange-600 disabled:bg-gray-400 text-white px-8 rounded-2xl transition flex items-center gap-2"
    >

      <Send size={20} />

      Send

    </button>

  </div>

</div>

</div>

{/* Footer */}

<div className="text-center text-gray-500 mt-6">

  <p className="font-medium">
    🤖 VibeBite Restaurant Assistant
  </p>

  <p className="text-sm mt-2">
    Ask about menu items, combos, prices, preparation time, allergies and restaurant FAQs.
  </p>

</div>

</div>

</main>

);
}
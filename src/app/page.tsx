"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll when messages update

  const startNewChat = () => {
    setMessages([{
      id: Date.now(),
      text: "Hello! I'm here to help you create a detailed job description. What position are you looking to write a description for?",
      sender: "bot",
    }]);
    setIsOpen(true);
  };

  const endConversation = async () => {
    try {
      const response = await fetch("/api/chat", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear conversation history");
      }

      setMessages([]);
      setIsOpen(false);
    } catch (error) {
      console.error("Error clearing conversation:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality here
    console.log("Searching for:", searchQuery);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      const botMessage: Message = {
        id: Date.now() + 1,
        text: data.message,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, something went wrong. Please try again.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInputMessage("");
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setIsOpen(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Main Content */}
      <main className={`flex flex-col items-center justify-center min-h-screen p-4 transition-all duration-300 ${isOpen ? 'mr-[400px]' : ''}`}>
        {/* Logo and Title */}
        <div className="w-[800px] mx-auto text-center mb-8">
          <h1 className="text-5xl font-bold text-blue-600 mb-2">Job Heaven</h1>
          <p className="text-gray-600 mb-8">Your AI-Powered Job Description Assistant</p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-[1000px] mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job descriptions..."
                className="w-full px-6 py-4 text-l border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-black shadow-md"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-600 hover:text-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Write Job Description Button */}
          <div className="flex justify-center gap-4">
            <button
              onClick={startNewChat}
              className="bg-blue-500 text-white px-5 py-3 rounded-full text-m font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Write Job Description
            </button>
          </div>
        </div>
      </main>

      {/* Chat Panel */}
      {messages.length > 0 && (
        <div
          className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Header */}
          <header className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
              <h1 className="text-xl font-semibold">Job Description Assistant</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleCollapse}
                className="text-white hover:text-blue-200 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>
              <button
                onClick={endConversation}
                className="text-white hover:text-red-200 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </header>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 h-[calc(100%-8rem)]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${message.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 shadow-md"
                    }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 max-w-[70%] rounded-lg p-3 shadow-md">
                  <p className="animate-pulse">Thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition-colors ${isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
                  }`}
                disabled={isLoading}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Chat Toggle Button */}
      {messages.length > 0 && !isOpen && (
        <button
          onClick={toggleCollapse}
          className="fixed bottom-4 right-4 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center z-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

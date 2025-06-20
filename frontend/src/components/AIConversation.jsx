import React, { useState, useEffect } from 'react';
import { Send, BrainCircuit, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function AIConversation({ fileInfo, setSidebarOpen }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMessages([
        {
          id: 1,
          text: "Hello! I'm your AI assistant. Select a file and ask me anything about its data.",
          sender: 'assistant',
        },
      ]);
  }, [fileInfo]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || !fileInfo) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };
    
    // Optimistically add user message
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
        const apiMessages = newMessages
            .filter(msg => msg.sender === 'user' || msg.sender === 'assistant') 
            .map(msg => ({ role: msg.sender, content: msg.text }));

        const response = await fetch('http://localhost:5000/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                file_id: fileInfo.id,
                messages: apiMessages
            }),
        });

        const data = await response.json();

        if (response.ok) {
            const aiResponse = {
                id: Date.now() + 1,
                text: data.reply,
                sender: 'assistant',
            };
            setMessages(prev => [...prev, aiResponse]);
        } else {
             const errorResponse = {
                id: Date.now() + 1,
                text: `Error: ${data.error || 'Failed to get response.'}`,
                sender: 'ai',
                isError: true,
            };
            setMessages(prev => [...prev, errorResponse]);
        }
    } catch (error) {
         const errorResponse = {
            id: Date.now() + 1,
            text: 'Network error. Could not connect to the AI service.',
            sender: 'ai',
            isError: true,
        };
        setMessages(prev => [...prev, errorResponse]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 flex flex-col h-full">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <BrainCircuit className="w-5 h-5 mr-2 text-purple-400" />
              AI Conversation
            </h3>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md hover:bg-gray-700">
            <X className="w-5 h-5" />
        </button>
      </div>
       <p className="text-xs text-gray-400 px-4 pt-2">
          {fileInfo ? `Analyzing: ${fileInfo.name}` : 'No file selected'}
        </p>
      
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-2 ${
              message.sender === 'user' ? 'justify-end' : ''
            }`}
          >
            {message.sender === 'ai' && (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.isError ? 'bg-red-500/20' : 'bg-purple-500/20'}`}>
                <BrainCircuit className={`w-5 h-5 ${message.isError ? 'text-red-300' : 'text-purple-300'}`} />
              </div>
            )}
            <div
              className={`max-w-xs md:max-w-sm lg:max-w-md p-3 rounded-2xl text-sm ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : message.isError 
                  ? 'bg-red-500/10 text-red-200 rounded-bl-none'
                  : 'bg-gray-700 text-gray-200 rounded-bl-none'
              }`}
            >
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <BrainCircuit className="w-5 h-5 text-purple-300 animate-pulse" />
                </div>
                <div className="max-w-xs p-3 rounded-2xl text-sm bg-gray-700 text-gray-200 rounded-bl-none">
                    <div className="flex items-center space-x-1">
                        <span className="h-2 w-2 bg-gray-500 rounded-full animate-pulse delay-75"></span>
                        <span className="h-2 w-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                        <span className="h-2 w-2 bg-gray-500 rounded-full animate-pulse delay-300"></span>
                    </div>
                </div>
            </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={fileInfo ? "Ask about your data..." : "Select a file first"}
            disabled={!fileInfo || isLoading}
            className="w-full pl-4 pr-16 py-3 rounded-full bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm text-gray-200 placeholder-gray-400 disabled:cursor-not-allowed disabled:bg-gray-700/50"
          />
          <button
            type="submit"
            disabled={!fileInfo || input.trim() === '' || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-full p-2.5 hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
} 
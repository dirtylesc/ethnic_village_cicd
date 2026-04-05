'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useChatSession } from '@/stores/useChatSession';
import { Bot, Loader2, MessageCircle, RotateCcw, Send, Sparkles, User, X } from 'lucide-react';

import logger from '@/libs/logger';

import { defaultChatbotV2Config, getChatbotPosition, type ChatbotV2Config } from './chatbot-config-v2';
import type { ChatRequest, ChatResponse } from './types';

type ChatbotV2Props = {
  config?: Partial<ChatbotV2Config>;
};

const ChatbotV2: React.FC<ChatbotV2Props> = ({ config = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const chatbotConfig = { ...defaultChatbotV2Config, ...config };

  const { sessionId, messages, cache, isLoading, addMessage, updateCache, clearMessages } = useChatSession(
    chatbotConfig.sessionConfig.storageKey,
    chatbotConfig.sessionConfig.maxMessages,
  );

  // Get auth token from store
  const { accessToken, isAuthenticated } = useAuthStore();

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTypingIndicator, isOpen]);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${chatbotConfig.apiUrl}/health`);
        if (!response.ok) {
          setApiError('API không khả dụng');
        }
      } catch (error) {
        logger.error('Health check failed:', error);
        setApiError('Không thể kết nối API');
      }
    };

    checkHealth();
  }, [chatbotConfig.apiUrl]);

  const sendMessage = async () => {
    if (isWaitingResponse || inputValue.trim() === '' || !chatbotConfig.apiUrl) return;

    const userMessage = inputValue.trim();

    addMessage({
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    });

    setInputValue('');
    setIsWaitingResponse(true);
    setShowTypingIndicator(true);
    setApiError(null);

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const requestBody: ChatRequest = {
        message: userMessage,
        session_id: sessionId || undefined,
        history: history,
        cache: cache,
      };

      console.log('Sending request:', {
        message: userMessage,
        session_id: sessionId,
        history_count: history.length,
        cache_keys: Object.keys(cache),
        has_auth: isAuthenticated,
      });

      // Prepare headers with optional Authorization
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add Authorization header if user is logged in
      if (isAuthenticated && accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
        console.log('Sending with auth token');
      }

      const response = await fetch(`${chatbotConfig.apiUrl}/chat`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data: ChatResponse = await response.json();

      setShowTypingIndicator(false);

      addMessage({
        role: 'assistant',
        content: data.response,
        timestamp: Date.now(),
      });

      if (data.cache) {
        updateCache(data.cache);
      }
    } catch (error) {
      logger.error('Chatbot error:', error);
      setShowTypingIndicator(false);
      setApiError(chatbotConfig.errorMessage);

      addMessage({
        role: 'assistant',
        content: chatbotConfig.errorMessage,
        timestamp: Date.now(),
      });
    } finally {
      setIsWaitingResponse(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isWaitingResponse) {
      sendMessage();
    }
  };

  const handleReset = async () => {
    if (!confirm('Bạn có chắc muốn xóa toàn bộ lịch sử chat?')) return;

    try {
      if (sessionId) {
        await fetch(`${chatbotConfig.apiUrl}/chat/reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      }

      clearMessages();
      setApiError(null);
    } catch (error) {
      logger.error('Failed to reset chat:', error);
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-start space-x-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
        <Bot size={16} />
      </div>
      <div className="flex max-w-xs items-center space-x-1 rounded-lg rounded-tl-none border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex space-x-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: '0.1s' }}></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <span className="ml-2 text-xs text-gray-500">AI đang trả lời...</span>
      </div>
    </div>
  );

  const formatContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return content.split('\n').map((line, lineIndex) => {
      const parts = line.split(urlRegex);

      return (
        <React.Fragment key={lineIndex}>
          {parts.map((part, partIndex) => {
            if (urlRegex.test(part)) {
              return (
                <a
                  key={partIndex}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-blue-500 underline hover:text-blue-700"
                  onClick={e => e.stopPropagation()}
                >
                  {part}
                </a>
              );
            }
            return <span key={partIndex}>{part}</span>;
          })}
          {lineIndex < content.split('\n').length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className={`fixed ${getChatbotPosition(chatbotConfig.position)} z-50`}>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`group ${chatbotConfig.theme.primaryColor} relative rounded-full p-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl`}
          aria-label="Mở chatbot"
        >
          <MessageCircle size={24} className="relative z-10" />
          <Sparkles
            size={12}
            className="absolute right-3 top-3 animate-pulse opacity-0 transition-opacity group-hover:opacity-100"
          />
        </button>
      )}

      {isOpen && (
        <div
          className={`${chatbotConfig.theme.backgroundColor} rounded-lg border shadow-2xl ${chatbotConfig.theme.borderColor} flex h-[600px] w-[400px] flex-col transition-all duration-300`}
        >
          <div
            className={`${chatbotConfig.theme.primaryColor} flex items-center justify-between rounded-t-lg p-4 text-white shadow-md`}
          >
            <div className="flex items-center space-x-2">
              <div className="relative">
                <MessageCircle size={20} />
                <div className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-green-300"></div>
              </div>
              <div>
                <h3 className="text-sm font-semibold">{chatbotConfig.title}</h3>
                {sessionId && <p className="text-xs text-emerald-100">Session: {sessionId.slice(0, 8)}...</p>}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleReset}
                className="rounded p-1 text-white transition-colors hover:bg-emerald-700"
                aria-label="Reset chat"
                title="Xóa lịch sử chat"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1 text-white transition-colors hover:bg-emerald-700"
                aria-label="Đóng chatbot"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {apiError && (
            <div className="border-b border-red-200 bg-red-50 p-2 text-center">
              <p className="text-xs text-red-600">{apiError}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-1 items-center justify-center bg-gray-50">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <div
              ref={messagesContainerRef}
              className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-4"
            >
              {messages.length === 0 && (
                <div className="mt-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                    <Bot size={32} />
                  </div>
                  <p className="whitespace-pre-line px-4 text-sm text-gray-600">{chatbotConfig.welcomeMessage}</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2 px-4">
                    {['Tìm tour miền núi', 'Văn hóa Tày', 'Đặt tour 4 người'].map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => setInputValue(suggestion)}
                        className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs text-emerald-700 transition-colors hover:bg-emerald-50"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div
                    className={`flex h-8 min-w-8 items-center justify-center rounded-full text-xs text-white shadow-md ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                    }`}
                  >
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  <div className="flex max-w-[75%] flex-col">
                    <div
                      className={`rounded-lg p-3 shadow-sm ${
                        msg.role === 'user'
                          ? 'rounded-tr-none bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                          : 'rounded-tl-none border border-gray-200 bg-white text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{formatContent(msg.content)}</p>
                    </div>
                    <p
                      className={`mt-1 px-1 text-xs ${msg.role === 'user' ? 'text-right text-blue-400' : 'text-gray-400'}`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {showTypingIndicator && <TypingIndicator />}
            </div>
          )}

          <div className="rounded-b-lg border-t border-gray-200 bg-white p-4 shadow-inner">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={chatbotConfig.placeholder}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                disabled={isWaitingResponse || isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isWaitingResponse || inputValue.trim() === '' || isLoading}
                className={`${chatbotConfig.theme.primaryColor} rounded-lg p-2 text-white shadow-md transition-all hover:shadow-lg disabled:bg-gray-400 disabled:shadow-none`}
                aria-label="Gửi tin nhắn"
              >
                {isWaitingResponse ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotV2;

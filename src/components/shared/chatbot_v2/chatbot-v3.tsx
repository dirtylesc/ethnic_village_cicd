'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatSession } from '@/stores/useChatSession';
import logger from '@/libs/logger';
import {
  Bot,
  Loader2,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  User,
  X,
  Copy,
  RefreshCw,
  Check,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import TextareaAutosize from 'react-textarea-autosize';
import { toast, Toaster } from 'sonner';

import { defaultChatbotV3Config, getChatbotPosition, type ChatbotV3Config } from './chatbot-config-v3';
import type { ChatRequest, ChatResponse } from './types';

type ChatbotV3Props = {
  config?: Partial<ChatbotV3Config>;
}

const ChatbotV3: React.FC<ChatbotV3Props> = ({ config = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastMessageCountRef = useRef(0);

  const chatbotConfig = { ...defaultChatbotV3Config, ...config };

  const { sessionId, messages, cache, isLoading, addMessage, updateCache, clearMessages } = useChatSession(
    chatbotConfig.sessionConfig.storageKey,
    chatbotConfig.sessionConfig.maxMessages,
  );

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showTypingIndicator, isOpen]);

  useEffect(() => {
    if (!isOpen && messages.length > lastMessageCountRef.current) {
      const newMessages = messages.length - lastMessageCountRef.current;
      setUnreadCount(prev => prev + newMessages);
    }
    lastMessageCountRef.current = messages.length;
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

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

  const sendMessage = async (retryMessage?: string) => {
    const messageToSend = retryMessage || inputValue.trim();
    if (isWaitingResponse || messageToSend === '' || !chatbotConfig.apiUrl) return;

    if (!retryMessage) {
      addMessage({
        role: 'user',
        content: messageToSend,
        timestamp: Date.now(),
      });
      setInputValue('');
    }

    setIsWaitingResponse(true);
    setShowTypingIndicator(true);
    setApiError(null);

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const requestBody: ChatRequest = {
        message: messageToSend,
        session_id: sessionId || undefined,
        history: history,
        cache: cache,
      };

      const response = await fetch(`${chatbotConfig.apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      toast.success('Đã nhận phản hồi từ AI');
    } catch (error) {
      logger.error('Chatbot error:', error);
      setShowTypingIndicator(false);
      setApiError(chatbotConfig.errorMessage);

      addMessage({
        role: 'assistant',
        content: chatbotConfig.errorMessage,
        timestamp: Date.now(),
      });

      toast.error('Không thể kết nối với AI');
    } finally {
      setIsWaitingResponse(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isWaitingResponse) {
      e.preventDefault();
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
      toast.success('Đã xóa lịch sử chat');
    } catch (error) {
      logger.error('Failed to reset chat:', error);
      toast.error('Không thể xóa lịch sử');
    }
  };

  const handleCopy = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageIndex(index);
      toast.success('Đã sao chép tin nhắn');
      setTimeout(() => setCopiedMessageIndex(null), 2000);
    } catch (error) {
      toast.error('Không thể sao chép');
    }
  };

  const handleRegenerate = () => {
    if (messages.length < 2) return;

    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    if (lastUserMessage) {
      const updatedMessages = messages.slice(0, -1);
      clearMessages();
      updatedMessages.forEach(msg => addMessage(msg));

      sendMessage(lastUserMessage.content);
      toast.info('Đang tạo lại phản hồi...');
    }
  };

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-start space-x-2"
    >
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
    </motion.div>
  );

  const markdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          className="rounded-md text-sm"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className="rounded bg-gray-100 px-1 py-0.5 text-sm text-gray-800" {...props}>
          {children}
        </code>
      );
    },
    a({ node, children, ...props }: any) {
      return (
        <a
          className="break-all text-blue-500 underline hover:text-blue-700"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    },
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className={`fixed ${getChatbotPosition(chatbotConfig.position)} z-50`}>
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className={`group relative rounded-full p-4 text-white shadow-lg transition-all ${chatbotConfig.theme.primaryColor}`}
              aria-label="Mở chatbot"
            >
              <MessageCircle size={24} className="relative z-10" />
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.div>
              )}
              <Sparkles
                size={12}
                className="absolute right-3 top-3 animate-pulse opacity-0 transition-opacity group-hover:opacity-100"
              />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`${chatbotConfig.theme.backgroundColor} ${chatbotConfig.theme.borderColor} flex flex-col rounded-lg border shadow-2xl
                h-[600px] w-[400px] max-sm:fixed max-sm:inset-4 max-sm:h-auto max-sm:w-auto
                md:h-[600px] md:w-[400px]`}
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
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleReset}
                    className="rounded p-1 text-white transition-colors hover:bg-emerald-700"
                    aria-label="Reset chat"
                    title="Xóa lịch sử chat"
                  >
                    <RotateCcw size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="rounded p-1 text-white transition-colors hover:bg-emerald-700"
                    aria-label="Đóng chatbot"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              {apiError && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-red-200 bg-red-50 p-2 text-center"
                >
                  <p className="text-xs text-red-600">{apiError}</p>
                </motion.div>
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
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-12 text-center"
                    >
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                        <Bot size={32} />
                      </div>
                      <p className="whitespace-pre-line px-4 text-sm text-gray-600">{chatbotConfig.welcomeMessage}</p>
                      <div className="mt-6 flex flex-wrap justify-center gap-2 px-4">
                        {['Tìm tour miền núi', 'Văn hóa Tày', 'Đặt tour 4 người'].map((suggestion, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setInputValue(suggestion)}
                            className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs text-emerald-700 transition-colors hover:bg-emerald-50"
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <AnimatePresence mode="popLayout">
                    {messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`group flex items-start space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
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
                            {msg.role === 'assistant' ? (
                              <div className="prose prose-sm max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                  {msg.content}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                            )}
                          </div>

                          <div className="mt-1 flex items-center justify-between px-1">
                            <p className={`text-xs ${msg.role === 'user' ? 'text-blue-400' : 'text-gray-400'}`}>
                              {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            <div className="flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleCopy(msg.content, index)}
                                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                title="Sao chép"
                              >
                                {copiedMessageIndex === index ? <Check size={14} /> : <Copy size={14} />}
                              </motion.button>
                              {msg.role === 'assistant' && index === messages.length - 1 && (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={handleRegenerate}
                                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                  title="Tạo lại phản hồi"
                                  disabled={isWaitingResponse}
                                >
                                  <RefreshCw size={14} />
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {showTypingIndicator && <TypingIndicator />}
                </div>
              )}

              <div className="rounded-b-lg border-t border-gray-200 bg-white p-4 shadow-inner">
                <div className="flex space-x-2">
                  <TextareaAutosize
                    ref={inputRef}
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={chatbotConfig.placeholder}
                    className="max-h-32 min-h-[40px] flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 text-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    disabled={isWaitingResponse || isLoading}
                    minRows={1}
                    maxRows={4}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendMessage()}
                    disabled={isWaitingResponse || inputValue.trim() === '' || isLoading}
                    className={`${chatbotConfig.theme.primaryColor} flex h-10 w-10 items-center justify-center self-end rounded-lg text-white shadow-md transition-all hover:shadow-lg disabled:bg-gray-400 disabled:shadow-none`}
                    aria-label="Gửi tin nhắn"
                  >
                    {isWaitingResponse ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  </motion.button>
                </div>
                <p className="mt-1 text-right text-xs text-gray-400">
                  {inputValue.length}/2000 • <kbd className="rounded bg-gray-100 px-1">Shift+Enter</kbd> để xuống dòng
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ChatbotV3;

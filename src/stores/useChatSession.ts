'use client';

import { useCallback, useEffect, useState } from 'react';

import type { CacheData, ChatSession, Message } from '../components/shared/chatbot_v2/types';
import logger from '@/libs/logger';

type UseChatSessionReturn = {
  sessionId: string | null;
  messages: Message[];
  cache: CacheData;
  isLoading: boolean;
  addMessage: (message: Message) => void;
  updateCache: (newCache: CacheData) => void;
  clearMessages: () => void;
  loadSession: () => void;
  saveSession: () => void;
}

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const getSessionFromCookie = (): string | null => {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split('; ');
  const sessionCookie = cookies.find(c => c.startsWith('chatbot_session_id='));
  return sessionCookie ? sessionCookie.split('=')[1] : null;
};

const saveSessionToCookie = (sessionId: string): void => {
  if (typeof document === 'undefined') return;

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7);
  document.cookie = `chatbot_session_id=${sessionId}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
};

const clearSessionCookie = (): void => {
  if (typeof document === 'undefined') return;

  document.cookie = 'chatbot_session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export const useChatSession = (storageKey: string, maxMessages: number = 50): UseChatSessionReturn => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [cache, setCache] = useState<CacheData>({});
  const [isLoading, setIsLoading] = useState(true);

  const cacheStorageKey = `${storageKey}_cache`;
  const messagesStorageKey = `${storageKey}_messages`;

  const loadSession = useCallback(() => {
    setIsLoading(true);
    try {
      let currentSessionId = getSessionFromCookie();
      if (!currentSessionId) {
        currentSessionId = generateUUID();
        saveSessionToCookie(currentSessionId);
      }
      setSessionId(currentSessionId);

      const storedMessages = localStorage.getItem(messagesStorageKey);
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages);
        setMessages(parsed);
      }

      const storedCache = localStorage.getItem(cacheStorageKey);
      if (storedCache) {
        const parsed = JSON.parse(storedCache);
        setCache(parsed);
      }
    } catch (error) {
      logger.error('Failed to load session:', error);
    } finally {
      setIsLoading(false);
    }
  }, [messagesStorageKey, cacheStorageKey]);

  const saveSession = useCallback(() => {
    if (!sessionId) return;

    try {

      const messagesToSave = messages.slice(-maxMessages);
      localStorage.setItem(messagesStorageKey, JSON.stringify(messagesToSave));
    } catch (error) {
      logger.error('Failed to save messages to localStorage:', error);

      if (error instanceof Error && error.name === 'QuotaExceededError') {
        try {
          const reducedMessages = messages.slice(-Math.floor(maxMessages / 2));
          localStorage.setItem(messagesStorageKey, JSON.stringify(reducedMessages));
        } catch (retryError) {
          logger.error('Failed to save even with reduced messages:', retryError);
        }
      }
    }
  }, [sessionId, messages, messagesStorageKey, maxMessages]);

  const saveCache = useCallback(() => {
    try {
      localStorage.setItem(cacheStorageKey, JSON.stringify(cache));
    } catch (error) {
      logger.error('Failed to save cache to localStorage:', error);
    }
  }, [cache, cacheStorageKey]);

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const updateCache = useCallback((newCache: CacheData) => {
    setCache(prev => ({ ...prev, ...newCache }));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCache({});

    const newSessionId = generateUUID();
    setSessionId(newSessionId);
    saveSessionToCookie(newSessionId);

    try {
      localStorage.removeItem(messagesStorageKey);
      localStorage.removeItem(cacheStorageKey);
    } catch (error) {
      logger.error('Failed to clear localStorage:', error);
    }
  }, [messagesStorageKey, cacheStorageKey]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (messages.length > 0 && sessionId) {
      saveSession();
    }
  }, [messages, sessionId, saveSession]);

  useEffect(() => {
    if (Object.keys(cache).length > 0) {
      saveCache();
    }
  }, [cache, saveCache]);

  return {
    sessionId,
    messages,
    cache,
    isLoading,
    addMessage,
    updateCache,
    clearMessages,
    loadSession,
    saveSession,
  };
};

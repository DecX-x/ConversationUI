'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Message } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newMessageIndicator, setNewMessageIndicator] = useState(false);
  const [threadId, setThreadId] = useState(() => uuidv4());
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const addMessage = useCallback((content: string, role: 'user' | 'assistant', image?: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      content,
      role,
      timestamp: new Date(),
      image,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, []);

  const updateMessage = useCallback((id: string, content: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, content } : m));
  }, []);

  const sendMessage = useCallback(async (content: string, image?: string) => {
    if (!content.trim()) return;
    const userMessage = addMessage(content, 'user', image);
    setIsLoading(true);

    // add empty assistant message for streaming
    const assistantMessage = addMessage('', 'assistant');
    // build history up to new user message (assistant placeholder not sent)
    const history = [...messagesRef.current, userMessage];
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, threadId })
      });
      if (!res.ok || !res.body) throw new Error('Network response was not ok');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulated = '';
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          accumulated += chunk;
          updateMessage(assistantMessage.id, accumulated);
        }
      }
    } catch (error) {
      updateMessage(assistantMessage.id, 'Error: ' + String(error));
    } finally {
      setIsLoading(false);
      setNewMessageIndicator(true);
    }
  }, [addMessage, threadId, updateMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const newChat = useCallback(() => {
    setThreadId(uuidv4());
    clearMessages();
    setNewMessageIndicator(false);
  }, [clearMessages]);

  const clearNewMessageIndicator = useCallback(() => {
    setNewMessageIndicator(false);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    newMessageIndicator,
    clearNewMessageIndicator,
    newChat,
    threadId
  };
}
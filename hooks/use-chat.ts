import { useState, useCallback } from 'react';
import { Message } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newMessageIndicator, setNewMessageIndicator] = useState<boolean>(false);
  const [threadId, setThreadId] = useState<string>(() => uuidv4());

  const sendMessage = useCallback((message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const newChat = useCallback(() => {
    setThreadId(uuidv4());
    clearMessages();
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
};

export default useChat;
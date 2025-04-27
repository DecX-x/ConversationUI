'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Message } from '@/components/chat/message';
import { MessageInput } from '@/components/chat/message-input';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import { ExamplePrompts } from '@/components/chat/example-prompts';
import { NewMessageIndicator } from '@/components/chat/new-message-indicator';
import { useChat } from '@/lib/hooks/use-chat';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownCircle } from 'lucide-react';

export function ChatWindow() {
  const { messages, isLoading, sendMessage, newMessageIndicator, clearNewMessageIndicator } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const scrollPosition = scrollHeight - scrollTop - clientHeight;
      setIsNearBottom(scrollPosition < 100);
      
      if (isNearBottom) {
        clearNewMessageIndicator();
      }
    }
  };

  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages, isNearBottom]);

  return (
    <div className="flex flex-col h-full relative">
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-2 space-y-2 scroll-smooth"
      >
        {messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-full"
          >
            <div className="max-w-2xl w-full space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold">How can I help you today?</h2>
                <p className="text-muted-foreground">
                  Ask me anything, and I'll do my best to provide a helpful response.
                </p>
              </div>
              <ExamplePrompts onSelectPrompt={sendMessage} />
            </div>
          </motion.div>
        ) : (
          <>
            <AnimatePresence>
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
            </AnimatePresence>
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {!isNearBottom && (
        <NewMessageIndicator
          show={newMessageIndicator}
          onClick={scrollToBottom}
        />
      )}

      <div className="p-2 border-t">
        <MessageInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}